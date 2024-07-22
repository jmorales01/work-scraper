import puppeteer from 'puppeteer';
import config from '../../config.js';
import { sendMessageWorks } from '../../discord/index.js';

export const scrapeJobsUtp = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto(config.url.utpjobs, { waitUntil: 'networkidle2' });

    await page.waitForSelector('a.item-block');

    const works = await page.evaluate(() => {
        const elements = document.querySelectorAll('a.item-block');
        const works = [];

        elements.forEach(element => {
            let data = {};
            let date_now = new Date().toLocaleDateString();

            let date_created = element.querySelector('.publish_time').innerText;
            let date = date_created.match(/\d{2}\/\d{2}\/\d{4}/);

            data.created = date[0];
            data.url = element.href;
            data.url_image = element.querySelector('img').src;
            data.title = element.querySelector('h4').innerText;
            data.company = element.querySelector('h5').innerText;
            data.location = element.querySelector('span.location').innerText;
            data.type = element.querySelector('span.label').innerText;

            works.push(data);
        });

        return works;
    });
    
    console.log(works);
    await sendMessageWorks(works);
    // await browser.close();
    return works;
};

