import DatabaseClass from '../database/DatabaseClass.js';
import { readJSON } from '../utils.js'

export class ModelExercise{
     
    /**
     * Obtain all the exercises.
     * @static
     * @returns {Promise<Array<Object>>} - Returns an array of exercise objects.     
     */
     static getAll (){
        return new DatabaseClass().obtainDataCollection('Exercise')
    }

    
    /**
     * Obtain an exercise by its id.
     * @static @async
     * @param {string} param0.id - id of the exercise.
     * @returns {Promise<Object|boolean>} - Return the exercise if found; `false` if it does not exist.
     * @throws {Error} - Throws an error if there is a problem founding the data.
     */
    static async getById({ id }){
        try {
            const exercise = await new DatabaseClass().obtainData('Exercise', id);
            return exercise; 
        } catch (error) {
            console.error("Error obtaining Exercise:", error.message);
            if (error.message === 'No existe el documento') {
                return null;
            }
            throw error; 
        }
    }

    /**
     * Obtain all the exercises by filters.
     * @static
     * @param {string} param0.id - type of the exercise.
     * @param {string} param0.id - personalized or not.
     * @returns {Promise<Array<Object>>} - Returns an array of exercise objects.     
     */
    static async getAllByFilters({ type, personalized }) {
        try {
          let exercises = [];
    
          if (type) {
            exercises = await new DatabaseClass().obtainDataCollectionByField('Exercise', 'type', type);
          }
    
          if (personalized !== undefined) {
            const personalizedBoolean = personalized === 'true' ? true : false;
            const personalizedExercises = await new DatabaseClass().obtainDataCollectionByField('Exercise', 'personalized', personalizedBoolean);
    
            if (exercises.length > 0) {
              exercises = exercises.filter(exercise => 
                personalizedExercises.some(fe => fe.id === exercise.id)
              );
            } else {
              exercises = personalizedExercises;
            }
          }
    
          return exercises;
        } catch (error) {
          console.error('Error al obtener ejercicios filtrados:', error);
          throw new Error('Internal Server Error');
        }
    }

}

