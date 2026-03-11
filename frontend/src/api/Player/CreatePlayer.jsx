const API_URL = "http://localhost:5000"; 

export async function createPlayer(username, idT, playerData) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }

    const url = `${API_URL}/users/${username}/teams/${idT}/players`;

    console.log('playerData (FormData) before sending:');
    playerData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json", 
            },
            body: playerData, 
        });

        const contentType = response.headers.get("content-type");
        let responseBody;

        if (contentType && contentType.includes("application/json")) {
            responseBody = await response.json();
        } else {
            responseBody = await response.text();
        }

        console.log("response: ", responseBody);

        if (!response.ok) {
            if (responseBody.errors) {
                const errorMessages = responseBody.errors.map(err => `${err.field}: ${err.message}`).join('\n');
                throw new Error(`API Error: ${errorMessages}`);
            } else {
                throw new Error(responseBody.message || `Error creating player with status ${response.status}`);
            }
        }

        return responseBody;
    } catch (error) {
        console.error("Error in createPlayer:", error);
        throw error;
    }
}