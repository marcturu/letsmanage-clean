import Training from "../../models/ModelTraining"

const API_URL = "http://localhost:5000"; 

export async function getTraining(username, idT, idTr) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/trainings/${idTr}`;
    
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
            throw new Error(`Error fetching training: ${response.statusText}. Response: ${errorText}`);
        }

        const training = await response.json();
        const trainingP = {
            id:  training.idT,
            name: training.name,
            address: training.address,
            city: training.city,
            year: training.year,
            month: training.month,
            day: training.day,
            hour: training.hour,
            pitchZone: training.pitchZone,
            team: training.team,
            coach: training.coach,
            duration: training.duration,
            exercises: training.exercises
        }
        return new Training(trainingP)

    } catch (error) {
        console.error("Error in getTraining:", error);
        throw error; 
    }
}