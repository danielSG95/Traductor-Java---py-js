var cm;
var pycm;
var jscm;

$(document).ready(function () {
    var editor = document.getElementById('txtarea_cm');
    cm = CodeMirror.fromTextArea(editor, {
        lineNumbers: true,
        mode: "text/x-java",
        theme: "darcula",
        matchBrackets: true
    });

    cm.setSize(750, 600);


    options = {
        lineNumbers: true,
        theme: "darcula",
        mode: null,
        readOnly: true
    }

    var pyconsole = document.getElementById('jsconsole');
    jscm = CodeMirror.fromTextArea(pyconsole, options);
    jscm.setSize(750, 300);

    var jsconsole = document.getElementById('pyconsole');
    pycm = CodeMirror.fromTextArea(jsconsole, options);
    pycm.setSize(750, 300);

});

// Request 

function analizar() {
    try {
        analizarJs();
        analizarPy();
    } catch (error) {
        console.log(error);
    }

}

function analizarPy() {
    const url = 'http://182.18.7.9:8000/api/analizarpy';

    limpiar_terminales();

    $.post(url, cm.getValue(), function (data, status) {
        let res = JSON.parse(data);
        if (res.status == 0) {
            pycm.setValue('NO se han encontrado errores.');
        } else if (res.status == 1) {
            console.log(res.payload);
            printError_py(res.payload);
        } else {
            pycm.setValue('Error Critico. Imposible recuperarse...');
        }
    });
}

function analizarJs(text) {
    const url = 'http://182.18.7.9:8000/api/analizarjs';

    //limpiar las terminales de salida en cada ejecucion
    limpiar_terminales();

    $.post(url, cm.getValue(), function (data, status) {
        let res = JSON.parse(data);
        if (res.status == 0) {
            jscm.setValue('NO se han encontrado errores.');
        } else if (res.status == 1) {
            console.log(res.payload);
            printError_Js(res.payload);
        } else {
            //error critico
            jscm.setValue('Error Critico. Imposible de recuperarse... :(');
        }
    });

}

function arbolJs() {
    const url = 'http://182.18.7.9:8000/api/arboljs';

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";

    req.onload = function (event) {
        var blob = req.response;
        console.log(blob.size);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download ="arboljs.pdf";
        link.click();
    };

    req.send();

}

function arbolpy() {
    const url = 'http://182.18.7.9:8000/api/arbolpy';

    
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";

    req.onload = function (event) {
        var blob = req.response;
        console.log(blob.size);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download ="arbolpy.pdf";
        link.click();
    };

    req.send();

}

function traduccionjs() {
    const url = 'http://182.18.7.9:8000/api/traduccionjs';

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";

    req.onload = function (event) {
        var blob = req.response;
        console.log(blob.size);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download ="traduccion.js";
        link.click();
    };

    req.send()
}

function traduccionpy() {
    const url = 'http://182.18.7.9:8000/api/traduccionpy';

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";

    req.onload = function (event) {
        var blob = req.response;
        console.log(blob.size);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download ="traduccion.py";
        link.click();
    };

    req.send()
}


function guardar() {
    var blob = new Blob([cm.getValue()],
        { type: "text/plain;charset=utf-8" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'current_file.java';
    link.click();
}

function printError_Js(error) {
    let texto = '';

    for (let i = 0; i < error.length; i++) {
        texto += '>>' + error[i].tipo
        texto += '\nSe ha encontrado un error en la linea: ' + error[i].linea + ' , columna: ' + error[i].columna;
        texto += '\nSe recibio el token: ' + error[i].lexema + ' Y se esperaba alguno de los siguientes tokens:\n';
        texto += error[i].esperados.toString();
        texto += '\n';
    }


    jscm.setValue(texto);

}

function printError_py(error) {
    let texto = '';

    for (let i = 0; i < error.length; i++) {
        texto += '>>' + error[i].tipo;
        texto += '\nSe ha encontrado un error en la linea: ' + error[i].linea + ' , Columna: ' + error[i].columna;
        texto += '\n' + error[i].descripcion + '\n';
    }

    pycm.setValue(texto);
}

function limpiar_terminales() {
    pycm.setValue('');
    jscm.setValue('');
}




function openFile() {
    $('#uploadFile').click();
}

function clearEditor() {
    cm.setValue("");
}

function onfileChange(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        cm.setValue(event.target.result);
    }

    reader.readAsText(file);
}