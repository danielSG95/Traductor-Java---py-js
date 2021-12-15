const sha256 = require('crypto-js').SHA256;

class Nodo{
    constructor(etiqueta, valor = '', nombre = '') {
        this.etiqueta = etiqueta;
        this.nombre = nombre;
        this.valor = valor;
        this.hijos = [];
        this.hash = this.generate_hash();

    }  

    generate_hash(){
        var current_date = (new Date().valueOf().toString());
        var random = Math.random().toString();
        return sha256(current_date + random);
    }
}

module.exports.Nodo = Nodo;