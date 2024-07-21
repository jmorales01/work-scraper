import { scrapeJobsUtp } from './scraper/utpjobs/utp-jobs.js';
import { scrapeJobsLinkedin } from './scraper/linkedin/linkedin.js';
import { sendMessageWorks } from './discord/index.js';
import cron from 'node-cron';
import { app } from './app.js';

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})

cron.schedule('*/5 * * * *', async () => {
    console.log('***** Iniciando ejecución *****');

    const works = [];
    works = await scrapeJobsUtp();
    // const works = await scrapeJobsLinkedin();

    await sendMessageWorks(works);
    console.log(works);
},
{
    scheduled: true,
    timezone: "America/Lima"
});