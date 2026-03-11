import { Router } from 'express';
import { CtrlUser } from '../controllers/CtrlUser.js';
import { CtrlClub } from '../controllers/CtrlClub.js';
import { CtrlExercise } from '../controllers/CtrlExercise.js';
import { CtrlTeam } from '../controllers/CtrlTeam.js';
import { CtrlPlayer } from '../controllers/CtrlPlayer.js';
import { CtrlPlayerCharacteristics } from '../controllers/CtrlPlayerCharacteristics.js';
import { CtrlPlayerStats } from '../controllers/CtrlPlayerStats.js';
import { CtrlTraining } from '../controllers/CtrlTraining.js';
import { CtrlMatch } from '../controllers/CtrlMatch.js';
import multer from 'multer'; 
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import CtrlPlayerMatchStats from '../controllers/CtrlPlayerMatchStats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio para las fotos de los jugadores
const playersPhotosDir = path.join(__dirname, '../../../frontend/public/assets/PlayersPhotos');
if (!fs.existsSync(playersPhotosDir)) {
    fs.mkdirSync(playersPhotosDir, { recursive: true });
}

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, playersPhotosDir);  // El destino donde se almacenan las fotos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);  // Nombre del archivo con timestamp
    }
});

const upload = multer({ storage: storage });

// Crear el RouterServer
export const RouterServer = Router();

// User
RouterServer.get('/users', CtrlUser.getAll);
RouterServer.get('/users/:id', CtrlUser.getById);
RouterServer.post('/users', CtrlUser.create);
RouterServer.patch('/users/:id', CtrlUser.update);
RouterServer.delete('/users/:id', CtrlUser.delete);
RouterServer.post('/verifyUser', CtrlUser.verifyUser);

// Club
RouterServer.get('/clubs', CtrlClub.getAll);
RouterServer.get('/clubs/:id', CtrlClub.getById);

// Exercise
RouterServer.get('/exercises', CtrlExercise.getAll);
RouterServer.get('/exercises/:id', CtrlExercise.getById);

// Team
RouterServer.get('/users/:id/teams', CtrlTeam.getAll);
RouterServer.get('/users/:id/teams/:idT', CtrlTeam.getById);
RouterServer.get('/users/:id/teams/:idT/rival_teams', CtrlTeam.getAllRivalTeams);
RouterServer.get('/users/:id/teams/:idT/rival_teams/:idT2', CtrlTeam.getRivalTeamById);
RouterServer.patch('/users/:id/teams/:idT/rival_teams/:idT2', CtrlTeam.updateRivalTeam);
RouterServer.post('/users/:id/teams', CtrlTeam.create);
RouterServer.post('/users/:id/teams/:idT/rival_teams', CtrlTeam.createRivalTeam);
RouterServer.patch('/users/:id/teams/:idT', CtrlTeam.update);
RouterServer.delete('/users/:id/teams/:idT', CtrlTeam.delete);

// Player
RouterServer.get('/users/:id/teams/:idT/players', CtrlPlayer.getByTeam);
RouterServer.get('/users/:id/teams/:idT/players/:idP', CtrlPlayer.getById);

// Crear un jugador con la foto
RouterServer.post('/users/:id/teams/:idT/players', upload.single('photo'), (req, res, next) => {
    if (req.file) {
        // Si se sube una foto, actualiza el campo photo con la ruta de la foto
        req.body.photo = `/assets/PlayersPhotos/${req.file.filename}`;
        console.log("req.body.photo: " + req.body.photo);
    }
    next();
}, CtrlPlayer.create); // Aquí también se crean las características del jugador con valores predeterminados

// Actualizar un jugador con la foto
RouterServer.patch('/users/:id/teams/:idT/players/:idP', upload.single('photo'), async (req, res, next) => {
    try {
        let updatedPlayer = req.body;
        
        // Si se sube una nueva foto, actualizar el campo photo
        if (req.file) {
            updatedPlayer.photo = `/assets/PlayersPhotos/${req.file.filename}`;
            console.log("Nueva foto cargada: " + updatedPlayer.photo);
        }

        // Si no se sube una nueva foto, mantener la foto existente
        if (!req.file && req.body.photo) {
            updatedPlayer.photo = req.body.photo;
        }

        // Continúa con la actualización del jugador
        req.body = updatedPlayer;
        next();
    } catch (error) {
        console.error("Error al procesar la foto:", error);
        return res.status(500).json({ message: 'Error al actualizar el jugador' });
    }
}, CtrlPlayer.update);
RouterServer.delete('/users/:id/teams/:idT/players/:idP', CtrlPlayer.delete);

// PlayerCharacteristics
RouterServer.get('/users/:id/teams/:idT/players/:idP/playercharacteristics', CtrlPlayerCharacteristics.getByPlayer);
RouterServer.patch('/users/:id/teams/:idT/players/:idP/playercharacteristics', CtrlPlayerCharacteristics.update);

// PlayerStats
RouterServer.get('/users/:id/teams/:idT/players/:idP/playerstats', CtrlPlayerStats.getByPlayer);
RouterServer.patch('/users/:id/teams/:idT/players/:idP/playerstats', CtrlPlayerStats.update);

// Trainings
RouterServer.get('/users/:id/trainings', CtrlTraining.getAllByUser); 
RouterServer.get('/users/:id/teams/:idT/trainings', CtrlTraining.getAllByUserAndTeam); 
RouterServer.get('/users/:id/trainings/:idTr', CtrlTraining.getById); 
RouterServer.get('/users/:id/teams/:idT/trainings/:idTr', CtrlTraining.getById); 
RouterServer.post('/users/:id/teams/:idT/trainings', CtrlTraining.create); 
RouterServer.patch('/users/:id/teams/:idT/trainings/:idTr', CtrlTraining.update); 
RouterServer.delete('/users/:id/teams/:idT/trainings/:idTr', CtrlTraining.delete); 

// Matches
RouterServer.get('/users/:id/matches', CtrlMatch.getAllByUser); 
RouterServer.get('/users/:id/teams/:idT/matches', (req, res, next) => {
    const { finished } = req.query;

    if (finished === 'true') {
        CtrlMatch.getFinishedMatches(req, res, next);
    } else {
        CtrlMatch.getAllByUserAndTeam(req, res, next);
    }
});
RouterServer.get('/users/:id/matches/:idM', CtrlMatch.getById); 
RouterServer.get('/users/:id/teams/:idT/matches/:idM', CtrlMatch.getById); 
RouterServer.post('/users/:id/teams/:idT/matches', CtrlMatch.create); 
RouterServer.patch('/users/:id/teams/:idT/matches/:idM', CtrlMatch.update); 
RouterServer.delete('/users/:id/teams/:idT/matches/:idM', CtrlMatch.delete); 

// PlayerMatchStats
RouterServer.get('/users/:id/teams/:idT/players/:idP/playermatchstats', CtrlPlayerMatchStats.getAllByPlayer);
RouterServer.get('/users/:id/teams/:idT/players/:idP/playermatchstats/:idPMS', CtrlPlayerMatchStats.getById);
RouterServer.patch('/users/:id/teams/:idT/players/:idP/playermatchstats/:idPMS', CtrlPlayerMatchStats.update);
RouterServer.get('/users/:id/teams/:idT/matches/:idM/playermatchstats', CtrlPlayerMatchStats.getAllByMatch);

