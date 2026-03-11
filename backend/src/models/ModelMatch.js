import DatabaseClass from '../database/DatabaseClass.js';
import { ModelPlayerMatchStats } from '../models/ModelPlayerMatchStats.js';
import { readJSON } from '../utils.js'

export class ModelMatch {
     
    /**
     * Obtain all the matches.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of match objects.     
     */
     static getAll (){
        return new DatabaseClass().obtainDataCollection('Match')
    }

    
    /**
     * Obtain a match by its id.
     * @static @async
     * @param {string} param0.id - id of the match.
     * @returns {Promise<Object|boolean>} - Return the match if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const match = await new DatabaseClass().obtainData('Match', id);
            return match; 
        } catch (error) {
            console.error("Error obtaining match:", error.message);
            if (error.message === 'No existe el documento') {
                return null;
            }
            throw error; 
        }
    }

    /**
     * Checks if a match exists by their id.
     * @static @async
     * @param {string} param0.id - Id of the match.
     * @returns {Promise<boolean>} - Returns `true` if the match exists, or `false` if not.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async exists({ id }){
        try {
            await new DatabaseClass().obtainData('Match', id);
            return true; 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return false; 
            }
            console.error("Eror veryfiyng match existence", error);
            throw error; 
        }
    }

    /**
     * Creates a new match with the provided data.
     * @static @async
     * @param {Object} input - Object containing match data.
     * @param {string} input.uidsername - Id of the new match.
     * @param {Object} input - Additional data for the match.
     * @returns {Promise<Object>} - Returns the created match object.
     */
    static async create (id, input) {
        console.log("id: ", id);
        console.log("input: ", input);
        return new DatabaseClass().addNewData('Match', id, {...input})
    }

    /**
     * Updates the data of an existing match.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.id - Id of the match to update.
     * @param {Object} updatedData - Object containing the updated match data.
     * @returns {Promise<Object>} - Returns the updated match object.
     */
    static async update (id , updatedData){
        console.log("id: ", id);
        console.log("updatedData: ", updatedData);
        return new DatabaseClass().updateData('Match', id, updatedData)        
    }

    /**
     * Deletes a match by their id.
     * @static @async
     * @param {string} param0.id - Id of the match to delete.
     * @returns {Promise<void>} - Returns nothing if the match is deleted successfully.
     */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('Match', id)
    }

    /**
     * Deletes a match by their id. Also deletes their playerMatchStats associated.
     * @static @async
     * @param {string} param0.id - Id of the match to delete.
     * @returns {Promise<void>} - Returns nothing if the match is deleted successfully.
     */
    static async deleteWaterfall({id}) {
        //Delete playerMatchStats from the match calledups
        try {
            const playerMatchStatsToDelete = await new DatabaseClass().obtainDataCollectionByField('PlayerMatchStats', 'match', id);
            for (const playerMatchStats of playerMatchStatsToDelete) {                
                try {
                    await ModelPlayerMatchStats.delete({ id: playerMatchStats.id });
                } catch (error) {
                    console.error("Error deleting playerMatchStats:", error);
                }
            }
            
            //Delete match
            try {
                return await ModelMatch.delete({ id: id });
            } catch (error) {
                console.error("Error deleting match:", error);
            }
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }

    /**
     * Deletes a match by their user associated. Also deletes their playerMatchStats associated.
     * @static @async
     * @param {string} param0.username - Id of the user associated to the match.
     * @returns {Promise<void>} - Returns nothing if the match is deleted successfully.
     */
    static async deleteByUser(username) {
        try {
            const matchesSnapshot = await new DatabaseClass().obtainDataCollection('Match');
    
            for (const doc of matchesSnapshot) {
                const match = doc;
                console.log("match: " + JSON.stringify(match, null, 2));
    
                if ((match.myTeam).split("_").pop() === username) {
                    // Delete playerMatchStats from the calledups
                    try {
                        if (Array.isArray(match.calledups)) {
                            for (const calledup of match.calledups) {
                                const playerMatchStatsId = `${match.id}_${calledup}`;
                                try {
                                    await ModelPlayerMatchStats.delete({ id: playerMatchStatsId });
                                } catch (error) {
                                    console.error(`Error deleting PlayerMatchStats with ID ${playerMatchStatsId}:`, error);
                                }
                            }
                        }
                        // Delete match 
                        await ModelMatch.delete({ id: match.id });
                    } catch (error) {
                        console.error("Error deleting match data:", error);
                    }
                }
            }
        } catch (error) {
            throw new Error('Error deleting matches and associated PlayerMatchStats');
        }
    }

    /**
     * Deletes a match by their team associated. Also deletes their playerMatchStats associated.
     * @static @async
     * @param {string} param0.id - Id of the match associated to the match.
     * @returns {Promise<void>} - Returns nothing if the match is deleted successfully.
     */
    static async deleteByTeam(id) {
        try {
            const matchesSnapshot = await new DatabaseClass().obtainDataCollection('Match');
            console.log("Datos obtenidos:", JSON.stringify(matchesSnapshot, null, 2));
            
            for (const doc of matchesSnapshot) {
                const match = doc;
                console.log("match: " + JSON.stringify(match, null, 2));
                
                if (match.myTeam === id) {
                    // Delete all playerMatchStats from match
                    const playerMatchStatsToDelete = await new DatabaseClass().obtainDataCollectionByField('PlayerMatchStats', 'match', match.id);                    
                    console.log("playerMatchStatsSnapshot: ", JSON.stringify(playerMatchStatsToDelete, null, 2));
                    for (const playerMatchStats of playerMatchStatsToDelete) {
                        try {
                            await ModelPlayerMatchStats.delete({ id: playerMatchStats.id });
                        } catch (error) {
                            console.error("Error deleting playerMatchStats:", error);
                        }
                    }
                    //Delete match
                    try {
                        await ModelMatch.delete({id: match.id});
                    } catch (error) {
                        console.error("Error deleting data:", error);
                    }
                } 
            }
        } catch (error) {
            throw new Error('Error deleting matches from the user');
        }           
    }

}

