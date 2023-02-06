/**********************     VARIABLES GENERALES Y OBJETOS      ***********************************************************************************/
let esProduccion = "https://tenesstock.netlify.app/" === window.location.href || "https://tenesstockdev.netlify.app/" === window.location.href;
let configuracionUsuario;
let estanPausadasNotificaciones = false;
let estanPausadasLlamadasApi = false;

let editSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>'
let deleteSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>'

class Producto {
    constructor(idMeli, titulo, precio, estado, fecha, imgUrl) {
        this.idMeli = String(idMeli);                                                                      //Como identificador del producto usaremos directamente el identificador de la publicación que nos da Mercadolibre.
        this.titulo = titulo.toLowerCase();
        this.precio = parseInt(precio);
        this.estado = Boolean(estado);
        this.fecha = fecha;
        this.imgUrl = imgUrl;
    }

    update() {
        this.fecha = new Date();
    }
}

class Notificacion {
    constructor(fecha, descripcion) {
        this.fecha = fecha;
        this.descripcion = descripcion;
    }
}

class userConfig {
    constructor(notificPopUp, notificAudio, notificEmail, email, listOrder) {
        this.notificPopUp = notificPopUp;                                                                   //Como identificador del producto usaremos directamente el identificador de la publicación que nos da Mercadolibre.
        this.notificAudio = notificAudio;
        this.notificEmail = notificEmail;
        this.email = email;
        this.listOrder = listOrder;
    }
}


//Agregamos de entrada algunos productos para que haya algo de contenido.
let productosBase = [
    new Producto("MLA-818528606", "RAI", 0, false, new Date(), ""),
    new Producto("MLA-900797325", "Bitcoin Ticker", 0, false, new Date(), ""),
    new Producto("MLA-1117926574", "Timbre Programable", 0, true, new Date(), ""),
    new Producto("MLA-818539416", "Adaptador programador esp-01", 0, true, new Date(), ""),
    new Producto("MLA-1167147839", "Dimmer Módulo Desarrollo", 0, false, new Date(), ""),
    new Producto("MLA-918716646", "Bitcoin Ticker Grande", 0, true, new Date(), ""),
    new Producto("MLA-926122313", "Adaptador esp", 0, false, new Date(), ""),
    new Producto("MLA-863258477", "watchdog arduino", 0, false, new Date(), ""),
    new Producto("MLA-1150649391", "timbre con campana", 0, false, new Date(), "")
];

let productos = [];
let notificaciones = [];
let papelera = [];


/**********************     LOCALSTORAGE      ***********************************************************************************/
let dataLocal = localStorage.getItem("tenes-stock_productos");
//Si es la primera vez que carga la página le cargamos algunos productos aleatorios.
if (dataLocal === null) {
    console.log("Creando data local random")
    productosBase = productosBase.sort((a, b) => 0.5 - Math.random());
    let cantidadRandom = Math.floor(3 + Math.random() * (productosBase.length - 2));
    let arrayRandomGenerado = [];
    do {
        arrayRandomGenerado.push(productosBase.pop());
        cantidadRandom--;
    } while (cantidadRandom);

    localStorage.setItem("tenes-stock_productos", JSON.stringify(arrayRandomGenerado));
    localStorage.setItem("tenes-stock_notificaciones", JSON.stringify([new Notificacion(new Date(), "Hola! Bienvenido")]));
}

let configuracionUsuarioLocal = localStorage.getItem("tenes-stock_configuracion-usuario");
if (configuracionUsuarioLocal === null) {
    console.log("Creando configuracion del usuario")
    localStorage.setItem("tenes-stock_configuracion-usuario", JSON.stringify(new userConfig(true, true, false, "ejemplo@gmail.com", 0)));
}
/******************/

let productosLeidosLocal = JSON.parse(localStorage.getItem("tenes-stock_productos"));
productosLeidosLocal.forEach(e => {
    productos.push(new Producto(e.idMeli, e.titulo, e.precio, e.estado, new Date(e.fecha), e.imgUrl));
});

let notificacionesLeidasLocal = JSON.parse(localStorage.getItem("tenes-stock_notificaciones"));
notificacionesLeidasLocal.forEach(e => {
    notificaciones.push(new Notificacion(new Date(e.fecha), e.descripcion));
});

let userConfigLocal = JSON.parse(localStorage.getItem("tenes-stock_configuracion-usuario"));
configuracionUsuario = new userConfig(userConfigLocal['notificPopUp'], userConfigLocal['notificAudio'], userConfigLocal['notificEmail'], userConfigLocal['email'], userConfigLocal['listOrder']);


/**********************     FUNCIONES GENERALES      ***********************************************************************************/

/*Dado un objeto fecha retornamos un string en formato dd/mm/aaaa para simplificar la lectura.*/
function obtenerFechaFormateada(fecha) {
    return fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " - " + fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? "0" : "") + fecha.getMinutes() + ":" + (fecha.getSeconds() < 10 ? "0" : "") + fecha.getSeconds();
}


let urlInput = document.getElementById("urlInput");
urlInput.onfocus = () => {
    urlInput.value = "";
    urlInput.classList.remove("input-error");
};

let botonAgregarProductos = document.getElementById("botonAgregarProductos");
botonAgregarProductos.addEventListener("click", agregarProductos);

function agregarProductos() {
    let user = urlInput.value;
    user = user.toUpperCase();                                  //Por si escriben el ID.
    urlInput.value = "";
    const inicioId = user.indexOf("MLA") + 3;                    //+3 por el "MLA"
    console.log("Inicio: " + inicioId);

    let meliIdEncontrado = "";

    //Ya que el codigo meli puede iniciar con "MLA" o con "MLA-", y su largo es variable pero son sólo números,
    //recorremos el string de la url desde la posición de URL y concatenamos los caracteres mientras que sean números,
    //Lo hacemos con un for desde 0 (desde el inicio del substring) hasta 15 (como una exageración de un código muy largo pero son de 10 o 11).

    for (let i = 0; i <= 15; i++) {
        let caracter = "";
        caracter += user[inicioId + i];
        if (!isNaN(parseInt(caracter))) {
            meliIdEncontrado += caracter;
        }
    }

    if (inicioId < 0 || inicioId === 2) {
        urlInput.value = "Ups! Algo salió mal..."
        urlInput.classList.add("input-error");
    }

    //Algunas publicaciones tiene un ID de 8 dígitos que por alguna razón la API no devuelve nada.
    if (meliIdEncontrado.length <= 8) {
        urlInput.value = "Ups! Códigos de 8 dígitos no soportados.";
        urlInput.classList.add("input-error");
    }

    if (inicioId >= 0 && inicioId !== 2 && meliIdEncontrado.length >= 9) {
        //Verificamos que el producto ingresado no esté actualmente cargado; para eso lo buscamos y esperamos hallar "undefined" ya que no encuentra nada, si encontramos un objeto, alertamos con swal descartamos la entrada.
        let esRepetido = productos.find(e => e.idMeli == ("MLA-" + meliIdEncontrado));
        if (esRepetido !== undefined) {
            setTimeout(() => {                                                                              //Si no lo ejecutamos así (cargandolo al stack con tiempo 0), por alguna razón el Swal entra siempre en el .then y el modal desaparece instantáneamente.
                Swal.fire({
                    icon: 'error',
                    title: 'Ups!',
                    text: 'Este producto ya se encuentra cargado.',
                })
            }, 0);
            return;
        }
        productos.push(new Producto("MLA-" + meliIdEncontrado, "Por favor espere actualización...", 0, false, new Date()));
        reconstruirDom();
    }
}


//TODO: analizar status code del HTTP con un producto inválido, lo que ahora resolvimos con el swal
function llamarApiMeli(idMeli) {

    if (estanPausadasLlamadasApi === false) {
        clearInterval(reconstruirEnFuturo);                                                                       //Cancelamos la reconstrucción del dom si ya está en stack, para evitar que se ejecute múltiples veces cuando cargamos muchas publicaciones simultáneamente.
        reconstruirEnFuturo = setTimeout(() => {
            reconstruirDom();
        }, 100);
    }

    if (estanPausadasLlamadasApi)
        return;

    let idMeliApi = idMeli.replace("-", "");
    if (!esProduccion) console.log("Llamando API Meli: " + idMeliApi);

    if (estanPausadasNotificaciones) {
        setTimeout(() => { estanPausadasNotificaciones = false; }
            //,productos.length*1000);
            , 1 * 60 * 1000);
    }

    fetch('https://api.mercadolibre.com/items/' + idMeliApi)
        .then(response => response.json())
        .then(data => {
            let terminosVentas = data['sale_terms'];
            let _tiempoElaboracion = 0;
            terminosVentas.forEach(el => {
                //console.log(el);
                if (el['id'] === 'MANUFACTURING_TIME') {
                    _tiempoElaboracion = el['value_name'];
                    //console.log("Tiempo elaboracion: " + _tiempoElaboracion)
                }
            });

            //console.log(tiempoElaboracion);

            /* Recolección de data de la API */
            let _titulo = "";
            _titulo += String(data['title']);
            let _precio = parseInt(data['price']);
            let _estado = data['status'] === 'active' ? true : false;

            let _imgUrl = data['pictures'][0]['secure_url'].replace("https://http2.mlstatic.com/", "");          //No guardamos la URL completa a la imágen y con esto mejoró mucho el rendimiento con muchas publicaciones.
            _imgUrl = _imgUrl.replace(".jpg", "");

            let objActualIndice = productos.findIndex(e => e.idMeli === idMeli);                                //Ya que recibimos el ID pero no el objeto, tenemos que encontrar el objeto en el array y capturarlo
            let objetoActual = productos[objActualIndice];



            //TODO: estos dos IFs se pueden refactorizar en uno solo. Quedó así porque originalmente se notificaba sólo cambio de estado y luego se agregó cambio de precio.
            if (_precio != objetoActual.precio && objetoActual.precio && !estanPausadasNotificaciones) {
                let diferenciaPorcentual = 0;
                let esAumento = true;
                let _mensajeNotificacion = "Hola"

                if (_precio < objetoActual.precio) {
                    esAumento = false;
                    diferenciaPorcentual = Math.abs(parseInt(100 * (1 - _precio / objetoActual.precio)));
                    _mensajeNotificacion = `${_titulo} bajó un ${diferenciaPorcentual} %`;
                }


                else {
                    diferenciaPorcentual = Math.abs(parseInt(100 * (1 - objetoActual.precio / _precio)));
                    _mensajeNotificacion = `${_titulo} aumentó un ${diferenciaPorcentual} %`;
                }


                notificaciones.push(new Notificacion(new Date(), _mensajeNotificacion));
                if (!estanPausadasNotificaciones) {
                    botonNotificaciones.classList.add("recentlyUpdated");
                }
                if (configuracionUsuario.notificAudio && !estanPausadasNotificaciones) {
                    let mensajeEnAudio = _mensajeNotificacion.replace("-", " ");
                    mensajeEnAudio = mensajeEnAudio.replace("/", " ");

                    let utterance = new SpeechSynthesisUtterance(mensajeEnAudio);
                    utterance.pitch = 1.5;
                    window.speechSynthesis.speak(utterance);
                }

                if (configuracionUsuario.notificPopUp && !estanPausadasNotificaciones && !esAumento) {
                    setTimeout(() => {
                        Toastify({
                            text: _mensajeNotificacion,
                            duration: 3000,
                            close: true,
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true,
                            style: {
                                background: !esAumento ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, tomato, gold)",
                            },
                            offset: {
                                x: 0,
                                y: "100px"
                            },
                        }).showToast();
                    }, 100);
                }
            }

            if (_estado !== objetoActual.estado) {
                if (!esProduccion) console.log("Cambio de estado: " + objetoActual.titulo);

                objetoActual.update();                                                                          //Actualiza la fecha del objeto, ya que la fecha indica la última modificación y así aparece primero si se selecciona ordenar por fecha.

                let mensaje = `${_titulo} está ahora ${_estado ? "activo" : "pausado"} !`;

                if (!estanPausadasNotificaciones) {
                    notificaciones.push(new Notificacion(new Date(), mensaje));
                    botonNotificaciones.classList.add("recentlyUpdated");
                }

                if (configuracionUsuario.notificPopUp && !estanPausadasNotificaciones && _estado) {
                    setTimeout(() => {
                        Toastify({
                            text: mensaje,
                            duration: 3000,
                            close: true,
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true,
                            style: {
                                background: _estado ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, tomato, gold)",
                            },
                            offset: {
                                x: 0,
                                y: "100px"
                            },
                        }).showToast();
                    }, 100);
                }

                if (configuracionUsuario.notificAudio && !estanPausadasNotificaciones && _estado) {
                    let mensajeEnAudio = mensaje.replace("-", " ");
                    mensajeEnAudio = mensajeEnAudio.replace("/", " ");

                    let utterance = new SpeechSynthesisUtterance(mensajeEnAudio);
                    utterance.pitch = 1.5;
                    window.speechSynthesis.speak(utterance);
                }

                if (configuracionUsuario.notificEmail && !estanPausadasNotificaciones && _estado) {
                    console.log("enviando email");
                    emailjs.send('service_k3tj0b9', 'template_gqsipms', { destinatario: configuracionUsuario.email, producto: _titulo, estado: _estado ? "activo" : "pausado" })
                        .then(function (response) {
                            console.log('Email enviado correctamente!', response.status, response.text);
                        }, function (error) {
                            console.log('Email fallo...', error);
                        });
                }
            }
            objetoActual.estado = _estado;
            objetoActual.titulo = _titulo;
            if (_tiempoElaboracion)
                objetoActual.titulo = objetoActual.titulo + " - " + _tiempoElaboracion;
            objetoActual.precio = _precio;
            objetoActual.imgUrl = _imgUrl;
        })
        .catch(error => {
            console.log("Error: " + error);
            Swal.fire({
                title: 'Error!',
                text: "Algo salió mal con el producto " + idMeli + ", seleccione si desea eliminar el producto o cancelar.",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar'
            }).then((result) => {
                if (result.isConfirmed) {
                    borrarProducto(idMeli);
                }
            });
        })
}

//Recibe el "ID" que se desea borrar y debemos encontrarlo en el array de productos ya que se puede haber ordenado de varias maneras según la configuración del usuario.
function borrarProducto(idABorrar) {
    let indiceProductoBuscado = productos.findIndex(e => e.idMeli === idABorrar);

    notificaciones.push(new Notificacion(new Date(), "[" + productos[indiceProductoBuscado].idMeli + "] " + productos[indiceProductoBuscado].titulo + " eliminado."));
    botonNotificaciones.classList.add("recentlyUpdated");


    papelera.push(productos[indiceProductoBuscado]);
    document.getElementById("botonPapelera").classList.remove("oculto");
    productos.splice(indiceProductoBuscado, 1);

    if (productos.length === 0) {
        document.getElementById("botonGeneradorRandom").classList.remove("oculto");
    }

    reconstruirDom();
}

//Para las notificaciones no es necesario ubicar la notificación ya que siempre están ordenadas por fecha.
function borrarNotificacion(indice) {
    notificaciones.splice(indice, 1);
    document.getElementById("notificacionesContenedor").innerHTML = "";
    notificaciones.forEach(e => { cargarNotificacionADom(e); });

    reconstruirDom();
}

//Estas funciones reciben un objeto (notificacion y producto) y lo "concatenan" al DOM, de manera que se pueden recorrer los arrays con for of o .forEach.
function cargarNotificacionADom(objRecibido) {
    let notificacionesContenedor = document.getElementById("notificacionesContenedor");
    notificacionesContenedor.innerHTML += `
        <div><button onclick="borrarNotificacion('${notificaciones.indexOf(objRecibido)}');">${deleteSvg}</button><span>${obtenerFechaFormateada(objRecibido.fecha)} - ${objRecibido.descripcion}</span></div>
    `;
}

function cargarProductoADom(objRecibido) {
    let productosContenedor = document.getElementById("productosContenedor");

    let productoAgregar = `
    <div class="productos__individual">
        <div class="superior">
            <div class="identificador">
            <span>${objRecibido.idMeli}</span>
            </div>
            <div class="botones">
                <button onclick="borrarProducto('${objRecibido.idMeli}');">${deleteSvg}</button>
            </div>
        </div>
        <div class="principal">
            <span class="fecha">${obtenerFechaFormateada(objRecibido.fecha)}</span>
            <a class="titulo" id="${objRecibido.idMeli}-title" target="_blank" href="https://articulo.mercadolibre.com.ar/${objRecibido.idMeli}">${objRecibido.titulo}</a>
            <div class="img-container">
            <img loading="lazy" src="https://http2.mlstatic.com/${objRecibido.imgUrl}.jpg" alt=" imágen ${objRecibido.titulo}" id="${objRecibido.idMeli}-img">
            </div>
            <span class="precio" id="${objRecibido.idMeli}-price">${objRecibido.precio}</span>
        </div>
        <div class="abajo">
            <span class="estado estado-${objRecibido.estado}" id="${objRecibido.idMeli}-status" + ">${objRecibido.estado ? "activo" : "pausado"}</span>
        </div>
    </div>
    `;

    productosContenedor.innerHTML += productoAgregar;
}



function reconstruirDom() {
    if (!esProduccion) console.log("Reconstruyendo DOM");

    document.getElementById("productosContenedor").innerHTML = "";
    document.getElementById("notificacionesContenedor").innerHTML = "";

    switch (configuracionUsuario.listOrder) {
        case 0: {
            productos.sort((a, b) => b.fecha - a.fecha);
            break;
        }
        case 1: {
            productos.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        }
        case 2: {
            productos.sort((a, b) => a.precio - b.precio);
            break;
        }
        case 3: {
            productos.sort((a, b) => a.estado - b.estado);
            break;
        }
    }

    productos.forEach(e => {
        cargarProductoADom(e);
    });


    notificaciones.sort((a, b) => b.fecha - a.fecha);
    if (notificaciones.length === 0) {
        document.getElementById("notificacionesContenedor").innerHTML = "<strong>Sin Notificaciones</strong>"
    }
    else {
        while (notificaciones.length > 20) {                                                                  //Limitamos la cantidad de notificaciones ya que si son muchas se ralentiza la página.
            notificaciones.pop();                                                                           //Usamos .pop() porque ya está ordenado el array.
        }
        notificaciones.forEach(e => {
            cargarNotificacionADom(e);
        });
    }

    localStorage.setItem("tenes-stock_productos", JSON.stringify(productos));
    localStorage.setItem("tenes-stock_notificaciones", JSON.stringify(notificaciones));
    localStorage.setItem("tenes-stock_configuracion-usuario", JSON.stringify(configuracionUsuario));

    document.getElementById("notificPopUp").checked = configuracionUsuario.notificPopUp;
    document.getElementById("notificAudio").checked = configuracionUsuario.notificAudio;
    document.getElementById("notificEmail").checked = configuracionUsuario.notificEmail;
    document.getElementById("userEmail").value = configuracionUsuario.email;

    document.getElementById("userEmail").disabled = !configuracionUsuario.notificEmail;
    let botonesSeleccionOrden = document.querySelectorAll(".botSetOrder");
    botonesSeleccionOrden.forEach(e => { e.disabled = false; });
    botonesSeleccionOrden[configuracionUsuario.listOrder].disabled = true;


    let notificacionEjecutada = document.querySelectorAll(".recentlyUpdated");                              //Agregamos al stack las tareas de quitar y agregar las clases de las notificaciones sólo si corresponde.
    if (notificacionEjecutada.length) {
        setTimeout(() => {
            botonNotificaciones.classList.remove("recentlyUpdated");
            botonNotificaciones.classList.add("recentlyUpdatedRemoved");
        }, 500);
    }
}


/***************************************** */
let botonPresupuesto = document.getElementById("botonPresupuesto");
let inputPresupuesto = document.getElementById("presupuestoInput")

inputPresupuesto.onfocus = () => {
    inputPresupuesto.value = "";
    inputPresupuesto.classList.remove("input-success");
    inputPresupuesto.classList.remove("input-error");
};

botonPresupuesto.addEventListener("click", presupuesto);
function presupuesto() {
    estanPausadasLlamadasApi = true;
    setTimeout(() => { estanPausadasLlamadasApi = false; }, 15 * 1000);                                                    //Para evitar que se actualice el DOM y vuelva a cargar todos los productos; queremos ver lo que filtró el presupuesto.

    let presupuestoUsuario = inputPresupuesto.value;
    if (isNaN(presupuestoUsuario)) {
        inputPresupuesto.value = "Ingrese sólo números";
        return;
    }

    productos.sort((a, b) => a.precio - b.precio);                                                           //Necesitamos el array ordenado. No importa la elección del usuario ya que luego se reordena dentro de reconstruirDom().
    console.log(productos[0].precio);

    /*
    Ahora analizamos cuántos productos podría comprar el usuario según su presupuesto.
    Existen tres escenarios:
    1: el presupuesto no alcanza para ningún producto
    2: el presupuesto alcanza para todos los productos.
    3: el presupuesto alcanza para algunos de los productos
    */

    //Escenario 1:
    if (presupuestoUsuario < productos[0].precio) {                                                          //Comparamos contra el primer elemento del array porque está ordenado.
        document.getElementById("productosContenedor").innerHTML = "";
        cargarProductoADom(productos[0]);
        inputPresupuesto.classList.add("input-error");
        inputPresupuesto.value = "Falta al menos " + (productos[0].precio - presupuestoUsuario) + "$";
    }
    else {
        //Escenario 2:
        let sumatoriaTotal = 0;                                                                             //Calculamos el costo del carrito entero.
        for (let el of productos) {
            sumatoriaTotal += el.precio;
        }
        if (sumatoriaTotal <= presupuestoUsuario) {
            reconstruirDom();
            inputPresupuesto.value = "Felicidades! Alcanza para todo!";
            inputPresupuesto.classList.add("input-success");
        }

        //Escenario 3;
        else {
            document.getElementById("productosContenedor").innerHTML = "";                                  //Eliminamos los productos para mostrar sólo los que alcanza el presupuesto.
            let indice = 0;
            let costoParcialCarrito = 0;

            do {                                                                                            //Hacemos un do-while en lugar de while ya que alcanza para almenos el primer producto (escenario 1).
                costoParcialCarrito += productos[indice].precio;
                cargarProductoADom(productos[indice]);
                indice++;
            } while ((costoParcialCarrito + productos[indice].precio) <= presupuestoUsuario);                 //Mientras que el costo del carrito sumado al siguiente producto sea menor al presupuesto.

            inputPresupuesto.classList.add("input-success")
            inputPresupuesto.value = "Su presupuesto alcanza sólo para:";
        }
    }
}


//La API MeLi tiene un endpoint que nos devuelve datos del vendedor entre ellos las publicaciones activas.
//Importante: el nick está asociado a un ID de vendedor, pero el endpoint de productos nos devuelve el ID y no el nick.
//A futuro: TODO: agregar a cada publicación el link al vendedor; lo cuál requerirá trabajo para asociar el ID y el nick.
function importarPorVendedor(nickName) {
    estanPausadasNotificaciones = true;

    fetch('https://api.mercadolibre.com/sites/MLA/search?nickname=' + nickName)
        .then(response => response.json())
        .then(data => {
            let sellerProds = data['results'];
            if (sellerProds.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ups!',
                    text: 'Algo salió mal... quizás el Nick esté mal?',
                });
                return;
            }

            for (let i = 0; i < 30 && i < sellerProds.length; i++) {
                let _id = sellerProds[i].id.replace("MLA", "MLA-");
                let esRepetido = productos.findIndex(e => e.idMeli === _id);
                if (esRepetido === -1) {                                                                      //Verificamos que el producto no se encuentre cargado actualmente.
                    productos.push(new Producto(_id, "Espere...", 0, false, new Date(), ""));
                }
            }
        });
    reconstruirDom();
}


function borrarTodos() {
    notificaciones = [];
    productos = [];
    reconstruirDom();
}


/**********************     NAVEGACIÓN / ÍCONOS HEADER     ***********************************************************************************/
let botonGeneradorRandom = document.getElementById("botonGeneradorRandom");
botonGeneradorRandom.onclick = () => {
    localStorage.clear("tenes-stock_productos");
    document.location.reload(true);
};

let botonNotificaciones = document.getElementById("botonNotificaciones");
botonNotificaciones.onclick = () => {
    document.getElementById("configuracionUsuarioContenedor").classList.add("oculto");
    document.getElementById("notificacionesContenedor").classList.toggle("oculto");
    document.getElementById("modalBase").classList.remove("oculto");
};

let botonConfiguracion = document.getElementById("botonConfiguracion");
botonConfiguracion.onclick = () => {
    document.getElementById("notificacionesContenedor").classList.add("oculto");
    document.getElementById("configuracionUsuarioContenedor").classList.toggle("oculto");
    document.getElementById("modalBase").classList.remove("oculto");
};


let botonDescargarCsv = document.getElementById("botonDescargarCsv");
botonDescargarCsv.onclick = () => {

    let textosDeNotas = [["id", "titulo", "precio", "estado", "fecha"]];                                    //Para poder descargar un archivo como CSV básicamente creamos una matriz bidimensional y luego se codifica y descarga con un <a>
    for (let el of productos) {
        let nuevoArray = [el.idMeli, el.titulo, el.precio, el.estado ? "ACTIVO" : "INACTIVO", obtenerFechaFormateada(el.fecha)];
        textosDeNotas.push(nuevoArray);
    }

    let csvContent = "data:text/csv;charset=utf-8,";                                                    //https://stackoverflow.com/questions/14964035
    textosDeNotas.forEach(function (rowArray) {
        let row = rowArray.join(",");                                                                   //Transformamos esa matriz bidimensional en algo tipo CSV
        csvContent += row + "\r\n";
    });

    let encodedUri = encodeURI(csvContent);
    let anchorDescarga = document.getElementById("anchorDescargar");
    anchorDescarga.setAttribute("href", encodedUri);                                                    //Para poder descargar el archivo creado hay que "adjuntarlo" a un anchor, el cuál no está visible en el DOM.
    anchorDescarga.setAttribute("download", "tenes-stock_productos.csv");
    anchorDescarga.click();
};

let botonPapelera = document.getElementById("botonPapelera");
botonPapelera.onclick = () => {
    productos.push(papelera.pop());                                                                     //Eliminamos el último objeto de la papelera y lo restauramos al array principal.
    reconstruirDom();
    if (papelera.length === 0) {
        botonPapelera.classList.add("oculto");
    }
};

let botonImportarPorVendedor = document.getElementById("botonImportarPorVendedor");
botonImportarPorVendedor.onclick = () => {
    Swal.fire({
        title: 'Ingrese nick para importar',
        text: 'Nick del vendedor (EJ. LU4ULT_LAUTARO ). Se importarán hasta 30 publicaciones de ese vendedor.',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Importar',
    }).then((result) => {
        if (result.isConfirmed) {
            importarPorVendedor(result.value.toUpperCase());
        }
    })
}

let botonImportarDesdeArchivo = document.getElementById("botonImportarDesdeArchivo");
botonImportarDesdeArchivo.onclick = () => {
    Swal.fire({
        title: 'Importar listado desde archivo',
        text: 'Cargue el listado de publicaciones en un archivo de texto como se ve en la imágen.',
        imageUrl: 'images/importFileScreenShot.png',
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: 'Custom image',
        confirmButtonText: 'Seleccionar archivo',
        showCancelButton: true,
    })
        .then((result) => {
            if (result.isConfirmed) {
                document.getElementById("inputFile").click();
            }
        })
}

document.getElementById('inputFile').addEventListener('change', function () {
    let fr = new FileReader();
    fr.onload = function () {
        estanPausadasNotificaciones = true;
        let datosLeidos = fr.result.split("\r\n");
        let contadorProductosImportados = 0;

        datosLeidos.forEach(e => {
            let esRepetido = productos.findIndex(f => f.idMeli === e);
            if (esRepetido === -1 && e.length > 8) {                                                      //Verificamos que el producto no se encuentre cargado actualmente.
                productos.push(new Producto(e, "Espere...", 0, false, new Date(), ""));
                contadorProductosImportados++;
            }
        });

        if (contadorProductosImportados)
            notificaciones.push(new Notificacion(new Date(), `Importados ${contadorProductosImportados} productos!`));
        reconstruirDom();
    }
    fr.readAsText(this.files[0]);
})


let inputBusqueda = document.getElementById("inputBusqueda");
inputBusqueda.onfocus = () => {
    inputBusqueda.value = "";
}

/**********************     MENÚ CONFIGURACIÓN DEL USUARIO ********************************************************************/

let inputNotificPopUp = document.getElementById("notificPopUp");
inputNotificPopUp.onchange = () => {
    configuracionUsuario.notificPopUp = inputNotificPopUp.checked;
    reconstruirDom();
}

let inputNotificAudio = document.getElementById("notificAudio");
inputNotificAudio.onchange = () => {
    configuracionUsuario.notificAudio = inputNotificAudio.checked;
    reconstruirDom();
}

let inputNotificEmail = document.getElementById("notificEmail");
inputNotificEmail.onchange = () => {
    let active = inputNotificEmail.checked;
    configuracionUsuario.notificEmail = active;
    reconstruirDom();
}

let inputEmail = document.getElementById("userEmail");
inputEmail.onchange = () => {
    configuracionUsuario.email = inputEmail.value;
    reconstruirDom();
}

function setListOrder(seleccion) {
    configuracionUsuario.listOrder = seleccion;
    reconstruirDom();
}

/**********************     TECLADO      ***********************************************************************************/

//Simulamos el hacer click al presionar enter según dónde esté haciendo foco
window.addEventListener('keydown', function (e) {
    if (e.key === "Enter" && document.getElementById("urlInput") === document.activeElement) {
        document.getElementById("botonAgregarProductos").click();
    }

    if (e.key === "Enter" && document.getElementById("presupuestoInput") === document.activeElement) {
        document.getElementById("botonPresupuesto").click();
    }

    if (e.key === "Escape") {
        document.getElementById("configuracionUsuarioContenedor").classList.add("oculto");
        document.getElementById("notificacionesContenedor").classList.add("oculto");
        document.getElementById("modalBase").classList.add("oculto");
        document.getElementById("inputBusqueda").blur();                                                //Soltar focus del input sino se vuelve a filtrar
        document.getElementById("inputBusqueda").value = "Buscar por título en las publicaciones";
        reconstruirDom();
    }
});

window.addEventListener('keyup', function (e) {                                                         //Utilizamos keyUp y no keyDown para el input de busqueda porque sino "me como" el último caracter
    if (document.getElementById("inputBusqueda") === document.activeElement) {
        let arrayProductosEncontrados = [];
        let textoActual = document.getElementById("inputBusqueda").value.toLowerCase();
        /* productos.forEach(e => {
            if(e.titulo.toLowerCase().indexOf(textoActual) >=0)
                arrayProductosEncontrados.push(e);
        }); */
        //Refactor:
        arrayProductosEncontrados = productos.filter(el => el.titulo.toLowerCase().includes(textoActual));

        document.getElementById("productosContenedor").innerHTML = "";
        arrayProductosEncontrados.forEach(e => cargarProductoADom(e));


        //clearInterval(periodicamente);                                                                              //Cancelamos las llamadas a la API para que no se actualice el DOM y muestre lo que encontró.
        estanPausadasLlamadasApi = true;                                                                              //evitamos que se reconstruya el DOM dentro de la función que consume la API
        setTimeout(() => { estanPausadasLlamadasApi = false; }, 1 * 60 * 1000);
    }
});

document.getElementById("inputBusqueda").onblur = () => {
    periodicamente = setInterval(() => {
        productos.forEach(e => {
            setTimeout(() => {
                llamarApiMeli(e.idMeli);
            }, 200);
        });
    }, 5 * 1000);
};

/***  MODAL  ***/
document.body.addEventListener('click', (e) => {                                                        //Si se presiona fuera del modal que se oculte notificaciones y configuración. Alternativa a volver a presionar el ícono o tecla escape.
    console.log(e.target.className);                                                                    //Recordar: es un sandwich; el DOM z-index 0, la baseModal 50 y el modal z-index: 100
    if (e.target.className === "modalBase") {
        document.getElementById("configuracionUsuarioContenedor").classList.add("oculto");
        document.getElementById("notificacionesContenedor").classList.add("oculto");
        document.getElementById("modalBase").classList.add("oculto");
    }
}, true);


/**********************     SIMULACION      ***********************************************************************************/
function simulacion() {
    Swal.fire({
        title: 'Simular?',
        text: "Para simular y poder ver el funcionamiento de esta página, alteraremos el estado de los productos de manera aleatoria, y podrá ver cómo funciona el sistema. Luego espere 10 segundos a que se actualice.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, continuar'
    }).then((result) => {
        if (result.isConfirmed) {
            // productos.forEach(e => {
            //     let randomStatus = Boolean(Math.floor(Math.random()*10) %2);                           //Generamos un número aleatorio entre 0 y 10, obtenemos el módulo y lo casteamos para obtener un false o true random.
            //     e.estado = randomStatus;
            // });

            //En lugar de recorrer todos los productos y asignarles un estado aleatorio como hacíamos antes, elegimos cinco productos aleatorio y les alternamos el estado.
            //Sino las notificaciones te enloquecían cuando la cantidad de productos cargados eran muchas, digamos más de 30.
            productos.at(0).precio = parseInt(productos.at(0).precio * Math.random());
            productos.at(-1).precio = parseInt(productos.at(-1).precio * (Math.random() + 1));

            for (let i = 0; i < 3; i++) {
                let productoRandom = Math.floor(Math.random() * productos.length);
                productos[productoRandom].estado = !productos[productoRandom].estado;
            }
            reconstruirDom();
        }
    });
}

/******************************************************************************************************************************/
console.clear();
console.log("%cHola!", "color:blue;font-size:2.5rem;border-bottom:1px solid blue;")
console.log("Produccion: " + esProduccion);


let periodicamente = setInterval(() => {                                                                //Esta función llamara periodicamente a la API MeLi para consultar cambios en las publicaciones.
    productos.forEach(e => {
        setTimeout(() => {
            llamarApiMeli(e.idMeli);
        }, 200);
    });
}, 5 * 1000);

let reconstruirEnFuturo = setTimeout(() => {                                                            //Esta función es agregada al stack desde la función que llama a la API.
    reconstruirDom();                                                                                   //De forma que si se modificaron muchas publicaciones simultáneamente (por ejemplo cuando se agregan por Nick o archivo),
}, 0);                                                                                                   //Se va cancelando y nuevamente agregando la llamada a "reconstruirDom" para que se ejecute sólo una vez.

window.onload = () => {
    productos.forEach(e => {
        llamarApiMeli(e.idMeli);
    });
}