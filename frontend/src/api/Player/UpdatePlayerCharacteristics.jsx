const API_URL = "http://localhost:5000";

export async function updatePlayerCharacteristics(username, idT, idP, filteredPlayerCharacteristicsData) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    
    const url = `${API_URL}/users/${username}/teams/${idT}/players/${idP}/playercharacteristics`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filteredPlayerCharacteristicsData),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json(); 
            } catch (error) {
                throw new Error('No se pudo procesar la respuesta del servidor');
            }

            
            if (errorData.errors) {
                const errorMessages = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
                throw new Error(errorMessages); 
            } else {
                throw new Error(errorData.message || "Error updating player characteristics"); 
            }
        }

        const responseBody = await response.json();
        console.log("response status en API 2: ", response.status);
        console.log("response body en API 2: ", responseBody);

        return { response, responseBody };
    } catch (error) {
        console.error("Error in updatePlayerCharacteristics:", error);
        throw error; 
    }
}
