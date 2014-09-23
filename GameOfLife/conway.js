/**
 * Cria uma celula com 2 estados(0/1) que verifica 8 vizinhos:
 * # # # 
 * # C #
 * # # #
 * 
 * Regras: Se vivo
 * - com 1 vizinho, morre(0)
 * - 2 ou 3 vizinhos, vive(1)
 * - 4 ou mais vizinhos, morre(0)
 * 
 * Regras: Se morto
 * - com 3 vizinhos, vive(1)
 * 
 * @param {type} l
 * @param {type} c
 * @param {type} estado
 * @returns {celular}
 */
function celular(l, c, estado) {
    this.estado = estado | 0;
    this.proximoEstado;
    this.l = l;
    this.c = c;
    this.m;
    //prototype
    this.__proto__ = {
        update: function() {
            //Atualiza celular
            this.estado = this.proximoEstado;
            //Reseta proximo estado
            this.proximoEstado = undefined;

            this.m[this.l][this.c] = this.estado;

        }
        , check: function(matriz) {
            if (!this.m)
                this.m = matriz;
            var q, r, t;
            t = [];
            this.vizinho = ''
            for (q = -1; q < 2; q++) {

                if (!matriz[ this.l + q ])
                    continue;

                for (r = -1; r < 2; r++) {
                    if (!matriz[ this.l + q ][ this.c + r ])
                        continue;

                    if (q !== 0 || r !== 0) {
                        this.vizinho += "[" + (this.l + q) + ":" + (this.c + r) + "] ";
                        t.push(matriz[ this.l + q ][ this.c + r ]);
                    }
                }
            }

            r = t.length;
            q = 0;

            while (r--)
                if (t[r] === 1)
                    q++;

            if (this.estado === 1) {
                //Condicao de vida
                if (q < 4)
                    if (q > 1)
                        return this.proximoEstado = 1;
            }
            else if (this.estado === 0)
                if (q === 3)
                    return this.proximoEstado = 1;

            //se nao morre
            this.proximoEstado = 0;
        }
    };
}

//window.Grid =
//        [ [0, 0, 0, 0, 1, 0]
//        , [0, 0, 0, 0, 1, 0]
//        , [0, 0, 0, 0, 1, 0]
//        , [0, 0, 0, 0, 0, 0]
//        , [1, 1, 1, 0, 0, 0]
//        , [0, 0, 0, 0, 0, 0]
//        ];
//        [ [1, 1, 0, 0, 0, 0]
//        , [1, 1, 0, 1, 0, 0]
//        , [0, 1, 0, 1, 0, 0]
//        , [0, 0, 1, 1, 0, 0]
//        , [0, 0, 0, 0, 0, 0]
//        , [0, 0, 0, 0, 0, 0]
//        ];

var celGrid = [];
var grid = [[]];
var width, height, ativo = false;

function criarDivGrid(l, c) {
    celGrid = [];
    grid = [[]];
    ativo = true;
    height = width = null;

    width = l;
    height = c;
    var b = document.getElementById('grade');
    
    var t = l * c;
    var x = 0, y = 0;
    var d;


    while (t-- > 0) {
        d = document.createElement("div");
        d.className = 'grid';
        d.style.width = (15) + 'px';
        d.style.height = (15) + 'px';
        d.style.left = (x * parseInt(d.style.height)) + 'px';
        d.style.top = (y * parseInt(d.style.width)) + 'px';
        d.style.position = 'absolute';
        d.id = '' + (y < 10 ? '0' + y : y) + ':' + (x < 10 ? '0' + x : x);
        b.appendChild(d);

        grid[ y ].push(0);
        celGrid.push(new celular(y, x, 0));

        x++;
        if (x === l) {
            x = 0;
            y++;
            if (t !== 0)
                grid.push([]);
        }

        celGrid[ celGrid.length - 1 ].div = d;
    }
    
    //estado de animcao
    d = document.createElement("div");
    d.className = 'on';
    d.style.width = (15) + 'px';
    d.style.height = (15) + 'px';
    d.style.left = (l * parseInt(d.style.height)) + 'px';
    d.style.top = (c * parseInt(d.style.width)) + 'px';
    d.style.position = 'absolute';
    d.id = 'estado';
    b.appendChild(d);
    //
    
    b.style.position = 'absolute';
    
    linhaGeracao();
    show();
    setTimeout(mainLoop ,500);

}


window.addEventListener('mousedown', click);
function click(e) {
    if( e.ctrlKey ){
     
        return;
    }
    ativo = false;
    
    if( ativo===true){
            document.getElementById('estado').className ='on';
    }
    else 
        document.getElementById('estado').className ='off';
    
    move(e);
    window.addEventListener('mouseover', move, true);
}
window.addEventListener('mouseup', clickUp);
function clickUp(e) {
    if( e.ctrlKey ){
        ativo = !ativo;
        
        if( ativo==true){
            document.getElementById('estado').className ='on';
            window.requestAnimationFrame(mainLoop);
        }
        else 
            document.getElementById('estado').className ='off';
        
        return;
    }
        
    window.removeEventListener('mouseover', move, true);
    window.requestAnimationFrame(mainLoop);
}

function move(e) {
    if (e.target.id === '')
        return;

    if (e.target.className !== 'vivo') {
        e.target.className = 'vivo';
    }
    else {
        e.target.className = 'grid';
    }
    e = e.target;

    var x = parseInt(e.id.substr(3, 5)), y = parseInt(e.id.substr(0, 3));

    q = ((y * width) >> 0) + x;

    grid[ y ][ x ] = e.className === 'vivo' ? 1 : 0;
    celGrid[q].estado = e.className === 'vivo' ? 1 : 0;
}

function lerGrid() {
    var p, o, l = "";

    for (p = 0; p < grid.length; p++) {
        for (o = 0; o < grid[p].length; o++) {
            l += ' ' + grid[p][o];
        }

    }

    return ('conteudo >\n', l);

}


var l, ct = 0;
function mainLoop() {
     if (ativo===false)
         return;
    ct++;
    if (ct > 8) {
        l = celGrid.length;
        while (l--){
            celGrid[l].check(grid);
        }

        l = celGrid.length;

        while (l--) {
             celGrid[l].update();
             
            //*****************************************
            if (celGrid[l].estado === 1)
                celGrid[l].div.className = 'vivo';
            else if (celGrid[l].estado === 0)
                celGrid[l].div.className = 'grid';
            //*****************************************
            
           
        }
        ct = 0;
    }
   
        window.requestAnimationFrame(mainLoop);
}

function linhaGeracao(){
    var 
    q,            
    w,
    e = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    for( q=0;q<e.length;q++){
        grid[ 18 ][ 15+q]  = e[q];
    }
  
}
function show (){
    var l=celGrid.length,b,d,m;
    
    while (l--){
            b = celGrid[l].check(grid) ;
            d = document.getElementById( ''+celGrid[l].l+':'+celGrid[l].c); 
            
            if (m === 1)
               d.className = 'vivo';
            else if (m === 0)
               d.className = 'grid';
        }
}

alert('CTRL + click para Ativar(azul)/Desativar(cinza) !')
criarDivGrid(75,35);
  


