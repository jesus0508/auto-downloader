exports.downloadErrorHandler = (name) => (error) => {
    if (error) {
        console.error('Ocurrio un error ... :(\n', error, name);
    } else {
        console.log('Archivo descargado exitosamente! :)', name);
    }
}