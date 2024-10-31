const preciosAsientos = {
    platea: 5000,
    palcoAlto: 4500,
    palcoBajo: 4000,
    cazuela: 3500,
    tertulia: 3000,
    paraiso: 2500,
};

let selectedSeat = null;

function mostrarPrecio(asiento, ubicacion) {
    const precio = preciosAsientos[ubicacion];
    alert(`El precio para el asiento seleccionado (${asiento}, ${ubicacion}) es: $${precio}`);
}


function generarAsientos(asientosOcupados) {
    const sections = ["platea", "palcoBajo", "palcoAlto", "cazuela", "tertulia", "paraiso"];
    sections.forEach(section => document.getElementById(section).innerHTML = '');

    for (let i = 1; i <= 100; i++) {
        const seat = document.createElement('button');
        seat.classList.add('seat');
        seat.textContent = i;

        let ubicacion;
        if (i <= 12) ubicacion = 'platea';
        else if (i <= 24) ubicacion = 'palcoBajo';
        else if (i <= 36) ubicacion = 'palcoAlto';
        else if (i <= 54) ubicacion = 'cazuela';
        else if (i <= 72) ubicacion = 'tertulia';
        else ubicacion = 'paraiso';

        document.getElementById(ubicacion).appendChild(seat);

        if (asientosOcupados.includes(i)) {
            seat.classList.add('taken');
            seat.disabled = true;
        } else {
            seat.classList.add('available');
            seat.addEventListener('click', function() {
                if (selectedSeat) selectedSeat.classList.remove('selected');
                selectedSeat = seat;
                seat.classList.add('selected');

                mostrarPrecio(i, ubicacion);

                // Guardar el asiento seleccionado en localStorage
                const seatData = {
                    seatNumber: i,
                    price: preciosAsientos[ubicacion] // Guarda el precio correspondiente
                };
                localStorage.setItem("selectedSeat", JSON.stringify(seatData));
            });
        }
    }
}

document.getElementById('funcion').addEventListener('change', function() {
    const selectedFunction = this.value;

    // Guardar la fecha en localstorage
    const funciones = [
        'Función 1 - 14/11/2024 - 19:00 - Grupo A',
        'Función 2 - 15/11/2024 - 20:00 - Grupo B',
        'Función 3 - 16/11/2024 - 18:00 - Grupo C',
    ];
    localStorage.setItem("selectedDate", JSON.stringify(funciones[selectedFunction-1]));


    // Hacer una solicitud al backend para obtener los asientos ocupados
    fetch(`http://localhost:3000/funciones/${selectedFunction}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                generarAsientos(data.asientosOcupados); // Usar los asientos ocupados del servidor

            }
        })
        .catch(error => {
            console.error('Error al obtener los asientos ocupados:', error);
            alert('Ocurrió un error al obtener los asientos ocupados. Inténtalo de nuevo.');
        });
});

window.onload = function() {
    const firstFunction = document.getElementById('funcion').value;
    fetch(`http://localhost:3000/funciones/${firstFunction}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                generarAsientos(data.asientosOcupados);
            }
        })
        .catch(error => {
            console.error('Error al obtener los asientos ocupados al cargar:', error);
            alert('Ocurrió un error al obtener los asientos ocupados. Inténtalo de nuevo.');
        });
};

document.getElementById('confirm-seats').addEventListener('click', function() {
    if (selectedSeat) {
        const funcion = document.getElementById('funcion').selectedOptions[0].value; // ID de la función
        const ubicacion = selectedSeat.parentNode.id;
        const precio = preciosAsientos[ubicacion];
        const asiento = selectedSeat.textContent;

        const datosReserva = {
            funcion_id: funcion,
            asiento_id: parseInt(asiento) // Asegúrate de que el ID del asiento sea un número
        };

        fetch('http://localhost:3000/reservar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosReserva)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error); // Mostrar error si hay
            } else {
                alert(`Reserva confirmada: ${data.message}\nAsiento: ${asiento}, Precio: $${precio}`); // Confirmar la reserva
                selectedSeat.classList.add('taken'); // Marcar el asiento como ocupado
                selectedSeat.classList.remove('available');
                selectedSeat.disabled = true; // Deshabilitar el botón de asiento
                window.location.href = "compra.html";
            }
        })
        .catch(error => {
            console.error('Error al reservar el asiento:', error);
            alert('Ocurrió un error al reservar el asiento. Inténtalo de nuevo.');
        });
    } else {
        alert('Por favor, selecciona un asiento antes de confirmar.');
    }
});
