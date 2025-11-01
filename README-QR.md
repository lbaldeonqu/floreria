# Sistema de QR Codes - Florería

## Configuración de códigos QR

Para configurar los códigos QR de pago, sigue estos pasos:

### 1. Obtener los códigos Base64

1. Convierte tus imágenes QR a formato Base64
2. Puedes usar herramientas en línea como:
   - base64-image.de
   - base64.guru
   - codebeautify.org/base64-to-image-converter

### 2. Configurar en qr-codes.js

Abre el archivo `qr-codes.js` y reemplaza los placeholders:

```javascript
const QR_CODES = {
    // Reemplaza "TU_CODIGO_BASE64_YAPE_PLIN_AQUI" con tu código real
    yapePlin: "iVBORw0KGgoAAAANSUhEUgAA...", // Tu código aquí
    
    // Si tienes una versión CSS, reemplaza aquí también
    yapePlinCSS: "iVBORw0KGgoAAAANSUhEUgAA...", // Tu código CSS aquí
};
```

### 3. Estructura del proyecto

```
floreria/
├── index.html          # Página principal
├── script.js          # Lógica principal
├── qr-codes.js        # Códigos QR separados
├── styles.css         # Estilos
└── README-QR.md       # Este archivo
```

### 4. Cómo funciona

1. `qr-codes.js` se carga primero en el HTML
2. Contiene la función `getQRCode()` que devuelve el código Base64
3. `script.js` usa `getQRCode('yapePlin')` para obtener el código
4. Se inserta dinámicamente en el modal de confirmación de pago

### 5. Ventajas de esta organización

- ✅ Código más limpio y organizado
- ✅ Fácil mantenimiento de los QR codes
- ✅ Separación de responsabilidades
- ✅ Reutilizable para múltiples métodos de pago
- ✅ Fácil de actualizar sin tocar la lógica principal

### 6. Para agregar más QR codes

Solo agrega nuevas entradas en el objeto `QR_CODES`:

```javascript
const QR_CODES = {
    yapePlin: "codigo_yape_plin...",
    yapePlinCSS: "codigo_css...",
    // Nuevos códigos
    bcp: "codigo_bcp...",
    interbank: "codigo_interbank...",
};
```

Y úsalos con:
```javascript
getQRCode('bcp')
getQRCode('interbank')
```

### 7. Solución de problemas

Si el QR no se muestra:
1. Verifica que `qr-codes.js` se carga antes de `script.js`
2. Asegúrate de que el código Base64 sea válido
3. Revisa la consola del navegador para errores
4. Confirma que el formato sea: `data:image/png;base64,TU_CODIGO_AQUI`

### 8. Próximos pasos

Para completar la configuración:
1. Obtén tus códigos QR en formato Base64
2. Reemplaza los placeholders en `qr-codes.js`
3. Prueba el flujo de pago
4. ¡Listo para producción!