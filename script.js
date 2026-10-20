class Nodo {
    constructor(dato, genero) {
        this.dato = dato;
        this.genero = genero;
        this.siguiente = null;
    }
}

class ListaEnlazada {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.tam = 0;
    }

    insertarFinal(d, genero) {
        const nuevo = new Nodo(d, genero);
        if (this.cabeza === null) {
            this.cabeza = this.cola = nuevo;
        } else {
            this.cola.siguiente = nuevo;
            this.cola = nuevo;
        }
        this.tam++;
    }

    eliminarInicio() {
        if (this.cabeza === null) return null;
        const tmp = this.cabeza;
        this.cabeza = this.cabeza.siguiente;
        if (this.cabeza === null) this.cola = null;
        tmp.siguiente = null;
        this.tam--;
        return tmp;
    }
}

const colaBanco = new ListaEnlazada();
let totalServed = 0;

function printConsole(text) {
    document.getElementById('consoleLog').textContent = text;
}

function renderQueue() {
    const container = document.getElementById('queueContainer');
    container.innerHTML = '';
    document.getElementById('lblTam').textContent = colaBanco.tam;

    if (colaBanco.cabeza === null) {
        const emptyMessage = document.createElement('span');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'La fila está vacía';
        container.appendChild(emptyMessage);
        return;
    }

    let actual = colaBanco.cabeza;
    while (actual !== null) {
        const node = document.createElement('div');
        node.className = 'client-node';

        const person = document.createElement('span');
        person.className = `person ${actual.genero.toLowerCase()}`;
        person.setAttribute('aria-hidden', 'true');
        if (actual === colaBanco.cabeza) {
            node.classList.add('first');
            person.classList.add('here');
            person.setAttribute('aria-label', 'Siguiente en atención');
        }

        const label = document.createElement('span');
        label.className = 'client-label';
        label.textContent = actual.dato;
        node.append(person, label);
        container.appendChild(node);
        actual = actual.siguiente;
    }
}

function addClient() {
    event.preventDefault();
    const txtName = document.getElementById('clientName');
    const nameValue = txtName.value.trim();

    if (!nameValue) {
        txtName.focus();
        return;
    }

    colaBanco.insertarFinal(nameValue, document.getElementById('clientGender').value);
    txtName.value = '';
    renderQueue();
    printConsole(`${nameValue} se agregó al final de la fila.`);
    txtName.focus();
}

function serveClient() {
    const atendido = colaBanco.eliminarInicio();
    if (atendido) {
        totalServed++;
        document.getElementById('lblServed').textContent = totalServed;
        printConsole(`${atendido.dato} fue atendido en la caja.`);
    } else {
        printConsole('No hay clientes en la fila para atender.');
    }
    renderQueue();
}

function resetQueue() {
    while (colaBanco.eliminarInicio() !== null) {}
    totalServed = 0;
    document.getElementById('lblServed').textContent = totalServed;
    renderQueue();
    printConsole('Sistema reiniciado.');
}

document.getElementById('clientForm').addEventListener('submit', addClient);
document.getElementById('serveButton').addEventListener('click', serveClient);
document.getElementById('resetButton').addEventListener('click', resetQueue);

[
    ['Cliente 1', 'Mujer'],
    ['Cliente 2', 'Mujer'],
    ['Cliente 3', 'Mujer'],
    ['Cliente 4', 'Hombre'],
    ['Cliente 5', 'Mujer']
].forEach(([nombre, genero]) => colaBanco.insertarFinal(nombre, genero));

renderQueue();
