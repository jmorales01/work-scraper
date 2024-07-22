import express from 'express';
import holamundo from './modules/holamundo/routes.js';
import cors from 'cors';

const app = express();

app.use(cors());

// Inicializar el servidor
app.set('port', process.env.PORT || 3000);

// Rutas
app.use('/api/holamundo', holamundo);

export { app };