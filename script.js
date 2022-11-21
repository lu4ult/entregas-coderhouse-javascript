
let editSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>'
let deleteSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>'

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
// let productos =[ new Producto("MLA1120052195","Cable",559999,true),
//                 new Producto("MLA818528606","RAI",10429,false),
//                 new Producto("MLA900797325","Bitcoin Ticker",6869,false),
//                 new Producto("MLA1154142031","Juguete gatos",65,false),
//                 new Producto("MLA1117926574","Timbre Programable",30000,true)
//                 ];

let productos = [];

let dataLocal = localStorage.getItem("tenes-stock");

if(dataLocal === null) {
    //primer inicio
    let cargarle = [new Producto("MLA818528606","RAI",10429,false, new Date())];
    localStorage.setItem("tenes-stock",JSON.stringify(cargarle));
}

let dataLeida = JSON.parse(localStorage.getItem("tenes-stock"));
//console.log(dataLeida)
dataLeida.forEach(e => {
    productos.push(new Producto(e.idMeli,e.titulo,e.precio,e.estado,e.fecha))
    console.log(e)
});

//productos = JSON.parse(localStorage.getItem("tenes-stock"));

// function agregarProductos() {
//     let nombre = prompt("Cuál es el nombre del producto "+String(productos.length +1)+"?");
//     let precio = parseInt(prompt("Y cuál es el precio del producto "+String(productos.length +1)+" ("+nombre+")?"));
//     if(isNaN(precio))
//         precio = 0;
//     //let productoNuevo = new Producto("MLA",nombre,precio,true);
//     productos.push(new Producto("MLA12345678",nombre,precio,true));

//     mostrarProductos(productos,true);                                                                //Mostramos los productos luego de agregar alguno.
// }


/*Dado un objeto fecha retornamos un string en formato dd/mm/aaaa para simplificar la lectura cuando no queremos ver la fecha completa con hora y todos los chiches.*/
function obtenerFechaFormateada(fecha) {

    //To-Do: cambiar getDay por getDate ya que ese es el número de día, no dow, y a month +1
    return fecha.getDate()+"/"+(fecha.getMonth() +1)+"/"+fecha.getFullYear();
}

//Recibimos el array y si debe limpiar la consola o no
// function mostrarProductos(arreglo, clearScreen) {
//     if(clearScreen === true) {
//         console.clear();
//         console.log("%cProductos:","font-size:1rem;color:blue;");
//     }

//     for(let elemento of arreglo) {
//         console.log(elemento.idMeli + ": " + elemento.titulo + " - " + elemento.precio + "$ - " + obtenerFechaFormateada(elemento.fecha));
//     }
// }

// function buscarProductosPorNombre() {
//     let tituloBuscado = prompt("Ingrese el nombre del producto a buscar:");
//     let encontrados = productos.filter(el => el.titulo.includes(tituloBuscado));
//     if(encontrados.length >= 1) {
//         console.log("Encontrados:");
//         mostrarProductos(encontrados,true);
//     }
//     else
//         console.log("Ups! No encontré nada...")
// }


// function listarProductosPorPresupuesto() {
//     let presupuestoUsuario = parseInt(prompt("Cuál es su presupuesto?"));
//     //let presupuestoUsuario = 11000;
//     productos.sort((a,b) => a.precio - b.precio);                                                   //Fuente: https://stackoverflow.com/questions/1129216
//     console.clear();
//     console.log("%cProductos ordenados de menor a mayor precio:","font-size:1rem;color:blue;");
//     mostrarProductos(productos,false);

//     console.log("----------");

//     /*
//     Ahora analizamos cuántos productos podría comprar el usuario según su presupuesto.
//     Existen tres escenarios:
//     1: el presupuesto no alcanza para ningún producto
//     2: el presupuesto alcanza para todos los productos.
//     3: el presupuesto alcanza para algunos de los productos
//     */

//     //Escenario 1:
//     if(presupuestoUsuario < productos[0].precio) {                                                  //Comparamos contra el primer elemento del array ya que ya se ordenó.
//         console.clear();
//         console.log("Ups! no alcanza para ninguno!");
//         console.log("Necesita "+ (productos[0].precio - presupuestoUsuario) + "$ para comprar al menos " + productos[0].titulo);
//     }
//     else {
//         //Escenario 2:
//         let sumatoriaTotal = 0;                                                                     //Calculamos el costo del carrito entero.
//         for(let el of productos) {
//             sumatoriaTotal += el.precio;
//         }
//         if(sumatoriaTotal <= presupuestoUsuario) {
//             console.log("Felicidades! Le alcanza para comprar todo!");
//         }

//         //Escenario 3;
//         else {
//             //console.log("escenario 3");
//             let indice = 0;
//             let costoParcialCarrito = 0;
//             let mensajeParaUsuario = "";

//             do {                                                                                    //Hacemos un do-while en lugar de while ya que alcana para almenos el primer producto (escenario 1).
//                 costoParcialCarrito += productos[indice].precio;
//                 //console.log("costo carrito: "+costoParcialCarrito);
//                 mensajeParaUsuario += "\n*\t"+productos[indice].titulo;

//                 indice++;
//             }while((costoParcialCarrito + productos[indice].precio) <= presupuestoUsuario);         //Mientras que el costo del carrito sumado al siguiente producto sea menor al presupuesto.
//         console.log("Su presupuesto alcanza para:" + mensajeParaUsuario + "\nY sobran " + (presupuestoUsuario - costoParcialCarrito) + " $");
//         }
//     }
// }


// async function buscar(buscado) {
//     console.log("google api: " + buscado);
//     const response = await fetch('https://www.googleapis.com/youtube/v3/search?key=AIzaSyAD6_lw_djitCmUxEI8WyNyjvonlUTT57E&q='+buscado+' en vivo', {});
//     //console.log('response.status: ', response.status); //
//     if(response.status === 403) {
//       console.log("sin couta para la api");
//     }
//     const data = await response.json();
//     for(let i=0;i<5;i++) {
//       let tipo = data['items'][i]['id']['kind'];
//       let id = data['items'][i]['id']['videoId'];
//       //console.log(tipo + " - " + id);
//       if(tipo === "youtube#video") {
//         //console.log("bien: " + id)
//         return id;
//       }
//     }
//     //console.log("ups no")
//     return "nada";
  
//    // return json.first_name.concat(' ').concat(json.last_name);
//     //return "retornando";
//   }

async function getImgUrlfromMeli(id_meli){
    //console.log(id_meli)

    const response = await fetch('https://api.mercadolibre.com/items/'+id_meli, {});
    //console.log(response);
    const data = await response.json();
    const img = data['secure_thumbnail'];
    //console.log(img);

    let imgSrc = document.getElementById("img-"+id_meli);
    imgSrc.src = img;

    //return url;
    //return "https://http2.mlstatic.com/D_709442-MLA32447175586_102019-I.jpg";
    return img;
}

function borrarProducto(indice) {
    //Recibimos el índice de dónde está el objeto a eliminar, y luego de borrarlo limpiamos todo el HTML del contenedor y lo reconstruimos
    //console.log(indice);
    productos.splice(indice,1);
    document.getElementById("productosContenedor").innerHTML = "";
    productos.forEach(e => {cargarProductoADom(e);});

}


function cargarProductoADom(objRecibido) {
    let productosContenedor = document.getElementById("productosContenedor");
    //console.log()
    let productoAgregar = `
    <div class="productos__individual">
        <div class="superior">
            <div class="identificador">
            <span>${objRecibido.idMeli}</span>
            </div>
            <div class="botones">
                <button onclick="borrarProducto(${productos.indexOf(objRecibido)});">${deleteSvg}</button>
            </div>
        </div>
        <div class="principal">
            <span class="fecha">${obtenerFechaFormateada(objRecibido.fecha)}</span>
            <span class="titulo"></span>
            <a target="_blank" href="https://articulo.mercadolibre.com.ar/${objRecibido.idMeli.replace("MLA","MLA-")}">${objRecibido.titulo}</a>
            <img src="" id="img-${objRecibido.idMeli}">
            <span class="precio">${objRecibido.precio}</span>
        </div>
        <div class="abajo">
            <span class="estado estado-${objRecibido.estado}">Pausado</span>
        </div>
    </div>
    `;
    getImgUrlfromMeli(objRecibido.idMeli);
    productosContenedor.innerHTML += productoAgregar;
}




productos.forEach(e => {cargarProductoADom(e);
});


//cargarProductoADom(0);
/**************************************************************************************************/


// console.clear();
// console.log("%cHola!","color:blue;font-size:2.5rem;border-bottom:1px solid blue;")
// mostrarProductos(productos,false);                                                                  //Al cargar por primera vez mostramos los productos cargados al array de objetos.

