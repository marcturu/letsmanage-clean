import { ModelMatch } from '../models/ModelMatch.js'
import { CtrlTeam } from '../controllers/CtrlTeam.js'
import { ModelPlayerMatchStats } from '../models/ModelPlayerMatchStats.js'
import { CtrlPlayerMatchStats } from '../controllers/CtrlPlayerMatchStats.js'
import { CtrlPlayerStats } from '../controllers/CtrlPlayerStats.js'
import { ModelPlayerStats } from '../models/ModelPlayerStats.js'

export class CtrlMatch {

    static async getAllByUser(req, res) {
        const username = req.params.id; 
        try {
            const documents = await ModelMatch.getAll();
    
            const filteredDocuments = documents.filter(doc => {
                const myCoach = doc.myTeam ? doc.myTeam.split('_').pop() : null; 
                return myCoach === username;
            });
    
            filteredDocuments.sort((a, b) => {
                const nameA = a.name.toLowerCase(); 
                const nameB = b.name.toLowerCase(); 
    
                if (nameA < nameB) {
                    return -1;  
                }
                if (nameA > nameB) {
                    return 1; 
                }
                return 0;       
            });
    
            res.json(filteredDocuments); 
        } catch (error) {
            console.error("Error in getAllByUser:", error.message);
            if (error.message === 'Match not found') {
                return res.status(404).json({ message: 'Match not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }
    

    static async getAllByUserAndTeam(req, res) {
        const username = req.params.id; 
        const idT = req.params.idT; 
        try {
            const documents = await ModelMatch.getAll();
    
            const filteredDocuments = documents.filter(doc => {
                const myCoach = doc.myTeam ? doc.myTeam.split('_').pop() : null; 
                return (myCoach === username && doc.myTeam === idT);
            });
    
            filteredDocuments.sort((a, b) => {
                const nameA = a.name.toLowerCase(); 
                const nameB = b.name.toLowerCase(); 
    
                if (nameA < nameB) {
                    return -1;  
                }
                if (nameA > nameB) {
                    return 1;  
                }
                return 0;       
            });
    
            res.json(filteredDocuments); 
        } catch (error) {
            console.error("Error in getAllByUserAndTeam:", error.message);
            if (error.message === 'Match not found') {
                return res.status(404).json({ message: 'Match not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }
    

    static async getFinishedMatches(req, res) {
        const username = req.params.id; 
        const idT = req.params.idT; 
        try {
            const documents = await ModelMatch.getAll();
    
            const filteredDocuments = documents.filter(doc => {
                const myCoach = doc.myTeam ? doc.myTeam.split('_').pop() : null; 
                return (myCoach === username && doc.myTeam === idT && doc.finished === true);
            });
    
            res.json(filteredDocuments); 
        } catch (error) {
            console.error("Error in getFinishedMatches:", error.message);
            if (error.message === 'Match not found') {
                return res.status(404).json({ message: 'Match not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async getById(req, res) {
        const idM = req.params.idM; 
        try {
            const data = await ModelMatch.getById({ id: idM }); 
            res.json(data); 
        } catch (error) {
            console.error("Error in getById:", error.message);
            if (error.message === 'Match not found') {
                return res.status(404).json({ message: 'Match not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async create(req, res) {

        const { name, myTeam, rivalTeam, city, address, date, hour, imLocal, finished, formation, starters, calledups } = req.body;
        
        //Match exists?
        const martchExists = await ModelMatch.exists({ id: name });
        if (martchExists) {
            return res.status(409).json({ message: 'Match already exists' });
        } 
    
        const result = {
            name, 
            myTeam, 
            rivalTeam, 
            city, 
            address, 
            date, 
            hour, 
            imLocal, 
            finished, 
            formation, 
            starters, 
            calledups,
            myGoals: 0,
            rivalGoals: 0,
            myPossession: 0,
            rivalPossession: 0,
            myShots: 0,
            rivalShots: 0,
            myFouls: 0,
            rivalFouls: 0,
            myCorners: 0,
            rivalCorners: 0
        };

        try {
            const res_creation = await ModelMatch.create(name, result);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating match' });
            }
        } catch (error) {
            console.error("Error creating match:", error);
            return res.status(500).json({ message: 'Error creating match' });
        }

        //Creates all the Called-Ups PlayerMatchStats with default values
        try {
            for (const playerId of calledups) {
                const idMPMS = `${name}_${playerId}`; 
                const modelplayerMatchStatsData = {
                    timePlayed: 0,
                    goals: 0,
                    assists: 0,
                    yellowCards: 0,
                    redCards: 0,
                    shots: 0,
                    shotsOnTarget: 0,
                    player: playerId,
                    match: name,
                };
        
                const res_creation = await ModelPlayerMatchStats.create(idMPMS, modelplayerMatchStatsData);
        
                if (!res_creation) {
                    return res.status(400).json({
                        message: `Error creating modelPlayerMatchStats for player ${playerId}`,
                    });
                }
            }
        } catch (error) {
            console.error("Error creating modelPlayerMatchStats:", error);
            return res.status(500).json({
                message: 'Error creating modelPlayerMatchStats',
            });
        }

        //Returns the Match created
        return res.status(201).json(result);
    }

    static async update(req, res) {
        let idM = req.params.idM;
        const team = req.params.idT;
    
        //Match exists?
        let prevMatch;
        try {
            prevMatch = await ModelMatch.getById({ id: idM });
        } catch (error) {
            if (error.message === 'Match not found') {
                return res.status(404).json({ message: 'Match not found' });
            }
            return res.status(500).json({ message: 'Error obtaining match' });
        }
        if (!prevMatch) {
            return res.status(404).json({ message: 'Match not found' });
        }
    
        const { 
            myGoals, rivalGoals, myPossession, rivalPossession, myShots, rivalShots, 
            myFouls, rivalFouls, myCorners, rivalCorners 
        } = req.body.newMatch;  
        const {  playerStats } = req.body;

        console.log("req.body: ", req.body);
    
        const updatedMatch = {
            myGoals, 
            rivalGoals, 
            myPossession, 
            rivalPossession, 
            myShots, 
            rivalShots, 
            myFouls, 
            rivalFouls, 
            myCorners, 
            rivalCorners,
            finished : true
        };

        console.log("updatedMatch: ", updatedMatch);
    
        // Actualizar el objeto prevMatch con los nuevos valores
        for (const key in updatedMatch) {
            if (updatedMatch[key] !== undefined) {
                prevMatch[key] = updatedMatch[key];
            }
        }
    
        // Update all PlayerMatchStats from the Match
        if (playerStats) {
            try {
                for (const player of playerStats) {
                    if (player.id) {
                        console.log("playerMatchStats to update from: ", player);
                        await CtrlPlayerMatchStats.updatePlayerStats(player.id, player); 
                    } else {
                        return res.status(400).json({ message: 'Player ID is required to update player stats.' });
                    }
                }
            } catch (error) {
                return res.status(500).json({ message: 'Error updating player stats' });
            }
        }
    
        // Update Match
        try {
            console.log("match a updatear: ", prevMatch);
            const res_update = await ModelMatch.update(idM, prevMatch);
            if (!res_update) {
                return res.status(400).json({ message: 'Match update error' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error updating match' });
        }

        //Update Team (stats)
        try {
            const res_update = await CtrlTeam.updateByEndMatch(team, prevMatch);
            if (!res_update) {
                return res.status(400).json({ message: 'Team update error' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error updating team' });
        }

        // Return PrevMatch
        return res.status(200).json(prevMatch);

    }

    static async delete (req, res){
        const team = req.params.idT;
        let id = req.params.idM;
        let match

        // Match exists?
        try {
            match = await ModelMatch.getById({ id });
        } catch (error) {
            if( error.message === 'No existe el documento' )
                return res.status(404).json({ message: 'Match not found'})
        }

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        if (match.finished === true) {

            //Recalculate Team stats
            try {
                const res_update = await CtrlTeam.recalculateStats(team, match);
                if (!res_update) {
                    return res.status(400).json({ message: 'Team update error' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Error updating team la buenaaa' });
            }

            //Recalculate PlayerStats
            //Get playerMatchStats by Match
            let playerStats;
            try {
                const documents = await ModelPlayerMatchStats.getAll();
                
                playerStats = documents.filter(doc => {
                    const match = doc.match ? doc.match : null; 
                    return match === id;
                });
                } catch (error) {
                    if (error.message === 'No existe el documento') {
                        return res.status(404).json({ message: 'PlayerMatchStats not found' }); 
                    }
                    return res.status(500).json({ message: 'Internal server error' }); 
                }
            //Recalculate
            if (playerStats) {
                try {
                    for (const player of playerStats) {
                        if (player.id) {
                            const id = `${player.player}_PlayerStats`;
                            const existingStats = await ModelPlayerStats.getById({ id });
                            if (existingStats) {
                                await CtrlPlayerStats.recalculateStats(player.player, player);
                            } else {
                                console.warn(`PlayerStats not found for player ID: ${player.id}. Skipping.`);
                            }
                        } else {
                            return res.status(400).json({ message: 'Player ID is required to update player stats.' });
                        }
                    }
                } catch (error) {
                    return res.status(500).json({ message: 'Error updating player stats' });
                }
            }   
        }     

        // Delete Match and PlayerMatchStats
        const res_delete = await ModelMatch.deleteWaterfall({ id });
        if (!res_delete){
            return res.status(400).json({message: 'Match deletion error'})
        }

        return res.json({ message: 'Match ' + id +' deleted' })
    }

    static async deleteByUser(username) {
        try {
            await ModelMatch.deleteByUser(username);
        } catch (error) {
            return { status: 500, message: 'Internal Server Error', details: error.message};
        }
    }

    static async deleteByTeam(id) {
            try {
                await ModelMatch.deleteByTeam(id);
            } catch (error) {
                return { status: 500, message: 'Internal Server Error', details: error.message};
            }
        }
}

export default CtrlMatch;