import PlayerCharacteristics from "../../models/ModelPlayerCharacteristics"

const API_URL = "http://localhost:5000"; 

export async function getPlayerCharacteristics(username, idT, idP) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/players/${idP}/playercharacteristics`;
    
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

        const playerCharacteristics = await response.json();
        const playerCharacteristicsP = {
            id:  playerCharacteristics.id,
            position1: playerCharacteristics.position1,
            position2: playerCharacteristics.position2,
            dominantFoot: playerCharacteristics.dominantFoot,
            avgTechnicalLevel: playerCharacteristics.avgTechnicalLevel,
            avgTacticalLevel: playerCharacteristics.avgTacticalLevel,
            avgFatigue: playerCharacteristics.avgFatigue,
            avgHeartRate: playerCharacteristics.avgHeartRate,
            personalLifeLevel: playerCharacteristics.personalLifeLevel,
            drugUseLevel: playerCharacteristics.drugUseLevel,
            allergies: playerCharacteristics.allergies,
            player: playerCharacteristics.player
        }
        return new PlayerCharacteristics(playerCharacteristicsP)

    } catch (error) {
        console.error("Error in getPlayerCharacteristics:", error);
        throw error; 
    }
}