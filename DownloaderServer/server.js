//Tutorial baseado em http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4


//Pacotes usados
var express = require("express"); //importa express
var app = express(); //defina app com express
var bodyParser = require("body-parser");
var url = require('url');
var fs = require('fs');
var http = require('http');
var https = require('https');

var port = process.env.PORT || 666; //configura porta


//Permite usar o bodyParser 
// para pegar o POST 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


/*
SLAVE
*/

var dir= '../../../downloads/FromBot/',
    working = false;
var arr;
var file;
dir='./Download/';

var call = function (response) {

    console.log('Downloading...' );

    response.on('data', function (data) {
        file.write(data);
    })
        .on('end', function () {
            file.end();

            working = false;

            console.log('Ok...Got this ! '+ Date.now());

            if (arr) {
                arr.shift();
                
                if (arr[0]) {
                    
                    while( arr[0] ==="" )
                        arr.shift();

                    console.log('proximo! '+ Date.now())

                    file = fs.createWriteStream( dir+arr[0].substr(arr[0].lastIndexOf('/') + 1, arr[0].length));

                    get(arr[0]);
//                    console.log("ok2");
                }
  //              console.log("ok1");
            }
    //        console.log("ok0");
        });
	//console.log("ok");
}

var get = function (url) {

    name = url.substr(url.lastIndexOf('/') + 1, url.length);

    fs.exists(name, function (err, existe) {

        working = true;
		console.log(1,err,'\n',existe);

        if ( err )
            working=false;

        //else
            file = fs.createWriteStream( dir+url.substr(url.lastIndexOf('/') + 1, url.length));
	
	if( url.match("https") )
		https.get(url, call);
	else
        	http.get(url, call);
        //console.log("ok ",dir+url.substr(url.lastIndexOf('/') + 1, url.length));
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
    var add = req.url.indexOf('add') < 0;

    if ( req.url.length - req.url.indexOf('add') <5 )
        return rsp.json('Nope!' + Date.now() );
		
    console.log('add');

    if (!arr)
        arr = []

    url = req.url.substr(5, req.url.length);

    arr = arr.concat(url.split('!!!'));


    if (!working)
        get(arr[0]);

    rsp.json('Ok! on '+ Date.now() );
    console.log('ok');

});


//prefixa as rotas para /api
app.use('/', rota);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////


//inicia servidor
app.listen(port);
console.log("Ouvindo porta:[ " + port + " ] ♪");