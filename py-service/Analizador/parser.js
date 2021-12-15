const Nodo = require('./nodo').Nodo;
const stack = require('./stack').stack;
const Tabla = require('./Tabla').Tabla;
const Error = require('./Token').Error;

class Parser {
    constructor(tokens, errores) {
        this.tokens = tokens;
        this.errores = errores;
        this.ctoken = -1;
        this.tabla = new Tabla();
        this.pila = new stack();
        this.raiz = new Nodo('S')

    }

    parse() {
        this.pila.Push('$');
        this.pila.Push(this.raiz);
        this.pila.Push('S');

        let ntemp = null; // Nodo temporal de la pila
        let temp = null; // temporal de la pila


        let token = this.next_token();
        
        do{
            temp = this.pila.Peek();
            if(this.is_terminal(temp) || temp == '$') {
                if(temp == token) {
                    this.pila.Pop();
                    
                    if(this.match_terminal(token, ntemp)){

                        ntemp.valor = this.tokens[this.ctoken].lexema;

                        if(ntemp.etiqueta == 'T_CLASS' && token != 'tk_id'){
                            ntemp.nombre = token;

                            console.log('T_CLASS:  ' + ntemp.nombre);
                            console.log(this.tokens[this.ctoken].lexema);
                        }

                        if(ntemp !== null || ntemp != undefined) {
                            // console.log('nodo_temporal: ' + ntemp.etiqueta + ' Token: ' + token);
                        } else {
                            console.log('Ntemp es nulo');
                        }
                    }

                    token = this.next_token();
                } else {
                    let desc = 'Se esperaba el token: ' + temp + ' Y se recibio el token: ' + token;
                    this.push_error(desc, this.ctoken);
                    let token_ = { token: token };
                    let temp_ = { temp: temp };
                    console.log(desc);

                    console.log('modo panico activado... Token actual:  ' + token  + '  temp actual: ' + temp);
                    console.log(this.tokens[this.ctoken].linea);
                    this.panic_mode(token_, temp_);
                    token = token_.token;
                    temp = temp_.temp;
                    console.log('modo panico Terminado... Token actual:  ' + token  + '  temp actual: ' + temp);
                }
            } else {
                let p = this.tabla.buscar_produccion(temp, token);
                if(p != undefined) {
                    this.pila.Pop();
                    ntemp = this.pila.Pop();

                    // Esto es si la produccion deriva en epsilon
                    if(p.length == 0) { 
                        // ntemp = null;
                        continue;
                    }

                    this.create_nodes(p, ntemp);
                    this.push_productions(p, ntemp, ntemp.hijos.length - 1);


                } else {
                    let desc = 'Se esperaba algunos de los siguientes tokens: ' + this.get_keys(this.tabla.obtener_produccion_de(temp));
                    desc += ' Y se obtuvo: ' + this.tokens[this.ctoken].lexema
                    console.log(desc);

                    this.push_error(desc, this.ctoken);
                    let token_ = { token: token };
                    let temp_ = { temp: temp };

                    console.log('modo panico activado... Token actual:  ' + token  + '  temp actual: ' + temp);

                    this.panic_mode(token_, temp_);
                    temp = temp_.temp;
                    token = token_.token;
                    console.log('modo panico Terminado... Token actual:  ' + token  + '  temp actual: ');
                }
            }

        }while(temp != '$');

    }

    create_nodes(p, ntemp) {
        for(var i = 0; i < p.length; i++) {
            if(!this.is_terminal(p[i])) {
                ntemp.hijos.push(new Nodo(p[i]))
            }
        }
    }

    push_productions(p, ntemp, ntemp_count) {
        for(var i = p.length - 1; i >= 0; i--) {
            if(this.is_terminal(p[i])) {
                this.pila.Push(p[i]);
            } else {
                if( ntemp_count == -1 ){
                    continue;
                }

                this.pila.Push(ntemp.hijos[ntemp_count]);
                this.pila.Push(p[i]);
                ntemp_count--;            
            }
        }
    }

    panic_mode(token_, temp_){

        while((token_.token !== 'tk_;' && token_.token !== 'tk_}') && token_.token !== '$') {
            console.log('token consumido: ' + token_.token);
            token_.token = this.next_token();
        }

        console.log('token luego de salir del modo panico: ' + token_.token);
        while((temp_.temp !== 'tk_;' && temp_.temp !== 'tk_}') && this.pila.Peek() !== '$') {
            temp_.temp = this.pila.Pop();
            console.log('Token desapilado: ' + temp_.temp.toString());
        }

        token_.token = this.next_token();

    }

    push_error(descripcion, c_token){
        let token = this.tokens[c_token];
        this.errores.push(new Error(token.lexema, token.linea, token.columna, 'Error Sintactico', descripcion));
    }

    get_keys(ntemp){
        if(ntemp === undefined || ntemp === null) {
            return '';
        }
        return Object.keys(ntemp).toString();
    }


    next_token() {
        this.ctoken++;

        var retorno = '';

        if(this.ctoken <= this.tokens.length - 1) {
            retorno = this.tokens[this.ctoken].token;

            // while(retorno == 'tk_comentario_m' || retorno == 'tk_comentario_s'){
            //     this.ctoken++;
            //     retorno = this.tokens[this.ctoken].token;
            // }
        }

        return retorno;
    }

    match_terminal(tk, ntemp) {
        //token es el token actual
        //temp es el no terminal actual
        var not_match = ['tk_{', 'tk_}', 'tk_.', 'tk_,', 'tk_(', 'tk_)', 'tk_;'];
        if(!not_match.includes(tk)) {
            return true;
        } else {
            if(ntemp == null)
                return false;

            if (ntemp.etiqueta == 'F' && (tk == 'tk_(' || tk == 'tk_)')) {
                return true;
            }

        }

        return false;
        
    }


    is_terminal(temporal){
        return temporal.includes('tk_');
    }

}


module.exports.Parser = Parser;