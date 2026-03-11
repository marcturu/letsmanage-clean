const API_URL = "http://localhost:5000";

export async function getTeamsByUser(username) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams`;

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
            throw new Error(errorData.error || "Error obtaining user teams");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getTeamsByUser:", error);
        throw error;
    }
}