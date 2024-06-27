// Variables donde se guardan la url y la API key del repositorio

const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
const apiKey = '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK';
let dataJson = [];

async function apiLeerRegistros() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': apiKey
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const datos = await response.json();
        dataJson = datos;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

async function crearRegistro() {
    let confirmar = false;
    let jugador = {};
    let minutos = 0;
    let segundos = 0;

    await apiLeerRegistros();

    confirmar = confirm("¿Crear nuevo registro?");
    if (confirmar) {
        jugador.nombre = prompt("Ingresar nuevo nombre: ");
        jugador.respuestasCorrectas = Number(prompt("Ingresar cantidad de respuestas correctas: "));
        minutos = parseInt(prompt("Ingresar minutos: "));
        segundos = parseFloat(prompt("Ingresar segundos: "));
        segundos = Number(segundos.toFixed(3));
        jugador.tiempo = minutos * 60000 + segundos * 1000;
        jugador.posicion = 0;

        //Si lo que existe es el registro vacío, se reemplazan los valores del mismo con los ingresados

        if ((dataJson.record.length == 1) && (dataJson.record[0].nombre == "...")) {
            dataJson.record[0].nombre = jugador.nombre;
            dataJson.record[0].respuestasCorrectas = jugador.respuestasCorrectas;
            dataJson.record[0].tiempo = jugador.tiempo;
        } else dataJson.record.push(jugador);

        guardarDatos(dataJson);

        //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados

        setTimeout(() => {
            cargarRegistros()
        }, 500);
    }
}

// Función para cargar datos del servidor

async function cargarRegistros() {

    await apiLeerRegistros();

    const datosPosicion = document.getElementById("datosPosicion");
    const datosNombre = document.getElementById("datosNombre");
    const datosCorrectas = document.getElementById("datosCorrectas");
    const datosTiempo = document.getElementById("datosTiempo");

    let mensajePosicion = "";
    let mensajeNombre = "";
    let mensajeCorrectas = "";
    let mensajeTiempo = "";

    //Si lo que existe es el registro vacío, el mismo no se muestra

    if ((dataJson.record.length == 1) && (dataJson.record[0].nombre == "...")) alert("no hay registro de jugadores");
    else {
        dataJson.record.forEach(element => {
            mensajePosicion += `<div>${element.posicion}</div>`;
            mensajeNombre += `<div>${element.nombre}</div>`;
            mensajeCorrectas += `<div>${element.respuestasCorrectas}</div>`;
            let minutos = Math.floor((element.tiempo / 60000));
            let segundos = Math.floor((element.tiempo - minutos * 60000) / 1000);
            let milisegundos = element.tiempo - minutos * 60000 - segundos * 1000;
            minutos = minutos.toString().padStart(2, '0');
            segundos = segundos.toString().padStart(2, '0');
            milisegundos = milisegundos.toString().padStart(3, '0');
            mensajeTiempo += `<div>${minutos}' ${segundos}.${milisegundos}"</div>`;
        });
    }
    datosPosicion.innerHTML = mensajePosicion;
    datosNombre.innerHTML = mensajeNombre;
    datosCorrectas.innerHTML = mensajeCorrectas;
    datosTiempo.innerHTML = mensajeTiempo;
}

// Función para guardar datos en el servidor

async function guardarDatos(dataJson) {

    // Ordena los datos antes de guardarlos

    dataJson.record.sort((a, b) => {
        if (b.respuestasCorrectas != a.respuestasCorrectas) {
            return b.respuestasCorrectas - a.respuestasCorrectas;
        } else {
            return a.tiempo - b.tiempo;
        }
    });

    // Asigna el valor de la posición después de ordenar

    dataJson.record.forEach((item, index) => {
        item.posicion = index + 1;
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(dataJson.record)
        });

        if (!response.ok) {
            throw new Error('Error al guardar los datos en JSONBin: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Datos guardados correctamente en JSONBin:', result);
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
}

async function modificarRegistro() {
    let confirmar = false;
    let jugador = {};
    let nombre = "";
    let respuestasCorrectas = 0;
    let tiempo = 0;
    let minutos = 0;
    let segundos = 0;
    ID = prompt("Ingresar la posición del jugador:");

    await apiLeerRegistros();

    jugador = dataJson.record[ID - 1];
    confirmar = confirm("¿modificar datos de " + jugador.nombre + " en posición " + jugador.posicion + "?");
    if (confirmar) {
        confirmar = false;
        confirmar = confirm("¿modificar nombre de " + jugador.nombre + "?");
        if (confirmar) {
            nombre = prompt("Ingresar nuevo nombre: ");
            dataJson.record[ID - 1].nombre = nombre;
        }
        confirmar = false;
        confirmar = confirm("¿modificar cantidad de correctas? el dato actual es " + jugador.respuestasCorrectas);
        if (confirmar) {
            respuestasCorrectas = prompt("Ingresar nueva cantidad de correctas: ");
            dataJson.record[ID - 1].respuestasCorrectas = respuestasCorrectas;
        }
        confirmar = false;
        confirmar = confirm("¿modificar tiempo? el dato actual es " + jugador.tiempo + "ms");
        if (confirmar) {
            minutos = parseInt(prompt("Ingresar minutos: "));
            segundos = parseFloat(prompt("Ingresar segundos: "));
            segundos = Number(segundos.toFixed(3));
            tiempo = minutos * 60000 + segundos * 1000;
            dataJson.record[ID - 1].tiempo = tiempo;
        }

        guardarDatos(dataJson);

        //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados

        setTimeout(() => {
            cargarRegistros()
        }, 500);
    }
}

async function borrarDatos() {
    let confirmacion = false;
    confirmacion = confirm("Se borrarán todos los datos, estás seguro?");
    if (confirmacion) {

        await apiLeerRegistros();

        //Se borran todos los registros menos uno, al que se le asignan valores ficticios

        if (dataJson.record.length > 1) dataJson.record.splice(0, dataJson.record.length - 1);
        dataJson.record[0].nombre = "...";
        dataJson.record[0].respuestasCorrectas = 0;
        dataJson.record[0].tiempo = 0;

        guardarDatos(dataJson);

        //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados

        setTimeout(() => {
            cargarRegistros()
        }, 500);

    }
}

async function actualizarRanking(jugador) {

    //Recupera los datos guardados en dataJson.json

    await apiLeerRegistros();

    //Si lo que existe es el registro vacío, se reemplazan los valores del mismo con los ingresados

    if ((dataJson.record.length == 1) && (dataJson.record[0].nombre === "...")) {
        dataJson.record[0].nombre = jugador.nombre;
        dataJson.record[0].respuestasCorrectas = jugador.respuestasCorrectas;
        dataJson.record[0].tiempo = jugador.tiempo;
    } else dataJson.record.push(jugador);

    guardarDatos(dataJson);

}

async function borrarRegistro() {
    let confirmar = false;
    let jugador = {};
    let nombre = "";
    let respuestasCorrectas = 0;
    let tiempo = 0;
    ID = prompt("Ingresar la posición del jugador: ");

    await apiLeerRegistros();

    dataJson.record[ID - 1];
    confirmar = confirm("¿eliminar datos de " + dataJson.record[ID - 1].nombre + " en posición " + dataJson.record[ID - 1].posicion + "?")
    if (confirmar) {
        if (dataJson.record.length == 1) {
            dataJson.record[0].nombre = "...";
            dataJson.record[0].respuestasCorrectas = 0;
            dataJson.record[0].tiempo = 0;
        } else dataJson.record.splice(ID - 1, 1);
    }

    guardarDatos(dataJson);

    //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados

    setTimeout(() => {
        cargarRegistros()
    }, 500);
}