/*
Ingresamos los precios de 3 productos, los vamos almacenando en sus variables correspondientes y analizamos cuál es el menor y el mayor de ellos.

*/

let cantidadDeProductos = 3;

let precio1,precio2,precio3;                                                //To-Do: reemplazar por arryas cuando los aprendamos.
let mayorPrecio,menorPrecio;


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
            mayorPrecio = entradaUsuario;                                   //Tenemos que asignarles valores la primera vez que se ingresa un dato sino quedan como "undefined"
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

    if(entradaUsuario > mayorPrecio)
        mayorPrecio = entradaUsuario;
    }


console.log("Los precios ingresados son:\n" + precio1 + " $\n" + precio2 + " $\n" + precio3 + " $");
console.log(" El menor de ellos es: " + menorPrecio + " $\n\t\tY el mayor es: " + mayorPrecio + " $\n");