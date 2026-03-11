import { ModelUser } from '../models/ModelUser.js'
import { CtrlTeam } from './CtrlTeam.js'
import { CtrlTraining } from './CtrlTraining.js'
import { CtrlMatch } from './CtrlMatch.js'
import { validateUserRegister, validateUserLogin } from '../schemas/SchemaUser.js'

export class CtrlUser {
    static async getAll(req, res) {
        ModelUser.getAll()
            .then(data => {
                console.log(data);
                res.json(data);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error'});
            })
    }

    static async getById(req, res) {
        const username = req.params.id; 
        try {
            const data = await ModelUser.getById({ username }); 
            res.json(data); 
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ message: 'User not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

    static async create(req, res) {
        const result = validateUserRegister(req.body);
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        }
        
        // User exists?
        const username = req.body.username;
        const userExists = await ModelUser.exists({ username });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists with that username' });
        }
    
        try {
            const res_creation = await ModelUser.create(result.data);
            if (!res_creation) {
                return res.status(400).json({ message: 'Error creating user' });
            }
            return res.status(201).json(result.data);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    static async update(req, res) {
        const username = req.params.id;
        let prevUser;
    
        // User exists?
        try {
            prevUser = await ModelUser.getById({ username });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ message: 'User not found' }); 
            }
            return res.status(500).json({ message: 'Error obtaining user' }); 
        }

        if (!prevUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const newUser = {
            username: req.params.id ?? prevUser.username,
            name: req.body.name ?? prevUser.name,
            surname: req.body.surname ?? prevUser.surname,
            password: req.body.password ?? prevUser.password,
        };
    
        // Format validation
        const result = validateUserRegister(req.body);
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
            
            return res.status(422).json({ errors: errorResponse });
        }
    
        // Update User
        try {
            const res_update = await ModelUser.update({ username }, newUser);
            if (!res_update) {
                return res.status(400).json({ message: 'User update error' });
            }
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user' });
        }
    }

    static async delete (req, res){
        const username = req.params.id

        // User exists?
        try {
            await ModelUser.getById({ username })
        } catch (error) {
            if( error.message === 'Document does not exist' )
                return res.status(404).json({ message: 'User not found'})
        }

        // Delete user teams, players, playerCharacteristics & playerStats
        try {
            await CtrlTeam.deleteByUser(username);
        } catch (error) {
            return res.status(400).json({message: 'Teams deletion error'})
        }

        // Delete user trainings
        try {
            await CtrlTraining.deleteByUser(username);
        } catch (error) {
            return res.status(400).json({message: 'Trainings deletion error'})
        }
       
        // Delete user matches and PlayerMatchStats (from calledups)
        try {
            await CtrlMatch.deleteByUser(username);
        } catch (error) {
            return res.status(400).json({message: 'Matches deletion error'})
        }
        
        // Delete User
        const res_delete = await ModelUser.delete({ username });
        if (!res_delete){
            return res.status(400).json({message: 'User deletion error'})
        }

        return res.json({ message: 'User ' + username +' deleted' })
    }

    static async verifyUser(req, res) {
        const result = validateUserLogin(req.body);
    
        // Format validation
        if (!result.success) {
            const errorResponse = result.error.errors.map(err => ({
                field: err.path[0], 
                message: err.message  
            }));
    
            return res.status(422).json({ errors: errorResponse });
        }
        
        const { username, password } = req.body;
    
        try {
            const user = await ModelUser.getById({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.password === password) {
                return res.json({ message: 'User verified' });
            } else {
                return res.status(401).json({ message: 'Wrong password' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default CtrlUser;
