import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMatchesByUserAndTeam } from '../api/Match/GetMatchesByUserAndTeam';
import { deleteMatch } from '../api/Match/DeleteMatch';
import { getTeam } from '../api/Team/GetTeam';
import { getRivalTeam} from '../api/Team/GetRivalTeam';
import '../CSS/CSSTrainings.css';

const ComponentMatches = () => {
    const [matches, setMatches] = useState([]);
    const [team, setTeam] = useState(null);
    const [rivalTeams, setRivalTeams] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedMatches, setSelectedMatches] = useState(new Set());
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const { idT } = useParams();

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                console.log("idtRaro: ", idT);
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

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getMatchesByUserAndTeam(username, idT);
                setMatches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [username, idT]);

    

    useEffect(() => {
        const fetchRivalTeams = async () => {
            const rivalTeamsData = {};
            for (const match of matches) {
                try {
                    const data = await getRivalTeam(username, idT, match.rivalTeam);
                    rivalTeamsData[match.id] = data;
                } catch (err) {
                    setError(err.message);
                }
            }
            setRivalTeams(rivalTeamsData);
        };

        if (matches.length > 0) {
            fetchRivalTeams();
        }
    }, [matches, username]);

    const handleDeleteModeToggle = () => {
        setDeleteMode(!deleteMode);
        setSelectedMatches(new Set());
    };

    const handleSelectMatch = (matchId) => {
        setSelectedMatches((prevSelectedMatches) => {
            const newSelectedMatches = new Set(prevSelectedMatches);
            if (newSelectedMatches.has(matchId)) {
                newSelectedMatches.delete(matchId);
            } else {
                newSelectedMatches.add(matchId);
            }
            return newSelectedMatches;
        });
    };

    const handleDelete = async () => {
        if (selectedMatches.size === 0) return;

        if (window.confirm('Are you sure you want to delete the selected matches?')) {
            setLoading(true);  // Set loading to true before making the request
            try {
                for (const idMatch of selectedMatches) {
                    console.log("idMatch: ", idMatch);
                    await deleteMatch(username, idT, idMatch);
                }
                const data = await getMatchesByUserAndTeam(username, idT);
                setMatches(data);
                alert('Selected matches deleted successfully!');
            } catch (err) {
                setError(`Error deleting matches: ${err.message}`);
            } finally {
                setLoading(false);  
                setDeleteMode(false);
                setSelectedMatches(new Set());
            }
        }
    };
    
    const getLastNamePart = (name) => {
        const parts = name.split('_');
        return parts[parts.length - 1];
    };

    const getMatchShadowClass = (match) => {
        if (!match.finished) return ""; // Sin sombra si el partido no está terminado
    
        if (match.myGoals > match.rivalGoals) {
            return "shadow-green";
        } else if (match.myGoals === match.rivalGoals) {
            return "shadow-blue";
        } else if (match.myGoals < match.rivalGoals) {
            return "shadow-red";
        }
    
        return ""; // Fallback
    };
    

    if (error) {
        return <div className="error-trainings">{error}</div>;
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading matches...</p>
            </div>
        );
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
                                Matches from
                            </span>
                            <span style={{ display: 'block' }}>
                                {`${team._club} ${team._category} ${team._letter}`}
                            </span>
                        </div>
                        
                        <button
                            className={`delete-training-button-trainings ${deleteMode ? 'active' : ''}`}
                            onClick={handleDeleteModeToggle} 
                        >
                            {deleteMode ? 'Cancel Delete' : 'Delete Matches'}
                        </button>
                    </div>
                ) : (
                    'Loading team details...'
                )}
            </h1>

            <div className="content-trainings">
                {matches.length > 0 ? (
                    <div className="trainings-list-trainings">
                        {matches.map((match) => (
                            <div
                            key={match.name}
                            className={`training-item-trainings ${deleteMode ? 'delete-mode' : ''} ${getMatchShadowClass(match)}`}
                            style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}
                        >
                                <div className="training-info-trainings">
                                    <div
                                        className="training-name-trainings"
                                        onClick={() => navigate(`/users/${username}/teams/${idT}/matches/${match.id}`)}
                                    >
                                        <i className="far fa-futbol fa" style={{ marginRight: '0.5vw'}}></i>
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            {`${getLastNamePart(match.name)} VS `}
                                            {rivalTeams[match.id]?.teamPhoto && (
                                                <img
                                                    src={rivalTeams[match.id].teamPhoto}
                                                    alt={`${rivalTeams[match.id]?.club || 'Rival'} logo`}
                                                    style={{
                                                        width: '6vw',
                                                        height: 'auto',
                                                        marginLeft: '1.5vw',
                                                        verticalAlign: 'middle',
                                                    }}
                                                />
                                            )}
                                        </span>                                   
                                    </div>
                                    <div className="training-header-trainings">
                                        <div className="training-date-location-trainings">
                                            <span className="training-date-trainings">
                                                {`${match.date} - ${match.hour}`}
                                            </span>
                                        </div>
                                        <span className="training-location-trainings">{`${match.city} - ${match.address}`}</span>
                                    </div>
                                    {deleteMode && (
                                        <div className="training-delete-button-trainings">
                                            <button
                                                className={`delete-circle ${selectedMatches.has(match.id) ? 'selected' : ''}`}
                                                onClick={() => handleSelectMatch(match.id)}
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
                        <p>You have no matches</p>
                    </div>
                )}
            </div>

            {deleteMode && (
                <button className="submit-button-delete-trainings" onClick={handleDelete}>
                    Delete Selected Matches
                </button>
            )}
        </div>
    );
};

export default ComponentMatches;
