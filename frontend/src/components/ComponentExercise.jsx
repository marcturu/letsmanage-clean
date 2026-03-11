import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExercise } from '../api/Exercise/GetExercise';
import '../CSS/CSSExercise.css';

const ComponentExercise = () => {
    const [exercise, setExercise] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const fetchedExercise = await getExercise(id);
                setExercise(fetchedExercise);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading exercise: ' + error.message);
            }
        };

        fetchExercise();
    }, [id]);

    if (error) {
        return (
            <div className="main-container-exercise">
                <div className="content-exercise">
                    <h1 className="app-title-exercise">Exercise</h1>
                    <div className="error-exercise">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading exercise...</p>
            </div>
        );
    }

    return (
        <div className="main-container-exercise">
            <div className="content-exercise">
                <div className="header-exercise">
                    <h1 className="app-title-exercise">{exercise.id}</h1>
                </div>
                <div className="exercise">
                    <div className="exercise-photo-exercise">
                        <img src={process.env.PUBLIC_URL + '/' + exercise.photo} alt={`${exercise.id} logo`} />
                    </div>
                    <div className="exercise-info-exercise">
                        <h2>Description:</h2>
                        <p>{exercise.description}</p>
                        <h2>Duration:</h2>
                        <p>{exercise.duration}</p>
                        <h2>Material:</h2>
                        <ul>
                            {exercise.material.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <h2>Personalized:</h2>
                        <p className={exercise.personalized ? "yes-exercise" : "no-exercise"}>
                            {exercise.personalized ? "Yes" : "No"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentExercise;
