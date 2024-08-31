import { chromium } from 'playwright';
import config from '../../config.js';

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

const searchJobs = async (page, params) => {
    const { keywords, location } = params;
    
    await page.waitForSelector('form.sc-kafWEX');
    const serchContainer = await page.evaluate(() => {
        return document.querySelector('form.sc-kafWEX')?true:false
    })
    if(serchContainer){

        // Limpiar la barra de busqueda
        await page.evaluate(() => {
            document.querySelector('#busqueda  input').value = '';
            document.querySelector('#lugar-de-trabajo input').value = '';
        })
        await page.type('#busqueda  input', keywords);
        await page.type('#lugar-de-trabajo input', location);
        await page.click('button.sc-jwKygS');
    }
}

const filterPage = async (page, params) => {

    try {
        for (const [key, value] of Object.entries(params)) {
            const filterElement = await page.evaluateHandle(({ key }) => {
                const filters = Array.from(document.querySelectorAll('button.sc-ixZBQc'));
                return filters.find(filter => filter.innerText.trim().toLowerCase() === 'Fecha de publicación'.toLowerCase());
            }, { key });

            if (filterElement) {
                await filterElement.asElement().click();

                // Busca el valor dentro del dropdown y haz click en él
                await page.waitForSelector('div.sc-ddash.sc-yyapj');

                // Hacer clic en el valor específico dentro del menú
                const filterValue = await page.evaluateHandle((text) => {
                    const values = Array.from(document.querySelectorAll('div.sc-ddash.sc-yyapj button'));
                    return values.find(valueButton => valueButton.innerText.trim() === text);
                }, value);

                if (filterValue) {
                    await filterValue.click();
                } else {
                    console.log(`Valor no encontrado: ${value}`);
                }

                await page.waitForNavigation({ waitUntil: 'networkidle' });
            }
        }
    } catch (error) {
        console.log(`Error en el filtro: ${error.message}`);
    }
}

const pullData = async (page) => {
    await page.waitForSelector('div#listado-avisos');
    console.log('Buscando datos...');
    const result = await page.evaluate(() => {
        const works = [];
        try {
            
            const elements = document.querySelectorAll('div.sc-jYIdPM.ipwKGb.sc-ddcOto');

            elements.forEach(element => {
                const data = {};
                data.id = element.id;

                const titleElement = element.querySelector('h3.sc-dCVVYJ');
                const companyElement = element.querySelector('div.sc-fguZLD h3');
                const locationElement = element.querySelectorAll('h3.sc-LAuEU')[0];
                const typeElement = element.querySelectorAll('h3.sc-LAuEU')[1];
                const urlElement = element.querySelector('a');

                data.title = titleElement ? titleElement.innerText.trim() : 'N/A';
                data.company = companyElement ? companyElement.innerText.trim() : 'N/A';
                data.location = locationElement ? { "city": locationElement.innerText.trim() } : null;
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
    console.log(result);
    return result;
};

const nextPagination = async (page) => {
    const nextButton = await page.$('a.sc-cOoQYZ.gsapBC');
    console.log(nextButton)
    if (nextButton) {
        const isDisabled = await page.evaluate((button) => {
            return button.hasAttribute('disabled');
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
    const rows = [];
    const browser = await chromium.launch({
        headless: false
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0',
        });
    const page = await context.newPage();
    const result = await page.goto(config.url.bumeran, { waitUntil: 'networkidle' });

    const isPageActive = await checkPage(result);
    if (!isPageActive) {
        return [];
    }

    var i = 0;
    while (i<1) {
        const search = {'keywords': params.search.keywords[i], 'location': ''};
        await searchJobs(page, search);
        // await filterPage(page, params.filter);

        while (true) {
            const data = await pullData(page);
            rows.push(...data);

            const hasNext = await nextPagination(page);
            console.log(hasNext);
            if (!hasNext) {
                break;
            }
        }
        i++;
    }
    // await browser.close();
    return rows;
}