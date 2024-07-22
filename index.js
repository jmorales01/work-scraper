import cron from 'node-cron';
import { app } from './src/app.js';
import { scrapeJobsUtp } from './src/scraper/utpjobs/utp-jobs.js';
import { scrapeJobsLinkedin } from './src/scraper/linkedin/linkedin.js';

cron.schedule('*/2 * * * *', async () => {
    console.log('***** Iniciando ejecución *****');

    await scrapeJobsUtp();
    // await scrapeJobsLinkedin();
},
{
    scheduled: true,
    timezone: "America/Lima"
});


app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})