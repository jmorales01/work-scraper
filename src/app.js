import express from 'express';
import helloworld from './modules/helloworld/routes.js';
import cors from 'cors';

const app = express();

app.use(cors());

// Inicializar el servidor
app.set('port', process.env.PORT || 3000);

// Rutas
app.use('/api/helloworld', helloworld);

export { app };