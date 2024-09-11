import { chromium } from 'playwright';
import config from '../../config.js';

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
    const { key, value } = params;

    try {
        const filterElement = await page.evaluateHandle(({ key }) => {
            const filters = Array.from(document.querySelectorAll('div.field_select_links'));
            return filters.find(filter => filter.querySelector('p')?.innerText.trim().toLowerCase() === key.toLowerCase());
        }, { key });

        if (!filterElement) { return false; }
        await filterElement.asElement().click();

        // Busca la opción dentro del dropdown
        const optionElementHandle = await page.evaluateHandle(({ filterElement, value }) => {
            const options = filterElement.querySelectorAll('li span.buildLink');
            return Array.from(options).find(option => option.innerText.trim().toLowerCase() === value.toLowerCase());
        }, { filterElement, value });

        if (!optionElementHandle) { return false; }
        const optionElement = optionElementHandle.asElement();
        await optionElement.click();

        const hasOffers = await page.evaluate(() => {
            return document.querySelectorAll('article.box_offer').length > 0;
        });

        if (!hasOffers) {return false;}
        return true;
    } catch (error) {
        console.log(`Error en el filtro: ${error.message}`);
        return false;
    }
}

const pullData = async (page, keywords) => {
    await page.waitForSelector('article.box_offer');
    console.log('Buscando datos...');
    const result = await page.evaluate(async () => {
        const works = [];
        const cleanText = (text) => text.replace(/\n/g, '').replace(/<br\s*\/?>/g, ' | ').trim();
        try {
            
            const elements = document.querySelectorAll('article.box_offer');

            for (const element of elements) {
                const data = {};

                const titleElement = element.querySelector('h2 a');
                const companyElement = element.querySelector('a.fc_base.t_ellipsis');
                const locationElement = element.querySelector('p.fs16.fc_base.mt5 span.mr10');
                const salaryElement = element.querySelector('div.fs13.mt15 span.dIB.mr10');
                const urlElement = element.querySelector('h2 a');

                data.code = element.id;
                data.platform = 'computrabajo';
                data.title = titleElement ? titleElement.innerText.trim() : null;
                data.company = companyElement ? companyElement.innerText.trim() : null;
                data.location = locationElement ? locationElement.innerText.trim() : null;
                // data.salary = salaryElement ? salaryElement.innerText.trim() : null;
                data.url = urlElement ? urlElement.href : null;
                data.date_posted = new Date().toISOString().slice(0, 10);
                data.date_expires = null;
                data.keywords = keywords;

                await element.click();
                const detailElement = document.querySelector('div.box_detail');
                if (detailElement) {
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const descriptionElement = detailElement ? detailElement.querySelector('div.fs16') : null;
                    const rawDescription = descriptionElement ? descriptionElement.innerHTML : null;
                    if (rawDescription) {
                        data.description = cleanText(rawDescription);
                    } else {
                        data.description = null;
                    }
                }
                works.push(data);
            }
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
const checkPage = async (page) => {
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
};

export const getData = async (params) => {
    const browser = await chromium.launch({
        headless: false
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0',
        });
    const page = await context.newPage();
    const result = await page.goto(config.url.computrabajo, { waitUntil: 'networkidle' });

    const isPageActive = await checkPage(result);
    if (!isPageActive) {
        return [];
    }

    const rows = [];
    for (let index = 0; index < params.search.length; index++) {

        await searchJobs(page, params.search[index]);
        const isFilterActive = await filterPage(page, params.filter[0]);

        if(isFilterActive) {
            while (true) {
                const data = await pullData(page, params.search[index]);
                rows.push(...data);
    
                const hasNext = await nextPagination(page);
                console.log(hasNext);
                if (!hasNext) {
                    break;
                }
            }
        }
    }

    await browser.close();
    return rows;
}