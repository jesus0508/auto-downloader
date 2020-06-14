const { ROOT_DIRECTORY, SUB_DIRECTORIES } = require('./Constants');

class DownloadableResource {

    constructor(url) {
        this.url = url;
    }

    get parentPath() {
        const index = this.day;
        return Number.isInteger(index) ? SUB_DIRECTORIES[index - 1] : ROOT_DIRECTORY;
    }

    get fullPath() {
        return `${this.parentPath}/${this.filename}`;
    }

    get day() { }

    get filename() { }

    download() { }
}

module.exports = DownloadableResource;