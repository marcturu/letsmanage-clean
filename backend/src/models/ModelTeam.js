import DatabaseClass from '../database/DatabaseClass.js';
import { ModelPlayer } from '../models/ModelPlayer.js'
import { ModelPlayerCharacteristics } from '../models/ModelPlayerCharacteristics.js'
import { ModelPlayerStats } from '../models/ModelPlayerStats.js'
import { readJSON } from '../utils.js'

export class ModelTeam {
     
    /**
     * Obtain all the teams form the User.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of team objects.     
     */
     static getAll ({id}){
        return new DatabaseClass().obtainDataCollectionByField('Team', 'coach', id);
    }

    /**
     * Obtain all the teams.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of team objects.     
     */
    static getAll2 (){
        return new DatabaseClass().obtainDataCollection('Team')
    }
    
    /**
     * Obtain a team by its id.
     * @static @async
     * @param {string} param0.username - Id of the team.
     * @returns {Promise<Object|boolean>} - Return the team if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const team = await new DatabaseClass().obtainData('Team', id);
            return team; 
        } catch (error) {
            console.error("Error obtaining team:", error.message);
            if (error.message === 'No existe el documento') {
                return false;
            }
            throw error; 
        }
    }

    /**
     * Checks if a team exists by their id.
     * @static @async
     * @param {string} param0.username - Id of the team.
     * @returns {Promise<boolean>} - Returns `true` if the team exists, or `false` if not.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async exists({ id }){
        try {
            await new DatabaseClass().obtainData('Team', id);
            return true; 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return false; 
            }
            console.error("Eror veryfiyng team existence", error);
            throw error; 
        }
    }

    /**
     * Creates a new team with the provided data.
     * @static @async
     * @param {Object} input - Object containing team data.
     * @param {string} input.username - Id of the new team.
     * @param {Object} input - Additional data for the team.
     * @returns {Promise<Object>} - Returns the created user object.
     */
    static async create (id, input) {
        return new DatabaseClass().addNewData('Team', id, {...input})
    }

    /**
     * Updates the data of an existing team.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.username - Id of the team to update.
     * @param {Object} updatedData - Object containing the updated team data.
     * @returns {Promise<Object>} - Returns the updated team object.
     */
    static async update ( { id}, updatedData){
        return new DatabaseClass().updateData('Team', id, updatedData)        
    }

    /**
     * Deletes a team by their id.
     * @static @async
     * @param {string} param0.username - Id of the team to delete.
     * @returns {Promise<void>} - Returns nothing if the team is deleted successfully.
     */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('Team', id)
    }

    static async deleteWaterfall({id}) {
        try {
            const playersSnapshot = await new DatabaseClass().obtainDataCollection('Player');
            console.log("playersSnapshot: ", JSON.stringify(playersSnapshot, null, 2));
        
            const playersToDelete = playersSnapshot.filter(player => String(player.team).trim() === String(id).trim());
            console.log("playersToDelete: ", JSON.stringify(playersToDelete, null, 2));
            //Delete players from the team & their playerCharacteristics & playerStats
            for (const player of playersToDelete) {

                try {
                    const playerCharacteristicsId = `${player.id}_PlayerCharacteristics`;
                    console.log("playerCharacteristicsId: " + playerCharacteristicsId);
                    await ModelPlayerCharacteristics.delete({ id: playerCharacteristicsId });
                } catch (error) {
                    console.error("Error deleting player characteristics:", error);
                }
        
                try {
                    const playerStatsId = `${player.id}_PlayerStats`;
                    await ModelPlayerStats.delete({ id: playerStatsId });
                } catch (error) {
                    console.error("Error deleting player stats:", error);
                }

                try {
                    await ModelPlayer.delete({ id: player.id });
                } catch (error) {
                    console.error("Error deleting player:", error);
                }
    
            }

            //Delete team
            try {
                return await ModelTeam.delete({ id: id });
            } catch (error) {
                console.error("Error deleting team:", error);
            }
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }

    static async deleteRivalsByTeam(id, league) {
            let creatorToCompare = id.split('_').pop();
            const rivalTeamsToDelete = await new DatabaseClass().obtainDataCollectionByField('Team', 'creator', creatorToCompare);                    
            console.log("rivalTeamsToDelete: ", JSON.stringify(rivalTeamsToDelete, null, 2));
            try {
                
                for (const doc of rivalTeamsToDelete) {
                    const rivalTeam = doc;
                    console.log("rivalTeam: " + JSON.stringify(rivalTeam, null, 2));
                    
                    if ((!rivalTeam.coach || rivalTeam.coach === "" || rivalTeam.coach === null) && league === rivalTeam.league) {
                        // Delete rivalTeam
                        try {
                            await ModelTeam.delete({ id: rivalTeam.id });
                        } catch (error) {
                            console.error("Error deleting rivalTeam:", error);
                        }
                    } 
                }
            } catch (error) {
                console.error("Error en el bloque try principal:", error);
                throw new Error('Error deleting matches from the user');
            }       
        }

    static async deleteByUser(username) {
        try {
            const teamsSnapshot = await new DatabaseClass().obtainDataCollection('Team');
            console.log("Datos obtenidos:", JSON.stringify(teamsSnapshot, null, 2));
            
            for (const doc of teamsSnapshot) {
                const team = doc;
                console.log("team: " + JSON.stringify(team, null, 2));
                
                if (team.creator === username) {
                    //Delete players from the team & their playerCharacteristics & playerStats
                    try {
                        const playersSnapshot = await new DatabaseClass().obtainDataCollection('Player');
                        console.log("playersSnapshot: ", JSON.stringify(playersSnapshot, null, 2));
                    
                        const playersToDelete = playersSnapshot.filter(player => String(player.team).trim() === String(team.id).trim());
                        console.log("playersToDelete: ", JSON.stringify(playersToDelete, null, 2));
                        for (const player of playersToDelete) {
                    
                            try {
                                const playerCharacteristicsId = `${player.id}_PlayerCharacteristics`;
                                console.log("playerCharacteristicsId: " + playerCharacteristicsId);
                                await ModelPlayerCharacteristics.delete({ id: playerCharacteristicsId });
                            } catch (error) {
                                console.error("Error deleting player characteristics:", error);
                            }
                    
                            try {
                                const playerStatsId = `${player.id}_PlayerStats`;
                                await ModelPlayerStats.delete({ id: playerStatsId });
                            } catch (error) {
                                console.error("Error deleting player stats:", error);
                            }
                    
                            try {
                                await ModelPlayer.delete({ id: player.id });
                            } catch (error) {
                                console.error("Error deleting player:", error);
                            }
                        }
                        
                        //Delete team
                        await ModelTeam.delete({ id: team.id });
                    } catch (error) {
                        console.error("Error deleting data:", error);
                    }
                } 
            }
        } catch (error) {
            console.error("Error en el bloque try principal:", error);
            throw new Error('Error deleting teams and their players from the user');
        }
    }

    /**
     * Deletes a team by their id.
     * @static @async
     * @param {string} param0.username - Id of the team to delete.
     * @returns {Promise<void>} - Returns nothing if the team is deleted successfully.
     */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('Team', id)
    }
    

}

