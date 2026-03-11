import PlayerStats from "../../models/ModelPlayerStats"

const API_URL = "http://localhost:5000"; 

export async function getPlayerStats(username, idT, idP) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/players/${idP}/playerstats`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching team: ${response.statusText}. Response: ${errorText}`);
        }

        const playerStats = await response.json();
        const playerStatsP = {
            id:  playerStats.id,
            timePlayed: playerStats.timePlayed,
            goals: playerStats.goals,
            assists: playerStats.assists,
            yellowCards: playerStats.yellowCards,
            redCards: playerStats.redCards,
            shots: playerStats.shots,
            shotsOnTarget: playerStats.shotsOnTarget,
            player: playerStats.player
        }
        return new PlayerStats(playerStatsP)

    } catch (error) {
        console.error("Error in getPlayerStats:", error);
        throw error; 
    }
}