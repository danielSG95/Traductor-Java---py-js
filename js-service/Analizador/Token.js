

class Token {
    constructor(token, lexema, linea, columna) {
        this.token = token;
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
    }

}

class Error {
    constructor(lexema, linea, columna, esperados, tipo) {
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
        this.esperados = esperados;
        this.tipo = tipo;
    }
}

module.exports.Token = Token;
module.exports.Error = Error;