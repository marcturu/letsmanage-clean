const API_URL = "http://localhost:5000/clubs"; 

export async function getClub(id) {
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
            throw new Error(errorData.error || "Error obtaining club");
        }

        return await response.json();

    } catch (error) {
        console.error("Error in getClub:", error);
        throw error; 
    }
}