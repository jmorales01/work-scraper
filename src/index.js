import { scrapeJobsUtp } from './scraper/utp-jobs.js';
import { scrapeJobsLinkedin } from './scraper/linkedin.js';
import { sendMessageWorks } from './discord/index.js';
import cron from 'node-cron';



cron.schedule('*/1 * * * *', async () => {
    console.log('Ejecutando script...');
    // const works = await scrapeJobsUtp();
    // await sendMessageWorks(works);

    const works = await scrapeJobsLinkedin();
    console.log(works);

},
{
    scheduled: true,
    timezone: "America/Lima"
});