import puppeteer from 'puppeteer';
import config from '../../config.js';

const logIn = async (page) => {
    await page.waitForSelector('#organic-div');

    const username = process.env.LINKEDIN_USERNAME;
    const password = process.env.LINKEDIN_PASSWORD;
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button[data-litms-control-urn="login-submit"]');
}

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

const searchJobs = async (page, params) => {
    const { keywords, location } = params;
    
    await page.waitForSelector('nav.nav');
    const serchContainer = await page.evaluate(() => {
        return document.querySelector('section.search-bar')?true:false
    })

    if(serchContainer){
        // Limpiar la barra de busqueda
        await page.evaluate(() => {
            document.querySelector('input#job-search-bar-keywords').value = '';
            document.querySelector('input#job-search-bar-location').value = '';
        })
        await page.type('input#job-search-bar-keywords', keywords[0]);

        // await page.type('input#job-search-bar-location', 'Perú');
        await page.waitForSelector('button.base-search-bar__submit-btn');

        // Seleccionar el botón de búsqueda
        const searchButton = await page.$('button.base-search-bar__submit-btn');

        if (searchButton) {
            // Asegurarse de que el botón es visible y clickable
            await page.evaluate(el => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }, searchButton);
            
            await page.waitForTimeout(500); // Esperar un momento para que se haga scroll

            // Hacer clic en el botón
            await searchButton.click();

            console.log('Clic en el botón de búsqueda realizado.');
        } else {
            console.log('Botón de búsqueda no encontrado.');
        }
    }
}

const filterPage = async (page, params) => {

    try {
        // Seleccionar el primer `li` en la lista de filtros (en este caso, se asume que es "Fecha de publicación")
        const filterElement = await page.$('ul.filters__list > li.filter > div > div > button');

        if (filterElement) {
            // Hacer clic en el botón para desplegar las opciones de filtro
            await filterElement.click();

            // Esperar a que las opciones se desplieguen
            await page.waitForSelector('.collapsible-dropdown__list', { visible: true });

            // Seleccionar la opción de "Últimas 24 horas"
            const option = await page.$('input[value="r86400"] + label');
            if (option) {
                await option.click();

                // Hacer clic en el botón "Listo"
                const submitButton = await page.$('button.filter__submit-button');
                if (submitButton) {
                    await submitButton.click();
                } else {
                    console.log('Botón "Listo" no encontrado.');
                }
            } else {
                console.log('Opción "Últimas 24 horas" no encontrada.');
            }
        } else {
            console.log('Elemento de filtro no encontrado.');
        }
    } catch (error) {
        console.log(`Error al aplicar el filtro: ${error.message}`);
    }
}

const pullData = async (page) => {
    await page.waitForNavigation();
    await page.waitForSelector('ul.scaffold-layout__list-container');

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

    return newWorks;
}

const nextPagination = async (page) => {
    const nextButton = await page.$('button[aria-label="Página siguiente"]');

    if (nextButton) {
        const isDisabled = await page.evaluate((button) => {
            return button.classList.contains('disabled');
        }, nextButton);

        if (!isDisabled) {
            await nextButton.click();
            console.log('Clic en "Siguiente".');
            return true;
        } else {
            return false;
        }
    } else {
        console.log('Botón "Siguiente" no encontrado.');
        return false;
    }
};

export const getData = async (params) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    // const context = await browser.newContext({
    //     userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0',
    //     });

    await page.goto(config.url.linkedin, { waitUntil: 'networkidle2' });

    // const isPageActive = await checkPage(result);
    // if (!isPageActive) {
    //     return [];
    // }

    await logIn(page);
    // await searchJobs(page, params.search);
    // await filterPage(page, params.filter);

    const rows = [];
    while (true) {
        const data = await pullData(page);
        rows.push(...data);

        // const hasNext = await nextPagination(page);
        // console.log(hasNext);
        // if (!hasNext) {
        //     break;
        // }

        break;
    }

    // await browser.close();
    return rows;
}