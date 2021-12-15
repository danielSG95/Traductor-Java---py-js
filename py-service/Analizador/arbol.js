const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Arbol{
    constructor(raiz){
        this.raiz = raiz;
    }

     async graficar(){
        if(this.raiz === undefined){
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

            console.log(dotPath);


            fs.writeFile(dotPath, stringBuffer, { flag: 'w'}, function(err) {
                if(err) console.log(err);
                return;
            });

            const { stdout, stderr } = await exec('dot -Tpdf ' + dotPath + ' -o ' + outPath);
            console.log(stdout);
            console.log(stderr);

            return true;

        } catch (error) {
            console.log(error);
        }

    }


    generarDot(raiz){
        if(raiz == undefined){
            return;
        }

        let stringBuffer = '';
        try {
            
            stringBuffer += 'nodo' + raiz.hash;
            stringBuffer += '[label="Etiqueta: ' + raiz.etiqueta;
            if(raiz.valor !== '' && raiz.valor !== undefined && raiz.etiqueta != 'COMENTARIO'){
                stringBuffer += ' \\nValor: ' + this.remove_quotes(raiz.valor.toString());
            }

            stringBuffer += '"];\n';

            for(var i = 0; i < raiz.hijos.length; i++){
                let temporal = raiz.hijos[i];
                if(temporal !== undefined){
                    stringBuffer += 'nodo' + temporal.hash + '[label="Etiqueta: ';
                    stringBuffer += temporal.etiqueta;
                    if(temporal.valor !== '' && temporal.valor !== undefined && raiz.etiqueta != 'COMENTARIO'){
                        stringBuffer += ' \\nValor: ' + this.remove_quotes(temporal.valor.toString());
                    }

                    stringBuffer += '"];\n';

                    stringBuffer += 'nodo' + raiz.hash;
                    stringBuffer += '->';
                    stringBuffer += 'nodo' + temporal.hash + '\n';

                    stringBuffer += this.generarDot(temporal);

                }
            }

        } catch (error) {
            console.log(error);
        }

        return stringBuffer;
    }


    remove_quotes(text) {
        while(text.includes('"')) {
            text = text.replace('"', '');
        }

        return text;
    }

}

module.exports.Arbol = Arbol;