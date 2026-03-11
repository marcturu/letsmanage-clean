import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation  } from 'react-router-dom';
import { getRivalTeamsByUser } from '../api/Team/GetRivalTeamsByUser';
import { deleteTeam } from '../api/Team/DeleteTeam';
import '../CSS/CSSRivalTeams.css';

const ComponentRivalTeams = () => {
    const [rivalTeams, setRivalTeams] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState(new Set());
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const { idT } = useParams();
    const location = useLocation();
    const { league } = location.state || {};


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await getRivalTeamsByUser(username, idT, league);
                setRivalTeams(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [username]);

    const handleDeleteModeToggle = () => {
        setDeleteMode(!deleteMode);
        setSelectedTeams(new Set());
    };

    const handleSelectTeam = (teamId) => {
        setSelectedTeams((prevSelectedTeams) => {
            const newSelectedTeams = new Set(prevSelectedTeams);
            if (newSelectedTeams.has(teamId)) {
                newSelectedTeams.delete(teamId);
            } else {
                newSelectedTeams.add(teamId);
            }
            return newSelectedTeams; 
        });
    };
    
    const handleDelete = async () => {
        if (selectedTeams.size === 0) return;
    
        const teamsToDelete = Array.from(selectedTeams);
        console.log("Teams to delete: ", teamsToDelete);
    
        if (window.confirm('Are you sure you want to delete the selected teams? \nDo not eliminate teams with which you have created matches')) {
            try {
                await Promise.all(teamsToDelete.map((idRT) => deleteTeam(username, idRT)));
    
                const data = await getRivalTeamsByUser(username, idT, league);
                setRivalTeams(data);
    
                alert('Selected teams deleted successfully!');
            } catch (err) {
                setError(`Error deleting teams: ${err.message}`);
            } finally {
                setDeleteMode(false);
                setSelectedTeams(new Set());
            }
        }
    };

    if (error) {
        return <div className="error-rival-teams">{error}</div>;
    }

    return (
        <div className="main-container-rival-teams">
            <h1 className="app-title-rival-teams">
                Rival Teams from your league
                <button 
                    className={`delete-team-button-teams ${deleteMode ? 'active' : ''}`} 
                    onClick={handleDeleteModeToggle}
                >
                    {deleteMode ? 'Cancel Delete' : 'Delete Rival Teams'}
                </button>
            </h1>

            <div className="content-rival-teams">
                {rivalTeams.length > 0 ? (
                    <div className="teams-list-rival-teams">
                        {rivalTeams.map(rivalTeam => (
                            <div key={rivalTeam.id} className={`team-item-rival-teams ${deleteMode ? 'delete-mode' : ''}`} style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}>
                                <div className="team-photo-rival-teams" onClick={() => navigate(`/users/${username}/teams/${idT}/rival_teams/${rivalTeam.id}`)}>
                                    <img src={rivalTeam.teamPhoto} alt={`${rivalTeam.id} logo`} />
                                </div>
                                <div className="team-info-rival-teams">
                                    <div className="team-header-rival-teams">
                                        <div className="team-category-letter-rival-teams">
                                            <span className="team-category-rival-teams">{rivalTeam.category}</span>
                                            <span className="team-letter-rival-teams">{rivalTeam.letter}</span>
                                        </div>
                                        <div className="team-club-rival-teams">{rivalTeam.club}</div>
                                    </div>
                                    <div className="team-points-ratio-rival-teams">
                                        <span className="team-pointsRatio-rival-teams">Points: {rivalTeam.points}</span>
                                    </div>
                                    {deleteMode && (
                                        <div className="team-delete-button-rival-teams">
                                            <button
                                                className={`delete-circle ${selectedTeams.has(rivalTeam.id) ? 'selected' : ''}`}
                                                onClick={() => handleSelectTeam(rivalTeam.id)}
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
                    <div className="no-rivalteams-found">
                        <i className="fas fa-sad-tear"></i>
                        <p>You have no rival teams</p>
                    </div>
                )}
            </div>

            {deleteMode && (
                <button className="submit-button-delete-rival-teams" onClick={handleDelete}>Delete Selected Rival Teams</button>
            )}
        </div>
    );
};

export default ComponentRivalTeams;