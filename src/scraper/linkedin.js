import puppeteer from 'puppeteer';

export const scrapeJobsLinkedin = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto(process.env.URL_LINKEDIN);

    await page.waitForSelector('#organic-div');

    const username = process.env.LINKEDIN_USERNAME;
    const password = process.env.LINKEDIN_PASSWORD;
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button[aria-label="Inicia sesión"]');

    await page.waitForNavigation();
    await page.waitForSelector('ul[class="scaffold-layout__list-container"]');

    const logIn = await page.evaluate(() => {
        return document.querySelector('button#ember28') === null;
    });

    const works = await page.evaluate(() => {
        if (logIn) {
            return [];
        }
        const elements = document.querySelectorAll('ul[class="scaffold-layout__list-container"] li#ember260');
        const works = [];

        elements.forEach(element => {
            let data = {};

            data.url = element.querySelector('div#ember265 a').href;
            data.url_image = element.querySelector('img').src;
            data.title = element.querySelector('div#ember265 > strong').innerText;
            data.company = element.querySelector('div#ember267 span').innerText;

            var elem = element.querySelector('div#ember332 > li').innerText; // Ate, Perú (En remoto)
            data.location = elem.substring(0, elem.indexOf('(')); // Ate, Perú
            data.type = elem.substring(elem.indexOf('(') + 1, elem.length - 1);  // En remoto

            works.push(data);
        });

        return works;
    });

    console.log('Informacion extraida:');
    console.log(works);
    await browser.close();
    return works;
};