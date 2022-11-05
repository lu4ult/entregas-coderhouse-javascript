/*
Aquí tenemos un array de objetos donde cada objeto tendrá su id, precio, título, etc.
La idea es hacer una especie de carrito para mostrar al usuario cuáles están activos o pausados, y calcular cuántos puede comprar en función de un presupuesto.
*/

class Producto {
    constructor(idMeli,titulo,precio,estado) {
        this.idMeli = idMeli.replace("-","");                                                       //Como identificador del producto usaremos directamente el identificador de la publicación que nos da Mercadolibre.
        this.titulo = titulo.toLowerCase();
        this.precio = precio;
        this.estado = estado;
        this.fecha = new Date();
    }

    //método:                                                                                       //A implementar en un futuro
    // vender(cantidad) {
    //     this.stock = this.stock + cantidad;
    // }
    // activar() {
    //     this.estado = true;
    // }
    // pausar() {
    //     this.estado = false;
    // }
}


//Agregamos de entrada algunos productos para que haya algo de contenido.
let productos =[ new Producto("MLA-15998080","TV smart",559999,true),
                new Producto("MLA-818528606","RAI",10429,false),
                new Producto("MLA-900797325","Bitcoin Ticker",6869,true),
                new Producto("MMLA-1117926574","Timbre Programable",30000,true)
                ];


function agregarProductos() {
    let nombre = prompt("Cuál es el nombre del producto "+String(productos.length +1)+"?");
    let precio = parseInt(prompt("Y cuál es el precio del producto "+String(productos.length +1)+" ("+nombre+")?"));
    if(isNaN(precio))
        precio = 0;
    //let productoNuevo = new Producto("MLA",nombre,precio,true);
    productos.push(new Producto("MLA-12345678",nombre,precio,true));

    mostrarProductos(productos,true);                                                                //Mostramos los productos luego de agregar alguno.
}


/*Dado un objeto fecha retornamos un string en formato dd/mm/aaaa para simplificar la lectura cuando no queremos ver la fecha completa con hora y todos los chiches.*/
function obtenerFechaFormateada(fecha) {
    return fecha.getDay()+"/"+fecha.getMonth()+"/"+fecha.getFullYear();
}

//Recibimos el array y si debe limpiar la consola o no
function mostrarProductos(arreglo, clearScreen) {
    if(clearScreen === true) {
        console.clear();
        console.log("%cProductos:","font-size:1rem;color:blue;");
    }

    for(let elemento of arreglo) {
        console.log(elemento.idMeli + ": " + elemento.titulo + " - " + elemento.precio + "$ - " + obtenerFechaFormateada(elemento.fecha));
    }
}

function buscarProductosPorNombre() {
    let tituloBuscado = prompt("Ingrese el nombre del producto a buscar:");
    let encontrados = productos.filter(el => el.titulo.includes(tituloBuscado));
    if(encontrados.length >= 1) {
        console.log("Encontrados:");
        mostrarProductos(encontrados,true);
    }
    else
        console.log("Ups! No encontré nada...")
}


function listarProductosPorPresupuesto() {
    let presupuestoUsuario = parseInt(prompt("Cuál es su presupuesto?"));
    //let presupuestoUsuario = 11000;
    productos.sort((a,b) => a.precio - b.precio);                                                   //Fuente: https://stackoverflow.com/questions/1129216
    console.clear();
    console.log("%cProductos ordenados de menor a mayor precio:","font-size:1rem;color:blue;");
    mostrarProductos(productos,false);

    console.log("----------");

    /*
    Ahora analizamos cuántos productos podría comprar el usuario según su presupuesto.
    Existen tres escenarios:
    1: el presupuesto no alcanza para ningún producto
    2: el presupuesto alcanza para todos los productos.
    3: el presupuesto alcanza para algunos de los productos
    */

    //Escenario 1:
    if(presupuestoUsuario < productos[0].precio) {                                                  //Comparamos contra el primer elemento del array ya que ya se ordenó.
        console.clear();
        console.log("Ups! no alcanza para ninguno!");
        console.log("Necesita "+ (productos[0].precio - presupuestoUsuario) + "$ para comprar al menos " + productos[0].titulo);
    }
    else {
        //Escenario 2:
        let sumatoriaTotal = 0;                                                                     //Calculamos el costo del carrito entero.
        for(let el of productos) {
            sumatoriaTotal += el.precio;
        }
        if(sumatoriaTotal <= presupuestoUsuario) {
            console.log("Felicidades! Le alcanza para comprar todo!");
        }

        //Escenario 3;
        else {
            //console.log("escenario 3");
            let indice = 0;
            let costoParcialCarrito = 0;
            let mensajeParaUsuario = "";

            do {                                                                                    //Hacemos un do-while en lugar de while ya que alcana para almenos el primer producto (escenario 1).
                costoParcialCarrito += productos[indice].precio;
                //console.log("costo carrito: "+costoParcialCarrito);
                mensajeParaUsuario += "\n*\t"+productos[indice].titulo;

                indice++;
            }while((costoParcialCarrito + productos[indice].precio) <= presupuestoUsuario);         //Mientras que el costo del carrito sumado al siguiente producto sea menor al presupuesto.
        console.log("Su presupuesto alcanza para:" + mensajeParaUsuario + "\nY sobran " + (presupuestoUsuario - costoParcialCarrito) + " $");
        }
    }
}

/**************************************************************************************************/


console.clear();
console.log("%cHola!","color:blue;font-size:2.5rem;border-bottom:1px solid blue;")
mostrarProductos(productos,false);                                                                  //Al cargar por primera vez mostramos los productos cargados al array de objetos.
