// Códigos QR para los métodos de pago
const QR_CODES = {
    // QR code para Yape/Plin - Imagen PNG
    yapePlin: "qr-yape.png",

    // QR code alternativo - Versión CSS (si es necesario)
    yapePlinCSS: "TU_CODIGO_BASE64_CSS_AQUI",
    
    // Puedes agregar más QR codes aquí si los necesitas
    // Por ejemplo, para diferentes cuentas o métodos de pago
    // otroMetodo: "OTRO_CODIGO_BASE64_AQUI"
};

// Función para obtener el QR code
function getQRCode(type = 'yapePlin') {
    return QR_CODES[type] || QR_CODES.yapePlin;
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QR_CODES, getQRCode };
}