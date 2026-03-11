import Training from "../../models/ModelTraining"

const API_URL = "http://localhost:5000"; 

export async function getTrainingShort(username, idTr) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/trainings/${idTr}`;
    
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
            id:  training.idTr,
            name: training.name,
            address: training.address,
            city: training.city,
            coach: training.coach,
            day: training.day,
            duration: training.duration,
            exerciese: training.exercises,
            hour: training.hour,
            month: training.month,
            team: training.team,
            year: training.year
        }
        return new Training(trainingP)

    } catch (error) {
        console.error("Error in getTrainingShort:", error);
        throw error; 
    }
}