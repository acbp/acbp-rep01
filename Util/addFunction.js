  /* Criador de função prototype */
// * e - object || object.prototype 
// * n - string ( name )
// * f - function
function addFunction( o, n, f){
    if( !n )return;
    if( f ) return o[n]=f;
    o[n] = function(){};
};