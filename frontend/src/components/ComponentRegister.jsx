// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/User/CreateUser'; 
import '../CSS/CSSRegister.css';

const Register = () => {
    const [userData, setUserData] = useState({ username: '', password: '', name: '', surname: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            await createUser(userData);  
            console.log('User data submitted:', userData); 
            navigate("/login"); 
        } catch (error) {
            const errorMessages = error.message.split('\n'); 
            const combinedErrors = ['Error with user Registration: ', ...errorMessages].join(', '); 
            const finalError = combinedErrors.replace('Error with user Registration: ,', 'Error with user Registration: ');

            setError(finalError); 
        }
    };

    return (
        <div className="main-container">
            <div className="content">
                <h1 className="app-title">Register</h1>
                {error && <p className="error">{error}</p>} {/* Render the error */}
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <i className="fas fa-circle-user input-icon"></i>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={userData.username}
                            onChange={handleChange}
                            className="input"
                        />
                        <span className="underline"></span>
                    </div>
                    <div className="input-container">
                        <i className="fas fa-user input-icon"></i>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={userData.name}
                            onChange={handleChange}
                            className="input"
                        />
                        <span className="underline"></span>
                    </div>
                    <div className="input-container">
                        <i className="fas fa-user-friends input-icon"></i>
                        <input
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            value={userData.surname}
                            onChange={handleChange}
                            className="input"
                        />
                        <span className="underline"></span>
                    </div>
                    <div className="input-container">
                        <i className="fas fa-lock input-icon"></i>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={userData.password}
                            onChange={handleChange}
                            className="input"
                        />
                        <span className="underline"></span>
                    </div>
                    <button type="submit" className="button-register-page register-button-register-page">Register</button>
                </form>
                <button onClick={() => navigate("/")} className="button-register-page back-button-register-page">Back to main page</button>
            </div>
        </div>
    );
};

export default Register;
