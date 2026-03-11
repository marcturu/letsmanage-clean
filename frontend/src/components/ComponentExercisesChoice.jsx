import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getExercises } from '../api/Exercise/GetExercises';
import '../CSS/CSSExercisesChoice.css';

const ComponentExercisesChoice = () => {
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ type: '', personalized: '' });
    const [selectedExercises, setSelectedExercises] = useState([]); // Guardamos solo los ids
    const navigate = useNavigate();
    const location = useLocation();
    
    // Reget previous page state (modal & selected exercises)
    const { selectedExercises: selectedExercisesFromLocation, modalState, previousPath  } = location.state || {};
    
    const showExercisesSelected = previousPath?.includes('/trainings/');

    useEffect(() => {
        if (!showExercisesSelected) {
            setSelectedExercises([]);
            sessionStorage.removeItem('selectedExercises');
        } else if (selectedExercisesFromLocation) {
            setSelectedExercises(selectedExercisesFromLocation);
        }
    }, [showExercisesSelected, selectedExercisesFromLocation]);

    useEffect(() => {
        if (selectedExercisesFromLocation) {
            setSelectedExercises(selectedExercisesFromLocation);
        }
    }, [selectedExercisesFromLocation]);

    useEffect(() => {
        console.log("Location state in ExercisesChoice:", location.state);
    
        const { selectedExercises, modalState } = location.state || {};
        console.log("Selected exercises in ExercisesChoice:", selectedExercises);
        console.log("Modal state in ExercisesChoice:", modalState);
    
        if (selectedExercises) {
        }
    
        if (modalState) {
        }
    }, [location.state]);
    
    // If selected exercises, initialize in state
    useEffect(() => {
        // Reget selected exercises from sessionStorage
        const storedSelectedExercises = JSON.parse(sessionStorage.getItem('selectedExercises'));
        if (storedSelectedExercises) {
            setSelectedExercises(storedSelectedExercises);
        }
    }, []);

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

    const handleSelectExercise = (exercise) => {
        const isAlreadySelected = selectedExercises.includes(exercise.id);
        const updatedSelection = isAlreadySelected
            ? selectedExercises.filter(id => id !== exercise.id)
            : [...selectedExercises, exercise.id];
    
        setSelectedExercises(updatedSelection);
        sessionStorage.setItem('selectedExercises', JSON.stringify(updatedSelection));
    };
    
    const handleSubmitSelection = () => {
        console.log("Location state en handleSubmitSelection choice:", location.state);
        console.log("Selected Exercises en handleSubmitSelection de choice:", selectedExercises);
    
        if (!modalState) {
            console.error("Modal State no está definido");
            return;
        }
    
        const updatedModalState = {
            ...modalState,
            exercises: selectedExercises
        };
    
        console.log("Modal State en handleSubmitSelection de choice:", updatedModalState);
    
        // Destionation route with state
        navigate(previousPath, { state: { modalState: updatedModalState } });
    };

    const handleSubmitRemoveExercises = () => {
        // No exercises selected
        setSelectedExercises([]);
        // No storage in sessionStorage
        sessionStorage.removeItem('selectedExercises');
    };

    if (error) {
        return (
            <div className="main-container-exercises-choice">
                <div className="content-exercises-choice">
                    <h1 className="app-title-exercises-choice">Exercises</h1>
                    <div className="error-exercises-choice">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container-exercises-choice">
            <div className="content-exercises-choice">
                <div className="header-exercises-choice">
                    <h1 className="app-title-exercises-choice">Exercises</h1>
                </div>
                
                <div className="filter-exercises-choice">
                <button onClick={handleSubmitRemoveExercises} className="submit-remove-button-choice"> Remove all exercises </button>                
                <button onClick={handleSubmitSelection} className="submit-selection-button-choice">Add exercises</button>

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
                    <div className="toggle-container-exercises-choice">
                        <label className="toggle-label-exercises-choice">Only personalized: </label>
                        <label className="toggle-switch-exercises-choice">
                            <input
                                type="checkbox"
                                checked={filters.personalized === 'true'}
                                onChange={handlePersonalizedToggle}
                            />
                            <span className="slider-exercises-choice"></span>
                        </label>
                    </div>
                </div>
                <div className="exercises-list-exercises-choice">
                    {exercises.map((exercise) => (
                        <div className="exercise-item-exercises-choice" key={exercise.id}>
                            <div className="exercise-photo-exercises-choice">
                                <img src={exercise.photo} alt={`${exercise.id} logo`} />
                            </div>
                            <div className="exercise-info-exercises-choice">
                                <div className="exercise-header-exercises-choice">
                                    <h2 className="exercise-name-exercises-choice">{exercise.id}</h2>
                                </div>
                                <div className="exercise-duration-personalized-exercises-choice">
                                    <div className="exercise-duration-exercises-choice">
                                        <i className="fas fa-clock exercise-duration-icon-exercises-choice"></i>
                                        <span><strong>Duration:</strong> {exercise.duration}</span>
                                    </div>
                                    <div className="exercise-personalized-exercises-choice">
                                        <i className="fas fa-user exercise-personalized-icon-exercises-choice"></i>
                                        <span>
                                            <strong>Personalized:</strong>{" "}
                                            <span className={exercise.personalized ? "yes-exercises-choice" : "no-exercises-choice"}>
                                                {exercise.personalized ? "Yes" : "No"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleSelectExercise(exercise)} 
                                    className={`select-exercise-button-choice ${selectedExercises.includes(exercise.id) ? 'selected' : ''}`}>
                                    {selectedExercises.includes(exercise.id) ? 'Deselect' : 'Select'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComponentExercisesChoice;
