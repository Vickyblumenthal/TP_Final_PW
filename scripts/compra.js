document.addEventListener("DOMContentLoaded", function() {
    const selectedSeat = JSON.parse(localStorage.getItem("selectedSeat"));
    const functionInfo = JSON.parse(localStorage.getItem("functionInfo"));

    if (!selectedSeat || !functionInfo) {
        alert("No se encontró información de la compra. Por favor, selecciona un asiento.");
        window.location.href = "asientos.html";
        return;
    }

    // Mostrar información de asiento y función
    document.getElementById("selectedSeatInfo").innerText = `Asiento Seleccionado: ${selectedSeat.seatNumber}`;
    document.getElementById("functionDateInfo").innerText = `Función: ${functionInfo.name}`; // Sin fecha aquí
    document.getElementById("totalPriceInfo").innerText = `Precio Total: $${selectedSeat.price}`;

    document.getElementById("paymentMethod").addEventListener("change", function() {
        const paymentMethod = this.value;
        const creditOptions = document.getElementById("creditOptions");
        const debitOptions = document.getElementById("debitOptions");

        creditOptions.style.display = "none";
        debitOptions.style.display = "none";

        if (paymentMethod === "credito") creditOptions.style.display = "block";
        else if (paymentMethod === "debito") debitOptions.style.display = "block";
    });

    document.getElementById("finalizePurchase").addEventListener("click", function() {
        const paymentMethod = document.getElementById("paymentMethod").value;

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

        // Calcular el precio total para tarjeta de crédito
        let precioFinal = selectedSeat.price;
        if (paymentMethod === "credito") {
            const cuotas = parseInt(document.getElementById("installments").value);
            if (cuotas === 2) {
                precioFinal *= 1.06; // 6% de recargo
            } else if (cuotas === 3) {
                precioFinal *= 1.12; // 12% de recargo
            } else if (cuotas === 6) {
                precioFinal *= 1.20; // 20% de recargo
            }
        }

        // Guardar detalles de la compra en localStorage
        const detalleCompra = {
            asiento: selectedSeat.seatNumber,
            precio: precioFinal.toFixed(2), // Redondear a 2 decimales
            funcion: functionInfo.name // Solo nombre de la función aquí
        };

        localStorage.setItem("detalleCompra", JSON.stringify(detalleCompra));
        localStorage.setItem("paymentMethod", paymentMethod);

        alert("Compra exitosa!");
        window.location.href = "entrada.html"; // Redirigir a la página de entrada confirmada
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
