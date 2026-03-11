const API_URL = "http://localhost:5000"; 

export async function updateTraining(username, idT, idTr, trainingData) {
    console.log("idT: " + idT + " idTr: " + idTr + " trainingdATA: " + trainingData);
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/trainings/${idTr}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(trainingData),
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
                throw new Error(errorData.message || "Error updating training"); 
            }
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error in updateTraining:", error);
        throw error; 
    }
}
