import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

// Inicializar el servidor
app.set('port', process.env.PORT || 3000);


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
import helloworld from './modules/helloworld/routes.js';
import discord from './modules/discord/routes.js';


app.use('/api/helloworld', helloworld);
app.use('/api/discord/message', discord);

export { app };