var parser = require('./analizador')
var arbol = require('./arbol').arbol
var traduccion = require('./traduccion').traductor;
const fs = require('fs');

function analizar() {
    try {
        text = fs.readFileSync('../Entradas/test1.java');
        salida = parser.parse(text.toString());        
            
        if(salida.terrores.length > 0) {
            console.log('Se han encontrado errores');
        }
        
        arbol = new arbol(salida.arbol);
        arbol.graficar();

    } catch (error) {
        console.error('error en en analizador: ' + error);
    }
    
}

analizar();