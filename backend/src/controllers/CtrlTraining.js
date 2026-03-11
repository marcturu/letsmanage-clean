import { ModelTraining } from '../models/ModelTraining.js'
import { ModelExercise } from '../models/ModelExercise.js'
import { ModelTeam } from '../models/ModelTeam.js'

function isOverlapping(existingTrainings, newTrainingDate, newTrainingHour) {
    const [newHour, newMinute] = newTrainingHour.split(':').map(Number);
    const newTrainingTime = new Date(newTrainingDate);
    newTrainingTime.setHours(newHour, newMinute, 0, 0);

    for (const training of existingTrainings) {
        const [existingHour, existingMinute] = training.hour.split(':').map(Number);

        const existingTrainingTime = new Date(newTrainingDate);
        existingTrainingTime.setHours(existingHour, existingMinute, 0, 0);

        const timeDifference = Math.abs(newTrainingTime - existingTrainingTime);
        const minuteDifference = timeDifference / (1000 * 60);
        
        // Check if the difference < 90 minutes
        if (minuteDifference <= 89) {
            return true;
        }
    }

    return false;
}

function isOverlappingDifferentLocation(existingTrainings, newTrainingDate, newTrainingHour, newCity, newAddress) {
    const [newHour, newMinute] = newTrainingHour.split(':').map(Number);
    const newTrainingTime = new Date(newTrainingDate);
    newTrainingTime.setHours(newHour, newMinute, 0, 0);

    for (const training of existingTrainings) {
        const [existingHour, existingMinute] = training.hour.split(':').map(Number);

        const existingTrainingTime = new Date(newTrainingDate);
        existingTrainingTime.setHours(existingHour, existingMinute, 0, 0);

        const timeDifference = Math.abs(newTrainingTime - existingTrainingTime);
        const minuteDifference = timeDifference / (1000 * 60);

        // Check if the difference < 120 minutes if different city or location
        if (minuteDifference <= 119 && (training.city !== newCity || training.address !== newAddress)) {
            return true;
        }
    }

    return false;
}

export class CtrlTraining {

    static async getAllByUser(req, res) {
        const username = req.params.id;
        try {
            const documents = await ModelTraining.getAll({ username });
    
            documents.sort((a, b) => {
                if (a.team !== b.team) {
                    return a.team.localeCompare(b.team); 
                }
                const dateA = new Date(a.year, a.month - 1, a.day); 
                const dateB = new Date(b.year, b.month - 1, b.day); 
                return dateA - dateB;  
            });
    
            res.json(documents);
        } catch (error) {
            if (error.message === 'Training not found') {
                return res.status(404).json({ message: 'Training not found' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }    
    

    static async getAllByUserAndTeam(req, res) {
        const username = req.params.id;
        const idT = req.params.idT; 
        try {
            const documents = await ModelTraining.getAll({ username });
            const filteredDocuments = documents.filter(doc => doc.team === idT);
    
            filteredDocuments.sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.day);
                const dateB = new Date(b.year, b.month - 1, b.day);
                return dateA - dateB; 
            });
    
            res.json(filteredDocuments);
        } catch (error) {
            if (error.message === 'Training not found') {
                return res.status(404).json({ message: 'Training not found' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    

    static async getById(req, res) {
        const idTr = req.params.idTr; 
        try {
            const data = await ModelTraining.getById({ id: idTr }); 
            res.json(data); 
        } catch (error) {
            if (error.message === 'TrAINING not found') {
                return res.status(404).json({ message: 'Training not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async create(req, res) {
        const coach = req.params.id; 
        const team = req.params.idT; 
        let exercises2 = [];
        let duration = 0;
    
        const { city, address, date, hour, exercises, name, pitchZone } = req.body;
        const [day, month, year] = date.split('/');
        const pitchZoneNumber = parseInt(pitchZone, 10);
         if (isNaN(pitchZoneNumber)) {
            return res.status(400).json({ message: 'Invalid pitchZone value' });
        }
        const id = `${team}_${coach}_${city}_${address}_${day}_${month}_${year}_${hour}_${pitchZoneNumber}`;

        //Team exists?
        const teamExists = await ModelTeam.exists({ id: team });
        if (!teamExists) {
            return res.status(404).json({ message: 'Team where the training wants to be planed does not exist' });
        }

        //Training exists?
        const trainingExists = await ModelTraining.exists({ id });
        if (trainingExists) {
            return res.status(409).json({ message: 'Training already exists' });
        } 

        //Trainings do not overlap in 1:30 hour time
        const allTrainings = await ModelTraining.getAll2();
        const sameDayTrainings = allTrainings.filter(doc => doc.coach === coach && doc.year === year && doc.month === month 
            && doc.day === day);

        //No = coach, = date, =/ location
        if (isOverlappingDifferentLocation(sameDayTrainings, new Date(year, month - 1, day), hour, city, address)) {
            return res.status(400).json({ message: 'The coach cannot be at two different locations within 2 hours' });
        }

        const sameDayAndPitchTrainings = sameDayTrainings.filter(doc => doc.city === city && doc.address === address);

        if (isOverlapping(sameDayAndPitchTrainings, new Date(year, month - 1, day), hour)) {
            return res.status(400).json({ message: 'Training hour overlaps with another of your trainings from your teams in the same pitch within 1:30 hours' });
        }
        
        if (exercises && exercises.length > 0) {
            try {
                exercises.sort((a, b) => {
                    const [nameA, numA] = a.split(' ');
                    const [nameB, numB] = b.split(' ');
    
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
    
                    return parseInt(numA) - parseInt(numB);
                });    
                const exercisePromises = exercises.map(async (exerciseId) => {
                    const exercise = await ModelExercise.getById({ id: exerciseId });
                    return exercise;
                });
    
                exercises2 = await Promise.all(exercisePromises);
    
                duration = exercises2.reduce((total, exercise) => {
                    const parts = exercise.duration.split('+');
                    const minutes = parts.reduce((sum, part) => {
                        const trimmed = part.trim();
                        const value = parseInt(trimmed, 10);
                        return sum + value;
                    }, 0);
                    return total + minutes;
                }, 0);
            } catch (error) {
                if (error.message === 'Exercise not found') {
                    return res.status(404).json({ message: 'Exercise not found' });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            duration = 0;
        }
    
        const result = {
            team,
            coach,
            city,
            address,
            year,
            month,
            day,
            hour,
            pitchZone : pitchZoneNumber,
            exercises: exercises,
            name,
            duration
        };
    
        try {
            const res_creation = await ModelTraining.create(id, result);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating training' });
            }
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating training' });
        }
    }

    static async update(req, res) {

        //Training exists?
        let idTr = req.params.idTr;
        let prevTraining;
        try {
            prevTraining = await ModelTraining.getById({ id: idTr });
        } catch (error) {
            if (error.message === 'Training not found') {
                return res.status(404).json({ message: 'Training not found' });
            }
            return res.status(500).json({ message: 'Error obtaining training' });
        }
        if (!prevTraining) {
            return res.status(404).json({ message: 'Training not found' });
        }
    
        //If new exercises:
        const newExercises = req.body.exercises ?? prevTraining.exercises;
        let newDuration = 0;
    
        if (newExercises && newExercises.length > 0) {
            try {
                newExercises.sort((a, b) => {
                    const [nameA, numA] = a.split(' ');
                    const [nameB, numB] = b.split(' ');
    
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
    
                    return parseInt(numA) - parseInt(numB);
                });    
                const exercisePromises = newExercises.map(async (exerciseId) => {
                    const exercise = await ModelExercise.getById({ id: exerciseId });
                    return exercise;
                });
    
                const exercisesDetails = await Promise.all(exercisePromises);
    
                newDuration = exercisesDetails.reduce((total, exercise) => {
                    const parts = exercise.duration.split('+');
                    const minutes = parts.reduce((sum, part) => {
                        const trimmed = part.trim();
                        const value = parseInt(trimmed, 10);
                        return sum + value;
                    }, 0);
                    return total + minutes;
                }, 0);
    
            } catch (error) {
                if (error.message === 'Exercise not found') {
                    return res.status(404).json({ message: 'Exercise not found' });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            newDuration = 0;
        }
    
        const newTraining = {
            name: req.body.name ?? prevTraining.name,
            exercises: newExercises,
            duration: newDuration
        };
    
        //Update Training
        try {
            const res_update = await ModelTraining.update({ id: idTr }, newTraining);
            if (!res_update) {
                return res.status(400).json({ message: 'Training update error' });
            }
            return res.status(200).json(newTraining);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating training' });
        }
    }

    static async delete (req, res){
        let id = req.params.idTr;

        // Training exists?
        let training
        try {
            training = await ModelTraining.getById({ id });
        } catch (error) {
            if( error.message === 'No existe el documento' )
                return res.status(404).json({ message: 'Trainig not found'})
        }

        if (!training) {
            return res.status(404).json({ message: 'Training not found' });
        }

        // Delete Training
        const res_delete = await ModelTraining.delete({ id });
        if (!res_delete){
            return res.status(400).json({message: 'Training deletion error'})
        }

        return res.json({ message: 'Training ' + id +' deleted' })
    }

    static async deleteByUser(username) {
        try {
            await ModelTraining.deleteByUser(username);
        } catch (error) {
            return { status: 500, message: 'Internal Server Error', details: error.message};
        }
    }

    static async deleteByTeam(id) {
        try {
            await ModelTraining.deleteByTeam(id);
        } catch (error) {
            return { status: 500, message: 'Internal Server Error', details: error.message};
        }
    }
}

export default CtrlTraining;