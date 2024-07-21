import { scrapeJobsUtp } from './scraper/utpjobs/utp-jobs.js';
import { scrapeJobsLinkedin } from './scraper/linkedin/linkedin.js';
import { sendMessageWorks } from './discord/index.js';
import cron from 'node-cron';



cron.schedule('*/1 * * * *', async () => {
    console.log('***** Iniciando ejecución *****');
    const works = await scrapeJobsUtp();
    // const works = await scrapeJobsLinkedin();

    await sendMessageWorks(works);
    console.log(works);
},
{
    scheduled: true,
    timezone: "America/Lima"
});