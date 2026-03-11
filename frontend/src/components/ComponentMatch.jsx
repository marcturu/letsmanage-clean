import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getMatch } from '../api/Match/GetMatch';
import { updateMatch } from '../api/Match/UpdateMatch';
import { getAllByMatch } from '../api/GetAllByMatch';
import { getTeam } from '../api/Team/GetTeam';
import { getRivalTeam } from '../api/Team/GetRivalTeam';
import { getFinishedMatches } from '../api/Match/GetFinishedMatches';
import { getPlayer } from '../api/Player/GetPlayer';
import '../CSS/CSSMatch.css';

const ComponentMatch = () => {
    const [match, setMatch] = useState(null); 
    const [editedMatch, setEditedMatch] = useState({});
    const [playerMatchStats, setPlayerMatchStats] = useState([]);
    const [team, setTeam] = useState(null);
    const [rivalTeam, setRivalTeam] = useState(null);
    const [finishedMatches, setFinishedMatches] = useState(null);
    const [selectedTab, setSelectedTab] = useState('matchStats');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [insightsOpen, setInsightsOpen] = useState(false);
    const [rivalInsights, setRivalInsights] = useState('');
    const [insights, setInsights] = useState({
        insights1: [],
        insights2: [],
        insights3: []
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { idT, idM } = useParams();
    const username = localStorage.getItem('username');
    const [modalMatchOpen, setModalMatchOpen] = useState(false);
    const [isModalFormationOpen, setIsModalFormationOpen] = useState(false);
    const [formation, setFormation] = useState([]);  
    const [draggedPlayer, setDraggedPlayer] = useState(null);
    const [players, setPlayers] = useState([]);
    const [isEditingFormation, setIsEditingFormation] = useState(false);
    const [playersToShow, setPlayersToShow] = useState([]);


    useEffect(() => {
        const fetchMatch = async () => {
            try {
                console.log("username:", username);  // Verifica que el valor esté correcto
                console.log("idT:", idT);
                console.log("idM:", idM);
    
                const fetchedMatch = await getMatch(username, idT, idM);
                console.log("Fetched match data:", fetchedMatch);  // Verifica la respuesta de la API
    
                if (fetchedMatch) {
                    setMatch(fetchedMatch);  // Establecemos el match cuando se obtienen los datos
                    console.log("Set match:", fetchedMatch);  // Verifica que setMatch esté recibiendo el valor esperado
                    setLoading(false);  // Cambiamos el estado a 'false' una vez que los datos se cargan
                    window.scrollTo(0, 0);
                } else {
                    console.error("No se ha recibido match desde la API.");
                    setLoading(false);  // También cambiamos a 'false' si no hay datos
                }
            } catch (error) {
                setError('Error loading match: ' + error.message);
                console.error("Error al cargar el partido:", error);  // Agregar más detalle en el error
                setLoading(false);  // En caso de error, cambiamos a 'false' también
            }
        };
    
        fetchMatch();
    }, [username, idT, idM]);

    const createFormationArray = (formationString) => {
        // Convertir el string en un array de números, y luego crear un array de arrays basado en esos números
        return formationString.split('').map(num => Array(parseInt(num)).fill(null)); 
    };

    useEffect(() => {
        // Aquí validamos si match está disponible antes de hacer cualquier cosa con sus propiedades
        if (!match) {
            console.log("match aún no disponible");
            return;  // Si match no está disponible, terminamos el useEffect sin hacer nada
        }
    
        console.log("match:", match);  // Verifica que match esté disponible
    
        // Verificar y establecer formation solo si está disponible y es un string
        if (match.formation && typeof match.formation === 'string') {
            console.log("match.formation:", match.formation);  // Verifica la formación
    
            const formationString = match.formation;
            const formationArray = [];
    
            // Convertir el string "231" en un arreglo de arreglos
            formationString.split('').forEach((num) => {
                formationArray.push(Array(parseInt(num)).fill(null));  // Convertimos el número en una fila con `null`
            });
    
            const initialFormation = createFormationArray(match._formation);
            setFormation(initialFormation);        } else {
            console.warn("match.formation no está disponible o no es un string");
        }
    
        // Verificar y establecer starters solo si está disponible y es un array
        if (match._starters) {
            console.log("match._starters (raw):", match._starters);  // Verifica los datos crudos de starters
    
            if (Array.isArray(match._starters)) {
                console.log("match._starters (array):", match._starters);  // Verifica que sea un array
    
                // Crear un array de objetos con el nombre de cada jugador
                const playersWithNames = match._starters.map((playerName, index) => ({
                    id: index,  // Asignamos un id único o uno real si lo tenemos
                    name: playerName
                }));
    
                setPlayers(playersWithNames);  // Actualizar los jugadores solo si _starters es un arreglo válido
            } else {
                console.warn("match._starters no es un array válido.");
            }
        } else {
            console.warn("match._starters no está disponible");
        }
    }, [match]);  // Este useEffect solo se ejecuta cuando 'match' cambia
    
    
    

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await getTeam(username, idT);
                setTeam(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [username, idT]);

    useEffect(() => {
        if (match) {
            const fetchRivalTeam = async () => {
                try {
                    const data = await getRivalTeam(username, idT, match.rivalTeam);
                    setRivalTeam(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchRivalTeam();
        }
    }, [username, idT, match]);

    useEffect(() => {
        const fetchPlayerMatchStats = async () => {
            try {
                const fetchedPlayerMatchStats = await getAllByMatch(username, idT, idM);
                setPlayerMatchStats(fetchedPlayerMatchStats);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading playermatchstats: ' + error.message);
            }
        };

        fetchPlayerMatchStats();
    }, [username, idT, idM]);

    useEffect(() => {
        const fetchFinishedMatches = async () => {
            try {
                const fetchedFinishedMatches = await getFinishedMatches(username, idT);
                setFinishedMatches(fetchedFinishedMatches);
                window.scrollTo(0, 0);
            } catch (error) {
                setError('Error loading finished matches: ' + error.message);
            }
        };

        fetchFinishedMatches();
    }, [username, idT]);

    useEffect(() => {
        if (selectedTab === "playerStats" && playerMatchStats.length === 0) {
            const fetchPlayerMatchStats = async () => {
                try {
                    const fetchedPlayerMatchStats = await getAllByMatch(username, idT, idM);
                    setPlayerMatchStats(fetchedPlayerMatchStats);
                } catch (error) {
                    setError('Error loading player match stats: ' + error.message);
                }
            };
            fetchPlayerMatchStats();
        }
    }, [selectedTab, playerMatchStats.length, username, idT, idM]);
   

    const handleEditButtonClick = () => {
        console.log("Match en handleEditButtonClick:", match);
        setEditedMatch({
            myGoals: match.myGoals || '',
            myShots: match.myShots || '',
            myPossession: match.myPossession || '',
            myFouls: match.myFouls || '',
            myCorners: match.myCorners || '',
            rivalGoals: match.rivalGoals || '',
            rivalShots: match.rivalShots || '',
            rivalPossession: match.rivalPossession || '',
            rivalFouls: match.rivalFouls || '',
            rivalCorners: match.rivalCorners || ''
          });
        setModalMatchOpen(true);
    };

    const handleCloseModalMatch = () => {
        setModalMatchOpen(false);
    };

    const handleInputChangeMatch = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'myGoals' || name === 'myShots' || name === 'myPossession' || name === 'myCorners' || name === 'myFouls' ||
            name === 'rivalGoals' || name === 'rivalShots' || name === 'rivalPossession' || name === 'rivalCorners' || name === 'rivalFouls'
        ) {
            formattedValue = parseFloat(value);
            if (isNaN(formattedValue)) {
              formattedValue = '';
            }
          }

        setEditedMatch((prevData) => ({
            ...prevData,
            [name]: formattedValue,
          }));
    };
    
    const handlePlayerStatsChange = (e, index) => {
        const { name, value } = e.target;
        const updatedStats = [...playerMatchStats];
        updatedStats[index] = {
            ...updatedStats[index],
            [name]: value === "" ? "" : parseInt(value, 10) 
        };
        setPlayerMatchStats(updatedStats);
    };

    const handleSubmitMatch = async () => {
        if (
            editedMatch.myGoals === undefined || editedMatch.myGoals === null || editedMatch.myGoals === "" ||
            editedMatch.myShots === undefined || editedMatch.myShots === null || editedMatch.myShots === "" ||
            editedMatch.rivalGoals === undefined || editedMatch.rivalGoals === null || editedMatch.rivalGoals === "" ||
            editedMatch.rivalShots === undefined || editedMatch.rivalShots === null || editedMatch.rivalShots === "" ||
            editedMatch.myPossession === undefined || editedMatch.myPossession === null || editedMatch.myPossession === "" ||
            editedMatch.rivalPossession === undefined || editedMatch.rivalPossession === null || editedMatch.rivalPossession === "" ||
            editedMatch.myFouls === undefined || editedMatch.myFouls === null || editedMatch.myFouls === "" ||
            editedMatch.rivalFouls === undefined || editedMatch.rivalFouls === null || editedMatch.rivalFouls === "" ||
            editedMatch.myCorners === undefined || editedMatch.myCorners === null || editedMatch.myCorners === "" ||
            editedMatch.rivalCorners === undefined || editedMatch.rivalCorners === null || editedMatch.rivalCorners === ""
          ) {
              alert('All goal fields must be filled out!');
              return;
          }
    
        if (editedMatch.myPossession + editedMatch.rivalPossession !== 100) {
            alert('The sum of my possession and rival possession must be 100.');
            return;
        }
    
        for (const player of playerMatchStats) {
            if (player.shotsOnTarget > player.shots) {
                alert('Shots on target cannot be greater than total shots.');
                return;
            }
            if (player.yellowCards > 2) {
                alert('A player can have a maximum of 2 yellow cards.');
                return;
            }
            if (player.yellowCards === 2 && player.redCards > 1) {
                alert('If a player has 2 yellow cards, they can have a maximum of 1 red card.');
                return;
            }
            if (player.redCards > 1) {
                alert('A player can have a maximum of 1 red card.');
                return;
            }
        }
        if (window.confirm('Are you sure you want to close the game? \nPlease verify that the values are correct.')) {
            setLoading(true);  
            try {
                const response = await updateMatch(username, idT, idM, editedMatch, playerMatchStats);
        
                setModalMatchOpen(false);
                setMatch({
                    ...match,
                    ...editedMatch,
                });
                setPlayerMatchStats([]); 
        
                alert('Match updated successfully!');
                window.location.reload();
            } catch (error) {
                setError('Error updating match: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };
    

    const handleOpenInsights = () => {
        const generatedInsights = generateInsights(match, team, rivalTeam); 
        setInsights(generatedInsights); 
        setRivalInsights(generatedInsights.insights1.join('\n')); 
        if (window.confirm(`Make sure you have updated your ${rivalTeam.club}'s stats to obtain the automatically generated insights.`)) {
            setInsightsOpen(true); 
        }
    };

    const handleCloseInsights = () => {
        setInsightsOpen(false);
    };

    const getMatchesStats = () => {
        if (!finishedMatches || finishedMatches.length === 0) {
            return null;  
        }
    
        let totalMyGoals = 0, totalRivalGoals = 0;
        let totalMyPossession = 0, totalRivalPossession = 0;
        let totalMyShots = 0, totalRivalShots = 0;
        let totalMyFouls = 0, totalRivalFouls = 0;
        let totalMyCorners = 0, totalRivalCorners = 0;
    
        finishedMatches.forEach((match) => {
            totalMyGoals += match.myGoals;
            totalRivalGoals += match.rivalGoals;
            totalMyPossession += match.myPossession;
            totalRivalPossession += match.rivalPossession;
            totalMyShots += match.myShots;
            totalRivalShots += match.rivalShots;
            totalMyFouls += match.myFouls;
            totalRivalFouls += match.rivalFouls;
            totalMyCorners += match.myCorners;
            totalRivalCorners += match.rivalCorners;
        });
    
        const matchCount = finishedMatches.length;
    
        return {
            avgMyGoals: totalMyGoals / matchCount,
            avgRivalGoals: totalRivalGoals / matchCount,
            avgMyPossession: totalMyPossession / matchCount,
            avgRivalPossession: totalRivalPossession / matchCount,
            avgMyShots: totalMyShots / matchCount,
            avgRivalShots: totalRivalShots / matchCount,
            avgMyFouls: totalMyFouls / matchCount,
            avgRivalFouls: totalRivalFouls / matchCount,
            avgMyCorners: totalMyCorners / matchCount,
            avgRivalCorners: totalRivalCorners / matchCount,
        };
    };
    

    const generateInsights = (match, team, rivalTeam) => {
        const insights = { 
            insights1: [],
            insights2: [],
            insights3: []
        };        
        const matchesStats = getMatchesStats();
    
        if (!matchesStats) {
            insights.insights3.push("No matches played yet. No relevant stats to compare.");
            return insights;
        }
    
        // --- Insights 1 ---
        // Points Comparison
        /*if (team.points === rivalTeam.points) {
            insights.insights1.push("Both teams have the same number of points. It's all to play for in the upcoming matches.");
        } else if (team.points > rivalTeam.points) {
            insights.insights1.push("You have more points than your rival team. Keep up the good work and continue to build on your success.");
        } else {
            insights.insights1.push("Your rival team has more points than you. They are ahead, so focus on closing the gap and catching up.");
        }*/
    
        // Games Won Comparison
        if (team.gamesWon === rivalTeam.gamesWon) {
            insights.insights1.push("Both teams have won the same number of games. It could go either way in the next match.");
        } else if (team.gamesWon > rivalTeam.gamesWon) {
            insights.insights1.push("You have won more games than your rival team. Maintain your strong form and continue to perform well.");
        } else {
            insights.insights1.push("Your rival team has won more games than you. Be determined to improve your results and challenge them in the next matches.");
        }
    
        // Games Lost Comparison
        if (team.gamesLost === rivalTeam.gamesLost) {
            insights.insights1.push("Both teams have the same number of losses. It's crucial to work on minimizing these losses moving forward.");
        } else if (team.gamesLost > rivalTeam.gamesLost) {
            insights.insights1.push("You have lost more games than your rival team. Stay focused and work on reducing these losses to improve your position.");
        } else {
            insights.insights1.push("Your rival team has lost more games than you. Take advantage of their weaknesses and look to continue your good form.");
        }
    
        // Winning Streak Comparison
        if (team.winningStreak === rivalTeam.winningStreak) {
            insights.insights1.push("Both teams have the same winning streak length. It's up to the next matches to break the deadlock.");
        } else if (team.winningStreak > rivalTeam.winningStreak) {
            insights.insights1.push("You are currently on a longer winning streak than your rival team. Keep the momentum going!");
        } else {
            insights.insights1.push("Your rival team is on a stronger winning streak than you. Be aware of their form and aim to break their streak.");
        }
    
        // Losing Streak Comparison
        if (team.losingStreak === rivalTeam.losingStreak) {
            insights.insights1.push("Both teams are currently on the same losing streak. Breaking the streak could be crucial for both teams.");
        } else if (team.losingStreak > rivalTeam.losingStreak) {
            insights.insights1.push("You are on a longer losing streak than your rival team. Work hard to turn this around and get back to winning ways.");
        } else {
            insights.insights1.push("Your rival team is on a longer losing streak than you. This could be a great opportunity to take advantage of their poor form.");
        }
    
        // Local Goals Comparison
        if (match.imLocal === true && team.localGoals > rivalTeam.awayGoals) {
            insights.insights1.push("You have scored more goals at home than your rival team away. Continue to use your home advantage to maximize your goal-scoring chances.");
        } else if (match.imLocal === true && team.localGoals < rivalTeam.awayGoals) {
            insights.insights1.push("Your rival team has scored more goals away than you at home. Consider strengthening your defense when playing home.");
        }
    
        // Away Goals Comparison
        if (match.imLocal === false && team.awayGoals > rivalTeam.localGoals) {
            insights.insights1.push("You have scored more goals away than your rival team home. Keep exploiting their weaknesses on the road.");
        } else if (match.imLocal === false && team.awayGoals < rivalTeam.localGoals) {
            insights.insights1.push("Your rival team has scored more goals home than you away. Pay attention to their home form and aim to limit their chances.");
        }
    
        // --- Insights 2 ---
        // Winning streak messages
        if (team.winningStreak > 4) {
            insights.insights2.push(`You are on a great winning streak with ${team.winningStreak} consecutive wins. Keep up the momentum and continue performing at this high level!`);
        }
            
        if (rivalTeam.winningStreak > 4) {
            insights.insights2.push(`Your rival team is currently on a strong winning streak with ${rivalTeam.winningStreak} consecutive wins. Be cautious, as they are in good form, but this also presents an opportunity to challenge their momentum.`);
        }
            
        // Losing streak messages
        if (team.losingStreak > 4) {
            insights.insights2.push(`You are currently on a losing streak with ${team.losingStreak} consecutive losses. Stay focused and work on regaining your confidence and form.`);
        }
            
        if (rivalTeam.losingStreak > 4) {
            insights.insights2.push(`Your rival team is on a losing streak with ${rivalTeam.losingStreak} consecutive losses. This could be an opportunity to take advantage of their dip in form, but don't underestimate them.`);
        }
            
        // Games won
        if ((team.gamesWon - rivalTeam.gamesWon) >= rivalTeam.gamesWon) {
            insights.insights2.push(`You have a clear advantage over your rivals in terms of wins. You have ${team.gamesWon} wins, while your rival has ${rivalTeam.gamesWon}. Keep up the great work and maintain your momentum!`);
        }
            
        if ((rivalTeam.gamesWon - team.gamesWon) >= team.gamesWon) {
            insights.insights2.push(`Your rival team has a clear advantage over you in terms of wins. They have ${rivalTeam.gamesWon} wins, while you have ${team.gamesWon}. They are performing well, but you still have the opportunity to close the gap.`);
        } 
    
        // Local goals messages
        if (match.imLocal === true && team.localGoals > team.awayGoals && rivalTeam.awayGoalsConceded > rivalTeam.localGoalsConceded) {
            insights.insights2.push("Take advantage of playing at home and your strong goal-scoring record there. The opponent concedes many goals away, so don't hesitate to press and attack to score.");
        }
    
        // Away goals messages
        if (match.imLocal === false && team.awayGoals > team.localGoals && rivalTeam.localGoalsConceded > rivalTeam.awayGoalsConceded) {
            insights.insights2.push("Take advantage of playing away and your strong goal-scoring record there. The opponent concedes many goals at home, so don't hesitate to press and attack to score.");
        }
    
        // --- Insights 3 ---
        // AvgGoals messages
        if (matchesStats.avgMyGoals > 2) {
            insights.insights3.push(`You tend to score ${matchesStats.avgMyGoals} goals on average, reflecting strong offensive play. Don't be afraid to be offensive.`);
        } else if (matchesStats.avgMyGoals < 2) {
            insights.insights3.push(`You tend to score ${matchesStats.avgMyGoals} goals on average, reflecting weak offensive play. You may want to be more offensive.`);
        }
    
        if (matchesStats.avgRivalGoals > 2) {
            insights.insights3.push(`Your rivals tend to score ${matchesStats.avgRivalGoals} goals on average, reflecting weak defensive play. Consider reinforcing your defensive strategy to avoid conceding too many goals.`);
        } else if (matchesStats.avgRivalGoals < 3) {
            insights.insights3.push(`Your rivals tend to score ${matchesStats.avgRivalGoals} goals on average, reflecting strong deffensive play. Keep up the good work!.`);
        }
    
        // AvgPossession messages
        if (matchesStats.avgMyPossession - matchesStats.avgRivalPossession > 19) {
            insights.insights3.push("You tend to control the game with your high possession, so dictate the pace of the match.");
        }
    
        if (matchesStats.avgMyPossession - matchesStats.avgRivalPossession > 29) {
            insights.insights3.push("You tend to highly control the game with your high possession, so dictate the pace of the match.");
        }
    
        if (matchesStats.avgRivalPossession - matchesStats.avgMyPossession > 19) {
            insights.insights3.push("The rivals tend to control the game with their possession. To counter this, focus on pressing high and disrupting their build-up play to regain control.");
        }
    
        if (matchesStats.avgRivalPossession - matchesStats.avgMyPossession > 29) {
            insights.insights3.push("The rivals tend to control the game with their strong possession. To counter this, focus on pressing high and disrupting their build-up play to regain control.");
        }
    
        // AvgShots messages
        if (matchesStats.avgMyShots > 10) {
            insights.insights3.push(`You tend to shoot ${matchesStats.avgMyShots} times on average. Keep up the good work and materialize these goal chances.`);
        }
    
        if (matchesStats.avgMyShots < 7) {
            insights.insights3.push(`You tend to shoot ${matchesStats.avgMyShots} times on average. You might want to increase your offensive play to create more chances.`);
        }
    
        if (matchesStats.avgRivalShots > 10) {
            insights.insights3.push(`Your rivals tend to shoot ${matchesStats.avgRivalShots} times on average. Don't let your rivals have that much goal chances.`);
        }
    
        if (matchesStats.avgRivalShots < 7) {
            insights.insights3.push(`Your rivals tend to shoot ${matchesStats.avgRivalShots} times on average. Keep up the good defensive work!`);
        }
    
        // AvgFouls messages
        if ((matchesStats.avgMyFouls - matchesStats.avgRivalFouls) > matchesStats.avgRivalFouls) {
            insights.insights3.push(`You commit more than twice as many fouls as your rivals. Be cautious, as this could lead to yellow or red cards that may penalize your team.`);
        }
    
        if ((matchesStats.avgRivalFouls - matchesStats.avgMyFouls) > matchesStats.avgMyFouls) {
            insights.insights3.push(`Your rivals commit more twice as many fouls as you. Sometimes, tactical fouls can be useful to disrupt their play, but be careful not to overdo it and risk unnecessary cards.`);
        }
    
        // AvgCorners messages
        if (matchesStats.avgMyCorners > 5) {
            insights.insights3.push(`You tend to take ${matchesStats.avgMyCorners} corners on average. Take into consideration this aspect and make sure to capitalize on these situations.`);
        }
    
        if (matchesStats.avgRivalCorners > 5) {
            insights.insights3.push(`Your rivals tend to take ${matchesStats.avgRivalCorners} corners on average. Take into consideration this aspect, as they may be creating more set-piece opportunities that could lead to goal-scoring chances.`);
        }
    
        return insights;
    };

    const handleOpenFormationModal = () => {
        setIsEditingFormation(true);
        setIsModalFormationOpen(true);
    };
    
    const handleCloseFormationModal = () => {
        setIsEditingFormation(false);
        setIsModalFormationOpen(false);
    };

    const handleDragStart = (e, player) => {
        // Guardamos el jugador que se está arrastrando
        setDraggedPlayer(player);
    };
    
    const handleDrop = (e, position, rowIndex, positionIndex) => {
        e.preventDefault();
    
        if (!draggedPlayer || (position && position.id)) return;  // Si la posición ya tiene un jugador, no hacemos nada
    
        const newFormation = [...formation];
    
        // Verificar si la fila existe y tiene suficientes posiciones
        if (!newFormation[rowIndex]) {
            newFormation[rowIndex] = []; // Inicializamos la fila si no existe
        }
    
        if (newFormation[rowIndex].length <= positionIndex) {
            newFormation[rowIndex].length = positionIndex + 1; // Aseguramos que el array tenga la longitud adecuada
        }
    
        // Asignar el jugador a la posición
        newFormation[rowIndex][positionIndex] = draggedPlayer;
    
        console.log('Nueva formación:', newFormation); // Verifica los cambios
    
        if (JSON.stringify(newFormation) !== JSON.stringify(formation)) {
            setFormation(newFormation);
            setDraggedPlayer(null);  // Limpiar el jugador arrastrado
        }
    };

const fetchPlayerDetails = async (player, username, idT) => {
    console.log("Fetching player details for:", player);  // Asegúrate de que se llama a la función correctamente

    try {
        const data = await getPlayer(username, idT, player.name);
        console.log("Datos del jugador:", data);  // Verifica los datos obtenidos

        setPlayersToShow((prevPlayers) => {
            const updatedPlayers = [...prevPlayers];
            const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);

            if (playerIndex !== -1) {
                updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], ...data };
            } else {
                updatedPlayers.push({ ...player, ...data });
            }

            return updatedPlayers;
        });
    } catch (error) {
        console.error("Error fetching player details:", error);
    }
};


    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading match...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-container-match">
                <div className="content-match">
                    <h1 className="app-title-match">Match</h1>
                    <div className="error-match">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading match...</p>
            </div>
        );
    }

    return (
        <div className="main-container-match">
            <div className="content-match">
                <div className="header-match">
                    <div className="column-match">
                    <h1 className="app-title-match"> {match.name ? match.name.split('_').pop() : ''} </h1>
                        <span className="match-date"> {`Date: `} <strong>{match.date}</strong> {` - `} <strong>{match.hour}</strong> </span>
                        <span className="match-location"> {`Location: `} <strong>{match.city}</strong> {` - `} <strong>{match.address}</strong> </span>
                    </div>
                    <div className="team-buttons-container">

                        <div className="team-match-info">
                            {match.imLocal ? (
                                <div className="team-match-details">
                                    {team && <img src={team.teamPhoto} alt="Team" className="local-photo-match" />}
                                    
                                    <span className="match-score">{`${match.myGoals} - ${match.rivalGoals}`}</span>

                                    {rivalTeam && (
                                        <div className="rival-photo-container">
                                            <img src={rivalTeam.teamPhoto} alt="Rival Team" className="away-photo-match" />
                                            <div className="insight-overlay-away" onClick={handleOpenInsights}>
                                                <i className="fas fa-info-circle"></i> {/* Icono de información */}
                                                <span className="insight-text">Rival Insights</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="team-match-details">
                                    {rivalTeam && (
                                        <div className="rival-photo-container">
                                            <img src={rivalTeam.teamPhoto} alt="Rival Team" className="local-photo-match" />
                                            <div className="insight-overlay-home" onClick={handleOpenInsights}>
                                                <i className="fas fa-info-circle"></i> {/* Icono de información */}
                                                <span className="insight-text">Rival Insights</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <span className="match-score">{`${match.rivalGoals} - ${match.myGoals}`}</span>

                                    {team && (
                                        <div className="my-team-photo-container">
                                            <img src={team.teamPhoto} alt="Team" className="away-photo-match" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="button-container">
                            <div className="edit-match-button">
                                { match.finished === false ? ( <button onClick={handleEditButtonClick}>Update Match</button>
                            ) : ( <p className="finished-message"> Match Closed</p>)
                            }
                            </div>
                            <div className="match-buttons">
                            
                                <button onClick={() => setSelectedTab('matchStats')}>Match Stats</button>   
                                <button onClick={() => setSelectedTab('playerStats')}>Players Stats</button>
                                { match.finished === false ? ( <button onClick={handleOpenFormationModal}>Build your lineup</button>
                            ) : (null)
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="match-details">
                    {selectedTab === 'matchStats' && (
                        <div className="match-statistics">
                            <h2>Match Stats:</h2>
                            <div className="stats-container">
                                {match.imLocal ? (
                                    <div className="local-stats">
                                        <ul>
                                            <li>My Goals: {match.myGoals}</li>
                                            <li>My Shots: {match.myShots}</li>
                                            <li>My Corners: {match.myCorners}</li>
                                            <li>My Fouls: {match.myFouls}</li>
                                            <li>My Possession: {match.myPossession}</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="rival-stats">
                                        <ul>
                                            <li>Rival Goals: {match.rivalGoals}</li>
                                            <li>Rival Shots: {match.rivalShots}</li>
                                            <li>Rival Corners: {match.rivalCorners}</li>
                                            <li>Rival Fouls: {match.rivalFouls}</li>
                                            <li>Rival Possession: {match.rivalPossession}</li>
                                        </ul>
                                    </div>
                                )}
                                {!match.imLocal ? (
                                    <div className="local-stats">
                                        <ul>
                                            <li>My Goals: {match.myGoals}</li>
                                            <li>My Shots: {match.myShots}</li>
                                            <li>My Corners: {match.myCorners}</li>
                                            <li>My Fouls: {match.myFouls}</li>
                                            <li>My Possession: {match.myPossession}</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="rival-stats">
                                        <ul>
                                            <li>Rival Goals: {match.rivalGoals}</li>
                                            <li>Rival Shots: {match.rivalShots}</li>
                                            <li>Rival Corners: {match.rivalCorners}</li>
                                            <li>Rival Fouls: {match.rivalFouls}</li>
                                            <li>Rival Possession: {match.rivalPossession}</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedTab === 'playerStats' && (
                        <div className="player-statistics">
                            <h2>Players Stats:</h2>
                            <ul>
                                {playerMatchStats && playerMatchStats.map((stat, index) => (
                                    <li key={index}>
                                        <strong>{stat.player.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</strong>{' '} 
                                         - Minutes Played: {stat.timePlayed}, Goals: {stat.goals}, Assists: {stat.assists}, 
                                        Yellow Cards: {stat.yellowCards}, Red Cards: {stat.redCards}, 
                                        Shots: {stat.shots}, Shots on Target: {stat.shotsOnTarget} 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {isModalFormationOpen && (
                <div className="modal-overlay">
                    <div className="formation-modal">
                    <h2>Create your lineup</h2>
                        <div className="formation-field">
                            {formation.map((row, rowIndex) => (
                                <div key={rowIndex} className="formation-row">
                                    {row.map((position, positionIndex) => {
                                        const playerDetails = position ? playersToShow.find(p => p.id === position.id) : null;

                                        return (
                                            <div
                                                key={positionIndex}
                                                className="formation-slot"
                                                onDrop={(e) => handleDrop(e, position, rowIndex, positionIndex)}
                                                onDragOver={(e) => e.preventDefault()}
                                            >
                                                {playerDetails ? (
                                                    playerDetails._photo ? (
                                                            <img
                                                                src={playerDetails._photo}
                                                                alt={playerDetails._name}   
                                                                className="player-formation-photo"
                                                            />
                                                    ) : (
                                                        <div className="player-in-position">
                                                            <p>No photo available</p>  
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="empty-slot">Empty</div>  
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="formation-players">
                            {players.map((player) => {
                                const playerDetails = playersToShow.find(p => p.id === player.id);
                                return (
                                    <div
                                        key={player.id}
                                        className="formation-player"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, player)} 
                                        onClick={() => fetchPlayerDetails(player, username, idT)} 
                                    >
                                        {playerDetails && playerDetails._photo ? (
                                            <img
                                                src={playerDetails._photo} 
                                                alt={player.name}
                                                className="player-formation-photo"
                                            />
                                        ) : (
                                            <p>Click to see starter</p> 
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button className="close-formation-modal" onClick={handleCloseFormationModal}>Close</button>
                    </div>
                </div>
            )}


            {modalMatchOpen && (
                <div className="modal-edit-match">
                    <div className="modal-edit-content-match">
                        <span className="close-edit-match" onClick={handleCloseModalMatch}>&times;</span>
                        <h2>Edit Match</h2>

                        {/* Pestañas */}
                        <div className="tabs">
                        <button
                            className={`tab-button ${selectedTab === "matchStats" ? "active" : ""}`}
                            onClick={() => setSelectedTab("matchStats")}
                        >
                            Match Info
                        </button>
                        <button
                            className={`tab-button ${selectedTab === "playerStats" ? "active" : ""}`}
                            onClick={() => setSelectedTab("playerStats")}
                        >
                            Player Stats
                        </button>
                        </div>

                        <form>
                        {selectedTab === "matchStats" && (
                        <div className="match-info-tab">
                            <div className="match-my-team-container">
                                <div className="team-info my-team">
                                    <div className="input-group">
                                        <h3>My Goals</h3>
                                        <input
                                            type="number"
                                            name="myGoals"
                                            value={editedMatch.myGoals !== null && editedMatch.myGoals !== undefined ? editedMatch.myGoals : 0}
                                            onChange={handleInputChangeMatch}
                                            placeholder="My Goals"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>My Shots</h3>
                                        <input
                                            type="number"
                                            name="myShots"
                                            value={editedMatch.myShots !== null && editedMatch.myShots !== undefined ? editedMatch.myShots : 0}
                                            onChange={handleInputChangeMatch}
                                            placeholder="My Shots"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>My Possession</h3>
                                        <input
                                            type="number"
                                            name="myPossession"
                                            value={editedMatch.myPossession !== null && editedMatch.myPossession !== undefined ? editedMatch.myPossession : 0}
                                            onChange={handleInputChangeMatch}
                                            placeholder="My Possession"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>My Fouls</h3>
                                        <input
                                            type="number"
                                            name="myFouls"
                                            value={editedMatch.myFouls !== null && editedMatch.myFouls !== undefined ? editedMatch.myFouls : 0}
                                            onChange={handleInputChangeMatch}
                                            placeholder="My Fouls"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>My Corners</h3>
                                        <input
                                            type="number"
                                            name="myCorners"
                                            value={editedMatch.myCorners !== null && editedMatch.myCorners !== undefined ? editedMatch.myCorners : 0}
                                            onChange={handleInputChangeMatch}
                                            placeholder="My Corners"
                                        />
                                    </div>
                                </div>

                                <div className="team-info rival-team">
                                    <div className="input-group">
                                        <h3>Rival Goals</h3>
                                        <input
                                            type="number"
                                            name="rivalGoals"
                                            value={editedMatch.rivalGoals ?? ""}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Rival Goals"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>Rival Shots</h3>
                                        <input
                                            type="number"
                                            name="rivalShots"
                                            value={editedMatch.rivalShots ?? ""}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Rival Shots"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>Rival Possession</h3>
                                        <input
                                            type="number"
                                            name="rivalPossession"
                                            value={editedMatch.rivalPossession ?? ""}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Rival Possession"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>Rival Fouls</h3>
                                        <input
                                            type="number"
                                            name="rivalFouls"
                                            value={editedMatch.rivalFouls ?? ""}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Rival Fouls"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <h3>Rival Corners</h3>
                                        <input
                                            type="number"
                                            name="rivalCorners"
                                            value={editedMatch.rivalCorners ?? ""}
                                            onChange={handleInputChangeMatch}
                                            placeholder="Rival Corners"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {selectedTab === "playerStats" && (
                        <div className="player-stats-tab">
                            <div className="player-stats-container-match">
                                {playerMatchStats.map((player, index) => (
                                    <div key={index} className="player-stat-match">
                                        <h3>{player.player}</h3>
                                        <div className="player-stat-inputs">
                                            <div className="input-item">
                                                <label>Time played</label>
                                                <input
                                                    type="number"
                                                    name="timePlayed"
                                                    value={player.timePlayed ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Time Played"
                                                />
                                            </div>
                                            <div className="input-item">
                                                <label>Goals</label>
                                                <input
                                                    type="number"
                                                    name="goals"
                                                    value={player.goals ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Goals"
                                                />
                                            </div>
                                            <div className="input-item">
                                                <label>Assists</label>
                                                <input
                                                    type="number"
                                                    name="assists"
                                                    value={player.assists ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Assists"
                                                />
                                            </div>
                                            <div className="input-item">
                                                <label>Shots</label>
                                                <input
                                                    type="number"
                                                    name="shots"
                                                    value={player.shots ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Shots"
                                                />
                                            </div>
                                            <div className="input-item">
                                                <label>Shots on target</label>
                                                <input
                                                    type="number"
                                                    name="shotsOnTarget"
                                                    value={player.shotsOnTarget ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Shots on Target"
                                                />
                                            </div>
                                            <div className="input-item">
                                                <label>Yellow cards</label>
                                                <input
                                                    type="number"
                                                    name="yellowCards"
                                                    value={player.yellowCards ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Yellow Cards"
                                                />
                                            </div>
                                            <div className="input-item">
                                                <label>Red cards</label>
                                                <input
                                                    type="number"
                                                    name="redCards"
                                                    value={player.redCards ?? ""}
                                                    onChange={(e) => handlePlayerStatsChange(e, index)}
                                                    placeholder="Red Cards"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}




                            <button type="button" className="confirm-edit-match-button" onClick={handleSubmitMatch}>Update Match</button>
                        </form>
                    </div>
                </div>
            )}




            {insightsOpen && (
                <div className="modal-insights">
                    <div className="modal-insights-content">
                        <span className="close-insights" onClick={handleCloseInsights}>&times;</span>
                                                
                        <div className="insight-section">
                            <h3>General Comparations</h3>
                            <div className="insights-info">
                                {insights.insights1.map((insight, index) => (
                                    <p key={index}>{insight}</p>
                                ))}
                            </div>
                        </div>

                        <div className="insight-section">
                            <h3>Streaks and Momentum</h3>
                            <div className="insights-info">
                                {insights.insights2.map((insight, index) => (
                                    <p key={index}>{insight}</p>
                                ))}
                            </div>
                        </div>

                        <div className="insight-section">
                            <h3>Advanced Stats</h3>
                            <div className="insights-info">
                                {insights.insights3.map((insight, index) => (
                                    <p key={index}>{insight}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComponentMatch;
