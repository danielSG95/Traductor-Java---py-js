const Router = require('express');
const router = Router.Router();
const path = require('path');
const interprete = require('../Analizador/interprete');
const Arbol = require('../Analizador/arbol').Arbol;
const Traductor = require('../Analizador/traductor').Traductor;
// Imports a los archivos de analisis y traduccion

let response = {
    status: 0,
    payload: null,
    message: ''
};

let out = undefined;



router.post('/analizar', function (req, res, next) {
    response.payload = null;
    let bufferOne = req.body;
    let data = bufferOne.toString('utf8');

    let out_ = interprete.analizar(data);

    console.log(data);

    if (out_.status == 0) {
        // ok
        out = out_.payload;
        response.status = 0;
        response.message = 'Analisis completo';
        res.send(response)
    } else if (out_.status == 1) {
        //errores
        out = out_.payload;
        response.status = 1
        response.message = 'Se han encontrado errores';
        response.payload = out.errores;
        res.send(response);
    } else {
        //status == 2 Error critico
        out = undefined;
        response.message = 'Se han detectado errores criticos, imposible recuperar...';
        response.status = 2;
        response.payload = undefined;

        res.send(response)
    }

});


router.get('/tokens', function (req, res, next) {
    if (out !== undefined) {
        response.status = 200;
        response.message = 'ok';
        response.payload = generarTabla(out.tokens);

        res.send(response);
    } else {
        response.status = 404;
        response.message = 'NO hay tabla de tokens por mostrar';
        response.payload = undefined;
        res.send(response);
    }
});

router.get('/errores', function (req, res, next) {
    if (out !== undefined) {
        response.status = 200;
        response.message = 'ok';
        response.payload = out.errores;

        res.send(response);
    } else {
        response.status = 404;
        response.message = 'NO hay tabla de errores por mostrar';
        response.payload = undefined;
        res.send(response);
    }
});

router.get('/arbol', async (req, res, next) => {
    if (out !== undefined) {
        arbol = new Arbol(out.raiz);
        await arbol.graficar();

        res.status(200);
        res.sendFile(path.resolve('Recursos/arbol.pdf'));
    } else {
        response.status = 404;
        response.message = 'NO existe AST por mostrar';
        response.payload = undefined;
        res.status(204);
        res.send(response);
    }

    // next();
});

router.get('/traducir', function (req, res, next) {
    if (out !== undefined) {
        let traductor = new Traductor(out.raiz);
        traductor.traducir();
        res.status(200);
        res.sendFile(path.resolve('Recursos/traduccion.py'));
    } else {
        response.status = 404;
        response.message = 'NO existe Traduccion por mostrar por mostrar';
        response.payload = undefined;
        res.status(204);
        res.send(response);
    }
});


function generarTabla(list) {
    let content = '<table class="table">\n';

    content += '<thead>\n';
    content += '<tr>\n';
    content += '<th scope="col">' + '#' + '</th>\n';
    content += '<th scope="col">' + 'Token' + '</th>\n';
    content += '<th scope="col">' + 'Lexema' + '</th>\n';
    content += '<th scope="col">' + 'Linea' + '</th>\n';
    content += '<th scope="col">' + 'Columna' + '</th>\n';
    content += '<th scope="col">' + 'Descripcion' + '</th>\n';
    content += '</tr>\n';
    content += '</thead>\n';

    content += '<tbody>\n';
    for (let i = 0; i < list.length; i++) {
        content += '<tr>\n';

        content += '<th scope="row">';
        content += i;
        content += '</th>\n';

        content += '<td>\n'
        content += list[i].token;
        content += '</td>\n'

        content += '<td>\n';
        content += list[i].lexema;
        content += '</td>\n'

        content += '<td>\n';
        content += list[i].linea;
        content += '</td>\n'

        content += '<td>\n';
        content += list[i].columna;
        content += '</td>\n'

        content += '<td>\n';
        content += list[i].descripcion;
        content += '</td>\n'

        content += '</tr>\n';

    }

    content += '</tbody>\n';


    content += '</table>\n';

    return content;

}






module.exports.router = router;