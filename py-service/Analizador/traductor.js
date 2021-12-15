const { S_IWOTH } = require('constants');
const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js

class Traductor{
    constructor(raiz) {
        this.raiz = {...raiz};
        this.buffer = [];
        this.tab = 0;
        this.interface_flag = false;
        this.expresion = [];
        this.dplus = false;
    }

    traducir(){
        this.traducir_(this.raiz);

        console.log(this.printList());

        try {
            // console.log();
            fs.writeFileSync(path.resolve('Recursos/traduccion.py'), this.printList(), function(err) {
                if(err) return console.log(err);
            });
            // fs.writeFileSync(path.resolve('Recursos/traduccion.py'),this.printList(), function(err){
            //     if(err) return console.log(err);
            // } );
        } catch (error) {
            console.log(error);
        }
    }

    printList() {
        let temp = '';
        for(let i = 0; i < this.buffer.length; i++){
            temp += this.buffer[i];
        }

        return temp;
    }

    traducir_(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 's':
                this.traducir_(raiz.hijos[0]);
                break;
            case 'ini':
                // this.traducir_(raiz.hijos[0]);
                for(let i = 0; i < raiz.hijos.length; i++) {
                    this.traducir_(raiz.hijos[i]);
                }
                break;
            case 'inir':
                this.traducir_(raiz.hijos[0]);
                break;
            case 'clase':
                this.clase_handler(raiz);
                break;
        }

    }

    clase_handler(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()) {
            case 'clase':
                for(let i = 0; i < raiz.hijos.length; i++){
                    this.clase_handler(raiz.hijos[i]);
                }
                this.tab = 0;
                break;
            case 't_class':
                if(raiz.nombre == 'tk_interface') {
                    // llamar al manejador de interfaces.
                    this.interface_flag = true
                    console.log('interface');
                } else  {
                    //clase normal
                    this.interface_flag = false;
                }
                this.writeText('class ' + raiz.valor + ':\n');
                this.tab++;
                break;
            case 'l_cuerpo_clase':
                this.clase_handler(raiz.hijos[0]);
                this.clase_handler(raiz.hijos[1]);
                break;
            case 'l_cuerpo_claser':
                if(raiz.hijos.length > 0 ){
                    this.clase_handler(raiz.hijos[0]);
                }
                
                break;
            case 'cuerpo_clase':
                //ahora si llamo a el controlador del cuerpo
                this.clase_handler(raiz.hijos[0]);
                break;
            case 'declaracion':
                //declaracion handler
                console.log('Detectando una declaracion');
                this.declaracion_handler(raiz);
                break;
            case 'metodo':
                // metodo handler
                console.log('Detectando un metodo');
                this.metodo_handler(raiz);
                break;
            case 'comentario':
                this.writeText('');
                this.buffer.push(this.procesar_comentario(raiz));
                break;
        }
    }

    declaracion_handler(raiz){
        if(raiz === undefined) return;

        // if(this.interface_flag) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 'declaracion':
                for(let i = 0; i < raiz.hijos.length; i++){
                    this.declaracion_handler(raiz.hijos[i]);
                }
                break;
            case 'l_id':
                this.writeText(''); // mando a escribir para agregarle los tabuladores
                this.capturar_l_id(raiz);
                this.buffer.push('\n');
                break;
        }

    }

    capturar_l_id(raiz){
        if(raiz === undefined){
            return;
        }

        switch (raiz.etiqueta.toLowerCase()){
            case 'l_id':
                this.buffer.push(raiz.valor);
                this.capturar_l_id(raiz.hijos[0]);
                this.capturar_l_id(raiz.hijos[1]);
                break;
            case 'l_idr':

                if(raiz.hijos.length > 0 ) {
                    this.buffer.push('\n');
                    this.writeText('');
                    this.capturar_l_id(raiz.hijos[0]);
                }
                break;
            case 'asig':
                if(raiz.hijos.length > 0 ){
                    this.buffer.push(' = ');
                    this.capturar_expresion(raiz.hijos[0]);
                    this.buffer.push(...this.expresion);
                    this.expresion = [];
                    this.buffer.push('\n');
                } else {
                    this.buffer.push('=');
                    this.buffer.push('None ');
                }
                break;
        }
    }

    capturar_expresion(raiz){
        if(raiz === undefined) return;
        switch (raiz.etiqueta.toLowerCase()){
            case 'expresion':
                this.capturar_expresion(raiz.hijos[0]);
                this.capturar_expresion(raiz.hijos[1]);
                break;
            case 'fexp':
                if(raiz.valor != ''){
                    // this.buffer.push(" not ");
                    this.expresion.push(" not ");
                }
                
                this.capturar_expresion(raiz.hijos[0]);
                break;
            case 'texpp':
                if(raiz.hijos.length > 0 ){
                    // this.buffer.push(" and ");
                    this.expresion.push(' and ');
                    this.capturar_expresion(raiz.hijos[0]);
                    this.capturar_expresion(raiz.hijos[1]);
                }
                break;
            case 'exp':
                if(raiz.hijos.length > 0 ){
                    if(raiz.valor == '||') {
                        // this.buffer.push(' or ');
                        this.expresion.push(' or ');
                    } else {
                        // this.buffer.push(' ^ ');
                        this.expresion.push(' ^ ');
                    }

                    this.capturar_expresion(raiz.hijos[0]);
                    this.capturar_expresion(raiz.hijos[1]);
                }
                break;
            case 's_rel':
                // this.buffer.push(raiz.valor);
                this.expresion.push(raiz.valor);
                break;
            case 'tp':
                if(raiz.hijos.length > 0 ){
                    // this.buffer.push(raiz.valor);
                    this.expresion.push(raiz.valor);

                    this.capturar_expresion(raiz.hijos[0]);
                    this.capturar_expresion(raiz.hijos[1]);
                }
                break;
            case 'ep':
                if(raiz.hijos.length > 0) {
                    // this.buffer.push(raiz.valor);
                    this.expresion.push(raiz.valor);

                    this.capturar_expresion(raiz.hijos[0]);
                    this.capturar_expresion(raiz.hijos[1]);
                }
                break;
            case 'f':
                if(raiz.valor != '(') {
                    // this.buffer.push(raiz.valor);
                    this.expresion.push(raiz.valor);
                    if(raiz.hijos.length >0) {
                        this.capturar_expresion(raiz.hijos[0]);
                    }
                } else {
                    // this.buffer.push('(');
                    this.expresion.push('(');
                    this.capturar_expresion(raiz.hijos[0]);
                    // this.buffer.push(')');
                    this.expresion.push(')');
                }
                break;
            case 'e_op':
                if(raiz.valor != ''){
                    // this.buffer.push(raiz.valor); // ++ | -- 
                    if(raiz.valor == '++') {
                        // this.buffer.push(' + 1'); // ++
                        this.expresion.push(' + 1');
                        this.dplus = true;
                    } else {
                        // this.buffer.push(' - 1'); // --
                        this.expresion.push(' - 1');
                        this.dplus = true;
                    }
                }
                
                if(raiz.hijos.length > 0){
                    // this.buffer.push('(');
                    this.expresion.push('(');
                    this.capturar_expresion(raiz.hijos[0]);
                    // this.buffer.push(')');
                    this.expresion.push(')');
                }
                break;
            
            case 'l_argr':
                if(raiz.hijos.length > 0) {
                    // this.buffer.push(',');
                    this.expresion.push(',');
                    this.capturar_expresion(raiz.hijos[0]);
                }
                break;
            default:
                for(let i = 0; i < raiz.hijos.length; i++){
                    this.capturar_expresion(raiz.hijos[i]);
                }
                break;
        }
    }

    metodo_handler(raiz){
        if(raiz === undefined) return;

        // if(this.interface_flag) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 'metodo':
                this.metodo_handler(raiz.hijos[0]);
                this.buffer.push('\n');
                break;
            case 'tpm':
                for(let i = 0; i < raiz.hijos.length; i++) {
                    this.metodo_handler(raiz.hijos[i]);
                }
                break;
            case 'tipo':
                this.writeText('def ');
                this.buffer.push(raiz.valor);
                break;
            case 'parametros':
                this.buffer.push('(self');
                if(raiz.hijos.length > 0){
                    this.buffer.push(', ');
                    this.parametros_handler(raiz);
                }
                this.buffer.push('):\n');
                break;
            case 'op_metodo':
                if(this.interface_flag == true){
                    this.writeText('');
                    this.buffer.push('\tpass\n');
                    break;
                }
                if(raiz.hijos.length > 0 ){
                    this.tab++;
                    // this.writeText(''); // aumentar el tabulador
                    this.instrucciones_handler(raiz.hijos[0]);
                }
                this.tab--;
                break;
            case 'main':
                this.writeText('');
                this.buffer.push('def main(self, string):\n') //sera esto correcto maestro?
                this.tab++;
                this.instrucciones_handler(raiz.hijos[0]);
                this.tab--;
                break;
            
        }
    }

    instrucciones_handler(raiz){
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'instrucciones':
                this.instrucciones_handler(raiz.hijos[0]);
                this.instrucciones_handler(raiz.hijos[1]);
                break;
            case 'instruccionesr':
                if(raiz.hijos.length > 0 ){
                    this.instrucciones_handler(raiz.hijos[0]);
                }
                break;   
            case 'instruccion':
                this.instruccion_handler(raiz);
                break;             
        }
    }

    instruccion_handler(raiz){
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'instruccion':
                if(raiz.valor != 'return') {
                    this.writeText('');
                    this.buffer.push(raiz.valor);
                    this.buffer.push('\n');
                }
                this.instruccion_handler(raiz.hijos[0]);
                break;
            case 'declaracion':
                this.declaracion_handler(raiz);
            case 'llamada_asig':
                this.capturar_llamada_asig(raiz);
                break;
            case 'if':
                this.writeText('');
                this.buffer.push('if ');
                this.if_handler(raiz);
                break;
            case 'rexp':
                this.writeText('');
                this.buffer.push('return ');
                this.capturar_expresion(raiz.hijos[0]);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                this.buffer.push('\n');
                break;
            case 'for':
                this.for_handler(raiz, null);
                break;
            case 'do':
                this.do_handler(raiz);
                break;
            case 'while':
                this.while_handler(raiz);
                break;
            case 'print':
                this.print_handler(raiz, false);
                break;
            case 'comentario':
                this.writeText('');
                this.buffer.push(this.procesar_comentario(raiz));
                break;
        }
    }

    while_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'while':
                this.writeText('');
                this.buffer.push('while ');
                this.while_handler(raiz.hijos[0]);
                this.while_handler(raiz.hijos[1]);
                break;
            case 'expresion':
                this.capturar_expresion(raiz);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                this.buffer.push(':\n');
                break;
            case 'instrucciones':
                this.tab++;
                this.instrucciones_handler(raiz);
                this.tab--;
                break;
        }
    }

    do_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'do':
                this.writeText('');
                this.buffer.push('while True:#Do Statement\n');
                this.do_handler(raiz.hijos[0]);
                this.do_handler(raiz.hijos[1]);
                break;
            case 'instrucciones':
                this.tab++;
                this.instrucciones_handler(raiz);
                this.tab--;
                break;
            case 'expresion':
                this.tab++;
                this.writeText('');
                this.buffer.push('if ');
                this.capturar_expresion(raiz);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                this.buffer.push(':\n')
                this.writeText('');
                this.buffer.push('\tbreak\n');
                this.tab--;
                break;
        }
    }

    print_handler(raiz, flag) {
        if(raiz === undefined) return;

        console.log('en print');

        switch(raiz.etiqueta.toLowerCase()){
            case 'print':
                if(raiz.hijos[0].valor == 'println') {
                    flag = true;
                }
                this.print_handler(raiz.hijos[1], flag);
                break;
            case 'expresion':
                this.writeText('');
                this.buffer.push('print');
                this.buffer.push('(');
                this.capturar_expresion(raiz);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                // this.buffer.push('"');
                if(!flag){
                    this.buffer.push(', end = ""');
                }

                this.buffer.push(')\n');
                break;
        }
    }

    for_handler(raiz, inc) {
        if(raiz === undefined)return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'for':
                this.for_handler(raiz.hijos[0], raiz.hijos[2]); // declaracion
                this.for_handler(raiz.hijos[1], raiz.hijos[2]); // expresion
                this.for_handler(raiz.hijos[3], raiz.hijos[2]); // instrucciones
                break;
            case 'for_declaracion':
                this.declaracion_handler(raiz);
                break;
            case 'expresion':
                this.writeText('');
                this.buffer.push('while ');
                this.capturar_expresion(raiz);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                this.buffer.push(':#for statement \n');
                this.tab++;
                break;
            case 'incremento':
                this.writeText('');
                // this.capturar_expresion(raiz.hijos[0]);
                // this.buffer.push('=');
                // this.capturar_expresion(raiz.hijos[1]);
                this.incremento_handler(raiz);
                this.buffer.push('\n');
                break;
            
            case 'instrucciones':
                this.instrucciones_handler(raiz);

                this.for_handler(inc); //le agrego al final el incremento
                this.tab--;
                break;
        }
    }
    
    incremento_handler(raiz){
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'incremento':

                if(raiz.hijos[1].hijos.length <= 0) {
                    // operadores ++ | -- 
                    this.capturar_expresion(raiz.hijos[0]);
                    this.buffer.push(this.expresion[0]);
                    this.buffer.push(' = ');
                    this.buffer.push(...this.expresion);
                    this.expresion = [];
                } else {
                    // capturando la parte izquierda de la expresion
                    this.capturar_expresion(raiz.hijos[0]);
                    this.buffer.push(...this.expresion);
                    this.expresion = [];
                    this.buffer.push(' = ');
                    this.incremento_handler(raiz.hijos[1]);
                }
                break;
            case 'inc':
                if(raiz.hijos.length > 0 ){
                    this.capturar_expresion(raiz.hijos[0]);
                    this.buffer.push(...this.expresion);
                    this.expresion = [];
                }
                break;
        }


        // if(raiz.hijos[1].length > 0) {
        //     // tiene una igualacion.
        //     this.capturar_expresion(raiz.hijos[0]);
        //     this.buffer.push(...this.expresion);
        //     this.expresion = [];
        //     this.buffer.push(' = ');
        //     this.capturar_expresion(raiz.hijos[1].hijos[0]);
        //     this.buffer.push(...this.expresion);
        //     this.expresion = [];
        // } else {
        //     // es posible que este usando el operador ++ | -- 
        //     this.capturar_expresion(raiz.hijos[0]);
        //     this.buffer.push(this.expresion[0]);
        //     this.buffer.push(' = ');
        //     this.buffer.push(...this.expresion);
        //     this.expresion = [];            
        // }
    }

    if_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'if':
                for(let i = 0; i < raiz.hijos.length; i++) {
                    this.if_handler(raiz.hijos[i]);
                }
                break;
            case 'expresion':
                this.capturar_expresion(raiz);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                this.buffer.push(' :\n');
                this.tab++;
                // this.writeText('');
                break;
            case 'instrucciones':
                this.instrucciones_handler(raiz);
                this.tab--;
                break;
            case 'if_op':
                this.if_handler(raiz.hijos[0]);
                break;
            case 'else':
                if(raiz.hijos[0].etiqueta.toLowerCase() == 'if') {
                    this.writeText('');
                    this.buffer.push('elif ');
                } else {
                    this.writeText('');
                    this.buffer.push('else:\n');
                    this.tab++;
                }
                this.if_handler(raiz.hijos[0]);
                break;
        }
    }

    capturar_llamada_asig(raiz){
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'llamada_asig':
                this.writeText('');
                this.buffer.push(raiz.valor);
                this.capturar_llamada_asig(raiz.hijos[0]);
                this.buffer.push('\n');
                break;
            case 'op_asig_llam':
                if(raiz.valor != '') {
                    this.buffer.push(raiz.valor);
                    this.capturar_expresion(raiz.hijos[0]);
                    this.buffer.push(...this.expresion);
                    this.expresion = [];
                } else {
                    this.capturar_llamada_asig(raiz.hijos[0]);
                }
                break;
            case 'arg':
                this.capturar_argumento(raiz);
                break;
        }
    }

    capturar_argumento(raiz){
        if(raiz === undefined) return;

        switch(raiz.etiqueta.toLowerCase()){
            case 'expresion':
                this.capturar_expresion(raiz.hijos[0]);
                this.buffer.push(...this.expresion);
                this.expresion = [];
                break;                
            case 'l_argr':
                this.buffer.push(',');
                this.capturar_argumento(raiz.hijos[0]);
                break;
            case 'arg':
                this.buffer.push('(');
                if(raiz.hijos.length > 0) {
                    this.capturar_argumento(raiz.hijos[0]);
                }
                this.buffer.push(')');
                break;
            default:
                for(let i = 0; i < raiz.hijos.length; i++) {
                    this.capturar_argumento(raiz.hijos[i]);
                }
                break;
        }
    }

    parametros_handler(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 'parametros':
                this.parametros_handler(raiz.hijos[0]);
                this.parametros_handler(raiz.hijos[1]);
                break;
            case 'parametro':
                this.parametros_handler(raiz.hijos[0]);
                break;
            case 'parametrosr':
                if(raiz.hijos.length > 0 ){
                    this.buffer.push(', ');
                    this.parametros_handler(raiz.hijos[0]);
                }
                break;
            case 'tipo':
                this.buffer.push(raiz.valor);
                break;
        }
    }


    writeText(text){
        let tabs = '';
        for(let i = 0; i < this.tab; i++){
            tabs += '\t';
        }

        this.buffer.push(tabs);
        this.buffer.push(text);
    }

    procesar_comentario(raiz){
        if(raiz === undefined) return;

        let comentario = raiz.valor;
        let salida = '';

        if(comentario[0] == '/' && comentario[1] == '/'){
            //comentario simple
            salida = '#' + comentario.substring(2) + '\n';
        } else {
            //comentario multilinea
            salida = comentario.substring(0, comentario.length-2);
            salida = comentario.substring(2);
            salida = '"""'  + salida + '"""\n';
        }

        return salida;
    }

}

module.exports.Traductor = Traductor;