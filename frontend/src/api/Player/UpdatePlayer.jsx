const API_URL = "http://localhost:5000";

export async function updatePlayer(username, idT, idP, playerData) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }

    const url = `${API_URL}/users/${username}/teams/${idT}/players/${idP}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            body: playerData,  
        });

        if (!response || !response.ok) {
            const responseBody = await response.json().catch(() => response.text());
            const errorMessage = responseBody.message || `Error updating player with status ${response.status}`;
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        let responseBody;

        if (contentType && contentType.includes("application/json")) {
            responseBody = await response.json();
        } else {
            responseBody = await response.text();
        }

        console.log("response status en API 1: ", response.status);
        console.log("response body en API 1: ", responseBody);

        return { response, responseBody };

    } catch (error) {
        console.error("Error in updatePlayer:", error);
        throw error;
    }
}

