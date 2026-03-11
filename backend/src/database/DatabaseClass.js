import admin from 'firebase-admin';
import 'dotenv/config';

try {
  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
} catch (error) {
  console.error('Error reading or parsing the JSON file:', error);
}

const db = admin.firestore();

let instance = null;

console.log("Connected to the database");

export class DatabaseClass {
  constructor() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }
  /*
    - clase: Class to which the document belongs to.
    - This function returns all the instances from a certain class.  
  */
   obtainDataCollection = async(clase) => {
    try {
      const collectionRef = db.collection(clase);
      const snapshot = await collectionRef.get();
      const data = [];

      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return data;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
    }
  };

  /*
    - clase: Class to which the document belongs to.
    - id: Primary key of the instance to search.
    - In this function, an instance identified by its docID from the class collection and its attributes are returned in JSON format.
  */
  obtainData = async (clase, id) => {
    try {
      const collectionRef = db.collection(clase);
      const docRef = await collectionRef.doc(id).get();

      if (docRef.exists) {
        return {
          id: docRef.id,
          ...docRef.data(),
        };
      }
      else {
        throw new Error('No existe el documento');
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
    }
  };

  /*
  - collectionName: Class to which the document belongs to.
	- fieldName: Attribute of the instances to search.
	- value: Property to compare in the attribute fieldName of all instances
  - In this function, the instances where the fieldName is equal to the value from the class collection and their attributes are returned in JSON format.
  */
  obtainDataCollectionByField = async (collectionName, fieldName, value) => {
    try {
      const collectionRef = db.collection(collectionName).where(fieldName, "==", value);
      const snapshot = await collectionRef.get();
      const data = [];

      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`Datos obtenidos de ${fieldName}:`, data);  // Agregar un log para verificar los datos
      return data;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
    }
  };

  /*
  - clase: Class to which the document belongs to.
	- documentID: Primary key of the instance to add.
	- nuevoDato: Attribute values to add to the instance.
  - In this function, newData from a new instance identified by its docID from the class collection is added. 
  */
  addNewData = async (clase, documentID,nuevoDato) => {
    try {
      const collectionRef = db.collection(clase);
      const docRef = collectionRef.doc(documentID);
      await docRef.set(nuevoDato);
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar datos:', error);
      throw error;
    }
  };

  /*
  - clase: Class to which the document belongs to.
	- documentID: Primary key of the instance to delete.
  - In this function, an instance identified by its docID from the class collection is deleted. 
  */  
  deleteData = async (clase, documentID) => {
    try {
      const collectionRef = db.collection(clase);
      const docRef = collectionRef.doc(documentID);
      await docRef.delete();
      return docRef.id;
    } catch (error) {
      console.error('Error al eliminar datos:', error);
      throw error;
    }
  };

  /*
  - clase: Class to which the document belongs to.
	- documentID: Primary key of the instance to update.
	- updateData: Attributes values to update to the instance.
  - In this function, updateData from an existing instance identified by its docID from the class collection is added. 
  */
  updateData = async (clase,documentID,updateData) => {
    try {
      const collectionRef = db.collection(clase);
      const docRef = collectionRef.doc(documentID);

      await docRef.update(updateData);
      const updatedData = await docRef.get();

      if(updatedData.exists){
        const data ={
          id: updatedData.id,
          ...updatedData.data(),
        }
        return data
      } else {
        throw new Error(`Documento con ID ${documentID} no encontrado después de la actualización.`);
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      throw error;
    }
  };

  disconnect() {
    console.log("Disconnected from the database");
  }
}

export default DatabaseClass;
