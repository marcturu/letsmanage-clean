const API_URL = "http://localhost:5000";

export async function getTrainingsByUserAndTeam(username, idT) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }

    const url = `${API_URL}/users/${username}/teams/${idT}/trainings`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error obtaining user & team trainings");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error in getTrainingsByUserAndTeam:", error);
        throw error;
    }
}
