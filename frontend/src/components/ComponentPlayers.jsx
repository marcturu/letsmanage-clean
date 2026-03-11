import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayersByTeam } from '../api/Player/GetPlayersByTeam';
import { deletePlayer } from '../api/Player/DeletePlayer';
import '../CSS/CSSPlayers.css';

const ComponentPlayers = ({ teamId }) => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState(new Set());
    const [deleteMode, setDeleteMode] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { idT } = useParams();
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getPlayersByTeam(username, idT);
                setPlayers(data);
            } catch (err) {
                setError('Error loading players: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [teamId, username, idT]);

    const handleDeleteModeToggle = () => {
        setDeleteMode(!deleteMode);
        setSelectedPlayers(new Set());
    };
    
    const handleSelectPlayers = (playerId) => {
        setSelectedPlayers((prevSelectedPlayers) => {
            const newSelectedPlayers = new Set(prevSelectedPlayers);
            if (newSelectedPlayers.has(playerId)) {
                newSelectedPlayers.delete(playerId);
            } else {
                newSelectedPlayers.add(playerId);
            }
            return newSelectedPlayers;
        });
    };
    
    const handleDelete = async () => {
        if (selectedPlayers.size === 0) return;

        if (window.confirm('Are you sure you want to delete the selected players?')) {
            try {
                await Promise.all(
                    Array.from(selectedPlayers).map((idPlayer) => deletePlayer(username, idT, idPlayer))
                );
                const data = await getPlayersByTeam(username, idT);
                setPlayers(data);
                alert('Selected players deleted successfully!');
            } catch (err) {
                setError(`Error deleting players: ${err.message}`);
            } finally {
                setDeleteMode(false);
                setSelectedPlayers(new Set());
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading players...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-players">{error}</div>;
    }

    return (
        <div className="players-container">
            <h1 className="players-title">Players</h1>
            <button
                className={`delete-player-button-players ${deleteMode ? 'active' : ''}`}
                onClick={handleDeleteModeToggle}
            >
                {deleteMode ? 'Cancel Delete' : 'Delete Players'}
            </button>
            <div className="players-list">
                {players.length > 0 ? (
                    players.map(player => (
                        <div
                            key={player.name}
                            className={`player-item-players ${deleteMode ? 'delete-mode' : ''}`}
                            style={{ position: 'relative' }} 
                        >
                            <div className="players-player-item" onClick={() => navigate(`/users/${username}/teams/${idT}/players/${player.id}`)}>
                                <div className="players-player-photo-container">
                                    <img src={player.photo} alt={`${player.name} ${player.surname}`} className="players-player-photo" />
                                </div>
                                <div className="players-player-info">
                                    <h3>{player.name} {player.surname} {player.surname2}</h3>
                                    <p>{player.number}</p>
                                </div>
                            </div>
                            {deleteMode && (
                                <div className="player-delete-button-players">
                                    <button
                                        className={`delete-circle ${selectedPlayers.has(player.id) ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectPlayers(player.id);
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-players-found">
                        <i className="fas fa-sad-tear"></i>
                        <p>You have no players</p>
                    </div>
                )}
            </div>
            {deleteMode && (
                <button className="submit-button-delete-players" onClick={handleDelete}>
                    Delete Selected Players
                </button>
            )}
        </div>
    );    
    
};

export default ComponentPlayers;
