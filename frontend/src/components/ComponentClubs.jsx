import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getClubs } from '../api/Club/GetClubs';
import '../CSS/CSSClubs.css';

const ComponentClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const fetchedClubs = await getClubs();
                setClubs(fetchedClubs);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading clubs: ' + error.message);
            }
        };

        fetchClubs();
    }, []);

    if (error) {
        return (
            <div className="main-container-club">
                <div className="content-club">
                    <h1 className="app-title-club">Clubs</h1>
                    <div className="error-club">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container-club">
            <div className="content-club">
                <div className="header-club">
                    <h1 className="app-title-club">Clubs</h1>
                </div>
                <div className="club-list-header">
                    <span className="club-list-title">Photo</span>
                    <span className="club-list-title">Name</span>
                    <span className="club-list-title">City</span>
                    <span className="club-list-title">Location</span>
                </div>
                <div className="club-list">
                    {clubs.map((club) => (
                        <div className="club-item" key={club.id}>
                            <div className="club-photo">
                                <img src={club.photo} alt={`${club.id} logo`} style={{ width: '15%', height: 'auto' }} />
                            </div>
                            <div className="club-name">
                                <span>{club.id}</span>
                            </div>
                            <div className="club-city">
                                <span>{club.city}</span>
                            </div>
                            <div className="club-location">
                                <span>{club.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComponentClubs;
