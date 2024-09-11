import { supabase } from './connection.js';

const insertJobs = async (data) => {
    const { result, error } = await supabase
        .from('jobs')
        .insert(data);

    if (error) {
        return console.error('Error al insertar datos:', error.message);
    }
    console.log('Datos insertados correctamente:', result);
};

export { insertJobs };