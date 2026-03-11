import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getExercise } from '../api/Exercise/GetExercise';
import { getTraining } from '../api/Training/GetTraining';
import { updateTraining } from '../api/Training/UpdateTraining';
import '../CSS/CSSTraining.css';

const ComponentTrainingLayout = () => {
    const [exercises, setExercises] = useState([]);
    const [training, setTraining] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { idT, idTr } = useParams();
    const username = localStorage.getItem('username');
    const [modalTrainingOpen, setModalTrainingOpen] = useState(false);
    const [newTraining, setNewTraining] = useState({
        name: '',
        exercises: []
    });

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const fetchedTraining = await getTraining(username, idT, idTr);
                setTraining(fetchedTraining);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading training: ' + error.message);
            }
        };

        fetchTraining();
    }, [username, idT, idTr]);

    useEffect(() => {
        const fetchTrainingAndExercises = async () => {
            try {
                if (!training) return;  

                const exerciseIds = training.exercises;

                const exercisePromises = exerciseIds.map((id) => getExercise(id));
                const fetchedExercises = await Promise.all(exercisePromises);

                setExercises(fetchedExercises);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading training or exercises: ' + error.message);
            }
        };

        fetchTrainingAndExercises();
    }, [training, username, idT, idTr]);  

    useEffect(() => {
        const { modalState } = location.state || {};
        const selectedExercises = modalState?.exercises || [];        

        if (modalState) {
            setNewTraining(modalState); 
            setModalTrainingOpen(true); 
        }

        if (selectedExercises.length > 0) {
            setNewTraining(prevState => ({
                ...prevState,
                exercises: selectedExercises 
            }));
        }
    }, [location.state]);

    window.onpopstate = (event) => {
        if (event.state && event.state.exercises) {
            setNewTraining({
                ...newTraining,
                exercises: event.state.exercises
            });
        }
    };

    const handleUpdateTraining = async (updatedTraining) => {
        try {
            const response = await updateTraining(username, idT, idTr, updatedTraining);
            if (response.success) {
                alert('Training updated successfully');
                navigate(`/training/${idT}/${idTr}`); 
            } else {
                setError('Failed to update training');
            }
        } catch (error) {
            setError('Error updating training: ' + error.message);
        }
    };

    const handleOpenModalTraining = () => {
        if (training) {
            setNewTraining({
                name: training.name,
                exercises: training.exercises
            });
        }
        setModalTrainingOpen(true);
    };

    const handleCloseModalTraining = () => {
        setModalTrainingOpen(false);
    };

    const handleInputChangeTraining = (e) => {
        const { name, value } = e.target;
        setNewTraining({
            ...newTraining,
            [name]: value
        });
    };

    const handleOpenExercisesChoice = () => {
        navigate('/exercises_choice', {
            state: {
                selectedExercises: newTraining.exercises, 
                modalState: newTraining,  
                previousPath: window.location.pathname
            }
        });
    };

    const handleSelectExercises = (selectedExercises) => {
        setNewTraining({
            ...newTraining,
            exercises: selectedExercises
        });
    
        const exercisesToPush = selectedExercises.map(exercise => exercise.id);  
        const exercisesParam = exercisesToPush.join(','); 
        const newUrl = `/users/${username}/teams/${idT}?selectedExercises=true&exercises=${exercisesParam}`;
    
        navigate(newUrl);  
    };

    const handleSubmitTraining = async () => {
        if (newTraining.name.length > 30) {
            alert('Training name cannot exceed 30 characters.');
            return;
        }
    
        try {
            const response = await updateTraining(username, idT, idTr, newTraining);
    
            console.log('Training updated successfully:', response);
    
            setModalTrainingOpen(false);
    
            setNewTraining({
                name: '',
                exercises: [],
            });
    
            alert('Training updated successfully!');
            window.location.reload();    
        } catch (error) {
            setError('Error updating training: ' + error.message);
        }
    };

    if (error) {
        return (
            <div className="main-container-exercise">
                <div className="content-exercise">
                    <h1 className="app-title-exercise">Training</h1>
                    <div className="error-training">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (day, month, year) => {
        const date = new Date(`${year}-${month}-${day}`); 
        const dayFormatted = String(date.getDate()).padStart(2, '0');
        const monthFormatted = String(date.getMonth() + 1).padStart(2, '0'); 
        const yearFormatted = date.getFullYear();
        return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
    };

    if (!training) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading players...</p>
            </div>
        );
    }

    return (
        <div className="main-container-training">
            <div className="content-training">
            <div className="header-training">
                <div className="left-column-training">
                    <h1 className="app-title-training">{training.name}</h1>
                    <span className="training-duration-training">{` Duration: ${training.duration} minutes`} </span>
                </div>
                <div className="right-column-training">
                    <span className="training-date-training">{`${formatDate(training.day, training.month, training.year)} - ${training.hour}`}</span>
                    <span className="training-location-training">{`${training.city} - ${training.address}`}</span>
                    <div className="edit-training-button">
                        <button onClick={handleOpenModalTraining}>Edit Training Planning </button>
                    </div>
                </div>
            </div>
                <div className="training-list">
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className="training">
                            <div className="training-photo-training">
                                <img 
                                    src={process.env.PUBLIC_URL + '/' + exercise.photo} 
                                    alt={`${exercise.id} logo`} 
                                />
                            </div>
                            <div className="training-info-training">
                                <div className="training-info-id-training"> {exercise.id} </div>
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modalTrainingOpen && (
                <div className="modal-edit-training">
                    <div className="modal-edit-content-training">
                        <span className="close-edit-training" onClick={handleCloseModalTraining}>&times;</span>
                        <h2>Edit Training Planning</h2>
                        <form>
                            <input type="text" name="name" value={newTraining.name} onChange={handleInputChangeTraining} placeholder="New Name" />
                            <div className="exercises-list-edit-training">
                                {newTraining.exercises.length > 0 && (
                                    <ul>
                                        {newTraining.exercises.map((exercise, index) => (
                                            <li key={index}>{exercise}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button className="select-exercises-button" type="button" onClick={handleOpenExercisesChoice}>Select Exercises</button>
                        </form>
                        <button className="confirm-edit-training-button" onClick={handleSubmitTraining}>Update Training</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ComponentTrainingLayout;
