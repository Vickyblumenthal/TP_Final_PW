// compra.js
document.addEventListener("DOMContentLoaded", async function() {
    const selectedSeat = JSON.parse(localStorage.getItem("selectedSeat"));
    const functionInfo = JSON.parse(localStorage.getItem("functionInfo"));
    const currencySelector = document.getElementById("currencySelector");
    const paymentMethodSelector = document.getElementById("paymentMethod");
    const totalPriceInfo = document.getElementById("totalPriceInfo");
    const creditOptions = document.getElementById("creditOptions");
    const debitOptions = document.getElementById("debitOptions");
    const selectedDate = JSON.parse(localStorage.getItem("selectedDate"));
    let precioEnPesos = selectedSeat ? selectedSeat.price : 0;
    let precioFinal = precioEnPesos;

    if (!selectedSeat || !functionInfo) {
        alert("No se encontró información de la compra. Por favor, selecciona un asiento.");
        window.location.href = "asientos.html";
        return;
    }

    // Mostrar información de asiento y función
    document.getElementById("selectedSeatInfo").innerText = `Asiento Seleccionado: ${selectedSeat.seatNumber}`;
    document.getElementById("functionDateInfo").innerText = `Función: ${selectedDate}`;
    totalPriceInfo.innerText = `Precio Total: $${precioEnPesos} ARS`;

    // Función para obtener el precio del dólar blue
    async function obtenerPrecioDolarBlue() {
        try {
            const response = await fetch("https://dolarapi.com/v1/dolares/blue");
            if (!response.ok) throw new Error("Error al obtener el precio del dólar blue. Intente de nuevo.");
            const data = await response.json();
            return data.venta;
        } catch (error) {
            console.error(error.message);
            alert(error.message);
            return null;
        }
    }

    // Cambia el precio cuando se selecciona la moneda
    currencySelector.addEventListener("change", actualizarPrecioTotal);

    // Actualiza el precio total en función del método de pago seleccionado
    paymentMethodSelector.addEventListener("change", function() {
        actualizarPrecioTotal();
        const paymentMethod = paymentMethodSelector.value;
        creditOptions.style.display = paymentMethod === "credito" ? "block" : "none";
        debitOptions.style.display = paymentMethod === "debito" ? "block" : "none";
    });

    // Función para actualizar el precio total
    async function actualizarPrecioTotal() {
        const paymentMethod = paymentMethodSelector.value;
        let precioCalculado = precioEnPesos;

        if (paymentMethod === "credito") {
            const cuotas = parseInt(document.getElementById("installments").value);
            if (cuotas === 2) precioCalculado *= 1.06;
            else if (cuotas === 3) precioCalculado *= 1.12;
            else if (cuotas === 6) precioCalculado *= 1.20;
        } else if (paymentMethod === "efectivo") {
            precioCalculado *= 0.90; // Aplica 10% de descuento
        }

        if (currencySelector.value === "dolares") {
            const precioDolarBlue = await obtenerPrecioDolarBlue();
            if (precioDolarBlue) {
                const precioEnDolares = (precioCalculado / precioDolarBlue).toFixed(2);
                totalPriceInfo.innerText = `Precio Total: $${precioEnDolares} USD`;
                precioFinal = parseFloat(precioEnDolares);
            }
        } else {
            totalPriceInfo.innerText = `Precio Total: $${precioCalculado.toFixed(2)} ARS`;
            precioFinal = precioCalculado;
        }
    }

    // Finalizar compra
document.getElementById("finalizePurchase").addEventListener("click", function() {
    let paymentMethod = paymentMethodSelector.value;
    const currency = currencySelector.value;

    // Validar campos según el método de pago seleccionado
    if ((paymentMethod === "credito" && !validarCamposCredito()) || (paymentMethod === "debito" && !validarCamposDebito()) || !paymentMethod) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    // Cambiar método de pago a título (primera letra en mayúscula)
    if (paymentMethod === "credito") paymentMethod = "Tarjeta de Crédito";
    else if (paymentMethod === "debito") paymentMethod = "Tarjeta de Débito";
    else if (paymentMethod === "efectivo") paymentMethod = "Efectivo";

    // Guardar detalles de la compra en localStorage
    const detalleCompra = {
        asiento: selectedSeat.seatNumber,
        precio: precioFinal.toFixed(2), // Asegura que el precio final se guarde como string
        funcion: selectedDate,
        fecha: functionInfo.fecha,  // Guardar la fecha de la función
        metodoPago: paymentMethod,
        moneda: currency
    };

    localStorage.setItem("detalleCompra", JSON.stringify(detalleCompra));

    alert("Compra exitosa!");
    window.location.href = "entrada.html";
});


    function validarCamposCredito() {
        return document.getElementById("cardNumber").value && document.getElementById("expiryDate").value && document.getElementById("cvv").value;
    }

    function validarCamposDebito() {
        return document.getElementById("debitCardNumber").value && document.getElementById("debitExpiryDate").value && document.getElementById("debitCvv").value;
    }
});
