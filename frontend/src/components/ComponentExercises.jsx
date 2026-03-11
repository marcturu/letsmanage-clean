import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExercises } from '../api/Exercise/GetExercises';
import '../CSS/CSSExercises.css';

const ComponentExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ type: '', personalized: '' });
    const navigate = useNavigate();

    const exerciseTypes = [
        { label: 'Warm-up', value: 'warmup' },
        { label: 'Conditioning', value: 'conditioning' },
        { label: 'Passing', value: 'passing' },
        { label: 'Possession', value: 'possession' },
        { label: 'Shooting', value: 'shooting' },
        { label: 'Duels', value: 'duels' },
        { label: 'Tactical', value: 'tactical' },
        { label: 'Match Simulation', value: 'matchsimulation' },
    ];

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const fetchedExercises = await getExercises(filters);
                setExercises(fetchedExercises);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading exercises: ' + error.message);
            }
        };

        fetchExercises();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handlePersonalizedToggle = () => {
        setFilters({
            ...filters,
            personalized: filters.personalized === 'true' ? '' : 'true'
        });
    };

    if (error) {
        return (
            <div className="main-container-exercises">
                <div className="content-exercises">
                    <h1 className="app-title-exercises">Exercises</h1>
                    <div className="error-exercises">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container-exercises">
            <div className="content-exercises">
                <div className="header-exercises">
                    <h1 className="app-title-exercises">Exercises</h1>
                </div>
                <div className="filter-exercises">
                    <label>
                        Type:
                        <select name="type" value={filters.type} onChange={handleFilterChange}>
                            <option value="">All</option>
                            {exerciseTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="toggle-container-exercises">
                        <label className="toggle-label-exercises">Only personalized: </label>
                        <label className="toggle-switch-exercises">
                            <input
                                type="checkbox"
                                checked={filters.personalized === 'true'}
                                onChange={handlePersonalizedToggle}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className="exercises-list-exercises">
                    {exercises.map((exercise) => (
                        <div className="exercise-item-exercises" key={exercise.id}>
                            <div className="exercise-photo-exercises" onClick={() => navigate(`/exercises/${exercise.id}`)}>
                                <img src={exercise.photo} alt={`${exercise.id} logo`} />
                            </div>
                            <div className="exercise-info-exercises">
                                <div className="exercise-header-exercises">
                                    <h2 className="exercise-name-exercises">{exercise.id}</h2>
                                </div>
                                <div className="exercise-duration-personalized-exercises">
                                    <div className="exercise-duration-exercises">
                                        <i className="fas fa-clock exercise-duration-icon-exercises"></i>
                                        <span><strong>Duration:</strong> {exercise.duration}</span>
                                    </div>
                                    <div className="exercise-personalized-exercises">
                                        <i className="fas fa-user exercise-personalized-icon-exercises"></i>
                                        <span>
                                            <strong>Personalized:</strong>{" "}
                                            <span className={exercise.personalized ? "yes-exercises" : "no-exercises"}>
                                                {exercise.personalized ? "Yes" : "No"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComponentExercises;
