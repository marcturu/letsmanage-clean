import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../api/User/GetUser.jsx';
import { deleteUser } from '../api/User/DeleteUser.jsx';
import { updateUser } from '../api/User/UpdateUser.jsx';
import { getTeamsByUser } from '../api/Team/GetTeamsByUser.jsx';  
import '../CSS/CSSProfile.css';

const ComponentProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]); 
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', surname: '', username: '', password: '' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await getUser(username);
                setUser(fetchedUser);
                setFormData({ name: fetchedUser.name, surname: fetchedUser.surname, username: fetchedUser.username, password: fetchedUser.password });
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading user profile: ' + error.message);
            }
        };

        fetchUser();
    }, [username]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const userTeams = await getTeamsByUser(username);
                setTeams(userTeams);
            } catch (error) {
                setError('Error loading teams: ' + error.message);
            }
        };

        fetchTeams();
    }, [username]);

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                await deleteUser(username);
                alert('Your account has been deleted.');
                handleLogout();
            } catch (error) {
                setError('Error deleting account: ' + error.message);
            }
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await updateUser(username, formData);
            setUser({ ...user, ...formData });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            setError('Error updating profile: ' + error.message);
        }
    };

    if (error) {
        return (
            <div className="main-container-profile">
                <div className="content-profile">
                    <h1 className="app-title-profile">User Profile</h1>
                    <div className="error-profile">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container-profile">
            <div className="content-profile">
                <div className="profile-header-profile">
                    <h1 className="app-title-profile">Profile</h1>
                    <div className="menu-container-profile">
                        <div className="floating-button" onClick={toggleMenu}>
                        <i class="fas fa-sign-out-alt"></i>
                        </div>
                        {menuOpen && (
                            <div className="menu-dropdown-profile">
                                <button onClick={handleLogout} className="logout-button-profile">Log Out</button>
                                <button onClick={handleDelete} className="delete-button-profile">Delete Account</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="edit-profile-container-profile">
                    <div className="action-buttons-profile">
                        <button onClick={handleEditProfile} className="edit-button-profile" style={{ marginLeft: 'auto' }}>Edit Profile</button>
                    </div>
                    {isEditing && (
                        <div className="save-cancel-buttons" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button onClick={handleSave} className="save-button-profile">Save</button>
                            <button onClick={handleEditProfile} className="cancel-button-profile">Cancel</button>
                        </div>
                    )}
                    <div className="profile-details-profile">
                        <div className="left-column-profile">
                            <div className="input-container-profile">
                                <label className="label-input-profile"><strong>Username: </strong></label>
                                <span>{formData.username}</span>
                            </div>
                            <div className="input-container-profile">
                                <label className="label-input-profile"><strong>Password: </strong></label>
                                {isEditing ? (
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="profile-input" />
                                ) : (
                                    <span>
                                        ********
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="right-column-profile">
                            <div className="input-container-profile">
                                <label className="label-input-profile"><strong>Name: </strong></label>
                                {isEditing ? (
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="profile-input" />
                                ) : (
                                    <span>{formData.name}</span>
                                )}
                            </div>
                            <div className="input-container-profile">
                                <label className="label-input-profile"><strong>Surname: </strong></label>
                                {isEditing ? (
                                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="profile-input" />
                                ) : (
                                    <span>{formData.surname}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-container-teams-profile">
                    <h1 className="app-title-teams-profile">Your Teams</h1>
                    <div className="content-teams-profile">
                        {teams.length > 0 ? (
                            <div className="teams-list-teams-profile">
                                {teams.map(team => (
                                   <div className="team-item-teams-profile">
                                        <div className="team-photo-teams-profile">
                                            <img src={team.teamPhoto} alt={`${team.id} logo`} />
                                        </div>
                                    <div className="team-info-teams-profile">
                                        <div className="team-header-teams-profile">
                                            <div className="team-category-letter-teams-profile">
                                                <span className="team-category-teams-profile">{team.category}</span>
                                                <span className="team-letter-teams-profile">{team.letter}</span>
                                            </div>
                                        </div>
                                        <div className="team-club-teams-profile">{team.club}</div> {/* Aquí está el club debajo de letter y category */}
                                    </div>
                                </div>
                                ))}
                            </div>
                        ) : (
                            <p>No teams found for this user.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentProfile;