import DatabaseClass from '../database/DatabaseClass.js';

export class ModelTraining {
     
    /**
     * Obtain all the trainings from the user.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of training objects.     
     */
     static getAll ({username}){
        return new DatabaseClass().obtainDataCollectionByField('Training', 'coach', username);
    }

    /**
         * Obtain all the trainings.
         * @static
         * @returns {Promise<Array<Object>>} - Returns an array of team objects.     
         */
        static getAll2 (){
            return new DatabaseClass().obtainDataCollection('Training')
        }

    
    /**
     * Obtain a training by its id.
     * @static @async
     * @param {string} param0.id - id of the training.
     * @returns {Promise<Object|boolean>} - Return the training if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const training = await new DatabaseClass().obtainData('Training', id);
            return training; 
        } catch (error) {
            console.error("Error obtaining training:", error.message);
            if (error.message === 'No existe el documento') {
                return null;
            }
            throw error; 
        }
    }

    /**
     * Checks if a training exists by their id.
     * @static @async
     * @param {string} param0.id - Id of the training.
     * @returns {Promise<boolean>} - Returns `true` if the training exists, or `false` if not.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async exists({ id }){
        try {
            await new DatabaseClass().obtainData('Training', id);
            return true; 
        } catch (error) {
            if (error.message === 'No existe el documento') {
                return false; 
            }
            console.error("Eror veryfiyng training existence", error);
            throw error; 
        }
    }

    /**
     * Creates a new training with the provided data.
     * @static @async
     * @param {Object} input - Object containing training data.
     * @param {string} input.uidsername - Id of the new training.
     * @param {Object} input - Additional data for the training.
     * @returns {Promise<Object>} - Returns the created training object.
     */
    static async create (id, input) {
        return new DatabaseClass().addNewData('Training', id, {...input})
    }

    /**
     * Updates the data of an existing training.
     * @static @async
     * @param {Object} param0 - Object containing the parameters for the update.
     * @param {string} param0.id - Id of the training to update.
     * @param {Object} updatedData - Object containing the updated training data.
     * @returns {Promise<Object>} - Returns the updated training object.
     */
    static async update ( { id }, updatedData){
        return new DatabaseClass().updateData('Training', id, updatedData)        
    }

    /**
     * Deletes a training by their id.
     * @static @async
     * @param {string} param0.id - Id of the training to delete.
     * @returns {Promise<void>} - Returns nothing if the training is deleted successfully.
     */
    static async delete ({ id }){
        return new DatabaseClass().deleteData('Training', id)
    }

    static async deleteByUser(username) {
            try {
                const trainingsSnapshot = await new DatabaseClass().obtainDataCollection('Training');
                console.log("Datos obtenidos:", JSON.stringify(trainingsSnapshot, null, 2));
                
                for (const doc of trainingsSnapshot) {
                    const training = doc;
                    console.log("training: " + JSON.stringify(training, null, 2));
                    
                    if (training.coach === username) {
                        try {
                            await ModelTraining.delete({id: training.id});
                        } catch (error) {
                            console.error("Error deleting data:", error);
                        }
                    } 
                }
            } catch (error) {
                console.error("Error en el bloque try principal:", error);
                throw new Error('Error deleting trainings from the user');
            }
        }

        static async deleteByTeam(id) {
            try {
                const trainingsSnapshot = await new DatabaseClass().obtainDataCollection('Training');
                console.log("Datos obtenidos:", JSON.stringify(trainingsSnapshot, null, 2));
                
                for (const doc of trainingsSnapshot) {
                    const training = doc;
                    console.log("training: " + JSON.stringify(training, null, 2));
                    
                    if (training.team === id) {
                        try {
                            await ModelTraining.delete({id: training.id});
                        } catch (error) {
                            console.error("Error deleting data:", error);
                        }
                    } 
                }
            } catch (error) {
                console.error("Error en el bloque try principal:", error);
                throw new Error('Error deleting trainings from the user');
            }
        }

}

