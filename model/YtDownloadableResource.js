const directories = [
    "dia-1",
    "dia-2",
    "dia-3",
    "dia-4",
    "dia-5",
];

const youtubedl = require('youtube-dl');
const fs = require('fs');
const { pipeline } = require('stream');

class YtDownloadableResource {

    constructor(url, filename) {
        this._url = url;
        this._filename = filename;
    }

    get parentDirname() {
        return directories[this.day];
    }

    get day() {
        return parseInt(this.filename.charAt(4));
    }

    get filename() {
        return this._filename;
    }

    get fullPath() {
        const parentDirname = this.parentDirname;
        const filename = this.filename;
        return directories.includes(parentDirname) ? `${parentDirname}/${filename}` : filename;
    }

    download() {
        const video = youtubedl(this.url,
            ['--format=18'],
            { cwd: __dirname })

        video.on('info', function (info) {
            console.log('Iniciando descarga')
            console.log('Video: ' + info._filename)
            console.log('Tamaño: ' + info.size)
        })

        pipeline(video, fs.createWriteStream('Nueva carpeta/' + this.fullPath),
            (err) => {
                if (err) {
                    console.error('Ocurrio el siguiente error', err);
                } else {
                    console.log('Descarga exitosa');
                }
            });
    }
}

module.exports = YtDownloadableResource;