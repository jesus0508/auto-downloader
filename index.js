const puppeteer = require("puppeteer");
const URL = "https://aprendoencasa.pe/#/planes-educativos/level.inicial.grade.5.speciality.0/resources";
const SELECTOR = ".resources__resource";

async function loadPage(url) {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 900 });
    await page.goto(url);
    return page;
}

async function getAllURLResources(url, selector) {
    const page = await loadPage(url);
    await page.waitForSelector(selector);
    const pdfUrls = await page.$$eval(selector, elements => {
        return elements
            .map(element => element.href)
            .filter(url => url.substr(-4) === ".pdf");
    });

    const elementHandles = await page.$$('a[href="#"]');
    const videoUrls = [];
    let src;
    for (elementHandle of elementHandles) {
        await elementHandle.click(),
            await page.waitForSelector('iframe')
        src = await page.$eval('iframe', element => element.src)
        videoUrls.push(src);
        await (await page.$('.MuiDialogActions-root button')).click();
        await page.waitFor(3000);
    }
    return [...pdfUrls, ...videoUrls];
}

function main() {
    getAllURLResources(URL, SELECTOR).then(resp => console.log(resp));
}

main();