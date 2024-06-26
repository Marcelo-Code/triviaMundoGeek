async function crearRegistro() {
    let confirmar = false;
    let jugador = {};
    let minutos = 0;
    let segundos = 0;
    try {
        const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK' // Tu clave X-Master-Key aquí
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        confirmar = confirm("¿Crear nuevo registro?");
        if (confirmar) {
            jugador.nombre = prompt("Ingresar nuevo nombre: ");
            jugador.respuestasCorrectas = Number(prompt("Ingresar cantidad de respuestas correctas: "));
            minutos = parseInt(prompt("Ingresar minutos: "));
            segundos = parseFloat(prompt("Ingresar segundos: "));
            segundos = Number(segundos.toFixed(3));
            jugador.tiempo = minutos * 60000 + segundos * 1000;
            jugador.posicion = 0;

            if((data.record.length == 1) && (data.record[0].nombre == "..."))
                    {
                        data.record[0].nombre = jugador.nombre;
                        data.record[0].respuestasCorrectas = jugador.respuestasCorrectas;
                        data.record[0].tiempo = jugador.tiempo;
                    }
            else data.record.push(jugador);

            console.log(data.record);

            guardarDatos(data);

            //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados

            setTimeout(() => {
                cargarRegistros()
            }, 500);
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }

}

// Función para cargar datos del servidor

async function cargarRegistros() {
    try {
        const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK' // Tu clave X-Master-Key aquí
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        // console.log(data.record.length);

        const datosPosicion = document.getElementById("datosPosicion");
        const datosNombre = document.getElementById("datosNombre");
        const datosCorrectas = document.getElementById("datosCorrectas");
        const datosTiempo = document.getElementById("datosTiempo");

        let mensajePosicion = "";
        let mensajeNombre = "";
        let mensajeCorrectas = "";
        let mensajeTiempo = "";

        if((data.record.length == 1) && (data.record[0].nombre == "...")) alert("no hay registro de jugadores");
        else
            {
                data.record.forEach(element => {
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
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para guardar datos en el servidor

async function guardarDatos(data) {

    // Ordena los datos antes de guardarlos

    data.record.sort((a, b) => {
        if (b.respuestasCorrectas != a.respuestasCorrectas) {
            return b.respuestasCorrectas - a.respuestasCorrectas;
        } else {
            return a.tiempo - b.tiempo;
        }
    });

    // Asigna el valor de la posición después de ordenar

    data.record.forEach((item, index) => {
        item.posicion = index + 1;
    });
    console.log(data.record);

    try {
        const API_URL = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
        const API_KEY = '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK';
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(data.record)
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
    try {
        const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK' // Tu clave X-Master-Key aquí
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        jugador = data.record[ID - 1];

        confirmar = confirm("¿modificar datos de " + jugador.nombre + " en posición " + jugador.posicion + "?");
        if (confirmar) {
            confirmar = false;
            confirmar = confirm("¿modificar nombre de " + jugador.nombre + "?");
            if (confirmar) {
                nombre = prompt("Ingresar nuevo nombre: ");
                data.record[ID - 1].nombre = nombre;
            }
            confirmar = false;
            confirmar = confirm("¿modificar cantidad de correctas? el dato actual es " + jugador.respuestasCorrectas);
            if (confirmar) {
                respuestasCorrectas = prompt("Ingresar nueva cantidad de correctas: ");
                data.record[ID - 1].respuestasCorrectas = respuestasCorrectas;
            }
            confirmar = false;
            confirmar = confirm("¿modificar tiempo? el dato actual es " + jugador.tiempo + "ms");
            if (confirmar) {
                minutos = parseInt(prompt("Ingresar minutos: "));
                segundos = parseFloat(prompt("Ingresar segundos: "));
                segundos = Number(segundos.toFixed(3));
                tiempo = minutos * 60000 + segundos * 1000;
                data.record[ID - 1].tiempo = tiempo;
            }

            guardarDatos(data);
            //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados
            setTimeout(() => {
                cargarRegistros()
            }, 500);
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

async function borrarDatos() {
    let confirmacion = false;
    confirmacion = confirm("Se borrarán todos los datos, estás seguro?");
    if (confirmacion) {
        try {
            const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
            const response = await fetch(apiUrl, {
                headers: {
                    'X-Master-Key': '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK' // Tu clave X-Master-Key aquí
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();

            if(data.record.length > 1) data.record.splice(0, data.record.length-1);
            data.record[0].nombre = "...";
            data.record[0].respuestasCorrectas = 0;
            data.record[0].tiempo = 0;

            console.log(data.record)

            guardarDatos(data);

            //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados
            setTimeout(() => {
                cargarRegistros()
            }, 500);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }
}


async function actualizarRanking(jugador) {

    //--- recupera los datos guardados en data.json

    try {
        const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK' // Tu clave X-Master-Key aquí
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        if(data.record.length == 1){
            data.record[0].nombre = jugador.nombre;
            data.record[0].respuestasCorrectas = jugador.respuestasCorrectas;
            data.record[0].tiempo = jugador.tiempo;
        }
        else data.record.push(jugador);

        guardarDatos(data);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

async function borrarRegistro() {
    let confirmar = false;
    let jugador = {};
    let nombre = "";
    let respuestasCorrectas = 0;
    let tiempo = 0;
    ID = prompt("Ingresar la posición del jugador: ");

    try {
        const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK' // Tu clave X-Master-Key aquí
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        data.record[ID - 1];
        confirmar = confirm("¿eliminar datos de " + data.record[ID - 1].nombre + " en posición " + data.record[ID - 1].posicion + "?")
        if (confirmar){
            if(data.record.length == 1){
                data.record[0].nombre = "...";
                data.record[0].respuestasCorrectas = 0;
                data.record[0].tiempo = 0;
            }
            else data.record.splice(ID - 1, 1);
        }
        guardarDatos(data);

        //Se agrega un pequeño retraso para asegurarnos de que se accedan a los datos ya modificados
        setTimeout(() => {
            cargarRegistros()
        }, 500);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}