import { ModelPlayer } from '../models/ModelPlayer.js'
import { ModelTeam } from '../models/ModelTeam.js'
import { ModelPlayerCharacteristics } from '../models/ModelPlayerCharacteristics.js'
import { ModelPlayerStats } from '../models/ModelPlayerStats.js'
import { validatePlayer } from '../schemas/SchemaPlayer.js'

export class CtrlPlayer {

    static async getById(req, res) {
        let id = req.params.idT;

        // Player exists?
        const idP = req.params.idP; 
        try {
            const data = await ModelPlayer.getById({ id: idP });
            //Player's team is = to the one in params?
            if (data.team == id) {
                res.json(data); 
            } 
            else {
                return res.status(404).json({ message: 'Player is not part of the team' + id }); 
            }
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return res.status(404).json({ message: 'Player not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async create(req, res) {

        const { name, surname, surname2, height, weight, phone, mail, DNI, birthdate, nationality, number, photo} = req.body;
        let playerPhoto;
        if (photo) {
            playerPhoto = photo; 
        } else {
            playerPhoto = "/assets/voidPFP.png"; 
        }

        const team = req.params.idT;
    
        //Team exists?
        const teamExists = await ModelTeam.exists({ id: team });
        if (!teamExists) {
            return res.status(404).json({ message: 'Team where the player want to play does not exist' });
        }

        //Player exists?
        const id = `${name.toLowerCase()}_${surname.toLowerCase()}_${surname2.toLowerCase()}`;
        const playerExists = await ModelPlayer.exists({ id });
        if (playerExists) {
            return res.status(409).json({ message: 'Player already exists' });
        }
    
        const playerData = {
            name,
            surname,
            surname2,
            height,
            weight,
            phone,
            mail,
            DNI,
            birthdate,
            nationality,
            number,
            team, 
            photo: playerPhoto 
        };
    
        // Create Player
        try {
            const res_creation = await ModelPlayer.create(id, playerData);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating player' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error creating player' });
        }

        // Create PlayerCharacteristics with default values
        const idPC = `${id}_PlayerCharacteristics`;
        const playerCharacteristicsData = {
            position1: "",              
            position2: "",               
            dominantFoot: "",            
            avgTechnicalLevel: 0.0,      
            avgTacticalLevel: 0.0,        
            avgFatigue: 0.0,             
            avgHeartRate: 0,             
            personalLifeLevel: 0,        
            drugUseLevel: 0,             
            allergies: [], 
            player: id               
        };
        try {
            const res_creation = await ModelPlayerCharacteristics.create(idPC, playerCharacteristicsData);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating playerCharacteristics' });
            }
    
        } catch (error) {
            return res.status(500).json({ message: 'Error creating playerCharacteristics' });
        }

        // Create PlayerStats with default values
        const idPS = `${id}_PlayerStats`;
        const playerStatsData = {
            timePlayed: 0,              
            goals: 0,               
            assists: 0,            
            yellowCards: 0,      
            redCards: 0,        
            shots: 0,             
            shotsOnTarget: 0,
            player: id               
        };
        try {
            const res_creation = await ModelPlayerStats.create(idPS, playerStatsData);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating playerStats' });
            }
    
        } catch (error) {
            return res.status(500).json({ message: 'Error creating playerStats' });
        }

        // Retruns the Player
        return res.status(201).json(playerData); 
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

        const { height, weight, phone, mail, DNI, birthdate, nationality, number, photo} = req.body;
        
        const newPlayer = {
            name: prevPlayer.name,
            surname: prevPlayer.surname,
            surname2: prevPlayer.surname2,
            height: Number(height) ?? prevPlayer.height,
            weight: Number(weight) ?? prevPlayer.weight,
            phone: phone ?? prevPlayer.phone,
            mail: mail ?? prevPlayer.mail,
            DNI: DNI ?? prevPlayer.DNI,
            birthdate: birthdate ?? prevPlayer.birthdate,
            nationality: nationality ?? prevPlayer.nationality,
            number: Number(number) ?? prevPlayer.number,
            photo: photo ?? prevPlayer.photo,
            team: prevPlayer.team
        };
    
        // Format validation
        const result = validatePlayer(newPlayer, false); 
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        } 
    
        // Update Player
        try {
            const res_update = await ModelPlayer.update({ id: idP }, newPlayer);
            if (!res_update) {
                return res.status(400).json({ message: 'Player update error' });
            }
            return res.status(200).json(newPlayer);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating player' });
        }
    }
    

    static async delete (req, res){

        // Player exists?
        let idP = req.params.idP;
        let player
        try {
            player = await ModelPlayer.getById({ id: idP });
        } catch (error) {
            if( error.message === 'No existe el documento' )
                return res.status(404).json({ message: 'Player not found'})
        }

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        //Delete playerCharacteristics
        try {
            const playerCharacteristicsId = `${idP}_PlayerCharacteristics`;
            await ModelPlayerCharacteristics.delete({ id: playerCharacteristicsId });
        } catch (error) {
            console.error("Error deleting player characteristics:", error);
        }

        //Delete playerStats
        try {
            const playerStatsId = `${idP}_PlayerStats`;
            await ModelPlayerStats.delete({ id: playerStatsId });
        } catch (error) {
            console.error("Error deleting player stats:", error);
        }
                  
        // Delete Player
        const res_delete = await ModelPlayer.delete({ id: idP });
        if (!res_delete){
            return res.status(400).json({message: 'Player deletion error'})
        }

        return res.json({ message: 'Player ' + idP +' deleted' })
    }

    static async getByTeam (req, res){
        const team = req.params.idT;
    
        // Team exists?
        if (! ModelTeam.exists({id: team})) {
            return res.status(404).json({ error: "Team not found"});
        }
    
        try {
            const players = await ModelPlayer.getByTeam({idT: team});
            players.sort((a, b) => {
                return a.number - b.number;  
            });
            res.json(players);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
    

}