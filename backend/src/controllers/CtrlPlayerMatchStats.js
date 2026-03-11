import { ModelTeam } from '../models/ModelTeam.js'
import { ModelPlayer } from '../models/ModelPlayer.js'
import { ModelPlayerMatchStats } from '../models/ModelPlayerMatchStats.js'
import { CtrlPlayerStats } from '../controllers/CtrlPlayerStats.js'

export class CtrlPlayerMatchStats {
    static async getAllByPlayer(req, res) {
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

        // Get PlayerMatchStats by Player
        try {
            const documents = await ModelPlayerMatchStats.getAll();
            
            const filteredDocuments = documents.filter(doc => {
                const pplayer = doc.player ? doc.player : null; 
                return pplayer === idP;
            });
    
            res.json(filteredDocuments); 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return res.status(404).json({ message: 'PlayerMatchStats not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async getById(req, res) {
            const idPMS = req.params.idPMS; 
            try {
                const data = await ModelPlayerMatchStats.getById({ id: idPMS }); 
                res.json(data); 
            } catch (error) {
                if (error.message === 'PlayerMatchStats not found') {
                    return res.status(404).json({ message: 'PlayerMatchStats not found' }); 
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
    
            // PlayerMatchStats exists?
            let idPMS = req.params.idPMS;
            let prevPlayerMatchStats;
            try {
                prevPlayerMatchStats = await ModelPlayerMatchStats.getById({ id: idPMS });
            } catch (error) {
                if (error.message === 'PlayerMatchStats not found') {
                    return res.status(404).json({ message: 'PlayerMatchStats not found' }); 
                }
                return res.status(500).json({ message: 'Error obtaining PlayerMatchStats' }); 
            }
            if (!prevPlayerMatchStats) {
                return res.status(404).json({ message: 'PlayerMatchStats not found' });
            }
    
            const newPlayerMatchStats = {
                timePlayed: req.body.timePlayed ?? prevPlayerMatchStats.timePlayed,
                goals: req.body.goals ?? prevPlayerMatchStats.goals,
                assists: req.body.assists ?? prevPlayerMatchStats.assists,
                yellowCards: req.body.yellowCards ?? prevPlayerMatchStats.yellowCards,
                redCards: req.body.redCards ?? prevPlayerMatchStats.redCards,
                shots: req.body.shots ?? prevPlayerMatchStats.shots,
                shotsOnTarget: req.body.shotsOnTarget ?? prevPlayerMatchStats.shotsOnTarget
            };
        
            // Update PlayerMatchStats
            try {
                const res_update = await ModelPlayerMatchStats.update({ id: idPMS }, newPlayerMatchStats);
                if (!res_update) {
                    return res.status(400).json({ message: 'PlayerMatchStats update error' });
                }
                return res.status(200).json(newPlayerMatchStats);
            } catch (error) {
                return res.status(500).json({ message: 'Error updating playerMatchStats' });
            }
        }

        static async getAllByMatch(req, res) {
            const idM = req.params.idM;
    
            try {
                const documents = await ModelPlayerMatchStats.getAll();
                
                const filteredDocuments = documents.filter(doc => {
                    const match = doc.match ? doc.match : null; 
                    return match === idM;
                });
        
                res.json(filteredDocuments); 
            } catch (error) {
                if (error.message === 'No existe el documento') {
                    return res.status(404).json({ message: 'PlayerMatchStats not found' }); 
                }
                return res.status(500).json({ message: 'Internal server error' }); 
            }
        }


        static async updatePlayerStats(id, playerData) {
            try {
                // Verificamos si las estadísticas del jugador existen
                let playerMatchStats;
                try {
                    playerMatchStats = await ModelPlayerMatchStats.getById({ id });
                } catch (error) {
                    if (error.message === 'PlayerMatchStats not found') {
                        return res.status(404).json({ message: 'PlayerMatchStats not found' }); 
                    }
                    return res.status(500).json({ message: 'Error obtaining PlayerMatchStats' }); 
                }
                if (!playerMatchStats) {
                    return res.status(404).json({ message: 'PlayerMatchStats not found' });
                }
        
                const updatedStats = {
                    timePlayed: playerData.timePlayed ?? playerMatchStats.timePlayed,
                    goals: playerData.goals ?? playerMatchStats.goals,
                    assists: playerData.assists ?? playerMatchStats.assists,
                    yellowCards: playerData.yellowCards ?? playerMatchStats.yellowCards,
                    redCards: playerData.redCards ?? playerMatchStats.redCards,
                    shots: playerData.shots ?? playerMatchStats.shots,
                    shotsOnTarget: playerData.shotsOnTarget ?? playerMatchStats.shotsOnTarget
                };

                // Update PlayerMatchStats
                try {
                    const updateResult = await ModelPlayerMatchStats.update({ id}, updatedStats);
                    if (!updateResult) {
                        return res.status(400).json({ message: 'PlayerMatchStats update error' });
                    }
                } catch (error) {
                    return res.status(500).json({ message: 'Error updating playerMatchStats' });
                }

                //Update superclass
                await CtrlPlayerStats.updatePlayerStatsSuperclass(playerMatchStats.player, updatedStats);
                
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' }); 
            }
        }
} 

export default CtrlPlayerMatchStats;