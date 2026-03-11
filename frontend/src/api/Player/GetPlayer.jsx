import Player from "../../models/ModelPlayer"

const API_URL = "http://localhost:5000"; 

export async function getPlayer(username, idT, idP) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/players/${idP}`;
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

        const player = await response.json();
        const playerP = {
            id:  player.idT,
            name: player.name,
            surname: player.surname,
            surname2: player.surname2,
            height: player.height,
            weight: player.weight,
            phone: player.phone,
            mail: player.mail,
            DNI: player.DNI,
            birthdate: player.birthdate,
            nationality: player.nationality,
            number: player.number,
            photo: player.photo,
            team: player.team
        }
        return new Player(playerP)

    } catch (error) {
        console.error("Error in getPlayer:", error);
        throw error; 
    }
}