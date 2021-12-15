const url = 'http://182.18.7.9:8000/api/';

$( document ).ready(function() {
    
    let searchParams = new URLSearchParams(window.location.search)
    let param = searchParams.get('a')

    if(param == 'j') {
        //tokens de javascript
        getJsTokens();
    } else if(param == 'p') {
        //tokens de python
        getPyTokens();
    } else {
        console.log('no se hace nada');
    }


});


function getJsTokens() {
    let local = url + 'tokensjs';

    $.get(local, function(data, status) {
        let res = JSON.parse(data);
        console.log(res);
        if(res.status == 200) {
            $('#tablearea').html(res.payload);
        } else {
            $('#tablearea').html('NO CONTENT');
        }
    });

}

function getPyTokens(){
    let local = url + 'tokenspy';

    $.get(local, function(data, status) {
        let res = JSON.parse(data);
        console.log(res);
        if(res.status == 200) {
            $('#tablearea').html(res.payload);
        } else {
            $('#tablearea').html('NO CONTENT');
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
    // const url = 'http://182.18.7.7:3000/api/grafo';

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