const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Nodo } = require('./Nodo');

class Arbol {
    constructor(arbol) {
        this.raiz = arbol;

        // this.escribir_consola(this.raiz);
    }


    escribir_consola(raiz) {
        if (raiz == null) {
            return;
        }

        console.log(raiz);


        let list = raiz.getHijos();

        for (let index = 0; index < list.length; index++) {
            this.escribir_consola(list[index]);
        }
    }

    async graficar() {
        if (this.raiz === undefined) {
            return;
        }

        let stringBuffer = "";

        stringBuffer += 'digraph G{\n graph[overlap = true, fontsize= 0.5];\n';
        stringBuffer += 'node[shape=ellipse, fontname=Helvetica, fixedsize=true, width=3.5, height=0.9];\n';
        stringBuffer += 'edge[color = black];\n';
        stringBuffer += this.generarDot(this.raiz);
        stringBuffer += '\n}'

        try {
            let dotPath = path.resolve('Recursos/arbol.dot');
            let outPath = path.resolve('Recursos') + '/arbol.pdf';
            fs.writeFile(dotPath, stringBuffer, {flag: 'w'}, function (err) {
                if (err) return console.log(err);
            });
            const { stdout, stderr } = await exec('dot -Tpdf ' + dotPath + ' -o ' + outPath)
            console.log(stdout);
            console.log(stderr);

        } catch (error) {
            console.log(`catch error: ` + error);
        }

    }



    generarDot(raiz) {
        let test = raiz instanceof Nodo;
        if (raiz == undefined || test == false || raiz.etiqueta == undefined) {
            console.log('abortando');
            console.log(raiz);
            return "";
        }

        // console.log(raiz);

        if( raiz.etiqueta == 'undefined') {
            console.log('undefined raiz');
            console.log(raiz);
        }

        let stringBuffer = "";

        try {
            stringBuffer += "nodo" + raiz.hash;
            stringBuffer += '[label="Etiqueta: ' + raiz.etiqueta;
            if (raiz.valor !== '' && raiz.valor !== undefined && raiz.etiqueta != 'COMENTARIO') {
                stringBuffer += ' \\nValor: ' + this.remove_quotes(raiz.valor.toString());
            }

            stringBuffer += '"];\n';

            for (var i = 0; i < raiz.getHijos().length; i++) {
                let temporal = raiz.getHijos()[i];
                if (temporal !== undefined) {
                    stringBuffer += 'nodo' + temporal.hash + '[label="Etiqueta: ';
                    stringBuffer += temporal.etiqueta;
                    if (temporal.valor !== '' && temporal.valor !== undefined && raiz.etiqueta != 'COMENTARIO') {
                        stringBuffer += ' \\nValor: ' + this.remove_quotes(temporal.valor.toString());
                    }

                    stringBuffer += '"];\n';

                    stringBuffer += "nodo" + raiz.hash;
                    stringBuffer += '->';
                    stringBuffer += 'nodo' + temporal.hash + '\n';

                    stringBuffer += this.generarDot(temporal);
                }
            }
        } catch (error) {
            console.log(raiz);
        }





        return stringBuffer;

    }

    remove_quotes(string) {
        while (string.includes('"')) {
            string = string.replace('"', '');
        }

        return string;
    }

}


module.exports.arbol = Arbol;