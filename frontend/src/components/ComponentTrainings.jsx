import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTrainingsByUserAndTeam } from '../api/Training/GetTrainingsByUserAndTeam';
import { deleteTraining } from '../api/Training/DeleteTraining';
import { getTeam } from '../api/Team/GetTeam';
import '../CSS/CSSTrainings.css';

const ComponentTrainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [team, setTeam] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedTrainings, setSelectedTrainings] = useState(new Set());
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const { idT } = useParams();

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const data = await getTrainingsByUserAndTeam(username, idT);
                setTrainings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, [username, idT]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await getTeam(username, idT);
                setTeam(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [username, idT]);

    const handleDeleteModeToggle = () => {
        setDeleteMode(!deleteMode);
        setSelectedTrainings(new Set());
    };

    const handleSelectTraining = (trainingId) => {
        setSelectedTrainings((prevSelectedTrainings) => {
            const newSelectedTrainings = new Set(prevSelectedTrainings);
            if (newSelectedTrainings.has(trainingId)) {
                newSelectedTrainings.delete(trainingId);
            } else {
                newSelectedTrainings.add(trainingId);
            }
            return newSelectedTrainings;
        });
    };

    const handleDelete = async () => {
        if (selectedTrainings.size === 0) return;

        if (window.confirm('Are you sure you want to delete the selected trainings?')) {
            try {
                await Promise.all(
                    Array.from(selectedTrainings).map((idTraining) => deleteTraining(username, idT, idTraining))
                );
                const data = await getTrainingsByUserAndTeam(username, idT);
                setTrainings(data);
                alert('Selected trainings deleted successfully!');
            } catch (err) {
                setError(`Error deleting trainings: ${err.message}`);
            } finally {
                setDeleteMode(false);
                setSelectedTrainings(new Set());
            }
        }
    };

    const formatDate = (day, month, year) => {
        const date = new Date(`${year}-${month}-${day}`);
        const dayFormatted = String(date.getDate()).padStart(2, '0');
        const monthFormatted = String(date.getMonth() + 1).padStart(2, '0');
        const yearFormatted = date.getFullYear();
        return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
    };

    if (error) {
        return <div className="error-trainings">{error}</div>;
    }

    return (
        <div className="main-container-trainings">
            <h1 className="app-title-trainings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {team ? (
                <div className="team-header" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img 
                        src={team._teamPhoto} 
                        alt={`${team._club} logo`} 
                        style={{ width: '10%', height: 'auto', marginLeft: '3vw', marginRight: '3vw', objectFit: 'cover' }} 
                    />
                    
                    <div style={{ textAlign: 'left', flexGrow: 1 }}>
                        <span style={{ display: 'block' }}>
                            Trainings from
                        </span>
                        <span style={{ display: 'block' }}>
                            {`${team._club} ${team._category} ${team._letter}`}
                        </span>
                    </div>
                    
                    <button
                        className={`delete-training-button-trainings ${deleteMode ? 'active' : ''}`}
                        onClick={handleDeleteModeToggle} 
                    >
                        {deleteMode ? 'Cancel Delete' : 'Delete Trainings'}
                    </button>
                </div>
            ) : (
                'Loading team details...'
            )}
        </h1>


            <div className="content-trainings">
                {trainings.length > 0 ? (
                    <div className="trainings-list-trainings">
                        {trainings.map((training) => (
                            <div
                                key={training.name}
                                className={`training-item-trainings ${deleteMode ? 'delete-mode' : ''}`}
                                style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}
                            >
                                <div className="training-info-trainings">
                                    <div
                                        className="training-name-trainings"
                                        onClick={() => navigate(`/users/${username}/teams/${idT}/trainings/${training.id}`)}
                                    >
                                        <i className="fas fa-stopwatch fa-2x" style={{ marginRight: '2vw' }}></i>
                                        <span>{training.name}</span>
                                    </div>
                                    <div className="training-header-trainings">
                                        <div className="training-date-location-trainings">
                                            <span className="training-date-trainings">
                                                {`${formatDate(training.day, training.month, training.year)} - ${
                                                    training.hour
                                                }`}
                                            </span>
                                        </div>
                                        <span className="training-location-trainings">{`${training.city} - ${training.address}`}</span>
                                    </div>
                                    {deleteMode && (
                                        <div className="training-delete-button-trainings">
                                            <button
                                                className={`delete-circle ${
                                                    selectedTrainings.has(training.id) ? 'selected' : ''
                                                }`}
                                                onClick={() => handleSelectTraining(training.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-trainings-found">
                        <i className="fas fa-sad-tear"></i>
                        <p>You have no trainings</p>
                    </div>
                )}
            </div>

            {deleteMode && (
                <button className="submit-button-delete-trainings" onClick={handleDelete}>
                    Delete Selected Trainings
                </button>
            )}
        </div>
    );
};

export default ComponentTrainings;
