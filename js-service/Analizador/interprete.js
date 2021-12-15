var parser = require('./analizador');
const { Nodo } = require('./Nodo');

const response = {
    status: 0,
    payload: undefined
};


function analizar(text) {
    // console.log('analizando: ' + text)
    let salida = parser.analizar(text);
    let status;

    if (salida != null) {

        if (salida.terrores.length <= 0) {
            status = 0;
        } else {
            console.log('se han encontrado errores');
            status = 1;
            cleanTree(salida.arbol);
        }

        response.status = status;
        response.payload = salida;

    } else {
        response.status = 2;
        response.payload = undefined;
    }

    return response;
}


function cleanTree(raiz) {
    if (raiz == null) {
        return;
    }

    for (let index = 0; index < raiz.hijos.length; index++) {
        let flag = raiz.hijos[index] instanceof Nodo;
        if (!flag) {
            raiz.hijos.splice(index, 1);
            index--;
        }
        cleanTree(raiz.hijos[index]);
    }
}

module.exports.analizar = analizar;