import express from 'express';
import Controller from './controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hola mundo');
});

router.post('/', (req, res) => {
    const { channel_id, content } = req.body
    Controller.message(channel_id, content)
    .then(() => res.send('Respuesta enviada'))
})

export default router;