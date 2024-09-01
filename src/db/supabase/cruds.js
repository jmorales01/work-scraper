import { supabase } from './connection.js';

const insertJobs = async (jobData) => {
    const { data, error } = await supabase
        .from('jobs')
        .insert([
            {
                code: jobData.code,
                title: jobData.title,
                company: jobData.company,
                location: jobData.location,
                type: jobData.type,
                url: jobData.url,
                date_posted: jobData.date_posted,
                date_expires: jobData.date_expires,
                description: jobData.description,
            },
        ]);

    if (error) {
        console.error('Error al insertar datos:', error.message);
    } else {
        console.log('Datos insertados correctamente:', data);
    }
};

export { insertJobs };