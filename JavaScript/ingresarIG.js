let iGExistente = false;
let ranking = [];
let nombreJugadorValido = false;
let nombreJugadorepetido = false;

function validarIG(nombreJugador) {

    // Expresión regular para validar el nombre de usuario de Instagram

    const condiciones = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    return condiciones.test(nombreJugador);
}

async function cargar() {
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

        ranking = data.record;

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

async function tomarIG() {
    await cargar();
    let nombreJugador = document.getElementById('ingresarIG').value
    nombreJugador = nombreJugador.toLowerCase();
    nombreJugadorValido = validarIG(nombreJugador);
    nombreJugadorepetido = false;

    ranking.forEach(elemento => {
        if (elemento.nombre === nombreJugador) {
            nombreJugadorepetido = true;
        }
    })

    if ((nombreJugadorValido == true) && (nombreJugadorepetido == false)) {
        window.open("./pages/trivia.html", "_blank");
        localStorage.setItem("nombreJugador", nombreJugador);
    } else {
        if (nombreJugadorValido == false) alert("Instagram inválido, volvé a ingresar");
        if (nombreJugadorepetido == true) alert("Esta cuenta ya figura en nuestro ranking");
    }
}