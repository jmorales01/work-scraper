import { getData } from './playwright.js';
import params from '../params.json' assert { type: 'json' };
import { insertJobs } from '../../db/supabase/cruds.js';

export const computrabajoRun = async () => {
    try {

        const data = await getData(params);
        
        console.log(data);
        if(data.length > 0) {
            await insertJobs(data);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}