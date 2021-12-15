const fs = require('fs');
const { Token } = require('./Token');
const Parser = require('./parser').Parser;
const Scanner = require('./scanner').Scanner;
const Arbol = require('./arbol').Arbol;
const path = require('path');
const Traductor = require('./traductor').Traductor;


function analizar(text){
    let response = {
        status: 0,
        payload: null
    }

    try {
        let status = 0;
        let s = null;
        let parser = null;

        s = new Scanner(text);
        s.scanner();
        s.tokens.push(new Token('$', '', -1, -1, '', ''));

        console.log('ahora se llama al analizador sintactico');
        parser = new Parser(s.tokens, s.errores);

        parser.parse();
        console.log('SE HA TERMINADO EL ANALISIS...');

        // let traductor = new Traductor(parser.raiz);
        // traductor.traducir();

        if(parser.errores.length > 0) {
            console.log(parser.errores);
            status = 1;
        }

        response.status = status;
        response.payload = parser;

    } catch (e) {
        console.log(e);
        //esto seria como un error critico en algun punto de la ejecucion de mi programa
        response.status = 2;
        response.payload = undefined;
    }

    return response;
}

//Todo esto se elimina cuando inicie a trbajar con el servidor unicamente
// var ruta = path.resolve('Entradas/test1.java');
//
// var data = fs.readFileSync(ruta);
//
// analizar(data.toString());


module.exports.analizar = analizar;