var fs = require('fs');
var beautify = require('js-beautify').js
const path = require('path');
class traductor {
    constructor(raiz) {
        this.raiz = {...raiz};
        this.buffer = []; // Aqui se guarda la traduccion
        this.identacion = 0;
        this.interface_flag = false;
    }

    traducir() {
        this.traducir_(this.raiz);

        // this.printList();

        try {
            // console.log();
            fs.writeFileSync(path.resolve('Recursos/traduccionJs.js'),beautify(this.printList(), { indent_size: 2, space_in_empty_paren: true }), function(err){
                if(err) return console.log(err);
            } );
        } catch (error) {
            console.log(error);
        }
    }

    traducir_(raiz) {
        if (raiz === undefined) {
            console.error('no se puede traducir. La raiz del arbol esta vacia');
            return;
        }

        switch (raiz.etiqueta) {
            case 'ini':
                this.traducir_(raiz.hijos[0]);
                break;
            case 'clases':
                for(var i = 0; i < raiz.hijos.length; i++) {
                    this.traducir_(raiz.hijos[i]);
                }
                break;
            case 'class':
                this.class_hander(raiz);
                break;
            case 'interface':
                console.log('JavaScript no soporta interfaces. Imposible traducir');
                this.buffer.push('/*JavaScript no soporta interfaces. Imposible traducir :( */');
                // return;

                break;
            default:
                // for(var i= 0; i < raiz.hijos.length; i++) {
                //     this.traducir_
                // }
                break;
        }

    }

    class_hander(raiz) {
        if(raiz === undefined) return;

        this.buffer.push('class ' + raiz.valor + '{\n');
        this.identacion++;
        this.cuerpo_clase(raiz.hijos[0]);
        this.buffer.push('\n}\n');
        this.identacion--;
    }

    cuerpo_clase(raiz) {
        if(raiz === undefined) return;

        switch (raiz.etiqueta) {
            case 'l_cuerpo_clase':
                this.cuerpo_clase(raiz.hijos[0]);
                this.cuerpo_clase(raiz.hijos[1]);
                break;
            case 'metodo':
                this.metodo_handler(raiz);
                this.buffer.push('\n');
                break;
            case 'main':
                console.log('detectando el main');
                this.buffer.push('main( ' + raiz.valor + ' ');
                this.metodo_handler(raiz.hijos[0]);
                this.buffer.push('\n');
                break;
            case 'declaracion':
                this.buffer.push('var ');
                this.declaracion_handler(raiz);
                this.buffer.push('\n');
                break;
            case 'comentario_m':
                this.buffer.push(raiz.valor);
                this.buffer.push('\n');
                break;
            case 'comentario_s':
                this.buffer.push(raiz.valor);
                this.buffer.push('\n');
                break;
        }
    }

    metodo_handler(raiz) {
        if(raiz === undefined) return;

        this.capturar_metodo(raiz);
    }

    capturar_metodo(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'metodo':
                this.buffer.push(raiz.valor);
                this.buffer.push('(');
                for(var i = 0; i < raiz.hijos.length; i++){
                    this.capturar_metodo(raiz.hijos[i]);
                }
                break;
            case 'l_parametro':
                this.capturar_metodo(raiz.hijos[0]);
                this.buffer.push(', ');
                this.capturar_metodo(raiz.hijos[1]);
                break;
            case 'parametro':
                this.buffer.push(raiz.valor);
                break;
            case 'instrucciones':
                this.buffer.push('){\n');
                this.identacion++;
                this.instrucciones_handler(raiz);        
                this.buffer.push('\n}\n');
                this.identacion--;
                break;
        }
    }

    is_static(raiz) {
        if(raiz === undefined) return;

        for(var i = 0; i < raiz.hijos.length; i++){
            if(raiz.hijos[i].etiqueta == 'static') {
                return true;
            }
        }
    }

    instrucciones_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'instrucciones':
                for(var i =0; i <= raiz.hijos.length; i++) {
                    this.instrucciones_handler(raiz.hijos[i]);
                }
                break;
            case 'if':
                this.if_handler(raiz);
                break;
            case 'for':
                this.for_hander(raiz);
                break;
            case 'do':
                this.do_handler(raiz);
                break;
            case 'while':
                this.while_handler(raiz);
                break;
            case 'continue':
                this.buffer.push('continue;\n');
                break;
            case 'break':
                this.buffer.push('break;\n');
                break;
            case 'return':
                this.return_handler(raiz);
                break;
            case 'print':
                this.print_handler(raiz);
                break;
            case 'println':
                this.print_handler(raiz);
                break;
            case 'declaracion':
                this.declaracion_handler(raiz);
                this.buffer.push('\n');
                break;
            case 'asignacion':
                this.asignacion_handler(raiz);
                this.buffer.push('\n');
                break;
            case 'llamada':
                this.llamada_handler(raiz);
                this.buffer.push('\n');
                break;
            case 'comentario_s':
                this.buffer.push(raiz.valor);
                this.buffer.push('\n');    
                break;
            case 'comentario_m':
                this.buffer.push(raiz.valor);
                this.buffer.push('\n');
                break;
        }
    }

    while_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'while':
                this.buffer.push('while');
                this.while_handler(raiz.hijos[0]);
                break;
            case 'condicion':
                this.buffer.push('(')
                this.capturar_condicion(raiz);
                this.buffer.push(')')
                break;
            case 'cuerpo':
                this.buffer.push('{\n');
                this.instrucciones_handler(raiz.hijos[0]);
                this.buffer.push('\n}\n');
                break;
        }


    }

    do_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'do':
                this.buffer.push('do');
                this.do_handler(raiz.hijos[0]);
                break;
            case 'cuerpo':
                this.buffer.push('{\n');
                this.instrucciones_handler(raiz.hijos[0]);
                this.buffer.push('\n}\n');
                break;
            case 'condicion':
                this.buffer.push('while');
                this.buffer.push('(');
                this.capturar_condicion(raiz);
                this.buffer.push(');\n');
                break;
        }
    }

    return_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta){
            case 'return':
                if(raiz.hijos.length >0) {
                    this.buffer.push('return ');
                    this.return_handler(raiz.hijos[0]);
                    this.buffer.push(';\n');
                } else {
                    this.buffer.push('return;\n');
                }
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
            case 'expresion_relacional':
                this.capturar_expresion_relacional(raiz);
                break;
            case 'expresion_logica':
                this.capturar_expresion_logica(raiz);
                break;
        }
    }

    print_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'println':
                this.buffer.push('console.log(');
                this.print_handler(raiz.hijos[0]);
                this.buffer.push(');\n');
                break;
            case 'print':
                this.buffer.push('console.log(');
                this.print_handler(raiz.hijos[0]);
                this.buffer.push(');\n');
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
            case 'llamada':
                this.llamada_handler(raiz);
                break;
        }
    }

    llamada_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'llamada':
                this.buffer.push(raiz.valor);
                this.buffer.push('(');
                this.llamada_handler(raiz.hijos[0]);
                this.buffer.push(')');
                break;
            case 'l_arg':
                this.llamada_handler(raiz.hijos[0]);
                this.buffer.push(', ');
                this.llamada_handler(raiz.hijos[1]);
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
        }
    }

    for_hander(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'for':
                this.buffer.push('for(');
                for(let i = 0; i < raiz.hijos.length; i++) {
                    this.for_hander(raiz.hijos[i]);
                }
                break;
            case 'declaracion':
                this.declaracion_handler(raiz);
                break;
            case 'asignacion':
                this.asignacion_handler(raiz);
                break;
            case 'condicion':
                this.capturar_condicion(raiz);
                this.buffer.push(';');
                break;
            case 'incremento':
                this.incremento_handler(raiz);
                this.buffer.push(')\n');
                break;
            case 'cuerpo':
                this.buffer.push('{\n');
                this.instrucciones_handler(raiz.hijos[0]);
                this.buffer.push('\n}\n');
                break;
        }
    }

    incremento_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta){
            case 'incremento':
                this.incremento_handler(raiz.hijos[0]);
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);    
                break;
            case 'asignacion':
                this.asignacion_handler(raiz);
                break;
        }

    }

    if_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'if':
                this.buffer.push('if');
                for(var i=0; i<raiz.hijos.length; i++){
                    this.if_handler(raiz.hijos[i]);
                }
                break;
            case 'condicion':
                this.buffer.push('(');
                this.capturar_condicion(raiz);
                this.buffer.push(')');
                break;
            case 'cuerpo':
                this.buffer.push('{\n');
                this.instrucciones_handler(raiz.hijos[0]);
                this.buffer.push('\n}\n');
                break;
            case 'else_if':
                this.buffer.push('else ');
                this.if_handler(raiz.hijos[0]);
                break;
            case 'else':
                this.buffer.push('else {\n');
                this.instrucciones_handler(raiz.hijos[0]);
                this.buffer.push('\n}\n')
                break;
        }
    }

    capturar_condicion(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'condicion':
                this.capturar_condicion(raiz.hijos[0]);
                break;
            case 'expresion_relacional':
                this.capturar_expresion_relacional(raiz);
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
            case 'expresion_logica':
                this.capturar_expresion_logica(raiz);
                break;
        }

    }


    asignacion_handler(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'asignacion':
                this.buffer.push(raiz.valor);
                this.buffer.push(' = ');
                this.asignacion_handler(raiz.hijos[0]);
                this.buffer.push(';')
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
            case 'expresion_logica':
                this.capturar_expresion_logica(raiz);
                break;
            case 'expresion_relacional':
                this.capturar_expresion_relacional(raiz);
                break;
            case 'llamada':
                this.llamada_handler(raiz);
                break;
            case 'parentesis':
                this.buffer.push('(');
                this.asignacion_handler(raiz.hijos[0]);
                this.buffer.push(')');
                break;
        }
    }

    declaracion_handler(raiz) {
        if(raiz === undefined) return;

        switch (raiz.etiqueta) {
            case 'declaracion':
                this.declaracion_handler(raiz.hijos[0]);
                this.declaracion_handler(raiz.hijos[1]);
                
                this.buffer.push(';');
                break;          
            case 'l_dec':
                this.declaracion_handler(raiz.hijos[0]);
                this.buffer.push(', ');
                this.declaracion_handler(raiz.hijos[1]);
                break;
            case 'asig':
                this.buffer.push(raiz.valor);
                if(raiz.hijos.length > 0) {
                    this.buffer.push(' = ');
                    this.capturar_expresion(raiz.hijos[0]);
                } else {
                    // console.log('no tiene expresion de asignacion');
                }
                break;
        }        
    }

    capturar_expresion(raiz) {
        if(raiz === undefined) return;

        switch (raiz.etiqueta) {
            case 'expresion_numerica':
                this.capturar_expresion(raiz.hijos[0]);
                // if(raiz.valor != 'parentesis') {
                //     this.buffer.push(raiz.valor);
                // }
                this.buffer.push(raiz.valor);
                this.capturar_expresion(raiz.hijos[1]);
                break;
            case 'expresion_logica':
                this.capturar_expresion_logica(raiz);
                break;
            case 'expresion_relacional':
                this.capturar_expresion_relacional(raiz);
                break;
            case 'llamada':
                this.llamada_handler(raiz);
                break;
            case 'parentesis':
                this.buffer.push('(');
                this.capturar_expresion(raiz.hijos[0]);
                this.buffer.push(')');
                break;
            default:
                console.log(raiz);
                // console.log('Se esperaba expresion_numerica');
                break;
        }
    }

    capturar_expresion_relacional(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'expresion_relacional':
                this.capturar_expresion_relacional(raiz.hijos[0]);
                this.buffer.push(raiz.valor);
                this.capturar_expresion_relacional(raiz.hijos[1]);
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
            case 'parentesis':
                this.buffer.push('(');
                this.capturar_expresion_relacional(raiz.hijos[0]);
                this.buffer.push(')');
                break;
        }
        
    }

    capturar_expresion_logica(raiz) {
        if(raiz === undefined) return;

        switch(raiz.etiqueta) {
            case 'expresion_logica':
                this.capturar_expresion_logica(raiz.hijos[0]);
                if(raiz.valor == 'xor') {
                    this.buffer.push(' ^ ');
                } else if(raiz.valor == 'and') {
                    this.buffer.push(' && ');
                } else if(raiz.valor == 'or') {
                    this.buffer.push(' || ');
                } else if(raiz.valor == 'not') {
                    this.buffer.push(' ! ');
                }
                this.capturar_expresion_logica(raiz.hijos[1]);
                break;
            case 'expresion_relacional':
                this.capturar_expresion_relacional(raiz);
                break;
            case 'expresion_numerica':
                this.capturar_expresion(raiz);
                break;
            case 'parentesis':
                this.buffer.push('(');
                this.capturar_expresion_logica(raiz.hijos[0]);
                this.buffer.push(')');
                break;
        }
     }

    printList() {
        let temp = '';
        for(var i = 0; i < this.buffer.length; i++) {
            temp += this.buffer[i];
        }

        return temp;
    }

}



module.exports.traductor = traductor;