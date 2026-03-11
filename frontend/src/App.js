import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/ComponentMainPage.jsx';
import Login from './components/ComponentLogin.jsx';
import Register from './components/ComponentRegister.jsx';
import SharedLayout from './components/ComponentSharedLayout'; 
import Home from './components/ComponentHome'; 
import Profile from './components/ComponentProfile'; 
import Clubs from './components/ComponentClubs'; 
import Exercises from './components/ComponentExercises'; 
import Exercise from './components/ComponentExercise'; 
import Teams from './components/ComponentTeams'; 
import Team from './components/ComponentTeam'; 
import Players from './components/ComponentPlayers'; 
import Player from './components/ComponentPlayer'; 
import RivalTeams from './components/ComponentRivalTeams'; 
import RivalTeam from './components/ComponentRivalTeam'; 
import ExercisesChoice from './components/ComponentExercisesChoice'; 
import Trainings from './components/ComponentTrainings'; 
import Training from './components/ComponentTraining'; 
import TrainingsLayout from './components/ComponentTrainingsLayout'; 
import TrainingLayout from './components/ComponentTrainingLayout'; 
import Matches from './components/ComponentMatches'; 
import Match from './components/ComponentMatch'; 
import MatchesLayout from './components/ComponentMatchesLayout'; 


const App = () => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="" element={<MainPage message={message} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<SharedLayout />}> 
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/clubs/" element={<Clubs />} />
                        <Route path="/matches/" element={<MatchesLayout />} />
                        <Route path="/trainings/" element={<TrainingsLayout />} />
                        <Route path="/trainings/:idTr" element={<TrainingLayout />} />
                        <Route path="/exercises/" element={<Exercises />} />
                        <Route path="/exercises/:id" element={<Exercise />} />
                        <Route path="/users/:id/teams/" element={<Teams />} />
                        <Route path="/users/:id/teams/:idT" element={<Team />} />
                        <Route path="/users/:id/teams/:idT/players/" element={<Players />} />
                        <Route path="/users/:id/teams/:idT/players/:idP" element={<Player />} />
                        <Route path="/users/:id/teams/:idT/rival_teams" element={<RivalTeams />} />
                        <Route path="/users/:id/teams/:idT/rival_teams/:idT2" element={<RivalTeam />} />
                        <Route path="/exercises_choice/" element={<ExercisesChoice />} />
                        <Route path="/users/:id/teams/:idT/trainings/" element={<Trainings />} />
                        <Route path="/users/:id/teams/:idT/trainings/:idTr" element={<Training />} />
                        <Route path="/users/:id/teams/:idT/matches/" element={<Matches />} />
                        <Route path="/users/:id/teams/:idT/matches/:idM" element={<Match />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;