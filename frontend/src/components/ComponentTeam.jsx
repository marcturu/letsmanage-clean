import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getTeam } from '../api/Team/GetTeam';
import { getClubs } from '../api/Club/GetClubs';
import { createPlayer } from '../api/Player/CreatePlayer';
import { createRivalTeam } from '../api/Team/CreateRivalTeam'; 
import { createTraining } from '../api/Training/CreateTraining';  
import { getRivalTeamsByUser } from '../api/Team/GetRivalTeamsByUser';  
import { getClub } from '../api/Club/GetClub';  
import { getPlayersByTeam } from '../api/Player/GetPlayersByTeam';  
import { getPlayerCharacteristics } from '../api/Player/GetPlayerCharacteristics';  
import { getPlayerStats } from '../api/Player/GetPlayerStats';  
import { createMatch } from '../api/Match/CreateMatch';  
import { getRivalTeam } from '../api/Team/GetRivalTeam'; 
import '../CSS/CSSTeam.css';

const ComponentTeam = () => {
    const [team, setTeam] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [club, setClub] = useState(null);
    const [rivalTeams, setRivalTeams] = useState(null);
    const [rivalTeam, setRivalTeam] = useState(null);
    const [players, setPlayers] = useState(null);
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        surname: '',
        surname2: '',
        height: '',
        weight: '',
        phone: '',
        mail: '',
        DNI: '',
        birthdate: '',
        nationality: '',
        number: ''
    });
    const [playerCharacteristics, setPlayerCharacteristics] = useState({});
    const [playerStats, setPlayerStats] = useState({});
    const [newRivalTeam, setNewRivalTeam] = useState({
        category: '',
        letter: '',
        club: '',
        league: ''
    });
    const [newTraining, setNewTraining] = useState({
        name: '',
        city: '',
        address: '',
        date: '',
        hour: '',
        pitchZone: '',
        exercises: []
    });
    const [newMatch, setNewMatch] = useState({
        name: '',
        myTeam: '',
        rivalTeam: '',
        imLocal: null, 
        city: '',
        address: '',
        date: '',
        hour: '',
        finished: '',
        formation: '',
        starters: [],
        calledups: [],
        myGoals: '',
        rivalGoals: '',
        myPossession: '',
        rivalPossession: '',
        myShots: '',
        rivalShots: '',
        myFouls: '',
        rivalFouls: '',
        myCorners: '',
        rivalCorners: ''
    }); 
    const [modalOpen, setModalOpen] = useState(false); 
    const [modalRivalOpen, setModalRivalOpen] = useState(false); 
    const [modalTrainingOpen, setModalTrainingOpen] = useState(false);
    const [modalMatchOpen, setModalMatchOpen] = useState(false);
    const { idT } = useParams();
    const username = localStorage.getItem('username');
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const fetchedTeam = await getTeam(username, idT);
                setTeam(fetchedTeam);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading team: ' + error.message);
            }
        };

        fetchTeam();
    }, [idT]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const fetchedClubs = await getClubs();
                setClubs(fetchedClubs);
            } catch (error) {
                setError('Error loading clubs: ' + error.message);
            }
        };

        fetchClubs();
    }, []);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const club = idT.split('_')[0];;
                const fetchedClub = await getClub(club);
                setClub(fetchedClub);
                console.log("club: ", club);
            } catch (error) {
                setError('Error loading club: ' + error.message);
            }
        };

        fetchClub();
    }, [idT]);

    useEffect(() => {
        if (club && club.city && club.location) {
            setNewTraining((prevState) => ({
                ...prevState,
                city: club.city,
                address: club.location
            }));
        }
    }, [club]);  

    useEffect(() => {
        const { modalState } = location.state || {};
        const selectedExercises = modalState?.exercises || [];        
        
        console.log("Modal state holaaa:", modalState); 
        console.log("Selected exercises holaaa:", selectedExercises); 
        console.log("Location state holaaa:", location.state);
    
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

    useEffect(() => {
        if (!location.state) {
            setModalTrainingOpen(false);
            setModalRivalOpen(false);
            setModalOpen(false);
        }
    }, [location.state]);

    useEffect(() => {
        if (!team) {
            console.log('Team is not available');
            return; 
        }
    
        const league = team.league || 'default-league';
    
        const fetchRivalTeams = async () => {
            try {
                const fetchedRivalTeams = await getRivalTeamsByUser(username, idT, league);
                setRivalTeams(fetchedRivalTeams);
            } catch (error) {
                setError('Error loading rival teams: ' + error.message);
            }
        };
    
        fetchRivalTeams();
    }, [username, idT, team]);  

    useEffect(() => {
        const fetchRivalteam = async () => {
            if (!newMatch.rivalTeam) {
                console.log('No valid rivalTeam found');
                return;
            }
    
            try {
                const fetchedRivalTeam = await getRivalTeam(username, idT, newMatch.rivalTeam);
                setRivalTeam(fetchedRivalTeam);
            } catch (error) {
                setError('Error loading rival team: ' + error.message);
            }
        };
    
        fetchRivalteam();
    }, [username, idT, newMatch.rivalTeam]);

    useEffect(() => {
        const fetchClub = async () => {
            console.log("rivalTeams: " + JSON.stringify(rivalTeam));
            const clubId = newMatch.imLocal && team ? team.club : (rivalTeam ? rivalTeam.club : null);
    
            if (!clubId) {
                console.log("clubId is not available, skipping fetch.");
                return; 
            }
    
            try {
                const fetchedClub = await getClub(clubId);
                setClub(fetchedClub);
    
                setNewMatch(prevState => ({
                    ...prevState,
                    city: fetchedClub.city,
                    address: fetchedClub.location
                }));
            } catch (error) {
                setError('Error loading club: ' + error.message);
            }
        };
    
        fetchClub();
    }, [team, newMatch.imLocal, rivalTeam]);  
    

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const fetchedPlayers = await getPlayersByTeam(username, idT);
                setPlayers(fetchedPlayers);
            } catch (error) {
                setError('Error loading players: ' + error.message);
            }
        };

        fetchPlayers();
    }, [username, idT]);

    useEffect(() => {
        const fetchPlayerCharacteristics = async () => {
            try {
                const characteristics = await Promise.all(
                    players.map(async (player) => {
                        const playerData = await getPlayerCharacteristics(username, idT, player.id);
                        return { id: player.id, characteristics: playerData };
                    })
                );
                
                const characteristicsMap = characteristics.reduce((acc, { id, characteristics }) => {
                    acc[id] = characteristics;
                    return acc;
                }, {});
    
                setPlayerCharacteristics(characteristicsMap);
            } catch (error) {
                console.error("Error fetching player characteristics:", error);
            }
        };
    
        if (players && players.length > 0) {
            fetchPlayerCharacteristics();
        }
    }, [players, username, idT]);

    useEffect(() => {
        const fetchPlayerStats = async () => {
            try {
                const stats = await Promise.all(
                    players.map(async (player) => {
                        const playerData = await getPlayerStats(username, idT, player.id);
                        return { id: player.id, stats: playerData };
                    })
                );
                
                const statsMap = stats.reduce((acc, { id, stats }) => {
                    acc[id] = stats;
                    return acc;
                }, {});
    
                setPlayerStats(statsMap);
            } catch (error) {
                console.error("Error fetching player stats:", error);
            }
        };
    
        if (players && players.length > 0) {
            fetchPlayerStats();
        }
    }, [players, username, idT]);    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlayer({
            ...newPlayer,
            [name]: value
        });
        console.log("Updated newPlayer state:", { ...newPlayer, [name]: value });

    };

    const validatePlayerData = () => {
        const requiredFields = ['name', 'surname', 'surname2', 'height', 'weight', 'phone', 'mail', 'DNI', 'birthdate', 'nationality', 'number'];
        for (let field of requiredFields) {
            if (!newPlayer[field]) {
                alert(`${field} is required!`);
                return false;
            }
        }
        return true;
    };
    
    const handleSubmit = async () => {
        const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1]+$/;

        if (!nameRegex.test(newPlayer.name)) {
            alert('Name must contain only letters.');
            return;
        }
        if (!nameRegex.test(newPlayer.surname)) {
            alert('Surname must contain only letters.');
            return;
        }
        if (!nameRegex.test(newPlayer.surname2)) {
            alert('Second surname must contain only letters.');
            return;
        }
    
        const dniRegex = /^\d{8}[A-Za-z]$/;
        if (!dniRegex.test(newPlayer.DNI)) {
            if (window.confirm("Does the player not have a DNI?")) {
                newPlayer.DNI = "N/A"; 
            } else {
                alert('DNI must contain 8 digits followed by a letter.');
                return;
            }
        }
    
        const height = parseFloat(newPlayer.height);
        const weight = parseFloat(newPlayer.weight);
        if (isNaN(height) || isNaN(weight)) {
            alert('Height and weight must be valid numbers.');
            return;
        }
    
        if (!/^\d{9}$/.test(newPlayer.phone)) {
            alert('Phone number must be exactly 9 digits.');
            return;
        }
    
        const birthdateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!birthdateRegex.test(newPlayer.birthdate)) {
            alert('Birthdate must be in the format DD/MM/YYYY.');
            return;
        }
    
        console.log('newPlayer before appending to FormData', newPlayer);
    
        const formData = new FormData();
    
        console.log("Player data before sending:", newPlayer);
    
        // Agregar los datos del jugador
        formData.append("name", newPlayer.name);
        formData.append("surname", newPlayer.surname);
        formData.append("surname2", newPlayer.surname2);
        formData.append("height", parseInt(newPlayer.height, 10));
        formData.append("weight", parseInt(newPlayer.weight, 10));
        formData.append("phone", newPlayer.phone);
        formData.append("mail", newPlayer.mail || '');
        formData.append("DNI", newPlayer.DNI || '');
        formData.append("birthdate", newPlayer.birthdate);
        formData.append("nationality", newPlayer.nationality);
        formData.append("number", newPlayer.number ? parseInt(newPlayer.number, 10) : '');
    
        if (imageFile) {
            formData.append("photo", imageFile);
        }
    
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            await createPlayer(username, idT, formData);
            
            setModalOpen(false);
            setNewPlayer({
                name: '',
                surname: '',
                surname2: '',
                height: '',
                weight: '',
                phone: '',
                mail: '',
                DNI: '',
                birthdate: '',
                nationality: '',
                number: ''
            });
            alert('New player created successfully!');
        } catch (error) {
            setError('Error creating player: ' + error.message);
        }
    };

    const handleSquadClick = () => {
        navigate(`/users/${username}/teams/${idT}/players`);
    };

    const handleRivalTeamsClick = () => {
        navigate(`/users/${username}/teams/${idT}/rival_teams`, {
            state: { league: team.league}
          });
    };

    const handleMatchesClick = () => {
        navigate(`/users/${username}/teams/${idT}/matches`);
    };

    const handleTrainingsClick = () => {
        navigate(`/users/${username}/teams/${idT}/trainings`);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleInputChangeRival = (e) => {
        const { name, value } = e.target;
        setNewRivalTeam(prevState => ({ ...prevState, [name]: value }));
    };

    const handleOpenModalRivalTeam = () => {
        if (team) {
            setNewRivalTeam({
                category: team.category,
                letter: '',
                club: '',
                league: team.league
            });
        }
        setModalRivalOpen(true);
    };

    const handleCloseModalRivalTeam = () => {
        setModalRivalOpen(false);
    };

    const handleSubmitRivalTeam = async (e) => {
        e.preventDefault(); 

        const requiredFields = ['letter', 'club'];
        for (let field of requiredFields) {
            if (!newRivalTeam[field]) {
                alert(`${field} is required!`);
                return false;
            }
        }

        const teamData = { ...newRivalTeam, creator: username };


        try {
            await createRivalTeam(username, idT, teamData);
            
            setModalRivalOpen(false);
            setNewRivalTeam({
                category: team.category,
                letter: '',
                club: '',
                league: team.league
            });
            alert('New rival team created successfully!');
        } catch (error) {
            setError('Error creating rival team: ' + error.message);
        }
    };

    const handleOpenModalTraining = () => {
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

    window.onpopstate = (event) => {
        if (event.state && event.state.exercises) {
            setNewTraining({
                ...newTraining,
                exercises: event.state.exercises
            });
        }
    };

    
    const handleSubmitTraining = async () => {

        if (!newTraining.name || newTraining.name.trim() === '') {
            alert('Training name is required.');
            return;
        }

        if (newTraining.name.length > 20) {
            alert('Training name cannot exceed 20 characters.');
            return;
        }

        const validCities = [
            'Terrassa', 'Sabadell', 'Matadepera', 'Sant Cugat', 'Castellbisbal', 
            'Mira-sol', 'Rubí', 'Les Fonts', 'Ullastrell', 'Vacarisses'
        ];

        if (!newTraining.city || newTraining.city.trim() === '') {
            alert('Training city is required.');
            return;
        }
    
        if (!validCities.includes(newTraining.city)) {
            alert('City must be one of the following: ' + validCities.join(', '));
            return;
        }

        if (!newTraining.address || newTraining.address.trim() === '') {
            alert('Training address is required.');
            return;
        }

        if (!newTraining.date || newTraining.date.trim() === '') {
            alert('Training date is required.');
            return;
        }
    
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(newTraining.date)) {
            alert('Date must be in the format DD/MM/YYYY.');
            return;
        }

        if (!newTraining.hour || newTraining.hour.trim() === '') {
            alert('Training hour is required.');
            return;
        }
    
        const hourRegex = /^\d{2}:\d{2}$/;
        if (!hourRegex.test(newTraining.hour)) {
            alert('Hour must be in the format HH:MM.');
            return;
        }

        if (!newTraining.pitchZone || newTraining.pitchZone.trim() === '') {
            alert('Training pitch zone is required.');
            return;
        }

        try {
            const response = await createTraining(username, idT, newTraining);
    
            console.log('Training created successfully:', response);
    
            setModalTrainingOpen(false);
            setNewTraining({
                name: '',
                city: '',
                address: '',
                date: '',
                hour: '',
                pitchZone: '',
                exercises: [],
            });
            alert('New training created successfully!');
        } catch (error) {
            setError('Error creating training: ' + error.message);
        }
    };

    const handleOpenModalMatch = () => {
        console.log("team.id in openmodal: " + idT);
        if (team) {
            setNewMatch({
                name: '',
                myTeam: idT,
                rivalTeam: '',
                imLocal: null, 
                city: '',
                address: '',
                date: '',
                hour: '',
                finished: false,
                formation: '',
                starters: [],
                calledups: [],
                myGoals: 0,
                rivalGoals: 0,
                myPossession: 0,
                rivalPossession: 0,
                myShots: 0,
                rivalShots: 0,
                myFouls: 0,
                rivalFouls: 0,
                myCorners: 0,
                rivalCorners: 0
            });
        }
        setModalMatchOpen(true);
    };
    
    const handleCloseModalMatch = () => {
        setModalMatchOpen(false);
    };

    const handleInputChangeMatch = (e) => {
        console.log("team.id in changematch: " + idT);
    
        const { name, value } = e.target;
    
        if (name === "imLocal") {
            const isLocal = value === "true";
    
            if (isLocal && newMatch.rivalTeam) {
                const rival = rivalTeams.find(team => idT === newMatch.rivalTeam);
                if (rival) {
                    setNewMatch((prevMatch) => ({
                        ...prevMatch,
                        imLocal: isLocal,
                        city: rival.city || "",
                        address: rival.address || "",
                    }));
                } else {
                    setNewMatch((prevMatch) => ({
                        ...prevMatch,
                        imLocal: isLocal,
                        city: idT.city || "",
                        address: idT.address || "",
                    }));
                }
            } else if (!isLocal || !newMatch.rivalTeam) {
                setNewMatch((prevMatch) => ({
                    ...prevMatch,
                    imLocal: false, 
                    city: newMatch.rivalTeam ? rivalTeams.find(team => idT === newMatch.rivalTeam)?.city : "",
                    address: newMatch.rivalTeam ? rivalTeams.find(team => idT === newMatch.rivalTeam)?.address : "",
                }));
            }
        } else {
            setNewMatch((prevMatch) => ({
                ...prevMatch,
                [name]: value,
            }));
        }
    };
    

    const handleSelectPlayersCalledups = (selectedPlayersCalledups) => {
        setNewMatch({
            ...newMatch,
            calledups: selectedPlayersCalledups
        });
    };

    const handleSelectPlayersStarters = (selectedPlayersStarters) => {
        setNewMatch({
            ...newMatch,
            starters: selectedPlayersStarters
        });
    };


    const handleSubmitMatch = async (e) => {
        e.preventDefault(); 

        if (!newMatch.name || newMatch.name.trim() === '') {
            alert('Match name is required.');
            return;
        }

        if (!newMatch.rivalTeam || newMatch.rivalTeam.trim() === '') {
            alert('Rival team is required.');
            return;
        }

        if (newMatch.imLocal === "") {
            alert('Match condition (Home/Away) is required.');
            return;
        }

        if (newMatch.formation === "") {
            alert('Match formation is required.');
            return;
        }

        if (!newMatch.date || newMatch.date.trim() === '') {
            alert('Match date is required.');
            return;
        }
    
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(newMatch.date)) {
            alert('Date must be in the format DD/MM/YYYY.');
            return;
        }

        if (!newMatch.hour || newMatch.hour.trim() === '') {
            alert('Match hour is required.');
            return;
        }
    
        const hourRegex = /^\d{2}:\d{2}$/;
        if (!hourRegex.test(newMatch.hour)) {
            alert('Hour must be in the format HH:MM.');
            return;
        }
    
        const minPlayersCalledups = (team.category === "Prebenjamí" || team.category === "Benjamí" || team.category === "Aleví") ? 7 : 11;
        const maxPlayersCalledups = (team.category === "Prebenjamí" || team.category === "Benjamí" || team.category === "Aleví") ? 16 : 22;
    
        if (newMatch.calledups.length < minPlayersCalledups || newMatch.calledups.length > maxPlayersCalledups) {
            alert(`Select from ${minPlayersCalledups} to ${maxPlayersCalledups} calledups.`);
            return;
        }

        const playersStarters = (team.category === "Prebenjamí" || team.category === "Benjamí" || team.category === "Aleví") ? 7 : 11;
    
        if (newMatch.starters.length !== playersStarters) {
            alert(`Select ${playersStarters} starters.`);
            return;
        }

        if (window.confirm(`Are you sure you want to create a match with these values? 
            - Check or update ${rivalTeam.club} stats if needed.
            - Check or update your players' characteristics if needed.
            - Verify there are no temporal overlaps in your match creation.
            - Ensure the match Name does not contain trailing spaces.
            
            Do you want to continue?`)) {            
                const matchToSubmit = {
                ...newMatch,
                name: `${idT}_${newMatch.name}`
            };
    
            console.log("Match to submit", matchToSubmit);
        
            try {
                const response = await createMatch(username, idT, matchToSubmit);
        
                console.log('Match created successfully:', response);
                setModalMatchOpen(false);
                setNewMatch({
                    name: '',
                    myTeam: idT,
                    rivalTeam: '',
                    imLocal: null, 
                    city: '',
                    address: '',
                    date: '',
                    hour: '',
                    finished: '',
                    formation: '',
                    starters: [],
                    calledups: [],
                    myGoals: 0,
                    rivalGoals: 0,
                    myPossession: 0,
                    rivalPossession: 0,
                    myShots: 0,
                    rivalShots: 0,
                    myFouls: 0,
                    rivalFouls: 0,
                    myCorners: 0,
                    rivalCorners: 0
                });
                alert('New match created successfully!');
            } catch (error) {
                setError('Error creating match: ' + error.message);
            }
        } else {
            console.log('Match creation canceled.');
        }
    };

    if (error) {
        return (
            <div className="main-container-team">
                <div className="content-team">
                    <h1 className="app-title-team">Team</h1>
                    <div className="error-team">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading team...</p>
            </div>
        );
    }

    return (
        <div className="main-container-team">
            <div className="content-team">
                {/* Header */}
                <div className="header-team">
                    <div className="team-header-content">
                        <div className="team-photo">
                            <img src={team.teamPhoto} alt={`${idT} logo`} />
                        </div>
                        <div className="team-id">
                            <div className="team-id1">
                                <h1>{team.club}</h1>
                            </div>
                            <div className="team-id2">
                                <h1>{team.category} {team.letter}</h1>
                            </div>
                        </div>
                        <div className="team-buttons">
                            <button onClick={handleOpenModal}>New Player</button>
                            <button onClick={handleOpenModalRivalTeam}>New Rival Team</button> 
                            <button onClick={handleOpenModalMatch}>New Match</button> 
                            <button onClick={handleOpenModalTraining}>New Training Planning</button>
                        </div>
                    </div>
                </div>

                <div className="team-info">
                    <div className="team-stats">
                    <div className="team-stats-row">
                            <div className="team-stats-item">
                                <h2>League:</h2>
                                <p>{team.league}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Points:</h2>
                                <p>{team.points}</p>
                            </div>
                        </div>
                        <div className="team-stats-row">
                            <div className="team-stats-item">
                                <h2>Games Won:</h2>
                                <p>{team.gamesWon}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Games Lost:</h2>
                                <p>{team.gamesLost}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Winning Streak:</h2>
                                <p>{team.winningStreak}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Losing Streak:</h2>
                                <p>{team.losingStreak}</p>
                            </div>
                        </div>
                        <div className="team-stats-row">
                        <div className="team-stats-item">
                                <h2>Local Goals:</h2>
                                <p>{team.localGoals}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Away Goals:</h2>
                                <p>{team.awayGoals}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Local Goals Conceded:</h2>
                                <p>{team.localGoalsConceded}</p>
                            </div>
                            <div className="team-stats-item">
                                <h2>Away Goals Conceded:</h2>
                                <p>{team.awayGoalsConceded}</p>
                            </div>
                        </div>
                    </div>

                    <div className="team-actions">
                        <button onClick={handleSquadClick}>Squad</button>
                        <button onClick={handleRivalTeamsClick}>Rival Teams</button>
                        <button onClick={handleMatchesClick}>Matches</button>
                        <button onClick={handleTrainingsClick}>Training Plannings</button>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Add New Player</h2>
                        <form>
                            <input type="text" name="name" value={newPlayer.name} onChange={handleInputChange} placeholder="Name" />
                            <input type="text" name="surname" value={newPlayer.surname} onChange={handleInputChange} placeholder="Surname" />
                            <input type="text" name="surname2" value={newPlayer.surname2} onChange={handleInputChange} placeholder="Second Surname" />
                            <input type="number" name="height" value={newPlayer.height} onChange={handleInputChange} placeholder="Height (cm)" />
                            <input type="number" name="weight" value={newPlayer.weight} onChange={handleInputChange} placeholder="Weight (kg)" />
                            <input type="text" name="phone" value={newPlayer.phone} onChange={handleInputChange} placeholder="Phone" />
                            <input type="email" name="mail" value={newPlayer.mail} onChange={handleInputChange} placeholder="Mail" />
                            <input type="text" name="DNI" value={newPlayer.DNI} onChange={handleInputChange} placeholder="DNI (optional)" />
                            <input type="text" name="birthdate" value={newPlayer.birthdate} onChange={handleInputChange} placeholder="Birthdate (DD/MM/YYYY)" />
                            <input type="text" name="nationality" value={newPlayer.nationality} onChange={handleInputChange} placeholder="Nationality" />
                            <input type="number" name="number" value={newPlayer.number} onChange={handleInputChange} placeholder="Number (Make sure no other teammate has this number)" />
                            <input type="file" name="photo" onChange={handleImageChange} accept="image/*" />
                        </form>
                        <button onClick={handleSubmit} >Create player</button>
                    </div>
                </div>
            )}

            {modalRivalOpen && (
                <div className="modal-teams">
                    <div className="modal-content-teams">
                        <h2>Create Rival Team</h2>
                        <form onSubmit={handleSubmitRivalTeam}>
                        <div className="form-group-teams">
                            <label htmlFor="club">Club</label>
                            <select
                                id="club"
                                name="club"
                                value={newRivalTeam.club}
                                onChange={handleInputChangeRival}
                            >
                                <option value="">Select Club</option>
                                {clubs.length > 0 ? (
                                    clubs.map(club => (
                                        <option key={club.id} value={club.id}>
                                            {club.id} 
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No clubs available</option>
                                )}
                            </select>
                        </div>

                            <div className="form-group-teams">
                                <label htmlFor="letter">Letter</label>
                                <select
                                    id="letter"
                                    name="letter"
                                    value={newRivalTeam.letter}
                                    onChange={handleInputChangeRival}
                                >
                                    <option value="">Select Letter</option>
                                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
                                        <option key={letter} value={letter}>
                                            {letter}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group-teams">
                                <label htmlFor="category">Category</label>
                                <input type="text" name="category" value={newRivalTeam.category} onChange={handleInputChangeRival} disabled />
                            </div>
                            <div className="form-group-teams">
                            <label htmlFor="league">League</label>
                                <input type="text" name="league" value={newRivalTeam.league} onChange={handleInputChangeRival} disabled />
                            </div>
                            <div className="form-buttons-teams">
                                <button type="submit" className="submit-button-modal-create-teams">Create Rival Team</button>
                                <button type="button" onClick={handleCloseModalRivalTeam} className="cancel-button-teams">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalTrainingOpen && (
                <div className="modal-training">
                    <div className="modal-content-training">
                        <span className="close-new-training" onClick={handleCloseModalTraining}>&times;</span>
                        <h2>New Training Planning</h2>
                        <form>
                            <input type="text" name="name" value={newTraining.name} onChange={handleInputChangeTraining} placeholder="Name" />
                            <input type="text" name="city" value={newTraining.city} onChange={handleInputChangeTraining} placeholder="City" />
                            <input type="text" name="address" value={newTraining.address} onChange={handleInputChangeTraining} placeholder="Address" />
                            <input type="text" name="date" value={newTraining.date} onChange={handleInputChangeTraining} placeholder="Date (DD/MM/YYYY)" />
                            <input type="text" name="hour" value={newTraining.hour} onChange={handleInputChangeTraining} placeholder="Hour (HH:MM)" />
                            <input type="number" name="pitchZone" value={newTraining.pitchZone} onChange={handleInputChangeTraining} placeholder="Pitch zone" />
                            <div className="exercises-list-new-training">
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
                        <button className="create-training-button" onClick={handleSubmitTraining}>Create Training</button>
                    </div>
                </div>
            )}

            {modalMatchOpen && (
                <div className="modal-match">
                    <div className="modal-content-match">
                        <h2>New Match</h2>
                        <form>
                            <div className="form-container">
                                <div className="form-left">
                                    <div className="form-select-match-creation">
                                        <select
                                            id="rivalTeam"
                                            name="rivalTeam"
                                            value={newMatch.rivalTeam}
                                            onChange={handleInputChangeMatch}
                                        >
                                            <option value="">Select Rival Team</option>
                                            {rivalTeams.length > 0 ? (
                                                rivalTeams.map((rivalTeam) => (
                                                    <option key={rivalTeam.id} value={rivalTeam.id}>
                                                        {`${rivalTeam.club} ${rivalTeam.category} ${rivalTeam.letter}`}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No Rival Teams available</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-select-match-creation">
                                        <select
                                            id="imLocal"
                                            name="imLocal"
                                            value={newMatch.imLocal === null ? "" : newMatch.imLocal ? "true" : "false"}
                                            onChange={handleInputChangeMatch}
                                        >
                                            <option value="">Select Match Condition</option>
                                            <option value="true">Home</option>
                                            <option value="false">Away</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-center">
                                    <div className="form-fill-match-creation">
                                        <input
                                            type="text"
                                            name="name"
                                            value={newMatch.name}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Name"
                                        />
                                    </div>

                                    <div className="form-select-match-creation">
                                        <select
                                            id="formation"
                                            name="formation"
                                            value={newMatch.formation}
                                            onChange={handleInputChangeMatch}
                                        >
                                            <option value="">Select Formation</option>
                                            {(
                                                team.category === "Prebenjamí" || 
                                                team.category === "Benjamí" || 
                                                team.category === "Aleví"
                                                ? ["231", "321", "312", "222", "213"]
                                                : ["433", "4231", "442", "343"]
                                            ).map((formation) => (
                                                <option key={formation} value={formation}>
                                                    {formation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-right">
                                    <div className="form-fill-match-creation">
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={newMatch.city}
                                            onChange={handleInputChangeMatch}
                                            placeholder="City"
                                        />
                                    </div>

                                    <div className="form-fill-match-creation">
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={newMatch.address}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Address"
                                        />
                                    </div>

                                    <div className="form-fill-match-creation">
                                        <input
                                            type="text"
                                            name="date"
                                            value={newMatch.date}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Date (DD/MM/YYYY)"
                                        />
                                    </div>

                                    <div className="form-fill-match-creation">
                                        <input
                                            type="text"
                                            name="hour"
                                            value={newMatch.hour}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Hour (HH:MM)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="calledups">Calledups</label>
                            </div>

                            <div className="players-list-match-container">
                                <div className="players-list-match">
                                    {players && players.length > 0 ? (
                                        players.map((player) => (
                                            <div key={player.id} className="player-item-match">
                                                <img
                                                    src={player.photo}
                                                    alt={`${player.name} ${player.surname}`}
                                                    className="player-photo-match"
                                                />
                                                <label htmlFor={`player-${player.id}`}>
                                                    <div style={{ textAlign: 'left' }}>{`(${player.number}) ${player.name} ${player.surname} ${player.surname2} ${playerCharacteristics[player.id]?.position1 || ''}`}</div>
                                                    <div style={{ textAlign: 'left', marginTop: '0.25vw', fontWeight: 'lighter' }}>{`Technical Level: ${playerCharacteristics[player.id]?.avgTechnicalLevel || ''}`}</div>
                                                    <div style={{ textAlign: 'left', fontWeight: 'lighter' }}>{`Tactical Level: ${playerCharacteristics[player.id]?.avgTacticalLevel || ''}`}</div>
                                                    <div style={{ textAlign: 'left', fontWeight: 'lighter' }}>{`Fatigue: ${playerCharacteristics[player.id]?.avgFatigue || ''}`}</div>

                                                    <div style={{ textAlign: 'left', marginTop: '0.25vw', fontWeight: 'lighter' }}>{`Goals: ${playerStats[player.id]?.goals || ''}`}</div>
                                                    <div style={{ textAlign: 'left', fontWeight: 'lighter' }}>{`Assists: ${playerStats[player.id]?.assists || ''}`}</div>
                                                    <div style={{ textAlign: 'left', fontWeight: 'lighter' }}>{`Time played: ${playerStats[player.id]?.timePlayed || ''} minutes`}</div>
                                                </label>
                                                <input
                                                    type="checkbox" className="large-checkbox"
                                                    id={`player-${player.id}`}
                                                    value={player.id}
                                                    checked={newMatch.calledups.includes(player.id)}
                                                    onChange={(e) => {
                                                        const selectedPlayersCalledups = e.target.checked
                                                            ? [...newMatch.calledups, player.id]
                                                            : newMatch.calledups.filter((id) => id !== player.id);
                                                        handleSelectPlayersCalledups(selectedPlayersCalledups);
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No players available</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="starters">Starters</label>
                            </div>

                            <div className="players-list-match-container">
                                <div className="players-list-match">
                                    {newMatch.calledups.length > 0 ? (
                                        newMatch.calledups.map((id) => {
                                            const player = players.find((p) => p.id === id); 
                                            return (
                                                player && (
                                                    <div key={player.id} className="player-item-match2">
                                                        <img
                                                            src={player.photo}
                                                            alt={`${player.name} ${player.surname}`}
                                                            className="player-photo-match"
                                                        />
                                                        <label htmlFor={`starter-${player.id}`}>
                                                        <div style={{ textAlign: 'left' }}>{`(${player.number}) ${player.name} ${player.surname} ${player.surname2} ${playerCharacteristics[player.id].position1}`}</div>                                                        </label>
                                                        <input
                                                            type="checkbox" className="large-checkbox"
                                                            id={`starter-${player.id}`}
                                                            value={player.id}
                                                            checked={newMatch.starters.includes(player.id)}
                                                            onChange={(e) => {
                                                                const selectedPlayersStarters = e.target.checked
                                                                    ? [...newMatch.starters, player.id]
                                                                    : newMatch.starters.filter((id) => id !== player.id);
                                                                handleSelectPlayersStarters(selectedPlayersStarters);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            );
                                        })
                                    ) : (
                                        <p>No calledups selected</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-buttons-teams">
                                <button type="submit" onClick={handleSubmitMatch} className="submit-button-modal-create-teams">Create Match</button>
                                <button type="button" onClick={handleCloseModalMatch} className="cancel-button-match-creation">Cancel</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ComponentTeam;
