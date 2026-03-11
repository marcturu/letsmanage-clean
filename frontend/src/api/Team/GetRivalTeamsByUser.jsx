const API_URL = "http://localhost:5000";

export async function getRivalTeamsByUser(username, idT, league) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }

    const url = `${API_URL}/users/${username}/teams/${idT}/rival_teams?league=${league}`;


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
            throw new Error(errorData.error || "Error obtaining user rival teams");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getRivalTeamsByUser:", error);
        throw error;
    }
}