document.addEventListener("DOMContentLoaded", async function() {
    const selectedSeat = JSON.parse(localStorage.getItem("selectedSeat"));
    const functionInfo = JSON.parse(localStorage.getItem("functionInfo"));
    const currencySelector = document.getElementById("currencySelector");
    const paymentMethodSelector = document.getElementById("paymentMethod");
    const totalPriceInfo = document.getElementById("totalPriceInfo");
    const creditOptions = document.getElementById("creditOptions");
    const debitOptions = document.getElementById("debitOptions");
    let precioEnPesos = selectedSeat ? selectedSeat.price : 0;
    let precioFinal = precioEnPesos; // Inicializa el precio final

    if (!selectedSeat || !functionInfo) {
        alert("No se encontró información de la compra. Por favor, selecciona un asiento.");
        window.location.href = "asientos.html";
        return;
    }

    // Mostrar información de asiento y función
    document.getElementById("selectedSeatInfo").innerText = `Asiento Seleccionado: ${selectedSeat.seatNumber}`;
    document.getElementById("functionDateInfo").innerText = `Función: ${functionInfo.name}`;
    totalPriceInfo.innerText = `Precio Total: $${precioEnPesos} ARS`;

    // Función para obtener el precio del dólar blue
    async function obtenerPrecioDolarBlue() {
        try {
            const response = await fetch("https://dolarapi.com/v1/dolares/blue");
            if (!response.ok) {
                throw new Error("Error al obtener el precio del dólar blue. Intente de nuevo.");
            }
            const data = await response.json();
            console.log("Precio del dólar blue:", data.venta); // Verificar respuesta de la API
            return data.venta;
        } catch (error) {
            console.error(error.message);
            alert(error.message);
            return null;
        }
    }

    // Cambia el precio cuando se selecciona la moneda
    currencySelector.addEventListener("change", async function() {
        actualizarPrecioTotal();
    });

    // Actualiza el precio total en función del método de pago seleccionado
    paymentMethodSelector.addEventListener("change", function() {
        actualizarPrecioTotal();
        const paymentMethod = paymentMethodSelector.value;

        creditOptions.style.display = "none";
        debitOptions.style.display = "none";

        if (paymentMethod === "credito") {
            creditOptions.style.display = "block";
        } else if (paymentMethod === "debito") {
            debitOptions.style.display = "block";
        }
    });

    // Función para actualizar el precio total
    function actualizarPrecioTotal() {
        const paymentMethod = paymentMethodSelector.value;
        let precioCalculado = precioEnPesos;

        if (paymentMethod === "credito") {
            const cuotas = parseInt(document.getElementById("installments").value);
            if (cuotas === 2) {
                precioCalculado *= 1.06; // 6% de recargo
            } else if (cuotas === 3) {
                precioCalculado *= 1.12; // 12% de recargo
            } else if (cuotas === 6) {
                precioCalculado *= 1.20; // 20% de recargo
            }
        } else if (paymentMethod === "efectivo") { // Si se elige pagar en efectivo
            precioCalculado *= 0.90; // Aplica 10% de descuento
        }

        // Actualiza el precio total en la interfaz
        if (currencySelector.value === "dolares") {
            obtenerPrecioDolarBlue().then(precioDolarBlue => {
                if (precioDolarBlue) {
                    const precioEnDolares = (precioCalculado / precioDolarBlue).toFixed(2);
                    totalPriceInfo.innerText = `Precio Total: $${precioEnDolares} USD`;
                }
            });
        } else {
            totalPriceInfo.innerText = `Precio Total: $${precioCalculado.toFixed(2)} ARS`;
        }
    }

    // Finalizar compra
    document.getElementById("finalizePurchase").addEventListener("click", function() {
        const paymentMethod = paymentMethodSelector.value;

        // Validar campos según el método de pago seleccionado
        if (paymentMethod === "credito" && !validarCamposCredito()) {
            alert("Por favor, complete todos los campos de tarjeta de crédito.");
            return;
        } else if (paymentMethod === "debito" && !validarCamposDebito()) {
            alert("Por favor, complete todos los campos de tarjeta de débito.");
            return;
        } else if (!paymentMethod) {
            alert("Por favor, seleccione un método de pago.");
            return;
        }

        // Guardar detalles de la compra en localStorage
        const detalleCompra = {
            asiento: selectedSeat.seatNumber,
            precio: precioFinal.toFixed(2),
            funcion: functionInfo.name,
            moneda: currencySelector.value // Agregar la moneda seleccionada
        };

        localStorage.setItem("detalleCompra", JSON.stringify(detalleCompra));
        localStorage.setItem("paymentMethod", paymentMethod);

        alert("Compra exitosa!");
        window.location.href = "entrada.html";
    });

    function validarCamposCredito() {
        const cardNumber = document.getElementById("cardNumber").value; 
        const expiryDate = document.getElementById("expiryDate").value; 
        const cvv = document.getElementById("cvv").value;

        return cardNumber && expiryDate && cvv; 
    }

    function validarCamposDebito() {
        const debitCardNumber = document.getElementById("debitCardNumber").value; 
        const debitExpiryDate = document.getElementById("debitExpiryDate").value; 
        const debitCvv = document.getElementById("debitCvv").value;

        return debitCardNumber && debitExpiryDate && debitCvv; 
    }
});
