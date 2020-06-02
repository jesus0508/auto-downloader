const puppeteer = require("puppeteer");
const Url = require("./model/Url");
const Selector = require("./model/Selector");

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

async function getAllMainResourcesUrl() {
    const page = await loadPage(Url.MAIN);
    const pdfUrls = await getPdfUrls(page);
    const videoUrls = await getYtUrls(page);
    return [...pdfUrls, ...videoUrls];
}

async function getMainElement(page){
    await page.waitForSelector(Selector.PDF);
    return page.$(Selector.MAIN);
}

async function getPdfUrls(page) {
    const mainElement = await getMainElement(page);
    return mainElement.$$eval(Selector.PDF, elements => {
        return elements
            .map(element => element.href)
            .filter(url => url.substr(-4) === ".pdf"); //  los 4 ultimos caracteres
    });
}

async function getYtUrls(page) {
    const mainElement = await getMainElement(page);
    const aElements = await mainElement.$$(Selector.YT);
    const videoUrls = [];
    let src;
    for (aElement of aElements) {
        await aElement.click();
        await page.waitForSelector(Selector.MODAL);
        const modalElement = await page.$(Selector.MODAL);
        src = await modalElement.$eval(Selector.IFRAME, element => element.src);
        videoUrls.push(src);
        await (await modalElement.$(Selector.MODAL_BUTTON)).click();
        await page.waitFor(2500);
    }
    return videoUrls;
}

function main() {
    getAllMainResourcesUrl().then(resp => console.log(resp));
}

main();
