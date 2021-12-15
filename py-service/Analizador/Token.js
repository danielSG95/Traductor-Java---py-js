
class Token{
    constructor(token, lexema, linea, columna, descripcion) {
        this.token = token;
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
        this.descripcion = descripcion;    
    }
}

class Error{
    constructor(lexema, linea, columna, tipo, descripcion) {
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }
}


module.exports.Token = Token;
module.exports.Error = Error;