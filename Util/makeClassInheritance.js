  /* Gera cria uma Classe que herda 1 ou mais Classes */
// * n - nome da classe
// * i - Classe(s) herdadas
// * a - Argumento da classe
function makeClassInheritence( n, i, a ){
    var o ="function "+n+"(";
    
    if(a){
        //insere paramentros na funcao
        if( a.length > 1 )
            for( var q=0;q<a.length;q++)
                o+=String.fromCharCode(q);            
        else        
            o+=String.fromCharCode(65);
    }   
    
    o+="){";
    
    if(i){
        if( i.length > 1 )
            for( q=0;q<i.length;q++)
                o+=i[q].name + ".apply(this,arguments);";                

        else        
            o+=i.name + ".apply(this,arguments);";
    }

    o+="};";
    window.eval(o);
}