const API_URL = "http://localhost:5000"; 

export async function createRivalTeam(username, idT, teamData) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }

    const url = `${API_URL}/users/${username}/teams/${idT}/rival_teams`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamData),
        });


        const contentType = response.headers.get("content-type");

        let responseBody;
        if (contentType && contentType.includes("application/json")) {
            responseBody = await response.json();
        } else {
            responseBody = await response.text();
        }

        if (!response.ok) {
            if (responseBody.errors) {
                const errorMessages = responseBody.errors.map(err => `${err.field}: ${err.message}`).join('\n');
                throw new Error(`API Error: ${errorMessages}`);  
            } else {
                throw new Error(responseBody.message || `Error creating team with status ${response.status}`);
            }
        }
        return responseBody;
    } catch (error) {
        console.error("Error in createRivalTeam:", error);  
        throw error;  
    }
}

