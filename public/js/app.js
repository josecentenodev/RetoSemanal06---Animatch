// 1) Traer los personajes -- Listo
// 2) Crear humano como objeto jugador poseedor de cartas -- Listo
// 3) Crear un constructor de humanos y asignarlo al boton "Jugar!" -- Listo
// 4) Crear Y Mostrar Juego -- Listo
// 5) Mostrar Resultados del Match
// 6) Eliminar ultimo Juego creado si descarto los resultados
// 7) Si el juego no fué recientemente creado oculto el boton volver a tirar

//  ********** Resolución

// Para crear los datos en html decidí usar un objeto Humano 
// para tener asociados los nombres de las cartas rápidamente desde un comienzo
class Humane {
    constructor(nombre = "") {
        this._nombre = nombre
        this.cartasId = []
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(nombre) {
        this._nombre = nombre;
    }

    addCarta(carta) {
        this.cartasId.push(carta)
    }
}

const url = '../personajes.json'
const inicioJuego = document.querySelector('#inicioJuego')
const verJuego = document.querySelector('#verJuego')
const intervalo = document.querySelector('#intervalo')
const btnCerrarVC = document.querySelector('#btnCerrarVC')
const botonJugar = document.querySelector('#botonJugar').addEventListener('click', crearJuego)
let creoJuego = true

// Creo un humano y le asigno los ids de las cartas
// let marcos = new Humane('Marcos')
//     // console.log(marcos)
//     // Agrego ids
// marcos.addCarta(2)
// marcos.addCarta(20)
// marcos.addCarta(18)
// console.log(marcos)
//     // accedo a los id
// marcos.cartasId.map(e => console.log(e))
// Función Random Number
//
// FUNCIONES DE CREAR Y MOSTRAR JUEGO

function randomNumber() {
    return Math.round(Math.random() * 19 + 1)
}

idJuego = 0

// Función que crea el juego

function crearJuego(e) {
    e.preventDefault()
    idJuego++
    creoJuego = true
    input1 = document.querySelector('#nombre1').value
    input2 = document.querySelector('#nombre2').value
    if (!input1 || !input2) {
        alert('La forma arcaica de frenar el todo')
        return
    } else {
        let humane1 = new Humane(input1)
        let humane2 = new Humane(input2)
            // En este pedacito agrega los numeros y hay que validar que no sean repetidos
        do {
            let random1 = randomNumber()
            if (humane1.cartasId.indexOf(random1) < 0) {
                humane1.addCarta(random1)
            }
        } while (humane1.cartasId.length < 4)
        do {
            let random2 = randomNumber()
            if (humane2.cartasId.indexOf(random2) < 0) {
                humane2.addCarta(random2)
            }
        } while (humane2.cartasId.length < 4)
        // Fin del pedacito
        let modelo = `<li id="juego${idJuego}" data-nombre1=${humane1._nombre} data-nombre2=${humane2._nombre} data-carta1=${humane1.cartasId[0]} data-carta2=${humane1.cartasId[1]} data-carta3=${humane1.cartasId[2]} data-carta4=${humane2.cartasId[0]} data-carta5=${humane2.cartasId[1]} data-carta6=${humane2.cartasId[2]} class="listaJuegos__Juego"><p class="listaJuegos__texto">${humane1._nombre} Y ${humane2._nombre}</p><div class="listaJuegos__botonera"><i id=${idJuego} onclick="mostrarJuego(this.id)" class="fa-solid fa-eye"></i><i onclick="removerJuego(this)" class="fa-solid fa-trash-can"></i></div></li>`
        let listaJuegos = document.querySelector('#listaJuegos')
        listaJuegos.innerHTML += modelo
        document.querySelector('#nombre1').value = ''
        document.querySelector('#nombre2').value = ''
        inicioJuego.classList.add('off')
        intervalo.classList.remove('off')
            // Agregar primeraVez para ver si esta ingresando por el boton o acaba de crear el juego
        setTimeout(() => {
            mostrarJuego(idJuego)
        }, 3000)
    }
}


// Función Mostrar Juego

function mostrarJuego(e) {
    intervalo.classList.add('off')
    inicioJuego.classList.add('off')
    verJuego.classList.remove('off')
    const liJuego = document.querySelector('#juego' + e)
    let nombre1 = liJuego.getAttribute('data-nombre1')
    let nombre2 = liJuego.getAttribute('data-nombre2')
    setearHeadersCarousel(nombre1, nombre2)
    let arrayIds = []
    for (i = 1; i < 7; i++) {
        let carta = liJuego.getAttribute('data-carta' + i)
        arrayIds.push(carta)
    }
    fetch(url).then(res => res.json()).then(res => {
        res.map(personaje => {
            let id = personaje.id
            for (i = 0; i < 6; i++) {
                if (arrayIds[i] == id) {
                    setearPersonajesCarousel(i + 1, personaje.url, personaje.nombre, personaje.descripcion)
                }
            }
        })
    })
}

// Fin Mostrar Juego

// Funciónes que Setean el HTML del Carousel que es Fijo
// pero con datos dinamicos

function setearHeadersCarousel(nombre1, nombre2) {
    for (i = 1; i < 7; i++) {
        if (i < 4) {
            document.querySelector('#hum' + i).innerHTML = nombre1
        } else {
            document.querySelector('#hum' + i).innerHTML = nombre2
        }
    }
}

function setearPersonajesCarousel(id, src, nom, tex) {
    document.querySelector('#img' + id).src = src
    document.querySelector('#nom' + id).innerHTML = nom
    document.querySelector('#tex' + id).innerHTML = tex
}

// Boton para pasar a pantalla de ver resultado y volver a tirar
btnCerrarVC.addEventListener('click', cerrarVerJuego)


function cerrarVerJuego() {
    document.querySelector('#verJuego').classList.add('off')
    document.querySelector('#verResultado').classList.remove('off')
    if (!creoJuego) {
        document.querySelector('#btnVolverTirar').classList.add('off')
        document.querySelector('#btnVolver').classList.remove('off')
    }
    resolverMatch(idJuego)
}

// Función para Resolver el Match

function resolverMatch(idJuego) {
    const liJuego = document.querySelector('#juego' + idJuego)
    let nombre1 = liJuego.getAttribute('data-nombre1')
    let nombre2 = liJuego.getAttribute('data-nombre2')
    document.querySelector('#matchHumane1').innerHTML = nombre1
    document.querySelector('#matchHumane2').innerHTML = nombre2
    let arrayIds1 = []
    let arrayIds2 = []
    for (i = 1; i < 4; i++) {
        let carta = liJuego.getAttribute('data-carta' + i)
        arrayIds1.push(carta)
    }
    for (i = 4; i < 7; i++) {
        let carta = liJuego.getAttribute('data-carta' + i)
        arrayIds2.push(carta)
    }
    fetch(url).then(res => res.json()).then(res => {
        res.map(personaje => {
            let id = personaje.id
            for (i = 0; i < 4; i++) {
                if (arrayIds1[i] == id) {
                    setearPersonajesMatch(`mimg1${i + 1}`, personaje.url, personaje.puntaje)
                }
            }
            for (i = 0; i < 4; i++) {
                if (arrayIds2[i] == id) {
                    setearPersonajesMatch(`mimg2${i + 1}`, personaje.url, personaje.puntaje)
                }
            }
        })
    })

}

// Función para setear las imágenes de los circulos pequeños
// y los puntajes para luego manejar el promedio y sacar match si coinciden

function setearPersonajesMatch(id, src, pun) {
    let circulito = document.querySelector(`#${id}`)
    circulito.src = src
    circulito.setAttribute('data-puntaje', pun)
}

// Listeners a los botones de volver a tirar, ver resultado, 

let btnVer = document.querySelector('#btnVer')
let btnVolverTirar = document.querySelector('#btnVolverTirar')
let btnVolver = document.querySelector('#btnVolver')
let btnGuardar = document.querySelector('#guardar')
let btnSalir = document.querySelector('#salir')

btnVer.addEventListener('click', verResultadoMatch)
btnVolverTirar.addEventListener('click', volverATirar)
btnVolver.addEventListener('click', volverMenu)
btnGuardar.addEventListener('click', guardarJuego)
btnSalir.addEventListener('click', salirJuego)

function verResultadoMatch() {
    document.querySelector('#verResultado').classList.add('off')
    document.querySelector('#verMatch').classList.remove('off')
    let h1match = document.querySelector('#match')
    let pun11 = parseInt(document.querySelector('#mimg11').getAttribute('data-puntaje'))
    let pun12 = parseInt(document.querySelector('#mimg12').getAttribute('data-puntaje'))
    let pun13 = parseInt(document.querySelector('#mimg13').getAttribute('data-puntaje'))
    let pun21 = parseInt(document.querySelector('#mimg21').getAttribute('data-puntaje'))
    let pun22 = parseInt(document.querySelector('#mimg22').getAttribute('data-puntaje'))
    let pun23 = parseInt(document.querySelector('#mimg23').getAttribute('data-puntaje'))
    let promPunTotal = (pun11 + pun12 + pun13 + pun21 + pun22 + pun23) / 6
    if (promPunTotal > 85) {
        h1match.innerHTML = 'SI'
    } else {
        h1match.innerHTML = 'NO'
    }
}

function volverATirar() {

    document.getElementById(`juego${idJuego}`).remove()
    document.querySelector('#verJuego').classList.add('off')
    document.querySelector('#inicioJuego').classList.remove('off')

    idJuego--
}

function volverMenu() {
    document.querySelector('#inicioJuego').classList.remove('off')
    document.querySelector('#verJuego').classList.add('off')
    document.querySelector('#verResultado').classList.add('off')
}

function guardarJuego() {
    creoJuego = false
    document.querySelector('#verJuego').classList.add('off')
    document.querySelector('#verMatch').classList.add('off')
    document.querySelector('#inicioJuego').classList.remove('off')
}

function salirJuego() {
    if (creoJuego) {
        console.log('es por aca')
        document.getElementById(`juego${idJuego}`).remove()
        document.querySelector('#inicioJuego').classList.remove('off')
        document.querySelector('#verJuego').classList.add('off')
        document.querySelector('#verMatch').classList.add('off')
        idJuego--
    } else {
        document.querySelector('#inicioJuego').classList.remove('off')
        document.querySelector('#verJuego').classList.add('off')
        document.querySelector('#verMatch').classList.add('off')
    }
}

// Función removerJuego
function removerJuego(elem) {
    elem.parentNode.parentNode.remove()
}