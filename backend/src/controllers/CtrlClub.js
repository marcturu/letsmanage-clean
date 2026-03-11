import { ModelClub } from '../models/ModelClub.js'

export class CtrlClub {
    static async getAll (req, res){
        ModelClub.getAll()
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error'});
            })
    }

    static async getById(req, res) {
        const id = req.params.id; 
        try {
            const data = await ModelClub.getById({ id }); 
            res.json(data); 
        } catch (error) {
            console.error("Error in getById:", error.message);
            if (error.message === 'Club not found') {
                return res.status(404).json({ message: 'Club not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

}

export default CtrlClub;
