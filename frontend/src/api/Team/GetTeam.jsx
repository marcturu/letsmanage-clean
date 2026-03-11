import Team from "../../models/ModelTeam"

const API_URL = "http://localhost:5000"; 

export async function getTeam(username, idT) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}`;

    try {

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();  
            throw new Error(`Error fetching team: ${response.statusText}. Response: ${errorText}`);
        }

        const team = await response.json();
        const teamP = {
            id:  team.idT,
            category: team.category,
            club: team.club,
            coach: team.coach,
            creator: team.creator,
            awayGoals: team.awayGoals,
            awayGoalsConceded: team.awayGoalsConceded,
            gamesWon: team.gamesWon,
            gamesLost: team.gamesLost,
            league: team.league,
            letter: team.letter,
            localGoals: team.localGoals,
            localGoalsConceded: team.localGoalsConceded,
            losingStreak: team.losingStreak,
            points: team.points,
            pointsRatio: team.pointsRatio,
            strengths: team.strengths,
            teamPhoto: team.teamPhoto,
            weaknesses: team.weaknesses,
            winningStreak: team.winningStreak
        }
        return new Team(teamP)

    } catch (error) {
        console.error("Error in getTeam:", error);
        throw error; 
    }
}