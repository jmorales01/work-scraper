import puppeteer from 'puppeteer';
import config from '../../config.js';
import { sendMessageWorks } from '../../discord/index.js';

export const scrapeJobsLinkedin = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto(config.url.linkedin, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#organic-div');

    const username = process.env.LINKEDIN_USERNAME;
    const password = process.env.LINKEDIN_PASSWORD;
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button[aria-label="Inicia sesión"]');

    await page.waitForNavigation();
    await page.waitForSelector('ul.scaffold-layout__list-container');

    // Validar que el inicio de sesión haya sido exitoso
    // const logIn = await page.evaluate(() => {
    //     return document.querySelector('button.global-nav__primary-link') === null;
    // });

    // if (!logIn) {
    //     console.error('Error en el inicio de sesión.');
    //     await browser.close();
    //     return [];
    // }

    // Función para hacer scroll hasta el final de la página
    const autoScroll = async (page) => {
        await page.evaluate(async () => {
            const scrollContainer = document.querySelector('.jobs-search-results-list');
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = scrollContainer.scrollHeight;
                    scrollContainer.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    };

    const works = [];

    // Función para scrapear una sola página de resultados
    const scrapePage = async () => {
        await autoScroll(page);

        const newWorks = await page.evaluate(() => {
            const elements = document.querySelectorAll('ul.scaffold-layout__list-container li');
            const works = [];

            elements.forEach(element => {
                let data = {};

                const linkElement = element.querySelector('a[href*="/jobs/view/"]');
                if (linkElement) {
                    data.url = linkElement.href;
                }

                const imageElement = element.querySelector('img');
                if (imageElement) {
                    data.url_image = imageElement.src;
                }

                const titleElement = element.querySelector('a span');
                if (titleElement) {
                    data.title = titleElement.innerText.trim();
                }

                const companyElement = element.querySelector('h4 span');
                if (companyElement) {
                    data.company = companyElement.innerText.trim();
                }

                const locationTypeElement = element.querySelector('ul li');
                if (locationTypeElement) {
                    const locationTypeText = locationTypeElement.innerText.trim();
                    const locationMatch = locationTypeText.match(/^(.*?)\s*\(/);
                    const typeMatch = locationTypeText.match(/\((.*?)\)/);

                    data.location = locationMatch ? locationMatch[1] : 'No especificado';
                    data.type = typeMatch ? typeMatch[1] : 'No especificado';
                }

                works.push(data);
            });

            return works;
        });

        works.push(...newWorks);
    };

    // Scraping de todas las páginas de resultados
    let hasNextPage = true;
    while (hasNextPage) {
        await scrapePage();

        // Intentar navegar a la siguiente página si existe
        const nextPageButton = await page.$('button[aria-label="Página siguiente"]');
        if (nextPageButton) {
            await nextPageButton.click();
            await page.waitForNavigation();
        } else {
            hasNextPage = false;
        }
    }

    console.log('Informacion extraida:');
    console.log(works);
    await sendMessageWorks(works);
    // await browser.close();
    return works;
};
