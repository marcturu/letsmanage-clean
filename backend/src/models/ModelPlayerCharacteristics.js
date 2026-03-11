import DatabaseClass from '../database/DatabaseClass.js';
import { readJSON } from '../utils.js'

export class ModelPlayerCharacteristics {

    /**
     * Obtain a playerCharacteristics by its id.
     * @static @async
     * @param {string} param0.id - id of the playerCharacteristics.
     * @returns {Promise<Object|boolean>} - Return the playerCharacteristics if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const playerCharacteristics = await new DatabaseClass().obtainData('PlayerCharacteristics', id);
            return playerCharacteristics; 
        } catch (error) {
            console.error("Error obtaining playerChaarcteristics:", error.message);
            if (error.message === 'No existe el documento') {
                //return null;
            }
            throw error; 
        }
    }
    
    /**
     * Obtain a playerCharacteristics by its Player associated.
     * @static @async
     * @param {string} param0.idP - id of the Player associated.
     * @returns {Promise<Object|boolean>} - Return the playerCharacteristics if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getByPlayer(idP) {
        try {
            const playersCharacteristicsSnapshot = await new DatabaseClass().obtainDataCollection('PlayerCharacteristics');
    
            for (const doc of playersCharacteristicsSnapshot) {
                if (doc.player === idP) {
                    return doc
                }
            }
            return false;
        } catch (error) {
            throw new Error('Error obtaining playersCharacteristics from the player');
        }
    }

    /**
     * Creates a new playerCharacteristics with the provided data.
     * @static @async
     * @param {Object} input - Object containing playerCharacteristics data.
     * @param {string} input.id - id of the new playerCharacteristics.
     * @param {Object} input - Additional data for the playerCharacteristics.
     * @returns {Promise<Object>} - Returns the created playerCharacteristics object.
     */
    static async create (id, input) {
        return new DatabaseClass().addNewData('PlayerCharacteristics', id, {...input})
    }

    /**
     * Updates the data of an existing playerCharacteristics.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.id - id of the playerCharacteristics to update.
     * @param {Object} updatedData - Object containing the updated playerCharacteristics data.
     * @returns {Promise<Object>} - Returns the updated playerCharacteristics object.
     */
    static async update ( {id}, updatedData){
        return new DatabaseClass().updateData('PlayerCharacteristics', id, updatedData)        
    }

    /**
    * Deletes a playercharateristics by their id.
    * @static @async
    * @param {string} param0.id - id of the playercharacteristics to delete.
    * @returns {Promise<void>} - Returns nothing if the playercharacteristics is deleted successfully.
    */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('PlayerCharacteristics', id)
    }
}