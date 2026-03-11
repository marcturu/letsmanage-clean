import DatabaseClass from '../database/DatabaseClass.js';
import { readJSON } from '../utils.js'

export class ModelPlayerStats {

    /**
         * Obtain a playerStats by its id.
         * @static @async
         * @param {string} param0.id - id of the playerStats.
         * @returns {Promise<Object|boolean>} - Return the playerStats if found; `false` if it does not exist.
         * @throws {Error} - Throws an error if there is a problem founding the data.
         */
    static async getById({ id }){
        try {
            const playerStats = await new DatabaseClass().obtainData('PlayerStats', id);
            return playerStats; 
        } catch (error) {
            console.error("Error obtaining playerStats:", error.message);
            if (error.message === 'No existe el documento') {
                return null;
            }
            throw error; 
        }
    }

    /**
     * Obtain a playerStats by its Player associated.
     * @static @async
     * @param {string} param0.idP - id of the Player associated.
     * @returns {Promise<Object|boolean>} - Return the playerStats if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getByPlayer(idP) {
        try {
            const playersStatsSnapshot = await new DatabaseClass().obtainDataCollection('PlayerStats');
    
            for (const doc of playersStatsSnapshot) {
                if (doc.player === idP) {
                    return doc
                }
            }
            return false;
        } catch (error) {
            console.error("Error en el bloque try principal:", error);
            throw new Error('Error obtaining playersStats from the player');
        }
    }

    /**
     * Creates a new playerStats with the provided data.
     * @static @async
     * @param {Object} input - Object containing playerStats data.
     * @param {string} input.id - id of the new playerStats.
     * @param {Object} input - Additional data for the playerStats.
     * @returns {Promise<Object>} - Returns the created playerStats object.
     */
    static async create (id, input) {
        return new DatabaseClass().addNewData('PlayerStats', id, {...input})
    }

    /**
     * Updates the data of an existing playerStats.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.id - id of the playerStats to update.
     * @param {Object} updatedData - Object containing the updated playerStats data.
     * @returns {Promise<Object>} - Returns the updated playerStats object.
     */
    static async update ( {id}, updatedData){
        return new DatabaseClass().updateData('PlayerStats', id, updatedData)        
    }

    /**
    * Deletes a playerstats by their id.
    * @static @async
    * @param {string} param0.id - id of the playerstats to delete.
    * @returns {Promise<void>} - Returns nothing if the playersttas is deleted successfully.
    */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('PlayerStats', id)
    }
}