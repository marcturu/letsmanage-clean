import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRivalTeam } from '../api/Team/GetRivalTeam';
import { updateRivalTeam } from '../api/Team/UpdateRivalTeam';
import '../CSS/CSSRivalTeam.css';

const ComponentRivalTeam = () => {
    const [rivalTeam, setRivalTeam] = useState(null);
    const [editedRivalTeam, setEditedRivalTeam] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { idT, idT2 } = useParams();
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchRivalTeam = async () => {
            try {
                const fetchedRivalTeam = await getRivalTeam(username, idT, idT2);
                setRivalTeam(fetchedRivalTeam);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading team: ' + error.message);
            }
        };

        fetchRivalTeam();
    }, [idT]);

    const handleEditButtonClick = () => {
        setIsEditing(true);
        console.log("rivalTeam when editing: ", rivalTeam);
        setEditedRivalTeam({
            club: rivalTeam.club || '',
            category: rivalTeam.category || '',
            letter: rivalTeam.letter || '',
            league: rivalTeam.league || '',
            points: rivalTeam.points || '',
            gamesWon: rivalTeam.gamesWon || '',
            gamesLost: rivalTeam.gamesLost || '',
            winningStreak: rivalTeam.winningStreak || '',
            losingStreak: rivalTeam.losingStreak || '',
            localGoals: rivalTeam.localGoals || '',
            awayGoals: rivalTeam.awayGoals || '',
            localGoalsConceded: rivalTeam.localGoalsConceded || '',
            awayGoalsConceded: rivalTeam.awayGoalsConceded || '',
            teamPhoto: rivalTeam.teamPhoto || '',
            strengths: Array.isArray(rivalTeam.strengths) ? rivalTeam.strengths : [], 
            weaknesses: Array.isArray(rivalTeam.weaknesses) ? rivalTeam.weaknesses : [] 
          });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
    
        if (name === 'strengths' || name === 'weaknesses') {
            formattedValue = value.split(',').map((item) => item.trim());
        }
    
        setEditedRivalTeam((prevState) => ({
            ...prevState,
            [name]: formattedValue,
        }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedRivalTeam(rivalTeam);
    };

    const handleSave = async () => {
        const updatedRivalTeam = {
            ...rivalTeam, 
            ...Object.keys(editedRivalTeam).reduce((acc, key) => {
                const value = editedRivalTeam[key];
                acc[key] = value === "" ? rivalTeam[key] : value; 
                if (["gamesWon", "gamesLost", "winningStreak", "losingStreak", "localGoals", "awayGoals", "localGoalsConceded", "awayGoalsConceded", "points"].includes(key)) {
                    acc[key] = isNaN(parseFloat(acc[key])) ? 0 : parseFloat(acc[key]);
                }
                return acc;
            }, {}),
        };

        editedRivalTeam.strengths = Array.isArray(editedRivalTeam.strengths) 
        ? editedRivalTeam.strengths 
        : [];

        editedRivalTeam.weaknesses = Array.isArray(editedRivalTeam.weaknesses) 
        ? editedRivalTeam.weaknesses 
        : [];

        console.log("updatedRivalTeam: ", updatedRivalTeam);
    
        try {
            console.log("Updated Rival Team: ", updatedRivalTeam);
            const response = await updateRivalTeam(username, idT, idT2, updatedRivalTeam);
                setRivalTeam(updatedRivalTeam); 
                setIsEditing(false);
        } catch (error) {
            console.error('Error updating rivalTeam:', error);
        }
    };

    if (error) {
        return (
            <div className="main-container-rival-team">
                <div className="content-rival-team">
                    <h1 className="app-title-rival-team">Team</h1>
                    <div className="error-rival-team">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!rivalTeam) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading players...</p>
            </div>
        );
    }

    return (
        <div className="main-container-rival-team">
            <div className="content-rival-team">
                <div className="header-rival-team">
                    <div className="rival-team-header-content">
                        <div className="rival-team-photo">
                            <img src={rivalTeam.teamPhoto} alt={`${rivalTeam.id} logo`} />
                        </div>
                        <div className="rival-team-id">
                            <div className="rival-team-id1">
                                <h1>{rivalTeam.club}</h1>
                            </div>
                            <div className="rival-team-id2">
                                <h1>{rivalTeam.category} {rivalTeam.letter}</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="edit-rivalteam-button">
                    <button onClick={() => (isEditing ? handleCancel() : handleEditButtonClick())}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button className="player-save-button" onClick={handleSave}>Save</button>
                    )}
                </div>

                <div className="rival-team-info">
                    <div className="rival-team-stats">
                    <div className="rival-team-stats-row-especial">
                        <div className="rival-team-stats-item">
                            <h2>League:</h2>
                            <p>{rivalTeam.league}</p>
                        </div>
                        <div className="rival-team-stats-item">
                            <h2>Strengths:</h2>
                            {isEditing ? (
                                <textarea
                                    name="strengths"
                                    value={editedRivalTeam.strengths}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p>{Array.isArray(rivalTeam?.strengths) ? rivalTeam.strengths.join(', ') : ''}</p>
                            )}
                        </div>
                        <div className="rival-team-stats-item">
                            <h2>Weaknesses:</h2>
                            {isEditing ? (
                                <textarea
                                    name="weaknesses"
                                    value={editedRivalTeam.weaknesses}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p>{Array.isArray(rivalTeam?.weaknesses) ? rivalTeam.weaknesses.join(', ') : ''}</p>
                            )}
                        </div>
                        <div className="rival-team-stats-item">
                                <h2>Points:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="points"
                                        value={editedRivalTeam.points}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.points}</p>
                                )}
                            </div>
                    </div>
                        <div className="rival-team-stats-row">
                            <div className="rival-team-stats-item">
                                <h2>Games Won:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="gamesWon"
                                        value={editedRivalTeam.gamesWon}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.gamesWon}</p>
                                )}
                            </div>
                            <div className="rival-team-stats-item">
                                <h2>Games Lost:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="gamesLost"
                                        value={editedRivalTeam.gamesLost}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.gamesLost}</p>
                                )}
                            </div>
                            <div className="rival-team-stats-item">
                                <h2>Winning Streak:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="winningStreak"
                                        value={editedRivalTeam.winningStreak}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.winningStreak}</p>
                                )}
                            </div>
                            <div className="rival-team-stats-item">
                                <h2>Losing Streak:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="losingStreak"
                                        value={editedRivalTeam.losingStreak}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.losingStreak}</p>
                                )}
                            </div>
                            
                        </div>
                        <div className="rival-team-stats-row">
                        <div className="rival-team-stats-item">
                                <h2>Local Goals:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="localGoals"
                                        value={editedRivalTeam.localGoals}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.localGoals}</p>
                                )}
                            </div>
                            <div className="rival-team-stats-item">
                                <h2>Away Goals:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="awayGoals"
                                        value={editedRivalTeam.awayGoals}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.awayGoals}</p>
                                )}
                            </div>
                            <div className="rival-team-stats-item">
                                <h2>Local Goals Conceded:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="localGoalsConceded"
                                        value={editedRivalTeam.localGoalsConceded}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.localGoalsConceded}</p>
                                )}
                            </div>
                            <div className="rival-team-stats-item">
                                <h2>Away Goals Conceded:</h2>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="awayGoalsConceded"
                                        value={editedRivalTeam.awayGoalsConceded}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p>{rivalTeam.awayGoalsConceded}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentRivalTeam;
