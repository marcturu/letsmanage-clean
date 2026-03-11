import Team from "../../models/ModelTeam"

const API_URL = "http://localhost:5000"; 

export async function getRivalTeam(username, idT, idT2) {
    if (!username) {
        throw new Error('Username not found in localStorage');
    }
    const url = `${API_URL}/users/${username}/teams/${idT}/rival_teams/${idT2}`;
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
            visitantGoals: team.visitantGoals,
            weaknesses: team.weaknesses,
            winningStreak: team.winningStreak
        }
        return new Team(teamP)

    } catch (error) {
        console.error("Error in getRivalTeam:", error);
        throw error; 
    }
}