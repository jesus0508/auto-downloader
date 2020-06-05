const directories = [
    "dia-1",
    "dia-2",
    "dia-3",
    "dia-4",
    "dia-5",
];
const ROOT = "resources";
const youtubedl = require('youtube-dl');
const fs = require('fs');
const { pipeline } = require('stream');

class YtDownloadableResource {

    constructor(url, filename) {
        this._url = url;
        this._filename = filename;
    }

    get parentDirname() {
        const index = this.day;
        return Number.isInteger(index) ? directories[index - 1] : "";
    }

    get day() {
        return parseInt(this._filename.charAt(4));
    }

    get filename() {
        return this.clearFilename().concat(".mp4");
    }

    clearFilename() {
        return this._filename.replace(/["'!¡¿?():]/g, "").trim();
    }

    get fullPath() {
        const parentDirname = this.parentDirname;
        const filename = this.filename;
        return directories.includes(parentDirname) ? `${parentDirname}/${filename}` : filename;
    }

    download() {
        this.video = youtubedl(this._url,
            ['--format=18'],
            { cwd: __dirname });
        console.log(this.fullPath);
        this.video.on('info', function (info) {
            console.log('Iniciando descarga...')
            console.log('Video: ' + info._filename)
            console.log('Tamaño: ' + info.size)
        })

        pipeline(this.video, fs.createWriteStream(`${ROOT}/${this.fullPath}`),
            (err) => {
                if (err) {
                    console.error('Ocurrio el siguiente error', err);
                } else {
                    console.log('Descarga exitosa!!!');
                }
            });
    }
}

module.exports = YtDownloadableResource;