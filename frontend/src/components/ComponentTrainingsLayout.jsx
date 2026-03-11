import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainingsByUser } from '../api/Training/GetTrainingsByUser';
import { deleteTraining } from '../api/Training/DeleteTraining';
import { getTeam } from '../api/Team/GetTeam';
import '../CSS/CSSTrainings.css';

const ComponentTrainingsLayout = () => {
    const [trainings, setTrainings] = useState([]);
    const [teams, setTeams] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedTrainings, setSelectedTrainings] = useState(new Set());
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const data = await getTrainingsByUser(username);
                setTrainings(data);
        
                const teamPromises = data.map((training) => getTeam(username, training.team));
                const teamData = await Promise.all(teamPromises);
        
                const teamDictionary = {};
                data.forEach((training, index) => {
                    const team = teamData[index];
                    teamDictionary[training.team] = team; 
                });
        
                setTeams(teamDictionary);
                console.log("Teams dictionary populated:", teamDictionary);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, [username]);

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
                    Array.from(selectedTrainings).map((idTraining) => {
                        const trainingToDelete = trainings.find((t) => t.id === idTraining);
                        return deleteTraining(username, trainingToDelete.team, idTraining);
                    })
                );

                const data = await getTrainingsByUser(username);
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
                <span style={{ marginLeft: '30vw' }}>All your trainings</span>
                <button
                    className={`delete-training-button-trainings ${deleteMode ? 'active' : ''}`}
                    onClick={handleDeleteModeToggle} style={{ marginBottom: '-0.5vw' }}
                >
                    {deleteMode ? 'Cancel Delete' : 'Delete Trainings'}
                </button>
            </h1>

            <div className="content-trainings">
                {trainings.length > 0 ? (
                    <div className="trainings-list-trainings">
                        {trainings.map((training) => {
                            const team = teams[training.team] || {}; 
                            return (
                                <div
                                    key={training.id}
                                    className={`training-item-trainings ${deleteMode ? 'delete-mode' : ''}`}
                                    style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}
                                >
                                    <div className="training-info-trainings">
                                        <div
                                            className={`team-item-teams ${deleteMode ? 'delete-mode' : ''}`}
                                            style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}
                                        >
                                        <div className="training-name-trainings" 
                                            onClick={() => navigate(`/users/${username}/teams/${training.team}/trainings/${training.id}`)} 
                                            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', lineHeight: '1.5' }} // Añadido lineHeight
                                        >
                                            <i className="fas fa-stopwatch fa-2x" style={{ marginRight: '2vw' }}></i> 
                                            <span> {training.name} </span> 
                                        </div>
                                        <div className="team-photo-teams" style={{ marginLeft: '-9vw', cursor: 'default'}} >
                                                <img src={team._teamPhoto} alt={`${team._id} logo`} />
                                        </div>
                                            <div className="team-info-teams" style={{ marginLeft: '-4vw'}}>
                                                <div className="team-header-teams">
                                                <div 
                                            className="team-category-letter-teams" 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span 
                                                className="team-category-teams" 
                                                style={{ marginRight: '0.5rem', fontWeight: 'bold' }}
                                            >
                                                {team._category}
                                            </span>
                                            <span className="team-letter-teams" style={{ fontWeight: 'bold' }}>
                                                {team._letter}
                                            </span>
                                        </div>

                                        <div 
                                            className="team-club-teams" 
                                            style={{ 
                                                fontSize: '2rem', 
                                            }}
                                        >
                                            {team._club}
                                        </div>

                                                </div>

                                                <div className="training-header-trainings">
                                                    <div className="training-date-location-trainings" style={{ marginLeft: 'auto' }}>
                                                        <span className="training-date-trainings" style={{ fontSize: '1.5vw' }}>
                                                            {`${formatDate(
                                                                training.day,
                                                                training.month,
                                                                training.year
                                                            )} - ${training.hour}`} 
                                                        </span>
                                                    </div>
                                                    <span className="training-location-trainings" style={{ fontSize: '1.5vw', marginLeft: '7vw'}} >
                                                        {`${training.city} - ${training.address}`}
                                                    </span>
                                                </div>
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
                                </div>
                            );
                        })}
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

export default ComponentTrainingsLayout;
