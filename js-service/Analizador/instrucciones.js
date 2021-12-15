const tipo_operacion = {
    INCREMENTO:     'OP_INCREMENTO',
    DECREMENTO:     'OP_DECREMENTO',
    SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
	DIVISION:       'OP_DIVISION',
	NEGATIVO:       'OP_NEGATIVO',
	MAYOR:          'OP_MAYOR_QUE',
    MENOR:          'OP_MENOR_QUE',
    NEGACION:       'OP_NEGACION',

	MAYOR_IGUAL: 	'OP_MAYOR_IGUAL',
	MENOR_IGUAL:    'OP_MENOR_IGUAL',
	IGUAL:          'OP_DOBLE_IGUAL',
	NO_IGUAL:    	'OP_NO_IGUAL',

	AND:  			'OP_AND',
	OR: 			'OP_OR',
    NOT:   			'OP_NOT',
    XOR:            'OP_XOR'
}

const tipo_valor = {
    ENTERO:         'VAL_ENTERO',
    DECIMAL:        'VAL_DECIMAL',
    ID:             'VAL_ID',
    STRING:         'VAL_CADENA',
    CHAR:			'VAL_CARACTER',
    LLAMADA:        'VAL_LLAMADA'
}

const tipo_instruccion = {
    IF:         'INSTR_IF',
    IF_ELSE:    'INSTR_IF_ELSE',
    ELSE_IF:    'INSTR_ELSE_IF',
    FOR:        'INSTR_FOR',
    DO:         'INSTR_DO',
    WHILE:      'INSTR_WHILE'
}

const instruccionesAPI = {
    operacionUnaria: function(operando, op) {
        return {
            operando: operando, 
            op: op
        };
    },

    operacionBinaria: function(opIzdo, opDcho, op) {
        return {
            opIzdo: opIzdo,
            opDcho: opDcho,
            op: op
        };
    },

    nuevoValor: function(valor, tipo) {
        return{
            tipo: tipo,
            valor: valor
        };
    },

    nuevoParametro: function(tipo, valor) {
        return { 
            tipo: tipo,
            id: valor
        };
    }, 

    nuevoFor: function(declaracion, condicion, incremento, instrucciones) {
        return {
            declaracion: declaracion,
            condicion: condicion,
            incremento: incremento,
            instrucciones: instrucciones,
            tipo: tipo_instruccion.FOR
        };
    },

    nuevoWhile: function(condicion, instrucciones) {
        return {
            condicion: condicion,
            instrucciones: instrucciones,
            tipo: tipo_instruccion.WHILE
        };
    },

    nuevoDo: function(condicion, instrucciones) {
        return { 
            condicion: condicion,
            instrucciones: instrucciones,
            tipo: tipo_instruccion.DO
        };
    },

    nuevoIf: function(expresion, instrucciones) {
        return {
            expresion: expresion,
            instrucciones: instrucciones,
            tipo: tipo_instruccion.IF
        };
    },

    nuevoElseIf: function(expresion, instrucciones, if_enlazado) {
        return {
            expresion: expresion,
            instrucciones: instrucciones,
            if_enlazado: if_enlazado,
            tipo: tipo_instruccion.ELSE_IF
        };
    },

    nuevoIfElse: function(expresion, instruccionesY, instruccionesN) {
        return {
            expresion: expresion,
            instruccionesY: instruccionesY,
            instruccionesN: instruccionesN,
            tipo: tipo_instruccion.IF_ELSE
        };
    }
}


module.exports.instruccionesAPI = instruccionesAPI;
module.exports.tipo_operacion = tipo_operacion;
module.exports.tipo_valor = tipo_valor;
module.exports.tipo_instruccion = tipo_instruccion;