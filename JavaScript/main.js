let data = [];
let index = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let posiblesRespuestas = [];
let suspenderBotones = false;
let basePreguntas = [];
let botonCorrespondiente = [];
let arrayNumerosPreguntas = 0;
let nombreJugador ="";
let jugador = {};

//------ declaración variables globales

function cerrarVentana() {
    window.close();
}

function generarOrdenPreguntas(cantidad) {
    let arrayNumerosPreguntas = [];
    let num = 0;
    if (cantidad > preguntas.length) cantidad = preguntas.length;
    for (let i = 0; i < cantidad; i++) {
        do {
            num = Math.floor(Math.random() * preguntas.length);
            coincidencia = false;
            for (let j of arrayNumerosPreguntas) {
                if (j == num) {
                    coincidencia = true;
                    break;
                }
            }
        } while (coincidencia);
        arrayNumerosPreguntas.push(num);
    }
    return arrayNumerosPreguntas;
}
arrayNumerosPreguntas = generarOrdenPreguntas(1);
function select_id(id) {
    return document.getElementById(id);
}

function style(id) {
    return document.getElementById(id).style;
}

botonCorrespondiente = [
    select_id("btn1"),
    select_id("btn2"),
    select_id("btn3"),
    select_id("btn4")
];

function escogerPreguntas() {
    nombreJugador = localStorage.getItem("nombreJugador");
    basePreguntas = preguntas[arrayNumerosPreguntas[index]];
    index += 1;
    select_id("pregunta").innerHTML = basePreguntas.pregunta;
    select_id("imagen").setAttribute("src", basePreguntas.imagen);
    if (basePreguntas.imagen) {
        style("imagen").heigth = "auto";
        style("imagen").width = "100%";
        style("imagen").objectFit = basePreguntas.objectFit;
    } else {
        style("imagen").heigth = 0;
        style("imagen").width = 0;
    }
    select_id("btn1").innerHTML = basePreguntas.respuesta;
    select_id("btn2").innerHTML = basePreguntas.incorrecta1;
    select_id("btn3").innerHTML = basePreguntas.incorrecta2;
    select_id("btn4").innerHTML = basePreguntas.incorrecta3;

    //En este segmento se desordenan las respuestas en los botones

    posiblesRespuestas = [
        basePreguntas.respuesta,
        basePreguntas.incorrecta1,
        basePreguntas.incorrecta2,
        basePreguntas.incorrecta3
    ];
    posiblesRespuestas.sort(() => Math.random() - 0.5);
    select_id("btn1").innerHTML = posiblesRespuestas[0];
    select_id("btn2").innerHTML = posiblesRespuestas[1];
    select_id("btn3").innerHTML = posiblesRespuestas[2];
    select_id("btn4").innerHTML = posiblesRespuestas[3];
}

function oprimirBoton(i) {
    if (suspenderBotones == true) {
        return;
    }
    suspenderBotones = true;
    if (posiblesRespuestas[i] == basePreguntas.respuesta) {
        botonCorrespondiente[i].style.background = "lightgreen";
        respuestasCorrectas += 1;
    } else {
        botonCorrespondiente[i].style.background = "red";
        respuestasIncorrectas += 1;
    }
    setTimeout(() => {
        if (index == arrayNumerosPreguntas.length) {
            pauseTimer();

            //terminar programa, mostrar resultados

            const body = document.getElementById("body");
            const contenedor = document.getElementById("contenedor");
            body.removeChild(contenedor);
            body.innerHTML = `<div class = "mensaje">¡¡Gracias por participar en la trivia!!<br>
                                                        Por último:<br>
                                                        👉 Realizá una captura de pantalla a tu resultado,<br>
                                                        👉 compartilo en historias y ya tenés un lugar asegurado en el ranking<br>
                                                        ⚠ 📱💻 Si tenés la cuenta en privado, mandanos la captura por mp<br>
                                </div>
                                <div class = "cartelFin">
                                    <div> ${nombreJugador} estos son tus resultados:</div>
                                    <div> Correctas: ${respuestasCorrectas}</div>
                                    <div> Incorrectas: ${respuestasIncorrectas}</div>
                                    <div> Tiempo: ${minutos} ' ${segundos} . ${milisegundos} "</div=><br><br>
                                    <a class = "btnInicio" onclick = "cerrarVentana()">Salir</a>
                                </div>
                                <br>
                                <div class = "mensajeFin"> ¡¡Recordá visitarnos en nuestro local!!</div>`;

            //Guardar los resutados en archivo:

            jugador.nombre = nombreJugador;
            jugador.respuestasCorrectas = respuestasCorrectas;
            jugador.tiempo = difference;

            //actualizarRanking(jugador);
            
        } else {

            //reiniciar botones una vez que se contestó la pregunta

            for (const btn of botonCorrespondiente) {
                btn.style.background = "skyblue";
            }
            escogerPreguntas(index);
            suspenderBotones = false;
        }
    }, 2000);
}

escogerPreguntas(index);