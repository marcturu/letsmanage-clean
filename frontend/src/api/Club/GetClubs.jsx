const API_URL = "http://localhost:5000/clubs";

export async function getClubs() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error obtaining clubs");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getClubs:", error);
        throw error;
    }
}
