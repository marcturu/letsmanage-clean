import User from "../../models/ModelUser"

const API_URL = "http://localhost:5000/users"; 

export async function getUser(username) {
    try {

        const response = await fetch(`${API_URL}/${username}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error obtaining user");
        }

        const user = await response.json();
        const userP = {
            username: user.username,
            name: user.name,
            surname: user.surname,
            password: user.password
        }
        return new User(userP)

    } catch (error) {
        console.error("Error in getUser:", error);
        throw error; 
    }
}