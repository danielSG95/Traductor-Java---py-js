%{
    // aqui se llama al arbol
    const Nodo = require('./Nodo').Nodo;
    const Token = require('./Token').Token;
    const Error = require('./Token.js').Error;
    const api = require('./instrucciones').instruccionesAPI;
    const tipo = require('./instrucciones').tipo_operacion;
    const valor = require('./instrucciones').tipo_valor;
    const inst = require('./instrucciones').tipo_instruccion;

    console.log('los arreglos deberia de estar vacios en cada ejecucion...');
    console.log('tokens: ' + tokens.length);
    console.log('errores: '+ errores.length);

%}

%lex


%%

\s+                                     //se ignoran espacios en blanco
"//".*                                  { tokens.push(new Token('tk_comentario_s', yytext, yylloc.first_line, yylloc.first_column)); return 'COMMENT_S'; }
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     { tokens.push(new Token('tk_comentario_m', yytext, yylloc.first_line, yylloc.first_column)); return 'COMMENT_M'; }


//palabras reservadas

"public"                    { tokens.push(new Token('r_public', yytext, yylloc.first_line, yylloc.first_column)); return 'RPUBLIC'; }
"class"                     { tokens.push(new Token('r_class', yytext, yylloc.first_line, yylloc.first_column)); return 'RCLASS'; }
"interface"                 { tokens.push(new Token('r_interface', yytext, yylloc.first_line, yylloc.first_column)); return 'RINTERFACE';}
"void"                      { tokens.push(new Token('r_void', yytext, yylloc.first_line, yylloc.first_column)); return 'RVOID';}
"int"                       { tokens.push(new Token('r_int', yytext, yylloc.first_line, yylloc.first_column)); return 'RINT';}
"boolean"                   { tokens.push(new Token('r_boolean', yytext, yylloc.first_line, yylloc.first_column)); return 'RBOOLEAN';}
"double"                    { tokens.push(new Token('r_double', yytext, yylloc.first_line, yylloc.first_column)); return 'RDOUBLE';}
"String"                    { tokens.push(new Token('r_string', yytext, yylloc.first_line, yylloc.first_column)); return 'RSTRING';}
"char"                      { tokens.push(new Token('r_char', yytext, yylloc.first_line, yylloc.first_column)); return 'RCHAR';}
"for"                       { tokens.push(new Token('r_for', yytext, yylloc.first_line, yylloc.first_column)); return 'RFOR';}
"while"                     { tokens.push(new Token('r_while', yytext, yylloc.first_line, yylloc.first_column)); return 'RWHILE';}
"do"                        { tokens.push(new Token('r_do', yytext, yylloc.first_line, yylloc.first_column)); return 'RDO';}
"System"                    { tokens.push(new Token('r_system', yytext, yylloc.first_line, yylloc.first_column)); return 'RSYSTEM';}
"out"                       { tokens.push(new Token('r_out', yytext, yylloc.first_line, yylloc.first_column)); return 'ROUT';}
"println"                   { tokens.push(new Token('r_println', yytext, yylloc.first_line, yylloc.first_column)); return 'RPRINTLN';}
"print"                     { tokens.push(new Token('r_print', yytext, yylloc.first_line, yylloc.first_column)); return 'RPRINT';}
"if"                        { tokens.push(new Token('r_if', yytext, yylloc.first_line, yylloc.first_column)); return 'RIF';}
"else"                      { tokens.push(new Token('r_else', yytext, yylloc.first_line, yylloc.first_column)); return 'RELSE';}
"break"                     { tokens.push(new Token('r_break', yytext, yylloc.first_line, yylloc.first_column)); return 'RBREAK';}
"continue"                  { tokens.push(new Token('r_continue', yytext, yylloc.first_line, yylloc.first_column)); return 'RCONTINUE';}
"return"                    { tokens.push(new Token('r_return', yytext, yylloc.first_line, yylloc.first_column)); return 'RRETURN';}
"static"                    { tokens.push(new Token('r_static', yytext, yylloc.first_line, yylloc.first_column)); return 'RSTATIC';}
"main"                      { tokens.push(new Token('r_main', yytext, yylloc.first_line, yylloc.first_column)); return 'RMAIN'}

// Simbolos

","					        { tokens.push(new Token('tk_,', yytext, yylloc.first_line, yylloc.first_column)); return 'COMA';}
";"					        { tokens.push(new Token('tk_;', yytext, yylloc.first_line, yylloc.first_column)); return 'PTCOMA';}
"("					        { tokens.push(new Token('tk_(', yytext, yylloc.first_line, yylloc.first_column)); return 'PARENTESIS_A';}
")"					        { tokens.push(new Token('tk_)', yytext, yylloc.first_line, yylloc.first_column)); return 'PARENTESIS_C';}
"{"					        { tokens.push(new Token('tk_{', yytext, yylloc.first_line, yylloc.first_column)); return 'LLAVE_A';}
"}"					        { tokens.push(new Token('tk_}', yytext, yylloc.first_line, yylloc.first_column)); return 'LLAVE_C';}
"."					        { tokens.push(new Token('tk_.', yytext, yylloc.first_line, yylloc.first_column)); return 'PTO';}
"["                         { tokens.push(new Token('tk_[', yytext, yylloc.first_line, yylloc.first_column)); return 'CORCHETE_A'; }
"]"                         { tokens.push(new Token('tk_]', yytext, yylloc.first_line, yylloc.first_column)); return 'CORCHETE_C'; }

// Relacionales
">="                        { tokens.push(new Token('tk_>=', yytext, yylloc.first_line, yylloc.first_column)); return 'MAYORI'; }
"<="                        { tokens.push(new Token('tk_<=', yytext, yylloc.first_line, yylloc.first_column)); return 'MENORI'; }
"=="                        { tokens.push(new Token('tk_==', yytext, yylloc.first_line, yylloc.first_column)); return 'IGUAL'; }
"!="                        { tokens.push(new Token('tk_!=', yytext, yylloc.first_line, yylloc.first_column)); return 'DIF'; }
">"                         { tokens.push(new Token('tk_>', yytext, yylloc.first_line, yylloc.first_column)); return 'MAYOR'; }
"<"                         { tokens.push(new Token('tk_<', yytext, yylloc.first_line, yylloc.first_column)); return 'MENOR'; }
"="                         { tokens.push(new Token('tk_=', yytext, yylloc.first_line, yylloc.first_column)); return 'ASIG'; }

// Logicos
"&&"                        { tokens.push(new Token('tk_and', yytext, yylloc.first_line, yylloc.first_column)); return 'AND'; }
"||"                        { tokens.push(new Token('tk_or', yytext, yylloc.first_line, yylloc.first_column)); return 'OR'; }
"!"                         { tokens.push(new Token('tk_not', yytext, yylloc.first_line, yylloc.first_column)); return 'NOT'; }
"^"                         { tokens.push(new Token('tk_xor', yytext, yylloc.first_line, yylloc.first_column)); return 'XOR'; }

// aritmeticos
"+"                         { tokens.push(new Token('tk_+', yytext, yylloc.first_line, yylloc.first_column)); return 'MAS'; }
"*"                         { tokens.push(new Token('tk_*', yytext, yylloc.first_line, yylloc.first_column)); return 'MULT'; }
"/"                         { tokens.push(new Token('tk_/', yytext, yylloc.first_line, yylloc.first_column)); return 'DIV'; }
"-"                         { tokens.push(new Token('tk_-', yytext, yylloc.first_line, yylloc.first_column)); return 'MENOS'; }


// Expresiones Regulares
([a-zA-Z])[a-zA-Z0-9_]*	    { tokens.push(new Token('tk_identificador', yytext, yylloc.first_line, yylloc.first_column)); return 'IDENTIFICADOR'; }
[0-9]+\b				    { tokens.push(new Token('tk_entero', yytext, yylloc.first_line, yylloc.first_column)); return 'ENTERO'; }
[0-9]+("."[0-9]+)?\b  	    { tokens.push(new Token('tk_decimal', yytext, yylloc.first_line, yylloc.first_column)); return 'DECIMAL'; }

\"[^\"]*\"				    {  /*yytext = yytext.substr(1, yyleng-2);*/ tokens.push(new Token('tk_cadena', yytext, yylloc.first_line, yylloc.first_column)); 
                                return 'CADENA';                           
                            }
\'[a-zA-Z]\'			    { yytext = yytext.substr(1, yyleng-2); tokens.push(new Token('tk_char', yytext, yylloc.first_line, yylloc.first_column)); 
                                return 'CHAR'; 
                            }


<<EOF>>                     return 'EOF';
.					        { 
                                errores.push(new Error(yytext, yylloc.first_line, yylloc.first_column, 'Caracter Desconocido', 'Error Lexico'));
                            }


/lex




%start ini

// precedencia
%left 'OR' 'XOR'
%left 'AND'
%left 'MAS' 'MENOS'
%left 'MULT' 'DIV'
%left 'NOT'
%left UMENOS

%% // Definicion de la gramatica

ini 
    : clases EOF { 
        var raiz = new Nodo("ini", "");
        raiz.agregarHijo($1);

        return { arbol: raiz, ttokens: tokens, terrores: errores};
     }
;

clases
    : clases clase {
        var  padre = new Nodo("clases", "");
        padre.agregarHijo($1);
        padre.agregarHijo($2);
        $$ = padre;

        // $1.push($2);
        // $$ = $1;
    }
    | clase { $$ = $1; }
;

clase
    : RPUBLIC t_class IDENTIFICADOR LLAVE_A l_cuerpo_clase LLAVE_C {
        let clase = new Nodo($2, $3);
        clase.agregarHijo($5);
        $$ = clase;        
    }
    | error LLAVE_C {
        console.log(esperados);
        e = new Error(err_lexema, this._$.first_line, this._$.first_column, esperados , "Error sintactico");
        errores.push(e);
        console.log('Se encontro un error, sincronizando con llave que cierra');
    }
    | error EOF {
        console.log(esperados);
        e = new Error(err_lexema, this._$.first_line, this._$.first_column, esperados , "Error sintactico");
        console.log('Se encontro un error, sincronizando con fin de archivo');
        errores.push(e);
    }

;

t_class
    : RCLASS { $$ = $1; }
    | RINTERFACE { $$ = $1; }
;

l_cuerpo_clase
    : l_cuerpo_clase cuerpo_clase {
        let l_cuerpo_clase = new Nodo('l_cuerpo_clase', '');
        l_cuerpo_clase.agregarHijo($1);
        l_cuerpo_clase.agregarHijo($2);

        $$ = l_cuerpo_clase;
    }
    | cuerpo_clase { $$ = $1; }
;

cuerpo_clase
    : metodo { $$ = $1; }
    | declaracion PTCOMA { $$ = $1; }
    | COMMENT_S { $$ = new Nodo('comentario_s', $1) }
    | COMMENT_M { $$ = new Nodo('comentario_m', $1); }
;

declaracion
    : tipo l_dec {
        let declaracion = new Nodo('declaracion', '');
        declaracion.agregarHijo($1);
        declaracion.agregarHijo($2);
        $$ = declaracion;
    }
;

l_dec
    : l_dec COMA IDENTIFICADOR asig { 
        padre = new Nodo('l_dec','');
        padre.agregarHijo($1);

        padre_t = new Nodo('asig', $3);

        if($4 !== undefined) {
            padre_t.agregarHijo($4);
        }

        padre.agregarHijo(padre_t)
        

        $$ = padre;
    }
    | IDENTIFICADOR asig { 
        padre = new Nodo('asig', $1);
        if($2 !== undefined) {
            padre.agregarHijo($2);
        }
        
        $$ = padre;
    }
;

asig
    : %Empty
    | ASIG expresion_logica { $$ = $2; }
;

metodo
    : metodo_imp { $$ = $1; }
    | metodo_definicion { $$ = $1; }
    | main { $$ = $1; }
    | error LLAVE_C {
        console.log(esperados)
        e = new Error(err_lexema, this._$.first_line, this._$.first_column, esperados, "Error sintactico");
        errores.push(e);
        console.log('Se encontro un error. Sincronizando con }');        
    }
;

main
    : RPUBLIC RSTATIC RVOID RMAIN PARENTESIS_A RSTRING IDENTIFICADOR CORCHETE_A CORCHETE_C PARENTESIS_C LLAVE_A instrucciones LLAVE_C  {
        padre = new Nodo('main', $7);
        padre.agregarHijo($12);

        $$ = padre;
    }
;

metodo_definicion
    : RPUBLIC t_retorno IDENTIFICADOR PARENTESIS_A parametros PARENTESIS_C PTCOMA {
        padre = new Nodo('metodo', $3);
        padre.agregarHijo($2);

        if($5 != undefined) {
            padre.agregarHijo($5);
        }

        
        $$ = padre;
    }
;

metodo_imp
    : RPUBLIC t_retorno IDENTIFICADOR PARENTESIS_A parametros PARENTESIS_C LLAVE_A instrucciones LLAVE_C {
        padre = new Nodo('metodo', $3);
        padre.agregarHijo($2);

        if ($5 !== undefined) {
            padre.agregarHijo($5);
        }
        

        padre.agregarHijo($8);   
        $$ = padre;
    }
;

parametros
    : l_paramentros { $$ = $1; }
    | %Empty
;

l_paramentros
    : l_paramentros COMA tipo IDENTIFICADOR {
        padre = new Nodo('l_parametro', '');
        
        var padret = new Nodo('parametro', $4);
        padret.agregarHijo($3);

        padre.agregarHijo($1);
        padre.agregarHijo(padret);

        $$ = padre;
    }
    | tipo IDENTIFICADOR { 
        padre = new Nodo('parametro', $2);
        padre.agregarHijo($1);
        $$ = padre;
     }
;

instrucciones
    : instrucciones instruccion {
        let instrucciones = new Nodo('instrucciones', '');
        instrucciones.agregarHijo($1);
        instrucciones.agregarHijo($2);
        
        $$ = instrucciones;
    }
    | instruccion { 
        padre = new Nodo('instrucciones', '');
        padre.agregarHijo($1);
        $$ = padre;
     }
;

instruccion
    : instruccion_inline { $$ = $1; }
    | instruccion_bloque { $$ = $1; }
    | COMMENT_S { $$ = new Nodo('comentario_s', $1); }
    | COMMENT_M { $$ = new Nodo('comentario_m', $1); }
    | error PTCOMA {
        e = new Error(err_lexema, this._$.first_line, this._$.first_column, esperados, "Error sintactico");
        errores.push(e);
        console.log('Se encontro un error. Sincronizando con -- instrucciones inline --  lexema' + err_lexema + ' actual' + yytext)
    }
    | error LLAVE_C { 
        e = new Error(err_lexema, this._$.first_line, this._$.first_column, esperados , "Error sintactico");
        errores.push(e);
        console.log('Se encontro un error. Sincronizando con -- instrucciones inline --  lexema' + err_lexema + ' actual' + yytext)
    }
    
;

instruccion_inline
    : llamada PTCOMA { $$ = $1; }
    | declaracion PTCOMA { $$ = $1; }
    | asignacion PTCOMA = { $$ = $1; }
    | RBREAK PTCOMA { $$ = new Nodo('break', ''); }
    | RCONTINUE PTCOMA { $$ = new Nodo('continue', ''); }
    | RRETURN PTCOMA { $$ = new Nodo('return', ''); }
    | RRETURN expresion_logica PTCOMA { 
        padre = new Nodo('return', ''); 
        padre.agregarHijo($2);
        $$ = padre;
    }
    | RSYSTEM PTO ROUT PTO RPRINT PARENTESIS_A expresion PARENTESIS_C PTCOMA { 
        padre = new Nodo('print', ''); 
        padre.agregarHijo($7);
        $$ = padre;
    }
    | RSYSTEM PTO ROUT PTO RPRINTLN PARENTESIS_A expresion PARENTESIS_C PTCOMA { 
        padre = new Nodo('println',''); 
        padre.agregarHijo($7);
        $$ = padre;
    }
;

instruccion_bloque
    :RFOR PARENTESIS_A for_declaracion PTCOMA expresion_logica PTCOMA for_incremento PARENTESIS_C LLAVE_A instrucciones LLAVE_C {
        padre = new Nodo('for', '');

        let t_c_for = new Nodo('condicion', '');
        t_c_for.agregarHijo($5);

        let t_i_for = new Nodo('incremento', '');
        t_i_for.agregarHijo($7);

        let t_cr_for = new Nodo('cuerpo', '');
        t_cr_for.agregarHijo($10);

        padre.agregarHijo($3);
        padre.agregarHijo(t_c_for);
        padre.agregarHijo(t_i_for);
        padre.agregarHijo(t_cr_for);
        $$ = padre;
    }
    | RWHILE PARENTESIS_A expresion_logica PARENTESIS_C LLAVE_A instrucciones LLAVE_C {
        padre = new Nodo('while', '');

        let t_while = new Nodo('condicion', '');
        t_c_while.agregarHijo($3);
        let t_cr_while = new Nodo('cuerpo', '');
        t_cr_while.agregarHijo($6);
        padre.agregarHijo(t_c_while);
        padre.agregarHijo(t_cr_while);
        $$ = padre;
    }
    | RDO LLAVE_A instrucciones LLAVE_C RWHILE PARENTESIS_A expresion_logica PARENTESIS_C PTCOMA {
        padre = new Nodo('do', '');

        let t_c_do = new Nodo('condicion', '');
        t_c_do.agregarHijo($7);
        let t_cr_do = new Nodo('cuerpo', '');
        t_cr_do.agregarHijo($3);

        padre.agregarHijo(t_cr_do);
        padre.agregarHijo(t_c_do);
        $$ = padre;
    }
    | if { $$ = $1; }
;


for_incremento
    : expresion {
        $$ = $1;
    }
    | asignacion {
        $$ = $1;
    }
;

asignacion
    : IDENTIFICADOR ASIG expresion_logica {
        padre = new Nodo('asignacion', $1);
        padre.agregarHijo($3);
        $$ = padre;
    }
;

for_declaracion
    : declaracion { $$ = $1; }
    | asignacion { $$ = $1; }
;

if
    : RIF PARENTESIS_A expresion_logica PARENTESIS_C LLAVE_A instrucciones LLAVE_C { 
        padre = new Nodo('if', '');
        var condicion = new Nodo('condicion', '')
        condicion.agregarHijo($3);
        var cuerpo = new Nodo('cuerpo', '');
        cuerpo.agregarHijo($6);

        padre.agregarHijo(condicion);
        padre.agregarHijo(cuerpo);
        $$ = padre;
     }
    | RIF PARENTESIS_A expresion_logica PARENTESIS_C LLAVE_A instrucciones LLAVE_C RELSE if { 
        padre = new Nodo('if', '');

        condicion = new Nodo('condicion', '')
        condicion.agregarHijo($3);

        cuerpo = new Nodo('cuerpo', '');
        cuerpo.agregarHijo($6);

        var else_if = new Nodo('else_if', '');
        else_if.agregarHijo($9);

        padre.agregarHijo(condicion);
        padre.agregarHijo(cuerpo);
        padre.agregarHijo(else_if);
        $$ = padre;
     }
    | RIF PARENTESIS_A expresion_logica PARENTESIS_C LLAVE_A instrucciones LLAVE_C RELSE LLAVE_A instrucciones LLAVE_C { 
        padre = new Nodo('if', '');

        condicion = new Nodo('condicion', '')
        condicion.agregarHijo($3);

        cuerpo = new Nodo('cuerpo', '');
        cuerpo.agregarHijo($6);

        var else_ = new Nodo('else', '');
        else_.agregarHijo($10);

        padre.agregarHijo(condicion);
        padre.agregarHijo(cuerpo);
        padre.agregarHijo(else_);
        $$ = padre;
     }
;

llamada
    : IDENTIFICADOR PARENTESIS_A l_arg PARENTESIS_C {
        padre = new Nodo('llamada', $1);
        padre.agregarHijo($3);
        $$ = padre;
    }
    | IDENTIFICADOR PARENTESIS_A PARENTESIS_C  {
        padre = new Nodo('llamada', $1);
        $$ = padre;
    }
;

l_arg
    : l_arg COMA expresion
    {
        padre = new Nodo('l_arg', '');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
    }
    | expresion { $$ = $1; }
;

expresion
    : expresion_numerica { $$ = $1; }
;

expresion_numerica
    : MENOS expresion_numerica %prec UMENOS { 
        padre = new Nodo('expresion_numerica', '');
        t_en = new Nodo('expresion_numerica', '-');
        padre.agregarHijo(t_en);
        padre.agregarHijo($2);
        $$ = padre;
     }
    | expresion_numerica MAS MAS { 
        padre = new Nodo('expresion_numerica', '++');
        padre.agregarHijo($1);
        $$ = padre;
     }
    | expresion_numerica MENOS MENOS { 
        padre = new Nodo('expresion_numerica', '--');
        padre.agregarHijo($1);        
        $$ = padre;
     }
    | expresion_numerica MAS expresion_numerica { 
        padre = new Nodo('expresion_numerica', '+');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica MENOS expresion_numerica { 
        padre = new Nodo('expresion_numerica', '-');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica MULT expresion_numerica { 
        padre = new Nodo('expresion_numerica', '*');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
    }
    | expresion_numerica DIV expresion_numerica { 
        padre = new Nodo('expresion_numerica', '/');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | PARENTESIS_A expresion_logica PARENTESIS_C { 
        padre = new Nodo('parentesis', '');
        padre.agregarHijo($2);
        $$ = padre;
     }
    | llamada { $$ = $1; }
    | ENTERO { $$ = new Nodo('expresion_numerica', $1); }
    | IDENTIFICADOR { $$ = new Nodo('expresion_numerica', $1); }
    | CADENA { $$ = new Nodo('expresion_numerica', $1); }
    | DECIMAL { $$ = new Nodo('expresion_numerica', $1); }
    | CHAR { $$ = new Nodo('expresion_numerica', $1); }
;

expresion_relacional
    : expresion_numerica MAYOR expresion_numerica { 
        padre = new Nodo('expresion_relacional', $2);
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica MENOR expresion_numerica { 
        padre = new Nodo('expresion_relacional', $2);
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica MAYORI expresion_numerica { 
        padre = new Nodo('expresion_relacional', $2);
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica MENORI expresion_numerica { 
        padre = new Nodo('expresion_relacional', $2);
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica IGUAL expresion_numerica { 
        padre = new Nodo('expresion_relacional', $2);
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica DIF expresion_numerica { 
        padre = new Nodo('expresion_relacional', $2);
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | expresion_numerica { 
        // padre = new Nodo('expresion_numerica', '');
        // padre.agregarHijo($1);
        // $$ = padre; 
        $$ = $1;
    }
;

expresion_logica
    : expresion_logica AND expresion_logica { 
        padre = new Nodo('expresion_logica', 'and');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
    }
    | expresion_logica XOR expresion_logica {
        padre = new Nodo('expresion_logica', 'xor');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
    }
    | expresion_logica OR expresion_logica { 
        padre = new Nodo('expresion_logica', 'or');
        padre.agregarHijo($1);
        padre.agregarHijo($3);
        $$ = padre;
     }
    | NOT expresion_logica %prec UMENOS { 
        padre = new Nodo('expresion_logica', 'not');
        padre.agregarHijo($2);

        $$ = padre;
     }
    | expresion_relacional { 
        // padre = new Nodo('expresion_relacional', '');
        // padre.agregarHijo($1);
        // $$ = padre;
        $$ = $1;
     }
;


tipo
    : RINT { $$ = new Nodo('tipo', $1); }
    | RDOUBLE { $$ = new Nodo('tipo', $1); }
    | RSTRING { $$ = new Nodo('tipo', $1); }
    | RCHAR { $$ = new Nodo('tipo', $1); }
    | RBOOLEAN { $$ = new Nodo('tipo', $1); }
    // | IDENTIFICADOR { $$ = new Nodo('tipo', $1); }
;

t_retorno
    : RINT { $$ = new Nodo('t_retorno', $1); }
    | RDOUBLE { $$ = new Nodo('t_retorno', $1); }
    | RSTRING { $$ = new Nodo('t_retorno', $1); }
    | RCHAR { $$ = new Nodo('t_retorno', $1); }
    | RBOOLEAN { $$ = new Nodo('t_retorno', $1); }
    | RVOID { $$ = new Nodo('t_retorno', $1); }
;




