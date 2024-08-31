import { getData } from './puppeter.js';
import search from '../search.json' assert { type: 'json' };

export const linkedinRun = async () => {
    try {

        const params = {
            search: search,
            filter: {
            // ordenar: 'fecha',
            fecha: 'desde ayer',
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