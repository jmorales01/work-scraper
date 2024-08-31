// @ts-check

import { chromium } from 'playwright';
import config from '../../config.js';

const pages = [
    {
        name: 'computrabajo',
        url: config.url.computrabajo,

        checkPage: async (page) => {
            try {
                if (page && page.status() === 200) {
                    console.log(`Página ok.`);
                    return true;
                } else {
                    console.log(`Error al cargar la página: Código de estado ${page.status()}`);
                    return false;
                }
            } catch (error) {
                console.log(`No se pudo acceder a la página: ${error.message}`);
                return false;
            }
        }
    }
];

const searchJobs = async (page, params) => {
    const { keywords, location } = params;
    
    await page.waitForSelector('div.box_search');
    const serchContainer = await page.evaluate(() => {
        return document.querySelector('div.box_search')?true:false
    })

    if(serchContainer){
        // Limpiar la barra de busqueda
        await page.evaluate(() => {
            document.querySelector('input#prof-cat-search-input').value = '';
            document.querySelector('input#place-search-input').value = '';
        })
        await page.type('input#prof-cat-search-input', keywords);
        await page.type('input#place-search-input', location);
        await page.click('button#search-button');
    }
}

const filterPage = async (page, params) => {

    try {
        for (const [key, value] of Object.entries(params)) {
            const filterElement = await page.evaluateHandle(({ key }) => {
                const filters = Array.from(document.querySelectorAll('div.field_select_links'));
                return filters.find(filter => filter.querySelector('p')?.innerText.trim().toLowerCase() === key.toLowerCase());
            }, { key });

            if (filterElement) {
                await filterElement.asElement().click();

                // Busca el valor dentro del dropdown y haz click en él
                await page.evaluate(({ filterElement, value }) => {
                    const options = filterElement.querySelectorAll('li span.buildLink');
                    const option = Array.from(options).find(option => option.innerText.trim().toLowerCase() === value.toLowerCase());
                    if (option) option.click();
                }, { filterElement, value });

                await page.waitForNavigation({ waitUntil: 'networkidle' });
            }
        }
    } catch (error) {
        console.log(`Error en el filtro: ${error.message}`);
    }
}

const pullData = async (page) => {
    await page.waitForSelector('article.box_offer');
    console.log('Buscando datos...');
    const result = await page.evaluate(() => {
        const works = [];
        try {
            
            const elements = document.querySelectorAll('article.box_offer');

            elements.forEach(element => {
                const data = {};
                data.id = element.id;

                const titleElement = element.querySelector('h2 a');
                const companyElement = element.querySelector('a.fc_base.t_ellipsis');
                const locationElement = element.querySelector('p.fs16.fc_base.mt5 span.mr10');
                const typeElement = element.querySelector('div.fs13.mt15 span.dIB.mr10');
                const urlElement = element.querySelector('h2 a');

                data.title = titleElement ? titleElement.innerText.trim() : 'N/A';
                data.company = companyElement ? companyElement.innerText.trim() : 'N/A';
                data.location = locationElement ? locationElement.innerText.trim() : 'N/A';
                data.type = typeElement ? typeElement.innerText.trim() : 'N/A';
                data.url = urlElement ? urlElement.href : 'N/A';
                data.date_posted = new Date().toISOString().slice(0, 10);
                data.date_expires = null;
                data.skills = [];
                data.description = null;
                works.push(data);
            });
        } catch (error) {
            return `Error en evaluate: ${error.message}`;
        }

        return works;
    });

    return result;
};

const nextPagination = async (page) => {
    const nextButton = await page.$('span.b_primary.w48.cp');

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

;(async () => {
    const browser = await chromium.launch({
        headless: true
    });

    for (const pageConfig of pages) {
        const { name, url, checkPage } = pageConfig;

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0',
          });
        const page = await context.newPage();
        
        const result = await page.goto(url, { waitUntil: 'networkidle' });

        const isPageActive = await checkPage(result);
        if (!isPageActive) {
            return;
        }

        await searchJobs(page, { keywords: '', location: 'Lima' });

        const params = {
            // ordenar: 'fecha',
            fecha: 'desde ayer',
            // jornada: 'tiempo completo',
        };

        await filterPage(page, params);

        const rows = [];
        while (true) {
            const data = await pullData(page);

            const hasNext = await nextPagination(page);
            console.log(hasNext);
            if (!hasNext) {
                break;
            }

            rows.push(...data);
        }
        console.log(rows);
    }

    await browser.close();
})()

