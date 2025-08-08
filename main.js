//Objeto que almacena valores booleanos para los tres productos, con el fin de consolidar en un objeto el estado del resultado de la promesa de cada pedido y utilizarlo posteriormente en el resumen
let pedidoResumen = {
    cafe: true,
    pan: true,
    jugo: true,
};

/**
 * Funcion comun que realiza la simulacion de la promesa y retorna el resultado de la ejecucion de la promesa
 * @param {string} nombre - El tipo de producto a preparar
 * @param {number} tiempoMin - El tiempo minimo (en segundos), disponible para la preparacion del producto
 * @param {number} tiempoMax - El tiempo maximo (en segundos), disponible para la preparacion del producto
 * @param {string} mensajeError - Mensaje que se entregara en caso que la promesa no se cumpla
 * @returns {Promise} La promesa con el resultado respectivo
 */
function prepararItem (nombre, tiempoMin, tiempoMax, mensajeError) {
    //Se define el tiempo de preparacion del producto de forma aleatoria, dentro de un rango entre timepoMin y tiempoMax
    let tiempoPreparacion = (Math.random() * (tiempoMax - tiempoMin) + tiempoMin);

    //la funcion retorna la Promesa, cuyo resultado dependerá de la probabilidad de fallo definida dentro del metodo setTimeOut
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //Se establece la probabilidad de fallo en un 20% a través del resultado de Math.random
            if (Math.random() <= 0.2) {
                reject(`${mensajeError}`);
            } else {
                resolve({ nombre, tiempo: tiempoPreparacion });
            }
        }, tiempoPreparacion);
    });
};

//Funciones individuales para cada producto, que llaman a la funcion principal prepararItem con los argumentos propios de cada producto definidos en el ejercicio
function prepararCafe() {
    return prepararItem('Cafe', 1, 3, 'Se acabo el cafe');
}

function tostarPan() {
    return prepararItem('Pan tostado', 2, 4, 'No hay pan disponible');
}

function exprimirJugo() {
    return prepararItem('Jugo', 1, 2, 'No hay frutas para el jugo');
}

//Funcion que realiza el pedido de forma encadenada, usando then - catch - finally de forma anidada
function realizarPedidoEncadenado() {
    console.log('\n Realizando pedido de forma encadenada...\n');

    prepararCafe()
        .then(resultado => {
            console.log(`${resultado.nombre} listo en ${resultado.tiempo} segundos.`);
            pedidoResumen.cafe = true;
        })
        .catch(mensajeError => {
            console.log(`No se pudo preparar el café: ${mensajeError}`);
            pedidoResumen.cafe = false;
        })
        .finally(() => {
            tostarPan()
                .then(resultado => {
                    console.log(`${resultado.nombre} listo en ${resultado.tiempo} segundos.`);
                    pedidoResumen.pan = true;
                })
                .catch(mensajeError => {
                    console.log(`No se pudo tostar el pan: ${mensajeError}`);
                    pedidoResumen.pan = false;
                })
                .finally(() => {
                    exprimirJugo()
                        .then(resultado => {
                            console.log(`${resultado.nombre} listo en ${resultado.tiempo} segundos.`);
                            pedidoResumen.jugo = true;
                        })
                        .catch(mensajeError => {
                            console.log(`No se pudo preparar el jugo: ${mensajeError}`);
                            pedidoResumen.jugo = false;
                        })
                        .finally(() => resumenPedido());
                });
        });
};

//Funcion que realiza el pedido de forma asincrona, usando async - await
const realizarPedidoAsync = async () => {
    console.log('\n Realizando pedido de forma asincrona... \n');

    try {
        const cafe = await prepararCafe();
        console.log(`${cafe.nombre} listo en ${cafe.tiempo} segundos.`);
        pedidoResumen.cafe = true;
    } catch (falla) {
        console.log(`No se pudo preparar el café: ${falla}`);
        pedidoResumen.cafe = false;
    }

    try {
        const pan = await tostarPan();
        console.log(`${pan.nombre} listo en ${pan.tiempo} segundos.`);
        pedidoResumen.pan = true;
    } catch (falla) {
        console.log(`No se pudo tostar el pan: ${falla}`);
        pedidoResumen.pan = false;
    }

    try {
        const jugo = await exprimirJugo();
        console.log(`${jugo.nombre} listo en ${jugo.tiempo} segundos.`);
        pedidoResumen.jugo = true;
    } catch (falla) {
        console.log(`No se pudo preparar el jugo: ${falla}`);
        pedidoResumen.jugo = false;
    }

    resumenPedido();
};

//Funcion que muestra el resumen del pedido por producto
const resumenPedido = () => {
    console.log('\n Resumen del pedido:');
    console.log(`Café: ${pedidoResumen.cafe ? 'Entregado' : 'No disponible'}`);
    console.log(`Pan: ${pedidoResumen.pan ? 'Entregado' : 'No disponible'}`);
    console.log(`Jugo: ${pedidoResumen.jugo ? 'Entregado' : 'No disponible'}`);
};

//Para validar la ejecucion se debe desconemtar una de las siguientes llamadas a la funcion que  se desea ejecutar

//realizarPedidoEncadenado();
realizarPedidoAsync();