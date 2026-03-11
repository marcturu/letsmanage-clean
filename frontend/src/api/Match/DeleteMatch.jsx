const API_URL = "http://localhost:5000"; 

export async function deleteMatch(username, idT, idM) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/matches/${idM}`;
    console.log("url: ", url);

    try {

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
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
                throw new Error(errorData.message || "Error deleting match"); 
            }
        }

        return await response.json(); 

    } catch (error) {
        console.error("Error in deleteMatch:", error);
        throw error; 
    }
}