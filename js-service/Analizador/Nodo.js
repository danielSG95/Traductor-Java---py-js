
const sha256 = require('crypto-js').SHA256;

class Nodo {

    constructor(etiqueta, valor) {
        this.etiqueta = etiqueta;
        this.valor = valor;
        this.hijos = [];
        this.hash = this.generate_hash();
    }

    agregarHijo(hijo) {
        this.hijos.push(hijo);
    }

    generate_hash() {
        var current_date = (new Date().valueOf().toString());
        var random = Math.random().toString();
        return sha256(current_date + random);
    }

    getHijos() {
        return this.hijos;
    }
}

module.exports.Nodo = Nodo;