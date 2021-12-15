const token = require('./Token').Token;
const error = require('./Token').Error;


class Scanner {

    constructor(data) {
        this.data = data + " ";
        this.symbols = {};
        this.keywords = {};
        this.tokens = [];
        this.errores = [];

        this.fillSymbols();
        this.fillKeywords();
    }

    scanner() {
        let lexema = "";
        let linea = 0;
        let columna = 1;
        let estado = 0;

        let d_chars = this.data.split('');

        for (let i = 0; i < d_chars.length; i++) {
            switch (estado) {
                case 0:
                    lexema = "";
                    if (this.isLetter(d_chars[i].charCodeAt())) {//identificador
                        estado = 1;
                        lexema += d_chars[i];
                        columna++;
                    } else if (this.isDigit(d_chars[i].charCodeAt())) {//numeros
                        estado = 2;
                        lexema += d_chars[i];
                        columna++;
                    } else if (d_chars[i].charCodeAt() == 34) {// cadena
                        estado = 3;
                        lexema += d_chars[i];
                        columna++
                    } else if (d_chars[i].charCodeAt() == 39) { //char
                        estado = 4;
                        lexema += d_chars[i];
                        columna++;
                    } else if (d_chars[i].charCodeAt() == 47) { // comentarios
                        estado = 5;
                        lexema += d_chars[i];
                        columna++;
                    } else if (this.isSymbol(d_chars[i])) {
                        estado = 6;
                        lexema += d_chars[i];
                        columna++;

                    } else if (d_chars[i].charCodeAt() >= 0 && d_chars[i].charCodeAt() <= 32) {
                        //se ignoran
                        columna++;
                        if (d_chars[i].charCodeAt() == 10) {
                            linea += 1;
                            columna = 1;
                        }

                    } else {
                        //Error
                        lexema += d_chars[i];
                        this.errores.push(new error(lexema, linea, columna, 'Error Lexico', 'Caracter Desconociiiido'));
                    }
                    break;

                case 1:
                    if (this.isLetter(d_chars[i].charCodeAt()) || this.isDigit(d_chars[i].charCodeAt()) || d_chars[i] == '_') {
                        lexema += d_chars[i];
                        columna++;
                    } else {
                        estado = 0;
                        i--;
                        this.tokens.push(new token(this.isKeyword(lexema), lexema, linea, columna, "Identificador/Reservada"));
                    }
                    break;
                case 2:
                    if(this.isDigit(d_chars[i].charCodeAt())){
                        lexema += d_chars[i];
                        columna++;
                    } else if(d_chars[i].charCodeAt() == 46) {
                        lexema += d_chars[i];
                        columna++;
                        estado = 7;
                    } else {
                        estado = 0;
                        i--;

                        this.tokens.push(new token('tk_entero', lexema, linea, columna, 'Entero'));
                    }
                    break;
                case 3:
                    if(d_chars[i].charCodeAt() != 34) {
                        if(d_chars[i].charCodeAt() == 10) {
                            this.errores.push(new error(lexema, linea, columna, 'Error lexico', 'Patron cadena no acepta saltos de linea'));
                            estado = 0;
                            linea++;
                            columna = 1;
                            continue;
                        }

                        lexema += d_chars[i];
                        columna++;

                    } else {
                        lexema += d_chars[i];
                        columna++;
                        this.tokens.push(new token('tk_cadena', lexema, linea,  columna, 'Cadena'));
                        estado = 0;
                    }
                    break;
                case 4:
                    if(d_chars[i].charCodeAt() != 39) {
                        if(d_chars[i].charCodeAt() == 10) {
                            this.errores.push(new error(lexema, linea, columna, 'Error lexico', 'Error en caracter'));
                            estado = 0;
                            linea++;
                            columna = 1;
                            continue;
                        }

                        lexema += d_chars[i];
                        columna++;
                        estado = 9;
                    } else {
                        lexema += d_chars[i];
                        columna++;
                        this.tokens.push(new token('tk_caracter', linea, columna, 'Caracter'));
                        estado = 0;
                    }
                    break;
                case 5:
                    if(d_chars[i].charCodeAt() == 47) {
                        estado = 10;
                        lexema += d_chars[i];
                        columna++;
                    } else if(d_chars[i].charCodeAt() == 42){
                        estado = 11;
                        lexema += d_chars[i];
                        columna++;
                    } else {
                        // simbolo de division
                        this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'division'));
                        i--;
                        estado = 0;
                    }
                    break;
                case 6:
                    switch(lexema){
                        case '&':
                            if(d_chars[i].charCodeAt() == 38) {
                                lexema += d_chars[i];
                                columna++;
                                this.tokens.push(new token('tk_&&', lexema, linea, columna, 'AND'));
                            } else {
                                lexema += d_chars[i];
                                this.errores.push(new error(lexema, linea, columna, 'Error lexico', 'Patron And incompleto'));
                            }
                            // break;
                            estado = 0;
                            continue;
                        case '|':
                            if(d_chars[i].charCodeAt() == 124) {
                                lexema += d_chars[i];
                                columna++;
                                this.tokens.push(new token('tk_||', lexema, linea, columna, 'OR'));
                            } else {
                                this.errores.push(new error(lexema, linea, columna, 'Error lexico', 'Patron Or incompleto'));
                            }
                            // break;
                            estado = 0;
                            continue;
                        case '>':
                            if(d_chars[i] == '='){
                                lexema += d_chars[i];
                                columna++;
                                estado = 0;
                                this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                                continue;
                            }

                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                        case '<':
                            if(d_chars[i] == '='){
                                lexema += d_chars[i];
                                columna++;
                                estado = 0;
                                this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                                continue;
                            }

                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                        case '!':
                            if(d_chars[i] == '='){
                                lexema += d_chars[i];
                                columna++;
                                estado = 0;
                                this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                                continue;
                            }

                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                        case '=':
                            if(d_chars[i] == '='){
                                lexema += d_chars[i];
                                columna++;
                                estado = 0;
                                this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                                continue;
                            }

                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                        case '+':
                            if(d_chars[i] == '+'){
                                lexema += d_chars[i];
                                columna++;
                                estado = 0;
                                this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                                continue;    
                            }

                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                            // continue;
                        case '-':
                            if(d_chars[i] == '-'){
                                lexema += d_chars[i];
                                columna++;
                                estado = 0;
                                this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                                continue;
                            }

                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                            // continue;
                        default:
                            this.tokens.push(new token(this.symbols[lexema], lexema, linea, columna, 'simbolo ' + lexema));
                            break;
                        
                    }

                    estado = 0;
                    i--;

                    break;
                case 7:
                    if(this.isDigit(d_chars[i].charCodeAt())){
                        lexema += d_chars[i];
                        columna++;
                        estado = 8;
                    } else {
                        //error
                        estado = 0;
                        lexema += d_chars[i];
                        this.errores.push(new error(lexema, linea, columna, 'Error lexico', 'Decimal incorrecto'));
                    }
                    break;
                case 8:
                    if(this.isDigit(d_chars[i].charCodeAt())){
                        lexema += d_chars[i];
                        columna++;
                    } else{
                        estado = 0;
                        i--;

                        this.tokens.push(new token('tk_decimal', lexema, linea, columna, 'Decimal'));
                    }
                    break;    
                case 9:
                    estado = 0;
                    i--;
                    this.tokens.push(new token('tk_caracter', lexema, linea, columna, 'Caracter'));
                    break;    
                case 10:
                    if(d_chars[i].charCodeAt() != 10){
                        columna++;
                        lexema += d_chars[i];
                    } else {
                        this.tokens.push(new token('tk_comentario_s', lexema, linea, columna, 'Comentario Simpble'));
                        estado = 0;
                        linea += 1;
                        columna = 1;
                    }
                    break;  
                case 11:
                    if(d_chars[i].charCodeAt() == 42){
                        estado = 12;
                    }

                    lexema += d_chars[i];
                    columna++;

                    if(d_chars[i].charCodeAt() == 10){
                        linea += 1;
                        columna = 1;
                    }
                    break;   
                    
                case 12:
                    if(d_chars[i].charCodeAt() == 47) {
                        lexema += d_chars[i];
                        columna++;
                        estado = 0;

                        this.tokens.push(new token('tk_comentario_m', lexema, linea, columna, 'Comentario Multilinea'));
                    } else{
                        i--;
                        estado = 11;
                    }
                    break;

            }
        }


    }



    fillKeywords() {
        this.keywords["public"] = "tk_public";
        this.keywords["class"] = "tk_class";
        this.keywords["interface"] = "tk_interface";
        this.keywords["void"] = "tk_void";
        this.keywords["int"] = "tk_int";
        this.keywords["boolean"] = "tk_boolean";
        this.keywords["double"] = "tk_double";
        this.keywords["String"] = "tk_string";
        this.keywords["char"] = "tk_char";
        this.keywords["for"] = "tk_for";
        this.keywords["while"] = "tk_while";
        this.keywords["do"] = "tk_do";
        this.keywords["System"] = "tk_system";
        this.keywords["out"] = "tk_out";
        this.keywords["println"] = "tk_println";
        this.keywords["print"] = "tk_print";
        this.keywords["if"] = "tk_if";
        this.keywords["else"] = "tk_else";
        this.keywords["break"] = "tk_break";
        this.keywords["continue"] = "tk_continue";
        this.keywords["return"] = "tk_return";
        this.keywords["static"] = "tk_static";
        this.keywords["main"] = "tk_main";
    }

    fillSymbols() {
        this.symbols[","] = "tk_,";
        this.symbols[";"] = "tk_;";
        this.symbols["("] = "tk_(";
        this.symbols[")"] = "tk_)";
        this.symbols["{"] = "tk_{";
        this.symbols["}"] = "tk_}";
        this.symbols["."] = "tk_.";
        this.symbols["["] = "tk_[";
        this.symbols["]"] = "tk_]";

        this.symbols[">="] = "tk_>=";
        this.symbols["<="] = "tk_<=";
        this.symbols["=="] = "tk_==";
        this.symbols["!="] = "tk_!=";
        this.symbols[">"] = "tk_>";
        this.symbols["<"] = "tk_<";
        this.symbols["="] = "tk_=";

        this.symbols["&"] = "tk_&&";
        this.symbols["|"] = "tk_||";
        this.symbols["!"] = "tk_!";
        this.symbols["^"] = "tk_^";

        this.symbols["+"] = "tk_+";
        this.symbols["*"] = "tk_*";
        this.symbols["/"] = "tk_/";
        this.symbols["-"] = "tk_-";
        this.symbols["++"] = "tk_++";
        this.symbols["--"] = "tk_--";
    }

    isSymbol(char) {
        if (this.symbols[char]) {
            return true;
        }
        return false;
    }

    isKeyword(string) {
        if (this.keywords[string]) {
            return this.keywords[string];
        }
        return 'tk_id';
    }

    isLetter(char) {
        if ((char >= 65 && char <= 90) || (char >= 97 && char <= 122)) {
            return true;
        }

        return false;
    }

    isDigit(char) {
        if (char >= 48 && char <= 57) {
            return true;
        }
        return false;
    }

}

module.exports.Scanner = Scanner;