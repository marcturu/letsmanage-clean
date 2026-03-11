import React, { useState, useEffect } from 'react'; 
import { Outlet, useNavigate } from 'react-router-dom';
import '../CSS/CSSSharedLayout.css'; 

const SharedLayout = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            setError('Username not found. Please log in.');
        }
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleHomeClick = () => {
        navigate(`/home`);
    };

    const handleProfileClick = () => {
        if (username) {
            navigate(`/profile/${username}`);
        } else {
            setError('Username not found. Please log in.');
        }
    };

    const handleClubsClick = () => {
        navigate(`/clubs`);
    };

    const handleTeamsClick = () => {
        navigate(`/users/${username}/teams`);
    };

    if (error) {
        return (
            <div className="home-container">
                <h1>Welcome to the Home Page</h1>
                <p>{error}</p>
                <button onClick={() => navigate("/")} className="profile-button">
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="main-container">
            <aside className="sidebar">
                <div className="top-section">
                    <div className="logo">
                        <div onClick={handleHomeClick} className="click-logo-sharedlayout">
                            <img src="/assets/letsmanage-logo.png" alt="Let'sManage Logo" className="logo-img" />
                        </div>
                    </div>
                </div>
                <nav className="menu">
                    <div onClick={handleClubsClick} className="menu-item">Clubs</div>
                    <div onClick={handleTeamsClick} className="menu-item">Teams</div>
                    <div onClick={() => handleNavigation("/matches")} className="menu-item">Matches</div>
                    <div onClick={() => handleNavigation("/trainings")} className="menu-item">Trainings</div>
                    <div onClick={() => handleNavigation("/exercises")} className="menu-item">Exercises</div>
                </nav>
                <div className="bottom-section">
                    <div onClick={handleProfileClick} className="menu-item">Profile</div>
                </div>
            </aside>
            <main className="content-sharedlayout">
                <Outlet />
            </main>
        </div>
    );
};

export default SharedLayout;