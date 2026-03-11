import express from 'express';
import cors from 'cors';
import multer from 'multer';  
import { RouterServer } from './routes/Router.js';
import { CtrlPlayer } from './controllers/CtrlPlayer.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos subidos
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Usamos la fecha actual y el nombre original del archivo para evitar colisiones de nombres
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Inicializamos el middleware de multer
const upload = multer({ storage: storage });

// Configuración de middlewares
app.use(cors());
app.use(express.json());  // Middleware para manejar datos JSON
app.use(express.urlencoded({ extended: true }));  // Middleware para formularios estándar

// Server routes
app.use('/', RouterServer);
app.post('/users/:username/teams/:idT/players', upload.single('photo'), CtrlPlayer.create);

// Test route
app.get('/api/hello', (req, res) => {
    res.json({ message: '¡Hola desde el backend!' });
});

// Server closing management
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
