import DatabaseClass from '../database/DatabaseClass.js';
import { readJSON } from '../utils.js'

export class ModelPlayer {
     
    /**
     * Obtain all the players.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of player objects.     
     */
     static getAll (){
        return new DatabaseClass().obtainDataCollection('Player')
    }

    
    /**
     * Obtain a player by its id.
     * @static @async
     * @param {string} param0.id - id of the player.
     * @returns {Promise<Object|boolean>} - Return the player if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const player = await new DatabaseClass().obtainData('Player', id);
            return player; 
        } catch (error) {
            console.error("Error obtaining player:", error.message);
            if (error.message === 'No existe el documento') {
                //return null;
            }
            throw error; 
        }
    }

    /**
     * Obtain players by their team.
     * @static @async
     * @param {string} param0.idT - id of the team.
     * @returns {Promise<Array<Object>>} - Returns an array of player objects.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getByTeam({ idT }) {
        try {
            const playersSnapshot = await new DatabaseClass().obtainDataCollectionByField('Player', 'team', idT);
            return playersSnapshot;
        } catch (error) {
            throw new Error('Error obtaining players from the team');
        }
    }

    /**
     * Checks if a player exists by their id.
     * @static @async
     * @param {string} param0.id - id of the player.
     * @returns {Promise<boolean>} - Returns `true` if the player exists, or `false` if not.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async exists({ id }){
        try {
            await new DatabaseClass().obtainData('Player', id);
            return true; 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return false; 
            }
            console.error("Eror veryfiyng player existence", error);
            throw error; 
        }
    }

    /**
     * Creates a new player with the provided data.
     * @static @async
     * @param {Object} input - Object containing player data.
     * @param {string} input.id - id of the new player.
     * @param {Object} input - Additional data for the player.
     * @returns {Promise<Object>} - Returns the created player object.
     */
    static async create (id, input) {
        return new DatabaseClass().addNewData('Player', id, {...input})
    }

    /**
     * Updates the data of an existing player.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.id - id of the player to update.
     * @param {Object} updatedData - Object containing the updated player data.
     * @returns {Promise<Object>} - Returns the updated player object.
     */
    static async update ( { id}, updatedData){
        return new DatabaseClass().updateData('Player', id, updatedData)        
    }

    /**
     * Deletes a player by their id.
     * @static @async
     * @param {string} param0.id - id of the player to delete.
     * @returns {Promise<void>} - Returns nothing if the player is deleted successfully.
     */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('Player', id)
    }

}

