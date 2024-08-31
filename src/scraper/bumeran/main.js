import { getData } from './playwright.js';
import search from '../search.json' assert { type: 'json' };

export const bumeranRun = async () => {
    try {

        const params = {
            search: search,
            filter: {
            // ordenar: 'fecha',
            fecha: 'Hoy',
            // jornada: 'tiempo completo',
            }
        };

        const data = await getData(params);
        console.log(data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}