const Scraper = require("./model/Scraper");
const PdfDownloadableResource = require("./model/PdfDownloadableResource");
const YtDownloadableResource = require("./model/YtDownloadableResource");

const urls = [
    "https://aprendoencasa.pe/#/planes-educativos/level.inicial.grade.5.speciality.0/resources",
    "https://aprendoencasa.pe/#/planes-educativos/level.inicial.grade.0.speciality.act/resources"
];

async function main() {

    const mainScraper = new Scraper(urls[0]);
    await mainScraper.init();
    const promiseGetMainPdfResources = mainScraper.getPdfResources();

    const activarteScraper = new Scraper(urls[1]);
    await activarteScraper.init();
    const promiseGetActivartePdfResources = activarteScraper.getPdfResources();

    const mainYtScraper = new Scraper(urls[0]);
    await mainYtScraper.init();
    const promiseGetMainYtResources = mainYtScraper.getYtResources();

    Promise.all([promiseGetMainPdfResources, promiseGetActivartePdfResources, promiseGetMainYtResources])
        .then(([mainPdfResources, activartePdfResources, mainYtResource]) => {
            //PdfDownloadableResource.makeParentDirectories();
            const pdfResources = [...mainPdfResources, ...activartePdfResources];
            console.log(pdfResources.length);
            console.log(mainYtResource.length);
        });

}

main();