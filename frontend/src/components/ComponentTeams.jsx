import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeamsByUser } from '../api/Team/GetTeamsByUser';
import { getClubs } from '../api/Club/GetClubs';
import { createTeam } from '../api/Team/CreateTeam';
import { deleteTeam } from '../api/Team/DeleteTeam';
import '../CSS/CSSTeams.css';

const ComponentTeams = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clubs, setClubs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({
        club: '',
        category: '',
        letter: '',
        league: ''
    });
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState(new Set());
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await getTeamsByUser(username);
                setTeams(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [username]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const fetchedClubs = await getClubs();
                setClubs(fetchedClubs);
            } catch (error) {
                setError('Error loading clubs: ' + error.message);
            }
        };

        fetchClubs();
    }, []);

    const categories = [
        'Prebenjamí', 'Benjamí', 'Aleví', 'Infantil', 'Cadet', 'Juvenil', 'Amateur', 'Veterans'
    ];

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewTeam({
            club: '',
            category: '',
            letter: '',
            league: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeam(prevState => {
            const updatedTeam = { ...prevState, [name]: value };
            return updatedTeam;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTeam.league || newTeam.league.trim() === '') {
            alert('The league field cannot be empty.');
            return;
        }
        
        const teamData = { ...newTeam, coach: username, creator: username };
        

        try {
            await createTeam(username, teamData);

            const data = await getTeamsByUser(username);
            setTeams(data);

            alert('New team created successfully!');
            handleCloseModal();
        } catch (err) {
            setError(`Error creating team: ${err.message}`);
        }
    };

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

        if (window.confirm('Are you sure you want to delete the selected teams?')) {
            try {
                await Promise.all(Array.from(selectedTeams).map((idT) => deleteTeam(username, idT)));
                const data = await getTeamsByUser(username);
                setTeams(data);
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
        return <div className="error-teams">{error}</div>;
    }

    return (
        <div className="main-container-teams">
            <h1 className="app-title-teams">
                Your Teams
                <button className="new-team-button-teams" onClick={handleOpenModal}>New My Team</button>
                <button 
                    className={`delete-team-button-teams ${deleteMode ? 'active' : ''}`} 
                    onClick={handleDeleteModeToggle}
                >
                    {deleteMode ? 'Cancel Delete' : 'Delete My Teams'}
                </button>
            </h1>

            {modalOpen && (
                <div className="modal-teams">
                    <div className="modal-content-teams">
                        <h2>Create your Team</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-teams">
                                <label htmlFor="club">Club</label>
                                <select
                                    id="club"
                                    name="club"
                                    value={newTeam.club}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Club</option>
                                    {clubs.length > 0 ? (
                                        clubs.map(club => (
                                            <option key={club.id} value={club.id}>
                                                {club.id}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No clubs available</option>
                                    )}
                                </select>
                            </div>

                            <div className="form-group-teams">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={newTeam.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group-teams">
                                <label htmlFor="letter">Letter</label>
                                <select
                                    id="letter"
                                    name="letter"
                                    value={newTeam.letter}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Letter</option>
                                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
                                        <option key={letter} value={letter}>
                                            {letter}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group-teams">
                                <label htmlFor="league">League</label>
                                <input
                                    type="text"
                                    id="league"
                                    name="league"
                                    value={newTeam.league}
                                    onChange={handleInputChange}
                                    placeholder="Enter league"
                                />
                            </div>

                            <div className="form-buttons-teams">
                                <button type="submit" className="submit-button-modal-create-teams">Create Team</button>
                                <button type="button" onClick={handleCloseModal} className="cancel-button-teams">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="content-teams">
                {teams.length > 0 ? (
                    <div className="teams-list-teams">
                        {teams.map(team => (
                            <div key={team.id} className={`team-item-teams ${deleteMode ? 'delete-mode' : ''}`} style={{ transform: deleteMode ? 'translateX(5vw)' : 'none' }}>
                                <div className="team-photo-teams" onClick={() => navigate(`/users/${username}/teams/${team.id}`)}>
                                    <img src={team.teamPhoto} alt={`${team.id} logo`} />
                                </div>
                                <div className="team-info-teams">
                                    <div className="team-header-teams">
                                        <div className="team-category-letter-teams">
                                            <span className="team-category-teams">{team.category}</span>
                                            <span className="team-letter-teams">{team.letter}</span>
                                        </div>
                                        <div className="team-club-teams">{team.club}</div>
                                    </div>
                                    <div className="team-points-ratio-teams">
                                        <span className="team-pointsRatio-teams">Points: {team.points}</span>
                                    </div>
                                    {deleteMode && (
                                        <div className="team-delete-button-teams">
                                            <button
                                                className={`delete-circle ${selectedTeams.has(team.id) ? 'selected' : ''}`}
                                                onClick={() => handleSelectTeam(team.id)}
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
                    <div className="no-teams-found">
                        <i className="fas fa-sad-tear"></i>
                        <p>You have no teams</p>
                    </div>
                )}
            </div>

            {deleteMode && (
                <button className="submit-button-delete-teams" onClick={handleDelete}>Delete Selected Teams</button>
            )}
        </div>
    );
};

export default ComponentTeams;