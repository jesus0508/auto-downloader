const puppeteer = require("puppeteer");

const UrlEnum = {
    MAIN: "https://aprendoencasa.pe/#/planes-educativos/level.inicial.grade.5.speciality.0/resources",
    ACTIVARTE: ""
};

const SelectorEnum = {
    MAIN: '.resources__content',
    PDF: '.resources__resource',
    YT: 'a[href="#"]',
    IFRAME: 'iframe',
    MODAL: '.MuiDialog-root',
    MODAL_BUTTON: 'button'
}

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

async function getAllMainResourceUrls(url) {
    const page = await loadPage(url);
    await page.waitForSelector(SelectorEnum.PDF);
    const mainElement = await page.$(SelectorEnum.MAIN);
    const pdfUrls = await getPdfUrls(mainElement);
    const videoUrls = await getYtUrls(page,mainElement);
    return [...pdfUrls, ...videoUrls];
}

function getPdfUrls(elementHandle) {
    return elementHandle.$$eval(SelectorEnum.PDF, elements => {
        return elements
            .map(element => element.href)
            .filter(url => url.substr(-4) === ".pdf"); //  los 4 ultimos caracteres
    });
}

async function getYtUrls(page, elementHandle) {
    const aElements = await elementHandle.$$(SelectorEnum.YT);
    const videoUrls = [];
    let src;
    for (aElement of aElements) {
        await aElement.click();
        await page.waitForSelector(SelectorEnum.MODAL);
        const modalElement = await page.$(SelectorEnum.MODAL);
        src = await modalElement.$eval(SelectorEnum.IFRAME, element => element.src);
        videoUrls.push(src);
        await (await modalElement.$(SelectorEnum.MODAL_BUTTON)).click();
        await page.waitFor(2500);
    }
    return videoUrls;
}

function main() {
    getAllMainResourceUrls(UrlEnum.MAIN).then(resp => console.log(resp));
}

main();
