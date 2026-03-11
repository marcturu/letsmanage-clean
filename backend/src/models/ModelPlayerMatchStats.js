import DatabaseClass from '../database/DatabaseClass.js';
import { ModelPlayerStats } from '../models/ModelPlayerStats.js';

export class ModelPlayerMatchStats extends ModelPlayerStats {

        /**
         * Obtain all the playerMatchStats.
         * @static
         * @returns {Promise<Array<Object>>} - Returns an array of playerMatchStats objects.     
         */
         static getAll (){
            return new DatabaseClass().obtainDataCollection('PlayerMatchStats')
        }

        /**
        * Obtain a playerMatchStats by its id.
        * @static @async
        * @param {string} param0.id - id of the playerMatchStats.
        * @returns {Promise<Object|boolean>} - Return the playerMatchStats if found; `false` if it does not exist.
        * @throws {Error} - Throws an error if there is a problem founding the data.
        */
        static async getById({ id }){
            console.log("ID recibido en getById: ", id);
            try {
                const playerMatchStats = await new DatabaseClass().obtainData('PlayerMatchStats', id);
                return playerMatchStats; 
            } catch (error) {
                console.error("Error obtaining playerMatchStats:", error.message);
                if (error.message === 'No existe el documento') {
                    //return null;
                }
                throw error; 
            }
        }
    
        /**
         * Obtain all the playerMatchStats of a Player.
         * @static @async
         * @param {string} param0.idP - id of the Player associated.
         * @returns {Promise<Array<Object>>} - Returns an array of playerMatchStats objects.     
         */
        static async getAllByPlayer(idP) {
            try {
                const playerMatchStatsSnapshot = await new DatabaseClass().obtainDataCollection('PlayerMatchStats');
        
                for (const doc of playerMatchStatsSnapshot) {
                    if (doc.player === idP) {
                        return doc
                    }
                }
                return false;
            } catch (error) {
                throw new Error('Error obtaining playerMatchStats from the player');
            }
        }
    
        /**
         * Creates a new playerMatchStats with the provided data.
         * @static @async
         * @param {Object} input - Object containing playerMatchStats data.
         * @param {string} input.id - id of the new playerMatchStats.
         * @param {Object} input - Additional data for the playerMatchStats.
         * @returns {Promise<Object>} - Returns the created playerMatchStats object.
         */
        static async create (id, input) {
            return new DatabaseClass().addNewData('PlayerMatchStats', id, {...input})
        }
    
        /**
         * Updates the data of an existing playerMatchStats.
         * @static @async
         * @param {Object} param0 - Object containing the parameters for the update.
         * @param {string} param0.id - id of the playerMatchStats to update.
         * @param {Object} updatedData - Object containing the updated playerMatchStats data.
         * @returns {Promise<Object>} - Returns the updated playerMatchStats object.
         */
        static async update ( {id}, updatedData){
            return new DatabaseClass().updateData('PlayerMatchStats', id, updatedData)        
        }

        /**
        * Deletes a playermatchstats by their id.
        * @static @async
        * @param {string} param0.id - id of the playermatchstats to delete.
        * @returns {Promise<void>} - Returns nothing if the playermatchstats is deleted successfully.
        */
        static async delete ({ id }){
            return new DatabaseClass().deleteData('PlayerMatchStats', id)
        }

        /**
        * Deletes all the playerMatchStats associated with a Player.
        * @static @async
        * @param {string} param0.idP - id of the Player.
        * @returns {Promise<void>} - Returns nothing if the playermatchstats are deleted successfully.
        * @throws {Error} - Throws an error if there is a problem deleting the data.
        */
        static async deleteByPlayer ({ idP }){
            const playerMatchStatsToDelete = await new DatabaseClass().obtainDataCollectionByField('PlayerMatchStats', 'player', idP);  
                console.log("playerMatchStatsToDelete: ", JSON.stringify(playerMatchStatsToDelete, null, 2));
                try {
                    for (const doc of playerMatchStatsToDelete) {
                        const playerMatchStats = doc;
                        console.log("playerMatchStats: " + JSON.stringify(playerMatchStats, null, 2));
                        try {
                            await ModelPlayerMatchStats.delete({ id: playerMatchStats.id });
                        } catch (error) {
                            console.error("Error deleting playerMatchStats:", error);
                        }
                    } 
                }
                catch (error) {
                    throw new Error('Error deleting playerMatchStats from the user');
                }       
        }
}
