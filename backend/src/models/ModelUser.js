import DatabaseClass from '../database/DatabaseClass.js';

export class ModelUser {
     
    /**
     * Obtain all the users.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of user objects.     
     */
     static getAll (){
        return new DatabaseClass().obtainDataCollection('User')
    }

    
    /**
     * Obtain a user by its username.
     * @static @async
     * @param {string} param0.username - Username of the user.
     * @returns {Promise<Object|boolean>} - Return the user if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ username }){
        try {
            const user = await new DatabaseClass().obtainData('User', username);
            return user; 
        } catch (error) {
            console.error("Error obtaining user:", error.message);
            if (error.message === 'No existe el documento') {
                return null;
            }
            throw error; 
        }
    }

    /**
     * Checks if a user exists by their username.
     * @static @async
     * @param {string} param0.username - Username of the user.
     * @returns {Promise<boolean>} - Returns `true` if the user exists, or `false` if not.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async exists({ username }){
        try {
            await new DatabaseClass().obtainData('User', username);
            return true; 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return false; 
            }
            console.error("Eror veryfiyng user existence", error);
            throw error; 
        }
    }

    /**
     * Creates a new user with the provided data.
     * @static @async
     * @param {Object} input - Object containing user data.
     * @param {string} input.username - Username of the new user.
     * @param {Object} input - Additional data for the user.
     * @returns {Promise<Object>} - Returns the created user object.
     */
    static async create (input) {
        return new DatabaseClass().addNewData('User', input.username, {...input})
    }

    /**
     * Updates the data of an existing user.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.username - Username of the user to update.
     * @param {Object} updatedData - Object containing the updated user data.
     * @returns {Promise<Object>} - Returns the updated user object.
     */
    static async update ( { username}, updatedData){
        return new DatabaseClass().updateData('User', username, updatedData)        
    }

    /**
     * Deletes a user by their username.
     * @static @async
     * @param {string} param0.username - Username of the user to delete.
     * @returns {Promise<void>} - Returns nothing if the user is deleted successfully.
     */
    static async delete ({ username }){
        return new DatabaseClass().deleteData('User', username)
    }

}

