let url = './personajes.json'
let personajes = []
let llenarPersonajes = fetch(url)
    .then(res => res.json())
    .then(res => {
        for (personaje of res) {
            personajes.push(personaje)
        }
    })

class Humane {
    constructor(nombre = "") {
        this._nombre = nombre
        this.cartas = []
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(nombre) {
        this._nombre = nombre;
    }

    addCarta(carta) {
        this.cartas.push(carta)
    }
}

let marcos = new Humane('Marcos')

console.log(marcos)

marcos.addCarta(2)
marcos.addCarta(20)
marcos.addCarta(18)

console.log(marcos)

marcos.cartas.map(e => console.log(e))