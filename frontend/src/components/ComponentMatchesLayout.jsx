import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatchesByUser } from '../api/Match/GetMatchesByUser';
import { deleteMatch } from '../api/Match/DeleteMatch';
import { getTeam } from '../api/Team/GetTeam';
import '../CSS/CSSTrainings.css';

const ComponentMatchesLayout = () => {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState({});
    const [rivalTeams, setRivalTeams] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedMatches, setSelectedMatches] = useState(new Set());
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getMatchesByUser(username);
                setMatches(data);
        
                const teamPromises = data.map((match) => getTeam(username, match.myTeam));
                const teamData = await Promise.all(teamPromises);
        
                const teamDictionary = {};
                data.forEach((match, index) => {
                    const team = teamData[index];
                    teamDictionary[match.myTeam] = team; 
                });
        
                setTeams(teamDictionary);
                console.log("Teams dictionary populated:", teamDictionary);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [username]);

    useEffect(() => {
            const fetchRivalTeams = async () => {
                const rivalTeamsData = {};
                for (const match of matches) {
                    try {
                        const data = await getTeam(username, match.rivalTeam);
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
            try {
                for (const idMatch of selectedMatches) {
                    console.log("matchToDelete: ", matchToDelete);
                    const matchToDelete = matches.find((m) => m.id === idMatch);
                    if (matchToDelete) {
                        await deleteMatch(username, matchToDelete.myTeam, idMatch);
                    } else {
                        console.warn(`Match with ID ${idMatch} not found. Skipping.`);
                    }
                }

                const data = await getMatchesByUser(username);
                setMatches(data);
                alert('Selected matches deleted successfully!');
            } catch (err) {
                setError(`Error deleting matches: ${err.message}`);
            } finally {
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
                <span style={{ marginLeft: '30vw' }}>All your matches</span>
            </h1>

            <div className="content-trainings">
                {matches.length > 0 ? (
                    <div className="trainings-list-trainings">
                        {matches.map((match) => {
                            const team = teams[match.myTeam] || {}; 
                            return (
                                <div
                                    key={match.name}
                                    className={`training-item-trainings ${deleteMode ? 'delete-mode' : ''} ${getMatchShadowClass(match)}`}
                                    style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}
                                >
                                    <div className="training-info-trainings">
                                        <div
                                            className={`team-item-teams ${deleteMode ? 'delete-mode' : ''}`}
                                            style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}
                                        >
                                        <div className="training-name-trainings" 
                                            onClick={() => navigate(`/users/${username}/teams/${match.myTeam}/matches/${match.id}`)} 
                                            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', lineHeight: '1.5' }} // Añadido lineHeight
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
                                                            {`${match.date} - ${match.hour}`} 
                                                        </span>
                                                    </div>
                                                    <span className="training-location-trainings" style={{ fontSize: '1.5vw', marginLeft: '7vw'}} >
                                                        {`${match.city} - ${match.address}`}
                                                    </span>
                                                </div>
                                            </div>

                                            {deleteMode && (
                                                <div className="training-delete-button-trainings">
                                                    <button
                                                        className={`delete-circle ${
                                                            selectedMatches.has(match.id) ? 'selected' : ''
                                                        }`}
                                                        onClick={() => handleSelectMatch(match.id)}
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

export default ComponentMatchesLayout;