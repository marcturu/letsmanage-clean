import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/CSSMainPage.css'

const MainPage = ({ message }) => {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="main-content">
                <h1 className="app-title">Welcome to <br /> Let's Manage!</h1>
                <p className="app-message">{message}</p>
                <div className="button-main-page-container">
                    <button className="button-main-page register-button-main-page" onClick={() => navigate("/register")}>Register</button>
                    <button className="button-main-page login-button-main-page" onClick={() => navigate("/login")}>Log In</button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;