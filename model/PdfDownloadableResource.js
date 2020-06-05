const directories = [
    "dia-1",
    "dia-2",
    "dia-3",
    "dia-4",
    "dia-5",
];
const fetch = require('node-fetch');
const { pipeline } = require('stream');
const fs = require('fs');

class PdfDownloadableResource {

    constructor(url) {
        this.url = url;
    }

    get parentDirname() {
        const filename = this.filename;
        return filename.substr(filename.indexOf('dia'), 5);
    }

    get filename() {
        return this.url.substring(this.url.lastIndexOf('/') + 1);
    }

    get type() {
        return this.url.substr(-4);
    }

    get fullPath() {
        const parentDirname = this.parentDirname;
        const filename = this.filename;
        return directories.includes(parentDirname) ? `${parentDirname}/${filename}` : filename;
    }

    download() {
        fetch(this.url)
            .then(resp => {
                pipeline(resp.body, fs.createWriteStream('Nueva carpeta/' + this.fullPath),
                    (err) => {
                        if (err) {
                            console.error('Fallo la descarga', err);
                        } else {
                            console.log('Archivo descargado');
                        }
                    });
            });
    }

    static makeParentDirectories(){
        directories.forEach(d => fs.mkdirSync(`Nueva carpeta/${d}`));
    }
}

module.exports = PdfDownloadableResource;