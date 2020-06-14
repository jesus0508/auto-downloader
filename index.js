const Scraper = require("./model/Scraper");
const DownloadableResource = require("./model/DownloadableResource");
const { makeRootDirectory, makeParentDirectories } = require("./model/Utils");
const { URLS, ROOT_DIRECTORY, SUB_DIRECTORIES } = require('./model/Constants');


async function main() {

    const mainScraper = new Scraper(URLS[0]);
    await mainScraper.init();
    const promiseGetMainPdfResources = mainScraper.getPdfResources();

    const activarteScraper = new Scraper(URLS[1]);
    await activarteScraper.init();
    const promiseGetActivartePdfResources = activarteScraper.getPdfResources();

    const mainYtScraper = new Scraper(URLS[0]);
    await mainYtScraper.init();
    const promiseGetMainYtResources = mainYtScraper.getYtResources();

    makeRootDirectory(ROOT_DIRECTORY);
    makeParentDirectories(SUB_DIRECTORIES);

    Promise.all([promiseGetMainPdfResources, promiseGetActivartePdfResources, promiseGetMainYtResources])
        .then(([mainPdfResources, activartePdfResources, mainYtResources]) => {
            const resources = [...mainPdfResources, ...activartePdfResources, ...mainYtResources];
            resources.forEach(resource => resource.download());
        });
}

main();