const puppeteer = require('puppeteer');
const Selector = require('./Selector');
const PdfDownloadableResource = require('./PdfDownloadableResource');
const YtDownloadableResource = require("./YtDownloadableResource");

class Scraper {

    constructor(url) {
        this.url = url;
    }

    async init() {
        this.browser = await puppeteer.launch({
            //headless: false,
            //slowMo: 100,
            //devtools: true
        });
        this.page = await this.browser.newPage();
        this.page.setViewport({ width: 1200, height: 900 });
        await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
    }

    async getPdfResources() {
        await this.page.waitForSelector(Selector.PDF);
        const hrefs = await this.page.$$eval(Selector.PDF, elements => {
            return elements
                .map(element => element.href)
                .filter(href => href.substr(-4) === ".pdf");
        });
        this.browser.close();
        return hrefs && hrefs.map(hrefs => new PdfDownloadableResource(hrefs));
    }

    async getYtResources() {
        const videoResources = [];
        let src;
        let filename;
        let modalElement;
        await this.page.waitForSelector(Selector.YT);
        const aElements = await this.page.$$(Selector.YT);
        for (let aElement of aElements) {
            await aElement.click();
            await this.page.waitForSelector(Selector.IFRAME);
            modalElement = await this.page.$(Selector.MODAL);
            src = await modalElement.$eval(Selector.IFRAME, iframe => iframe.src);
            filename = await modalElement.$eval(Selector.MODAL_TITLE, h2 => h2.innerText.trim());
            videoResources.push(new YtDownloadableResource(src, filename));
            await (await modalElement.$(Selector.MODAL_BUTTON)).click();
            await this.page.waitForFunction(selector => !document.querySelector(selector), {}, Selector.MODAL); //Espera a que desaparezca el modal
        }
        this.browser.close();
        return videoResources;
    }
}

module.exports = Scraper;