const youtubedl = require('youtube-dl');
const { pipeline } = require('stream');
const { createWriteStream } = require('fs');
const { downloadErrorHandler } = require('./ErrorHandler');
const DownloadableResource = require('./DownloadableResource')

class YtDownloadableResource extends DownloadableResource{

    constructor(url, filename) {
        super(url);
        this._filename = filename;
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

    download() {
        this.video = youtubedl(this.url,
            ['--format=18'],
            { cwd: __dirname });

        this.video.on('info', function (info) {
            console.log('Iniciando descarga...')
            console.log('Video: ' + info._filename)
        })

        pipeline(this.video, createWriteStream(this.fullPath), downloadErrorHandler(this._filename));
    }
}

module.exports = YtDownloadableResource;