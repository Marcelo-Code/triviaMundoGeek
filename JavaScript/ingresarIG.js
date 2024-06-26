let iGExistente = false;
let ranking = [];
let nombreJugadorValido = false;
let nombreJugadorepetido = false;
const apiUrl = 'https://api.jsonbin.io/v3/b/667b265fad19ca34f87ebdc4';
const apiKey = '$2a$10$WT5AxshcjZm2aoyff10BreyngNCLn3nPRaP4KL07tdYZ0.Z.ZO3NK';

// Valida que el texto ingresado sea una expresión válida

function validarIG(nombreJugador) {
    const condiciones = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    return condiciones.test(nombreJugador);
}

//Carga los datos del archivo JSON

async function cargar() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Master-Key': apiKey
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

//Verifica que el texto ingresado no esté repetido y sea una expresión válida

async function tomarIG() {
    let nombreJugador = document.getElementById('ingresarIG').value
    nombreJugador = nombreJugador.toLowerCase();
    if (validarIG(nombreJugador)) {

        await cargar();

        ranking.forEach(elemento => {
            if (elemento.nombre === nombreJugador) nombreJugadorepetido = true;
        })
        if (nombreJugadorepetido == false) {
            window.open("./pages/trivia.html", "_blank");
            localStorage.setItem("nombreJugador", nombreJugador);
        } else alert("Esta cuenta ya figura en nuestro ranking");
    } else alert("Instagram inválido, volvé a ingresar");
}

//Elimina espacios en blanco

ingresarIG.addEventListener('keyup', (e) => {
    let texto = e.target.value;
    e.target.value = texto.trim();
})

btnInicio.addEventListener('click', tomarIG);