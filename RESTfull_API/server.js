//Tutorial baseado em http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4


//Pacotes usados
var express     = require("express");//importa express
var app         = express();//defina app com express
var bodyParser  = require("body-parser");
var mongoose    = require('mongoose');//manipula banco
var bear        = require('./app/models/bear');



var port = process.env.PORT || 8080; //configura porta



//Coneceta com banco
mongoose.connect('mongodb://localhost:27017/Teste');



//Permite usar o bodyParser 
// para pegar o POST 
app.use( bodyParser.urlencoded( {extended:true} ) );
app.use( bodyParser.json() );



//////////////////////////////////////////
// ROTAS DA API
//////////////////////////////////////////
var rota = express.Router(); // pega instância

// middleware para usada para todas as rotas
rota.use( function( req,rsp,nxt ) {
    console.log( "Recebendo Request !\n");
    nxt(); // continua para proxima rota
} );

//Testa se esta funcionando
rota.get('/', function( req,rsp ){
    rsp.json( { message:"BLZ ! funfou !" } );
} );

//Cria uma rota dedicada para bears ( http://localhost:8080/api/bears )
rota.route('/bears')

    //Cria um bear acessado em http://localhost:8080/api/bears
    .post( function( req,rsp ){

        var b = new bear();    // nova instância do modelo bear
        b.name = req.body.name; // atribui nome vindo requisição

        // salva dados e verifica erros
        b.save( function( err ){
            
            //se tiver erro
            if( err )
                // devolve o erro
                rsp.send( err );

            //Dado que será devolvido
            rsp.json( { message:'Novo Bear Criado ! ' } );
            console.log( "POST in bears !")
            
        });//save

    })//post

    //Retorna todos os bear
    .get( function( req, rsp ) {
        
        //pega todos os bears
        bear.find( function( err , bears ){
            
            //se houver erro
            if( err )
                
                // envia
                rsp.send(err);

            //Envia todos os bear(s) 
            rsp.json( bears );
            console.log( "GET bears !");
            
        });// find
    
    })//get

    //Delete todos os bears
    .delete( function( req, rsp ) {
        
        //pega todos os bears
        bear.remove( {}, function( err , bears ){
            
            //se houver erro
            if( err )
                
                // envia
                rsp.send(err);

            //Deleta todos os bear(s) 
            rsp.json( { message:"Deletado todos os bears"} );
            console.log( "DELETE bears !");
            
        });// remove
    
    });//delete
//fim rotas para bears

//Rota para /bears/:bear_id
rota.route('/bears/:bear_id')

    //Retorna um bear com id específico 
    .get( function( req, rsp ) {

        //acha id
        bear.findById( req.params.bear_id, function( err,b ){

           //Caso não haja id
           if(err) 

               //envia erro
               rsp.send(err);

            // devolve item específico
            rsp.json( b );
            console.log( "GET id:[ "+req.params.bear_id+" ] !");
        });
    })

    //Atualiza um bear específico
    .put(function ( req ,rsp ){

        //procura id
        bear.findById( req.params.bear_id, function( err, b ){

            //se não encontrar o id
            if( err )

                //envia erro
                rsp.send(err);

            //Altera nome do bear
            b.name=req.body.name;

            //Salva
            b.save( function(err){

                //Caso esteja errado
                if( err )

                    //envia err
                    rsp.send(err);

                //Salva retorna msg de concluido
                rsp.json( { message:"Bear atualizado !" } );
                console.log( "PUT id:[ "+req.params.bear_id+" ] !");

            });//save

        }); //findById 

    })//put
    
    //Delete id específicado
    .delete( function( req, rsp ){

        //Remove o id 
        bear.remove({ _id:req.params.bear_id }, function(err,b){

            //Se não houver id
            if( err )

                //Retorna erro
                rsp.send(err);

            //Retorna msg de deletação
            rsp.json( { message:"Deletado com sucesso!"});
            console.log( "DELETE id:[ "+req.params.bear_id+"] !");

        });//remove
    });//delete

//fim /bears/:bear_id

//prefixa as rotas para /api
app.use( '/api', rota);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////



//inicia servidor
app.listen( port );
console.log( "Ouvindo porta:[ "+port+" ] ♪" );