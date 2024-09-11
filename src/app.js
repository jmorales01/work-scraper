import express from 'express';
import cors from 'cors';
import cron from 'node-cron';

import { bumeranRun } from './scraper/bumeran/main.js';
import { linkedinRun } from './scraper/linkedin/main.js';
import { computrabajoRun } from './scraper/computrabajo/main.js';

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

cron.schedule('*/10 * * * *', async () => {
    console.log('***** Iniciando ejecución *****');

    // await bumeranRun();
    // await linkedinRun();
    await computrabajoRun();

    console.log('***** Fin de ejecución *****');
},
{
    scheduled: true,
    timezone: "America/Lima"
});

export { app };