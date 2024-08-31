import puppeteer from 'puppeteer';
import config from '../../config.js';

export const computrabajoMain = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 50
    });

    const page = await browser.newPage();

    await page.goto(config.url.computrabajo);

    await searchJobs(page);

    const result = await pullData(page);
    console.log(result);

    // await browser.close();
}


// Crear una funcion solo para hacceder y filtrar las ofertas de trabajo
const searchJobs = async (page) => {
    await page.type('#prof-cat-search-input', 'desarrollador/a');
    await page.type('#place-search-input', 'Lima');
    await page.click('button[id="search-button"]');
}

const pullData = async (page) => {
    console.log('Buscando datos...');
    const result = await page.evaluate(() => {
        try {
            const works = [];
            const elements = document.querySelectorAll('.box_offer');

            console.log('Elementos encontrados:', elements.length);

            elements.forEach(element => {
                const data = {};
                data.id = element.id;

                const titleElement = element.querySelector('h2 a');
                const companyElement = element.querySelector('a[class="fc_base t_ellipsis"]');
                const locationElement = element.querySelector('p span[class="fs16 fc_base mt5"]');
                const typeElement = element.querySelector('div span[class="dIB mr10"]');
                const urlElement = element.querySelector('h2 a');

                data.title = titleElement ? titleElement.innerText : 'N/A';
                data.company = companyElement ? companyElement.innerText : 'N/A';
                data.location = locationElement ? locationElement.innerText : 'N/A';
                data.date_posted = new Date().toISOString().slice(0, 10);
                data.date_expires = null;
                data.type = typeElement ? typeElement.innerText : 'N/A';
                data.skills = [];
                data.url = urlElement ? urlElement.href : 'N/A';
                data.description = null;

                works.push(data);
            });
        } catch (error) {
            return `Error en evaluate: ${error.message}`;
        }

        return works;
    });

    console.log('Datos extraídos:', result.length);
    return result;
};

const nextPagination = async (page) => {
    const next = await page.evaluate(() => {
        const next = document.querySelector('a[rel="next"]');
        if (next) {
            return next.href;
        }
        return null;
    });
    return next;
}