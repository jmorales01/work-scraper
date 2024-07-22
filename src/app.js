import express from 'express';
import prueba from './modules/prueba/routes.js';
import cors from 'cors';

const app = express();

app.use(cors());

// Inicializar el servidor
app.set('port', process.env.PORT || 3000);

// Rutas
app.use('/api/prueba', prueba);

export { app };