const fetch = require('node-fetch');
const { pipeline } = require('stream');
const { createWriteStream } = require('fs');
const { downloadErrorHandler } = require('./ErrorHandler');
const DownloadableResource = require('./DownloadableResource')

class PdfDownloadableResource extends DownloadableResource {

    constructor(url) {
        super(url);
    }

    get day() {
        const filename = this.filename;
        return parseInt(filename.charAt(filename.indexOf("dia-") + 4));
    }

    get filename() {
        return this.url.substring(this.url.lastIndexOf('/') + 1);
    }

    download() {
        fetch(this.url)
            .then(resp => {
                pipeline(resp.body, createWriteStream(super.fullPath), downloadErrorHandler(this.url));
            });
    }

}

module.exports = PdfDownloadableResource;