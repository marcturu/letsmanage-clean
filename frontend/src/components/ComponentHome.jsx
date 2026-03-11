import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/CSSHome.css';

const Home = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        window.scrollTo(0, 0); 
    }, []);

    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <div className="home-page-container">
            <header className="header-bar">
                <h1>Welcome to Let's Manage!</h1>
                <div className="welcome-messages">
                    <h2>Where tradition meets innovation</h2>
                </div>
            </header>

            {/* Secciones de imágenes en forma de rombo */}
            <div className="image-grid">
                <div 
                    className="image-item" 
                    onClick={() => handleNavigation('/clubs')}>
                    <img src="/assets/club.jpg" alt="Clubs" />
                </div>
                <div 
                    className="image-item" 
                    onClick={() => handleNavigation(`/users/${username}/teams`)}>
                    <img src="/assets/team.jpg" alt="Your Teams" />
                </div>
                <div 
                    className="image-item" 
                    onClick={() => handleNavigation('/matches')}>
                    <img src="/assets/match.jpg" alt="Matches" />
                </div>
                <div 
                    className="image-item" 
                    onClick={() => handleNavigation('/trainings')}>
                    <img src="/assets/training.jpg" alt="Trainings" />
                </div>
                <div 
                    className="image-item" 
                    onClick={() => handleNavigation('/exercises')}>
                    <img src="/assets/exercise.jpg" alt="Exercises" />
                </div>
            </div>
        </div>
    );
};

export default Home;
