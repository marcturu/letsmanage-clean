import Match from "../../models/ModelMatch"

const API_URL = "http://localhost:5000"; 

export async function getMatch(username, idT, idM) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }

    const url = `${API_URL}/users/${username}/teams/${idT}/matches/${idM}`;

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
            throw new Error(`Error fetching match: ${response.statusText}. Response: ${errorText}`);
        }

        const match = await response.json();
        const matchP = {
            id:  match.idT,
            name: match.name,
            address: match.address,
            city: match.city,
            date: match.date,
            hour: match.hour,
            calledups: match.calledups,
            finished: match.finished,
            formation: match.formation,
            imLocal: match.imLocal,
            myTeam: match.myTeam,
            myCorners: match.myCorners,
            myFouls: match.myFouls,
            myGoals: match.myGoals,
            myPossession: match.myPossession,
            myShots: match.myShots,
            rivalTeam: match.rivalTeam,
            rivalCorners: match.rivalCorners,
            rivalFouls: match.rivalFouls,
            rivalGoals: match.rivalGoals,
            rivalPossession: match.rivalPossession,
            rivalShots: match.rivalShots,
            starters: match.starters,
        }
        return new Match(matchP)

    } catch (error) {
        console.error("Error in getMatch:", error);
        throw error; 
    }
}