import DatabaseClass from '../database/DatabaseClass.js';
import { readJSON } from '../utils.js'

export class ModelClub{
     
    /**
     * Obtain all the clubs.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of club objects.     
     */
     static getAll (){
        return new DatabaseClass().obtainDataCollection('Club')
    }

    
    /**
     * Obtain a club by its id.
     * @static @async
     * @param {string} param0.id - id of the club.
     * @returns {Promise<Object|boolean>} - Return the club if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const club = await new DatabaseClass().obtainData('Club', id);
            return club; 
        } catch (error) {
            console.error("Error obtaining club:", error.message);
            if (error.message === 'No existe el documento') {
                return null;
            }
            throw error; 
        }
    }


    /**
     * Checks if a club exists by its id.
     * @static @async
     * @param {string} param0.username - Id of the club.
     * @returns {Promise<boolean>} - Returns `true` if the club exists, or `false` if not.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async exists({ id }){
        console.log("Club id: " + id);
        try {
            await new DatabaseClass().obtainData('Club', id);
            return true; 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return false; 
            }
            console.error("Eror veryfiyng club existence", error);
            throw error; 
        }
    }

}

