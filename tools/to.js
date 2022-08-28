// Función que desestructura una promesa en un array con el error y el resultado
// Está basada en la gestión de errores de Go
const to = (promise) => {
    return promise
        .then(data => [null, data])
        .catch(err => [err, null]);
}

exports.to = to;