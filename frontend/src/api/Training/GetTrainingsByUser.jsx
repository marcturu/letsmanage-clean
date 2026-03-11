const API_URL = "http://localhost:5000";

export async function getTrainingsByUser(username) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/trainings`;
    
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
            throw new Error(errorData.error || "Error obtaining user trainings");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error in getTrainingsByUser:", error);
        throw error;
    }
}
