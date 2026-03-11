import { ModelTeam } from '../models/ModelTeam.js'
import { ModelClub } from '../models/ModelClub.js'
import { ModelUser } from '../models/ModelUser.js'
import { CtrlTraining } from './CtrlTraining.js'
import { CtrlMatch } from './CtrlMatch.js'
import { validateTeam } from '../schemas/SchemaTeam.js'

export class CtrlTeam {
    static async getAll(req, res) {
        const id = req.params.id;
    
        try {
            const documents = await ModelTeam.getAll({id});
            res.json(documents);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getAllRivalTeams(req, res) {
        const id = req.params.id;
        const league = req.query.league;  

        try {
            const documents = await ModelTeam.getAll2();
            const filteredDocuments = documents.filter(doc => !doc.coach && doc.creator === id && doc.league === league);
            res.json(filteredDocuments);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getById(req, res) {
        let id = req.params.idT;
        // Team exists?
        try {
            const team = await ModelTeam.getById({ id }); 
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            } 
            res.json(team); 
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async getRivalTeamById(req, res) {
        let id = req.params.idT;
        let id2 = req.params.idT2;
    
        //Your Team exists?
        try {
            const team = await ModelTeam.getById({ id }); 
            if (!team) {
                return res.status(404).json({ message: 'Your team not found' });
            } 
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' }); 
        }

        //Get rival Team
        try {
            const rivalTeam = await ModelTeam.getById({ id: id2 }); 
            if (!rivalTeam) {
                return res.status(404).json({ message: 'Rival team not found' });
            } 
            res.json(rivalTeam); 
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async create(req, res) {
        //Format verifications
        let result = validateTeam(req.body, true);
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 

        const { category, club, coach, creator, league, letter } = req.body;
        const id = `${club}_${category.toLowerCase()}_${letter.toLowerCase()}_${creator}`;

        //Club exists?
        let clubPhoto;
        try {
            const prevClub = await ModelClub.getById({ id: club });
            clubPhoto = prevClub.photo;
        } catch (error) {
            console.error("Error fetching club:", error);  
            if (error.message === 'Club not found') {
                return res.status(404).json({ message: 'Club not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining club' }); 
        }

        //Coach exists?
        const coachExists = await ModelUser.exists({ username: coach});
        if (! coachExists) {
            return res.status(409).json({ message: 'Coach does not exist' });
        }

        //Team exists?
        const teamExists = await ModelTeam.exists({ id });
        if (teamExists) {
            return res.status(409).json({ message: 'Team already exists with that club, cattegory, letter and creator' });
        }
        result = {
            club,
            category,
            letter,
            league,
            coach,
            creator,
            points: 0,
            pointsRatio: 0.0,
            gamesWon: 0,
            gamesLost: 0,
            awayGoals: 0,
            localGoals: 0,
            awayGoalsConceded: 0,
            localGoalsConceded: 0,
            winningStreak: 0,
            losingStreak: 0,
            strengths: [],
            weaknesses: [],
            teamPhoto: clubPhoto
        };
    
        try {
            const res_creation = await ModelTeam.create(id, result);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating team' });
            }
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating team' });
        }
    }

    static async createRivalTeam(req, res) {
        //Format verifications
        let result = validateTeam(req.body, true);
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 

        const { category, club, creator, league, letter } = req.body;
        const id = `${club}_${category.toLowerCase()}_${letter.toLowerCase()}_${creator}`;

        //Club exists?
        let clubPhoto;
        try {
            const prevClub = await ModelClub.getById({ id: club });
            clubPhoto = prevClub.photo;
        } catch (error) {
            console.error("Error fetching club:", error);  
            if (error.message === 'Club not found') {
                return res.status(404).json({ message: 'Club not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining club' }); 
        } 

        //Team exists?
        const teamExists = await ModelTeam.exists({ id });
        if (teamExists) {
            return res.status(409).json({ message: 'Team already exists with that club, cattegory, letter and creator' });
        }
        result = {
            club,
            category,
            letter,
            league,
            creator,
            points: 0,
            pointsRatio: 0.0,
            gamesWon: 0,
            gamesLost: 0,
            localGoals: 0,
            awayGoals: 0,
            localGoalsConceded: 0,
            awayGoalsConceded: 0,
            winningStreak: 0,
            losingStreak: 0,
            strengths: [],
            weaknesses: [],
            teamPhoto: clubPhoto
        };
    
        try {
            const res_creation = await ModelTeam.create(id, result);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating team' });
            }
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating team' });
        }
    }

    static async update(req, res) {
        let id = req.params.idT;
    
        const idTDecoded = decodeURIComponent(id); 
        const idTParts = idTDecoded.split(' '); 
    
        const club = idTParts.slice(0, -2).join(' '); 
        const category = idTParts.slice(-2, -1)[0]; 
        const letter = idTParts.slice(-1)[0]; 
    
        const parts = id.split(' ');
    
        if (parts.length >= 3) {
            const clubName = parts.slice(0, -2).join(' ');  // 'ESCOLA PIA TERRASSA'
            const categoryAndLetter = parts.slice(-2).join('_');  // '_infantil_b'
            id = `${clubName}_${categoryAndLetter}`;
        }
               
        // Team exists?
        let prevTeam;
        try {
            prevTeam = await ModelTeam.getById({ id });
        } catch (error) {
            if (error.message === 'Team not found') {
                return res.status(404).json({ message: 'Team not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining team' }); 
        }
    
        if (!prevTeam) {
            return res.status(404).json({ message: 'Team not found' });
        }
    
        const coach = req.body.coach;
    
        // New Coach exists? 
        if (coach) {
            try {
                const coachExists = await ModelUser.exists({ id: coach });
                if (!coachExists) {
                    return res.status(409).json({ message: 'Coach does not exist' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Error obtaining coach' });
            }
        }

        const newTeam = {
            id: prevTeam.id,
            club: prevTeam.club,
            category: prevTeam.category,
            letter: prevTeam.letter,
            coach: req.body.coach ?? prevTeam.coach,
            league: req.body.league ?? prevTeam.league,
            points: req.body.points ?? prevTeam.points,
            pointsRatio: prevTeam.pointsRatio,
            gamesWon: req.body.gamesWon ?? prevTeam.gamesWon,
            gamesLost: req.body.gamesLost ?? prevTeam.gamesLost,
            localGoals: req.body.localGoals ?? prevTeam.localGoals,
            awayGoals: req.body.awayGoals ?? prevTeam.awayGoals,
            localGoalsConceded: req.body.localGoalsConcedede ?? prevTeam.localGoalsConceded,
            awayGoalsConceded: req.body.awayGoalsConceded ?? prevTeam.awayGoalsConceded,
            winningStreak: req.body.winningStreak ?? prevTeam.winningStreak,
            losingStreak: req.body.losingStreak ?? prevTeam.losingStreak,
            strengths: req.body.strengths ?? prevTeam.strengths,
            weaknesses: req.body.weaknesses ?? prevTeam.weaknesses,
            teamPhoto: req.body.teamPhoto ?? prevTeam.teamPhoto

        };
    
        // Format validation
        const result = validateTeam(req.body, false); 
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 
    
        // Update Team
        try {
            const res_update = await ModelTeam.update({ id }, newTeam);
            if (!res_update) {
                return res.status(400).json({ message: 'Team update error' });
            }
            return res.status(200).json(newTeam);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating team' });
        }
    }

    static async updateRivalTeam(req, res) {
        let id = req.params.idT2;
    
        let prevTeam;
        // Team exists?
        try {
            prevTeam = await ModelTeam.getById({ id });
        } catch (error) {
            if (error.message === 'Team not found') {
                return res.status(404).json({ message: 'Team not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining team' }); 
        }
    
        if (!prevTeam) {
            return res.status(404).json({ message: 'Team not found' });
        }

        console.log("req.body: ", req.body);
        

        const newTeam = {
            id: prevTeam.id,
            club: prevTeam.club,
            category: prevTeam.category,
            letter: prevTeam.letter,
            league: req.body.league ?? prevTeam.league,
            points: req.body.points ?? prevTeam.points,
            pointsRatio: prevTeam.pointsRatio,
            gamesWon: req.body.gamesWon ?? prevTeam.gamesWon,
            gamesLost: req.body.gamesLost ?? prevTeam.gamesLost,
            localGoals: req.body.localGoals ?? prevTeam.localGoals,
            awayGoals: req.body.awayGoals ?? prevTeam.awayGoals,
            localGoalsConceded: req.body.localGoalsConceded ?? prevTeam.localGoalsConceded,
            awayGoalsConceded: req.body.awayGoalsConceded ?? prevTeam.awayGoalsConceded,
            winningStreak: req.body.winningStreak ?? prevTeam.winningStreak,
            losingStreak: req.body.losingStreak ?? prevTeam.losingStreak,
            strengths: req.body.strengths ?? prevTeam.strengths,
            weaknesses: req.body.weaknesses ?? prevTeam.weaknesses,
            teamPhoto: req.body.teamPhoto ?? prevTeam.teamPhoto
        };
        console.log("newTeam: ", newTeam);
    
        // Format validation
        const result = validateTeam(req.body, false); 
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 
    
        // Update Team
        try {
            const res_update = await ModelTeam.update({ id }, newTeam);
            if (!res_update) {
                return res.status(400).json({ message: 'Team update error' });
            }
            return res.status(200).json(newTeam);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating team' });
        }
    }
    

    static async delete(req, res) {
        let id = req.params.idT;
        let team;
    
        // Team exists?
        try {
            team = await ModelTeam.getById({ id });
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return res.status(404).json({ message: 'Team not found' });
            }
        }
    
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
    
        if (team.coach) {
    
            // Delete Trainings from Team
            try {
                await CtrlTraining.deleteByTeam(id);
            } catch (error) {
                return res.status(400).json({ message: 'Trainings deletion error' });
            }
    
            // Delete matches and Player Stats
            try {
                await CtrlMatch.deleteByTeam(id);
            } catch (error) {
                return res.status(400).json({ message: 'Matches deletion error' });
            }
    
            // Delete RivalTeams
            try {
                await ModelTeam.deleteRivalsByTeam(id, team.league);
            } catch (error) {
                return res.status(400).json({ message: 'Teams deletion error' });
            }
    
            // Delete Team, Players, PlayersCharacteristics & PlayersStats
            const res_delete = await ModelTeam.deleteWaterfall({ id });
            if (!res_delete) {
                return res.status(400).json({ message: 'Team deletion error' });
            }
    
            return res.json({ message: `Team ${id} deleted with dependencies` });
        } else {

            // Delete Team
            const res_delete = await ModelTeam.delete({ id });
            if (!res_delete) {
                return res.status(400).json({ message: 'Team deletion error' });
            }
    
            return res.json({ message: `Team ${id} deleted without dependencies` });
        }
    }    

    static async deleteByUser(username) {
        try {
            await ModelTeam.deleteByUser(username);
        } catch (error) {
            return { status: 500, message: 'Internal Server Error', details: error.message};
        }
    }

    static async updateByEndMatch(id, matchData) {
        try {
            const teamToUpdate = await ModelTeam.getById({id}); 
    
            if (!teamToUpdate) {
                return res.status(404).json({ message: 'Team not found' });
            }

            console.log("matchDATAAAA: ", matchData);
    
            const updatedTeam = { ...teamToUpdate };
    

            if (matchData.myGoals > matchData.rivalGoals) {
                updatedTeam.points += 3; 
                updatedTeam.gamesWon += 1; 
                updatedTeam.winningStreak += 1;
                updatedTeam.losingStreak = 0; 
            } else if (matchData.myGoals < matchData.rivalGoals) {
                updatedTeam.losingStreak += 1;
                updatedTeam.gamesLost += 1; 
                updatedTeam.winningStreak = 0;
            } else {
                updatedTeam.points += 1; 
                updatedTeam.winningStreak = 0; 
                updatedTeam.losingStreak = 0; 
            }

            if (matchData.imLocal) { 
                updatedTeam.localGoals += matchData.myGoals; 
                updatedTeam.localGoalsConceded = Number(updatedTeam.localGoalsConceded) + matchData.rivalGoals; 
            } else {
                updatedTeam.awayGoals += matchData.myGoals; 
                updatedTeam.awayGoalsConceded = Number(updatedTeam.awayGoalsConceded) + matchData.rivalGoals; 
            }
            
            console.log("team a updatear: ", id);
            console.log("updatedTeam: ", updatedTeam);
            const res_update = await ModelTeam.update({id}, updatedTeam);
            if (!res_update) {
                return res.status(400).json({ message: 'Team update error' });
            }
    
            return updatedTeam; 
        } catch (error) {
            return res.status(500).json({ message: 'Error updating team' });
        }
    }

    static async recalculateStats(id, matchData) {
        try {
            const teamToUpdate = await ModelTeam.getById({id}); 
    
            if (!teamToUpdate) {
                return res.status(404).json({ message: 'Team not found' });
            }

            console.log("before team HEHE: ", teamToUpdate);
            console.log("match before update HEHE: ", matchData);
    

            if (matchData.myGoals > matchData.rivalGoals) {
                teamToUpdate.points -= 3; 
                teamToUpdate.gamesWon -= 1; 
            } else if (matchData.myGoals < matchData.rivalGoals) {
                teamToUpdate.gamesLost -= 1; 
            } else {
                teamToUpdate.points -= 1; 
            }

            if (matchData.imLocal) { 
                teamToUpdate.localGoals -= matchData.myGoals; 
                teamToUpdate.localGoalsConceded -= matchData.rivalGoals;
            } else {
                teamToUpdate.awayGoals -= matchData.myGoals; 
                teamToUpdate.awayGoalsConceded -= matchData.rivalGoals; 
            }
            
            console.log("team a updatear: ", id);
            console.log("updatedTeam: ", teamToUpdate);
            const res_update = await ModelTeam.update({id}, teamToUpdate);
            if (!res_update) {
                return res.status(400).json({ message: 'Team update error' });
            }
    
            return res_update;
        } catch (error) {
            return res.status(500).json({ message: 'Error updating team' });
        }
    }
}

export default CtrlTeam;
