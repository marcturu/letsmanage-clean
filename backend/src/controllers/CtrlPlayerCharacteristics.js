import { ModelTeam } from '../models/ModelTeam.js'
import { ModelPlayer } from '../models/ModelPlayer.js'
import { ModelPlayerCharacteristics } from '../models/ModelPlayerCharacteristics.js'
import { validatePlayerCharacteristics } from '../schemas/SchemaPlayerCharacteristics.js'


export class CtrlPlayerCharacteristics {
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

        // Get PlayerCharacteristics by Player
        try {
            const data = await ModelPlayerCharacteristics.getByPlayer(idP);
            if (data) {
                res.json(data); 
            } else {
                return res.status(404).json({ message: 'PlayerCharacteristics not found' });
            }
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return res.status(404).json({ message: 'PlayerCharacteristics not found' }); 
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

        // PlayerCharacteristics exists?
        let idPC = `${idP}_PlayerCharacteristics`;
        let prevPlayerCharacteristics;
        try {
            prevPlayerCharacteristics = await ModelPlayerCharacteristics.getById({ id: idPC });
        } catch (error) {
            if (error.message === 'PlayerCharacteristics not found') {
                return res.status(404).json({ message: 'PlayerCharacteristics not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining playerCharacteristics' }); 
        }
        if (!prevPlayerCharacteristics) {
            return res.status(404).json({ message: 'PlayerCharacteristics not found' });
        }

        const newPlayerCharacteristics = {
            position1: req.body.position1 ?? prevPlayerCharacteristics.position1,
            position2: req.body.position2 ?? prevPlayerCharacteristics.position2,
            dominantFoot: req.body.dominantFoot ?? prevPlayerCharacteristics.dominantFoot,
            avgTechnicalLevel: req.body.avgTechnicalLevel ?? prevPlayerCharacteristics.avgTechnicalLevel,
            avgTacticalLevel: req.body.avgTacticalLevel ?? prevPlayerCharacteristics.avgTacticalLevel,
            avgFatigue: req.body.avgFatigue ?? prevPlayerCharacteristics.avgFatigue,
            avgHeartRate: req.body.avgHeartRate ?? prevPlayerCharacteristics.avgHeartRate,
            personalLifeLevel: req.body.personalLifeLevel ?? prevPlayerCharacteristics.personalLifeLevel,
            drugUseLevel: req.body.drugUseLevel ?? prevPlayerCharacteristics.drugUseLevel,
            allergies: req.body.allergies ?? prevPlayerCharacteristics.allergies
        };
        
        
        // Format validation
        const result = validatePlayerCharacteristics(req.body); 
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 
    
        // Update PlayerCharacteristics
        try {
            const res_update = await ModelPlayerCharacteristics.update({ id: idPC }, newPlayerCharacteristics);
            if (!res_update) {
                return res.status(400).json({ message: 'PlayerCharacteristics update error' });
            }
            return res.status(200).json(newPlayerCharacteristics);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating playerCharacteristics' });
        }
    }
} 