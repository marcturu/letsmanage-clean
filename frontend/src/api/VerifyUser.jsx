const API_URL = "http://localhost:5000"; // URL de tu backend

export async function verifyUser(credentials) {
    try {
        const response = await fetch(`${API_URL}/verifyUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
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
                throw new Error(errorData.message || "Error veryfying user"); 
            }
        }

        return await response.json(); 
    } catch (error) {
        console.error('Error in verifyUser:', error);
        throw error; 
    }
}
