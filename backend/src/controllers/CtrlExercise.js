import { ModelExercise } from '../models/ModelExercise.js'

export class CtrlExercise {

    static async getAll(req, res) {
      try {
        const { type, personalized } = req.query; 
        if (type || personalized !== undefined) {
          ModelExercise.getAllByFilters({ type, personalized })
            .then(data => {
              const sortedData = data.sort((a, b) => {
                const typeA = a.type;
                const typeB = b.type;

                if (typeA < typeB) return -1;
                if (typeA > typeB) return 1;

                const numA = extractNumberFromId(a.id);
                const numB = extractNumberFromId(b.id);

                return numA - numB; 
              });

              console.log(sortedData); 
              res.json(sortedData); 
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({ error: 'Internal Server Error' });
            });
        } else {
          ModelExercise.getAll()
            .then(data => {
              const sortedData = data.sort((a, b) => {
                const typeA = a.type;
                const typeB = b.type;

                if (typeA < typeB) return -1;
                if (typeA > typeB) return 1;

                const numA = extractNumberFromId(a.id);
                const numB = extractNumberFromId(b.id);

                return numA - numB; 
              });

              console.log(sortedData); 
              res.json(sortedData); 
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({ error: 'Internal Server Error' });
            });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    static async getById(req, res) {
        const id = req.params.id; 
        try {
            const data = await ModelExercise.getById({ id }); 
            console.log(data);
            res.json(data); 
        } catch (error) {
            console.error("Error in getById:", error.message);
            if (error.message === 'Exercise not found') {
                return res.status(404).json({ message: 'Exercise not found' }); 
            }
            return res.status(500).json({ message: 'Internal server error' }); 
        }
    }

}

function extractNumberFromId(id) {
  const match = id.match(/(\d+)$/); 
  return match ? parseInt(match[1], 10) : 0; 
}

export default CtrlExercise;
