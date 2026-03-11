const API_URL = "http://localhost:5000/exercises";

export async function getExercises(filters = {}) {
    const { type, personalized } = filters;
    let query = '';

    if (type !== '') {
        query += `type=${type}&`;
    }

    if (personalized !== '') {
        query += `personalized=${personalized}&`;
    }

    if (query.endsWith('&')) {
        query = query.slice(0, -1);
    }

    const url = query ? `${API_URL}?${query}` : API_URL;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error obtaining exercises");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getExercises:", error);
        throw error;
    }
}
