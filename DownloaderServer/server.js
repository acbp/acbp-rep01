//Tutorial baseado em http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4


//Pacotes usados
var express = require("express"); //importa express
var app = express(); //defina app com express
var bodyParser = require("body-parser");
var url = require('url');
var fs = require('fs');
var http = require('http');


var port = process.env.PORT || 8080; //configura porta


//Permite usar o bodyParser 
// para pegar o POST 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


/*
SLAVE
*/

var dir= './downloads/',
    working = false;
var arr;
var file;

var call = function (response) {

    console.log('Downloading...');

    response.on('data', function (data) {
        file.write(data);
    })
        .on('end', function () {
            file.end();

            working = false;

            console.log('Ok...Got this ! ');

            if (arr) {
                arr.shift();
                
                if (arr[0]) {
                    
                    while( arr[0] ==="" )
                        arr.shift();

                    console.log('proximo!')

                    file = fs.createWriteStream( dir+arr[0].substr(arr[0].lastIndexOf('/') + 1, arr[0].length));

                    get(arr[0]);
                }
            }
        });

}

var get = function (url) {

    var name = url.substr(url.lastIndexOf('/') + 1, url.length);

    fs.exists(name, function (err, existe) {

        working = true;

        if (err )
            working=true;


        file = fs.createWriteStream( dir+url.substr(url.lastIndexOf('/') + 1, url.length));

        http.get(url, call);

    });
};

/* 
SLAVE
*/


//////////////////////////////////////////
// ROTAS DA API
//////////////////////////////////////////
var rota = express.Router(); // pega instância

// middleware para usada para todas as rotas
rota.use(function (req, rsp, nxt) {
    var fail = true;
    var add = req.url.indexOf('add') < 0,
        download = req.url.indexOf('download') < 0;

    if ( add )
        return rsp.json('Nope!');

        console.log('add');

        if (!arr)
            arr = []

        url = req.url.substr(5, req.url.length);

        arr = arr.concat(url.split('%E2%98%BA'));


        if (!working)
            get(arr[0]);
    
        rsp.json('Ok!');


});


//prefixa as rotas para /api
app.use('/', rota);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////


//inicia servidor
app.listen(port);
console.log("Ouvindo porta:[ " + port + " ] ♪");