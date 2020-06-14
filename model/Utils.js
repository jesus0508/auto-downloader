const { mkdirSync } = require('fs');

const makeRootDirectory = (path) => {
    mkdirSync(path);
}

const makeParentDirectories = (paths) => {
    paths.forEach(path => mkdirSync(path));
}

module.exports = {
    makeRootDirectory,
    makeParentDirectories
};