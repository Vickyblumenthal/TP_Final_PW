function mostrarDetallesCompra() {
    const detalleCompra = JSON.parse(localStorage.getItem("detalleCompra"));
    const paymentMethod = localStorage.getItem("paymentMethod");

    if (detalleCompra) {
        const currencySymbol = detalleCompra.moneda === "dolares" ? "USD" : "ARS";
        
        // Mostrar el asiento y la fecha de la función
        document.getElementById("seat").textContent = detalleCompra.asiento || "Asiento no disponible";

        // Calcular monto con descuento si se paga en efectivo
        let precioFinal = detalleCompra.precio;
        if (paymentMethod === "efectivo") {
            precioFinal = precioFinal * 0.9; // Aplicar 10% de descuento
        }
        
        // Mostrar el monto abonado en ARS
        document.getElementById("amount").textContent = `${precioFinal.toFixed(2)} ARS` || "Monto no disponible";

        // Mostrar el monto en USD si es aplicable
        if (detalleCompra.moneda === "dolares") {
            const precioEnDolares = (precioFinal / obtenerPrecioDolarBlue()).toFixed(2); // Convertir el precio a USD
            document.getElementById("amountUSD").textContent = `${precioEnDolares} USD`;
        } else {
            document.getElementById("amountUSD").textContent = ''; // Limpiar si no es en dólares
        }

        // Mostrar el método de pago
        document.getElementById("method").textContent = paymentMethod || "Método de pago no disponible";

        // Mostrar la fecha de la función
        document.getElementById("date").textContent = detalleCompra.funcion.split(" - ")[1] || "Fecha no disponible";
    } else {
        document.querySelector('.entrada-confirmada').innerHTML = '<p>No se encontraron detalles de la compra.</p>';
    }
}

function obtenerPrecioDolarBlue() {
    // Implementar la lógica para obtener el precio del dólar blue
    // Si ya tienes esta función en otro archivo, simplemente llámala aquí
    return 200; // Este es un valor de ejemplo, reemplázalo con tu lógica real
}

document.addEventListener("DOMContentLoaded", mostrarDetallesCompra);
