//  Variables y selectores

const formulario = document.querySelector('#agregar-gasto');

const gastosListado = document.querySelector('#gastos ul')


//  Eventos 

eventListeners();

function eventListeners() {

    document.addEventListener('DOMContentLoaded', preguntarPresuesto)

    formulario.addEventListener('submit', agregarGasto)

}


// classes

class Presupuesto {

    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {

        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    }

    calcularRestante() {


        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);

        console.log(gastado);

        this.restante = this.presupuesto - gastado;

        console.log(this.restante);
    }

    eliminarGasto(id) {

        this.gastos = this.gastos.filter(gasto => gasto.id !== id);

        this.calcularRestante();

        console.log(this.gastos);

    }

}


class UI {

    insertarPresupuesto(cantidad) {

        const { presupuesto, restante } = cantidad;

        document.querySelector('#total').textContent = presupuesto;

        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje, tipo) {

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if (tipo === "error") {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {

            divMensaje.remove();

        }, 3000);

    }

    agregarGastosListado(gastos) {

        this.limpiarHTML(); // Elimina el HTML previo.

        console.log(gastos);
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            // Crear un Li

            const nuevoGasto = document.createElement('li');

            nuevoGasto.className = 'List-group-item d-flex justify-content-between aling-items-center item';

            nuevoGasto.dataset.id = id;


            // Agregar el HTML del gasto

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            // Boton para el gasto

            const btnBorrar = document.createElement('button');


            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')

            btnBorrar.innerHTML = 'Borrar &times'

            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTMl


            gastosListado.appendChild(nuevoGasto);


            // console.log(`Gasto: ${gasto.nombre} - Cantidad:${gasto.cantidad}`)

        });

    }

    limpiarHTML() {

        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        };

    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;


    }

    comprobarPresupuesto(presupuestoObj) {

        const { presupuesto, restante } = presupuestoObj;

        this.pintado(restante * 100 / presupuesto);

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;

        }

    }

    pintado(porcentajeGastado) {

        console.log(porcentajeGastado);

        const restanteDiv = document.querySelector('.restante');

        if (porcentajeGastado < 25) {

            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');


        } else if (porcentajeGastado < 50) {

            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');

        } else {

            restanteDiv.classList.remove('alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-success');
        }
    }

}

// Instancias

let presupuesto;

const ui = new UI();


// Funciones

function preguntarPresuesto() {

    const presupuestoUsuario = prompt('Cual es tu presupuesto');

    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {

        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}


function agregarGasto(e) {

    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;

    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar

    if (nombre === "" || cantidad === "") {

        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (cantidad <= 0 || isNaN(cantidad)) {

        ui.imprimirAlerta('Cantidad no valida', 'error');

    } else {

        // Crear un objeto con el gasto

        const gasto = { nombre, cantidad, id: Date.now() }

        // añade un nuevo gasto

        presupuesto.nuevoGasto(gasto);

        // Mensaje de todo Ok.

        ui.imprimirAlerta('Gasto agregado correctamente');

        // Imprimir los gastos

        const { gastos, restante } = presupuesto;

        ui.actualizarRestante(restante);

        ui.agregarGastosListado(gastos);

        ui.comprobarPresupuesto(presupuesto);

    }

    // Reinicar formulario

    formulario.reset();
}


function eliminarGasto(id) {


    // Eliminas los gastos de la clase
    presupuesto.eliminarGasto(id);


    // Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;

    ui.agregarGastosListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

}