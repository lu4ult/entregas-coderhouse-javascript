/*
Ingresamos los precios de 3 productos, los vamos almacenando en sus variables correspondientes y analizamos cuál es el menor y el mayor de ellos.

*/

let cantidadDeProductos = 3;

let precio1,precio2,precio3;                                                //To-Do: reemplazar por arryas cuando los aprendamos.
let mayorPrecio,menorPrecio;



function obtenerElMayor(primero,segundo,tercero) {
    let mayorDeTodos = primero;
    if(segundo > mayorDeTodos)
        mayorDeTodos = segundo;
    if(tercero > mayorDeTodos)
        mayorDeTodos = tercero;

    return mayorDeTodos;
}


const iniciar = () => {
    for(let i=1;i<=cantidadDeProductos;i++) {
        let entradaUsuario;
        do {                                                                    //Validamos que no ingrese 0 como precio.
            entradaUsuario = parseInt(prompt("Ingrese el precio del producto "+i+" de "+cantidadDeProductos));
            if(entradaUsuario <= 0)
                alert("😕😕😕😕\nNo puedo aceptar productos sin precio!\nIntentemos otra vez...");
        } while(entradaUsuario <= 0);

       switch(i) {
            case 1: {
                precio1 = entradaUsuario;
                // mayorPrecio = entradaUsuario;                                   //Tenemos que asignarles valores la primera vez que se ingresa un dato sino quedan como "undefined"
                menorPrecio = entradaUsuario;
                break;
            }
            case 2: {
                precio2 = entradaUsuario;
                break;
            }
            case 3: {
                precio3 = entradaUsuario;
                break;
            }
            default:
                alert("Ups! Algo salió mal...")
        }

        if(entradaUsuario < menorPrecio)
            menorPrecio = entradaUsuario;

        // if(entradaUsuario > mayorPrecio)
        //     mayorPrecio = entradaUsuario;
        }

    console.log("Los precios ingresados son:\n" + precio1 + " $\n" + precio2 + " $\n" + precio3 + " $");
    console.log(" El menor de ellos es: " + menorPrecio + " $\n\t\tY el mayor es: " + obtenerElMayor(precio1,precio2,precio3) + " $\n");
}


class Producto {
    constructor(idMeli,titulo,precio,estado) {
        this.idMeli = idMeli.replace("-","");                                   /*Como identificador del producto usaremos directamente el identificador de la publicación que nos da Mercadolibre.*/
        this.titulo = titulo.toLowerCase();
        this.precio = precio;
        this.estado = estado;
        this.fecha = new Date();
    }

    //método:
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

let productos =[new Producto("MLA-900797325","Bitcoin Ticker",6799,true),
                new Producto("MLA-818528606","RAI",9137,false)];


function agregarProductos() {
    let nombre = prompt("Cuál es el nombre del producto "+String(productos.length +1)+"?");
    let precio = parseInt(prompt("Y cuál es el precio del producto "+String(productos.length +1)+" ("+nombre+")?"));
    if(isNaN(precio))
        precio = 0;
    //let productoNuevo = new Producto("MLA",nombre,precio,true);
    productos.push(new Producto("MLA-12345678",nombre,precio,true));

    mostrarProductos(productos);                                                                                                     //Mostramos los productos luego de agregar alguno.
}


/*Dado un objeto fecha retornamos un string en formato dd/mm/aaaa para simplificar la lectura cuando no queremos ver la fecha completa con hora y todos los chiches.*/
function obtenerFechaFormateada(fecha) {
    return fecha.getDay()+"/"+fecha.getMonth()+"/"+fecha.getFullYear();
}


function mostrarProductos (arreglo) {
    for(let elemento of arreglo) {
        console.log(elemento.idMeli + ": "+elemento.titulo +" - "+obtenerFechaFormateada(elemento.fecha));
    }
}

function buscarProductosPorNombre() {
    let tituloBuscado = prompt("Ingrese el nombre del producto a buscar:");
    let encontrados = productos.filter(el => el.titulo.includes(tituloBuscado));
    if(encontrados.length >= 1) {
        console.log("Encontrados:");
        mostrarProductos(encontrados);
    }
    else
        console.log("Ups! No encontré nada...")
}


// function buscarProductosPorPresupuesto() {
//     let presupuestoUsuario = parseInt(prompt("Cuál es su presupuesto?"));
//     let productosOrdenadosPorPrecio = productos.sort(a.precio,b => a + b);
//     mostrarProductos(productos);
//     mostrarProductos(productosOrdenadosPorPrecio);
// }

//let encontrados = productos.filter(el => el.precio >60000);

mostrarProductos(productos);


