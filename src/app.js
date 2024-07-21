import express from 'express';
import prueba from './modules/prueba/routes.js';

const app = express();

// Inicializar el servidor
app.set('port', process.env.PORT || 3000);

// Rutas
app.use('/api/prueba', prueba);

export { app };