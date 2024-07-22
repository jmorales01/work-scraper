import puppeteer from 'puppeteer';

export const scrapeJobsUtp = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });

    const page = await browser.newPage();

    const URL_UTP_JOBS='https://utp.hiringroomcampus.com/jobs?location=Lima&education%5B%5D=Abandonado&education%5B%5D=En%20curso%20-%20Avanzado&education%5B%5D=En%20curso%20-%20Intermedio&education%5B%5D=En%20curso%20-%20Inicial&career%5B%5D=5d8a8e9f08a25a2301068672&career%5B%5D=5d8a8d9608a25a22e1561f41';
    await page.goto(URL_UTP_JOBS, { waitUntil: 'networkidle2' });

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
    // await browser.close();
    return works;
};

