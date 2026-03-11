const API_URL = "http://localhost:5000/users"; 

export async function createUser(userData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
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
                throw new Error(errorData.message || "Error creating user"); 
            }
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error in createUser:", error);
        throw error; 
    }
}
