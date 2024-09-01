import { getData } from './playwright.js';
import params from '../params.json' assert { type: 'json' };

export const bumeranRun = async () => {
    try {

        const data = await getData(params);
        console.log(data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}