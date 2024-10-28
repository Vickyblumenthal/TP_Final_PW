const preciosAsientos = {
    platea: 5000,
    palcoAlto: 4500,
    palcoBajo: 4000,
    cazuela: 3500,
    tertulia: 3000,
    paraiso: 2500,
};

// Diccionario de funciones y sus asientos ocupados
const funciones = {
    1: { asientosOcupados: [1, 7, 21, 33, 34, 35, 37, 48, 61, 69, 70, 84, 85, 89, 97] },
    2: { asientosOcupados: [2, 20, 31, 34, 36, 37, 46, 49, 52, 54, 70, 74, 77, 83, 94] },
    3: { asientosOcupados: [2, 3, 20, 21, 53, 56, 61, 64, 69, 73, 79, 81, 90, 92, 96] }
};

let selectedSeat = null;

function generarAsientos(asientosOcupados) {
    // Limpiar el contenido previo de cada sección
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

                const precio = preciosAsientos[ubicacion];
                alert(`El precio para el asiento seleccionado (${ubicacion}) es: $${precio}`);
            });
        }
    }
}

document.getElementById('funcion').addEventListener('change', function() {
    const selectedFunction = this.value;
    const asientosOcupados = funciones[selectedFunction].asientosOcupados;
    generarAsientos(asientosOcupados);
});

window.onload = function() {
    const firstFunction = document.getElementById('funcion').value;
    const asientosOcupados = funciones[firstFunction].asientosOcupados;
    generarAsientos(asientosOcupados);
};

document.getElementById('confirm-seats').addEventListener('click', function() {
    if (selectedSeat) {
        const funcion = document.getElementById('funcion').selectedOptions[0].textContent;
        const ubicacion = selectedSeat.parentNode.id;
        const precio = preciosAsientos[ubicacion];
        const asiento = selectedSeat.textContent;

        localStorage.setItem('selectedSeat', JSON.stringify({ seatNumber: asiento, price: precio }));
        localStorage.setItem('functionInfo', JSON.stringify({ name: funcion, date: new Date().toLocaleDateString(), price: precio }));

        window.location.href = 'compra.html';
    } else {
        alert('Por favor, selecciona un asiento antes de confirmar.');
    }
});
