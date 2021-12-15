const Router = require('express');
const router = Router.Router();
const path = require('path');
const interprete = require('../Analizador/interprete');
const tree = require('../Analizador/arbol');
const traduccion = require('../Analizador/traduccion');

const response = {
    status: 0,
    message: '',
    payload: undefined
};

let parserOutput = null;

router.post('/analizar', function(req, res, next) {
    let bufferOne = req.body;
    let data = bufferOne.toString('utf8');

    let out = interprete.analizar(data);

    console.log('salida luego de analizar la entrada:... ');
    console.log(out);

    if(out.status == 0) {
        parserOutput = out.payload;
        response.status = 0;
        response.message = 'Analisis realizado con exito';
        response.payload = undefined;
    } else if(out.status == 1){
        parserOutput = out.payload;
        response.status = 1;
        response.message = 'Se encontraron errores durante el analisis';
        response.payload = parserOutput.terrores;
    } else if(out.status == 2){
        parserOutput = undefined;
        response.status = 2;
        response.message = 'Se encontraron errores criticos. Imposible recuperar';
        response.payload = undefined;
    }    

    res.send(response);
    // next();
});

router.get('/tokens', function(req, res, next){
    if (parserOutput != null) {
        response.status = 200;
        response.message = 'ok';


        let resultado = generarTabla(parserOutput.ttokens);

        response.payload = resultado;
        console.log(parserOutput.ttokens);
        res.json(response);
    } else {
        response.status = 404;
        response.message = 'NO hay tabla de tokens por mostrar';
        response.payload = undefined;
        res.send(response);
    }
    
    next();
});

router.get('/errores', function(req, res, next){
    if(parserOutput != null) {
        response.status = 200;
        response.message = 'ok';
        response.payload = parserOutput.terrores;
        res.json(response);
    } else {
        response.status = 404;
        response.message = 'NO hay tabla de errores por mostrar';
        response.payload = undefined;
        res.send(response);
    }

    // next();
});

router.get('/grafo', async(req, res, next) =>{
    if(parserOutput != null && parserOutput.arbol != undefined) {
        arbol = new tree.arbol(parserOutput.arbol);
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

router.get('/traduccion', function(req, res, next){
    if(parserOutput == undefined){
        res.json({status:500, message:'Error'});
        return;
    }

    if(parserOutput.arbol !== undefined && parserOutput.arbol !== null) {
	    let arbol = parserOutput.arbol;
        t = new traduccion.traductor(arbol);
        t.traducir();

	    res.setHeader('Content-Type', 'application/javascript')
	    res.status(200);
        res.sendFile(path.resolve('Recursos/traduccionJs.js'));
	
    } else {
       response.status = 404;
       response.message = 'NO existe Traduccion por mostrar por mostrar';
       response.payload = undefined;
       res.status(204);
       res.send(response);
    }

    // next();
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
    content += '</tr>\n';
    content += '</thead>\n';

    content += '<tbody>\n';
    for(let i = 0; i < list.length; i++) {
        content += '<tr>\n';

        content += '<th scope="row">';
        content += i;
        content +='</th>\n';
        
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

        content += '</tr>\n';

    }

    content += '</tbody>\n';


    content += '</table>\n';

    return content;

}

module.exports.router = router;
