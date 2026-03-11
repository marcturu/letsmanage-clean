import User from "../../models/ModelUser"

const API_URL = "http://localhost:5000/users"; 

export async function deleteUser(username) {
    try {

        const response = await fetch(`${API_URL}/${username}`, {
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
                throw new Error(errorData.message || "Error deleting user"); 
            }
        }

        return await response.json(); 

    } catch (error) {
        console.error("Error in deleteUser:", error);
        throw error; 
    }
}