import { ModelTeam } from '../models/ModelTeam.js'
import { ModelPlayer } from '../models/ModelPlayer.js'
import { ModelPlayerStats } from '../models/ModelPlayerStats.js'
import { validatePlayerStats } from '../schemas/SchemaPlayerStats.js'

export class CtrlPlayerStats {
    static async getByPlayer(req, res) {
        const idP = req.params.idP; 

        // Player exists?
        try {
            const player = await ModelPlayer.getById({ id: idP }); 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return res.status(404).json({ message: 'Player not found' });
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }

        // Get PlayerStats by Player
        try {
            const data = await ModelPlayerStats.getByPlayer(idP);
            if (data) {
                res.json(data); 
            } else {
                return res.status(404).json({ message: 'PlayerStats not found' });
            }
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return res.status(404).json({ message: 'PlayerStats not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async update(req, res) {

        // Player exists?
        let idP = req.params.idP;
        let prevPlayer;
        try {
            prevPlayer = await ModelPlayer.getById({ id: idP });
        } catch (error) {
            if (error.message === 'Player not found') {
                return res.status(404).json({ message: 'Player not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining player' }); 
        }
        if (!prevPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // PlayerStats exists?
        let idPS = `${idP}_PlayerStats`;
        console.log("idPS: " + idPS);
        let prevPlayerStats;
        try {
            prevPlayerStats = await ModelPlayerStats.getById({ id: idPS });
        } catch (error) {
            if (error.message === 'PlayerStats not found') {
                return res.status(404).json({ message: 'PlayerStats not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining playerStats' }); 
        }
        if (!prevPlayerStats) {
            return res.status(404).json({ message: 'PlayerStats not found' });
        }

        const newPlayerStats = {
            timePlayed: req.body.timePlayed ?? prevPlayerStats.timePlayed,
            goals: req.body.goals ?? prevPlayerStats.goals,
            assists: req.body.assists ?? prevPlayerStats.assists,
            yellowCards: req.body.yellowCards ?? prevPlayerStats.yellowCards,
            redCards: req.body.redCards ?? prevPlayerStats.redCards,
            shots: req.body.shots ?? prevPlayerStats.shots,
            shotsOnTarget: req.body.shotsOnTarget ?? prevPlayerStats.shotsOnTarget
        };
        
        // Format validation
        const result = validatePlayerStats(req.body); 
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 
    
        // Update PlayerStats
        try {
            const res_update = await ModelPlayerStats.update({ id: idPS }, newPlayerStats);
            if (!res_update) {
                return res.status(400).json({ message: 'PlayerStats update error' });
            }
            return res.status(200).json(newPlayerStats);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating playerStats' });
        }
    }

    static async updatePlayerStatsSuperclass(playerId, updatedMatchStats) {
        try {
            const id = `${playerId}_PlayerStats`;
            console.log("idddddd: ", id);
            const playerStats = await ModelPlayerStats.getById({id});
    
            if (!playerStats) {
                throw new Error('No player stats found for player');
            }
    
            // Sumar the stats from the match to the general ones
            const updatedStats = {
                timePlayed: playerStats.timePlayed + (updatedMatchStats.timePlayed || 0),
                goals: playerStats.goals + (updatedMatchStats.goals || 0),
                assists: playerStats.assists + (updatedMatchStats.assists || 0),
                yellowCards: playerStats.yellowCards + (updatedMatchStats.yellowCards || 0),
                redCards: playerStats.redCards + (updatedMatchStats.redCards || 0),
                shots: playerStats.shots + (updatedMatchStats.shots || 0),
                shotsOnTarget: playerStats.shotsOnTarget + (updatedMatchStats.shotsOnTarget || 0)
            };
    
            // Update the superclasse stats (PlayerStats)
            const res_updatePlayerStats = await ModelPlayerStats.update({ id }, updatedStats);
            if (!res_updatePlayerStats) {
                return res.status(400).json({ message: 'PlayerStats update error' });
            }
        
        } catch (error) {
            return res.status(500).json({ message: 'Error updating playerStats' });
        }
    }

    static async recalculateStats(playerId, updatedMatchStats) {
        try {
            const id = `${playerId}_PlayerStats`;
            const playerStats = await ModelPlayerStats.getById({id});
    
            if (!playerStats) {
                throw new Error('No player stats found for player');
            }
    
            // Sumar the stats from the match to the general ones
            const updatedStats = {
                timePlayed: playerStats.timePlayed - (updatedMatchStats.timePlayed || 0),
                goals: playerStats.goals - (updatedMatchStats.goals || 0),
                assists: playerStats.assists - (updatedMatchStats.assists || 0),
                yellowCards: playerStats.yellowCards - (updatedMatchStats.yellowCards || 0),
                redCards: playerStats.redCards - (updatedMatchStats.redCards || 0),
                shots: playerStats.shots - (updatedMatchStats.shots || 0),
                shotsOnTarget: playerStats.shotsOnTarget - (updatedMatchStats.shotsOnTarget || 0)
            };
    
            // Update the superclasse stats (PlayerStats)
            const res_updatePlayerStats = await ModelPlayerStats.update({ id }, updatedStats);
            if (!res_updatePlayerStats) {
                return res.status(400).json({ message: 'PlayerStats update error' });
            }
        
        } catch (error) {
            return res.status(500).json({ message: 'Error updating playerStats' });
        }
    }
    
} 

export default CtrlPlayerStats;