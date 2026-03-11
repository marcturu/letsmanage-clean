const API_URL = "http://localhost:5000/exercises"; 

export async function getExercise(id) {
    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error obtaining exercise");
        }

        return await response.json();

    } catch (error) {
        console.error("Error in getExercise:", error);
        throw error; 
    }
}