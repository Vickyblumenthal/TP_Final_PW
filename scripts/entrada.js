function mostrarDetallesCompra() {
    // Recupera los detalles de la compra desde el localStorage
    const detalleCompra = JSON.parse(localStorage.getItem("detalleCompra"));

    if (detalleCompra) {
        // Determina el símbolo de la moneda según la opción seleccionada en la compra
        const currencySymbol = detalleCompra.moneda === "dolares" ? "USD" : "ARS";
        
        // Muestra el asiento seleccionado, el monto abonado, el método de pago y la fecha de la función
        document.getElementById("seat").textContent = ` ${detalleCompra.asiento || "No disponible"}`;
        document.getElementById("amount").textContent = `${detalleCompra.precio} ${currencySymbol}`;
        document.getElementById("method").textContent = `${detalleCompra.metodoPago || "No disponible"}`;
        document.getElementById("date").textContent = `${detalleCompra.funcion || "No disponible"}`;
    } else {
        // Si no hay detalles en el localStorage, muestra un mensaje de error
        document.querySelector('.entrada-confirmada').innerHTML = '<p>No se encontraron detalles de la compra.</p>';
    }
}

// Ejecuta la función mostrarDetallesCompra cuando se carga la página
document.addEventListener("DOMContentLoaded", mostrarDetallesCompra);
