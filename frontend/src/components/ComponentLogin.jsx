import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../api/VerifyUser'; 
import '../CSS/CSSLogin.css'; 

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState([]);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyUser(credentials);
            localStorage.setItem('username', credentials.username); 
            navigate("/home");
        } catch (error) {
            const errorMessages = error.message.split('\n'); 
            const combinedErrors = ['Error with user Log In: ', ...errorMessages]; 
            setError(combinedErrors); 
        }
    };

    return (
        <div className="main-container">
            <div className="content">
                <h1 className="app-title">Log in</h1>
                {error.length > 0 && (
                    <div className="error">
                        {error.map((err, index) => (
                            <p key={index}>{err}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <i className="fas fa-circle-user input-icon"></i>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={credentials.username}
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
                            value={credentials.password}
                            onChange={handleChange}
                            className="input"
                        />
                        <span className="underline"></span>
                    </div>
                    <button type="submit" className="button-login-page login-button-login-page">Log in</button>
                </form>
                <button onClick={() => navigate("/")} className="button-login-page back-button-login-page">Back to Main page</button>
            </div>
        </div>
    );
};

export default Login;
