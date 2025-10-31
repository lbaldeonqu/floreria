# Lima Rose Florería 🌸

Una hermosa página web para florería con funcionalidades completas de e-commerce, desarrollada con tecnologías web modernas.

## 🌟 Características

- **Diseño Responsivo**: Optimizada para dispositivos móviles, tablets y desktop
- **Catálogo de Productos**: Sistema completo de productos con categorías, filtros y búsqueda
- **Carrito de Compras**: Funcionalidad completa de carrito con persistencia local
- **Sistema de Modales**: Modales para detalles de producto, login y checkout
- **Arquitectura Modular**: Código organizado en módulos ES6 para mejor mantenibilidad
- **Animaciones Suaves**: Transiciones y efectos visuales elegantes
- **SEO Optimizado**: Estructura semántica y metadatos apropiados

## 🏗️ Arquitectura del Proyecto

```
floreria/
├── index.html                 # Página principal
├── assets/
│   ├── css/                   # Estilos modulares
│   │   ├── main.css          # Archivo principal con imports
│   │   ├── base.css          # Variables CSS y estilos base
│   │   ├── header.css        # Estilos del header
│   │   ├── products.css      # Estilos de productos
│   │   ├── cart.css          # Estilos del carrito
│   │   ├── modals.css        # Estilos de modales
│   │   ├── sections.css      # Secciones (testimonios, blog, etc.)
│   │   ├── footer.css        # Estilos del footer
│   │   └── utilities.css     # Clases de utilidad
│   └── js/                   # JavaScript modular
│       ├── app.js            # Aplicación principal
│       └── modules/
│           ├── services.js   # Servicios (API, Storage, Notifications)
│           ├── products.js   # Gestor de productos
│           ├── cart.js       # Gestor del carrito
│           └── modals.js     # Gestor de modales
├── data/
│   └── products.json         # Catálogo de productos
├── config/
│   └── config.js            # Configuración de la aplicación
└── README.md                # Documentación
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: 
  - CSS Custom Properties (Variables)
  - CSS Grid & Flexbox
  - Animaciones y transiciones
  - Responsive Design
- **JavaScript ES6+**:
  - Módulos ES6
  - Classes
  - Async/Await
  - Event Emitters
  - Local Storage

### Librerías Externas
- **Font Awesome 6**: Iconos
- **Google Fonts**: Tipografía (Inter)

## 📱 Funcionalidades

### Gestión de Productos
- Catálogo completo con imágenes
- Filtrado por categorías
- Búsqueda por texto
- Filtros avanzados (precio, valoración)
- Ordenamiento múltiple
- Detalles de producto en modal

### Carrito de Compras
- Agregar/quitar productos
- Modificar cantidades
- Persistencia en localStorage
- Cálculo automático de totales
- Proceso de checkout completo

### Interfaz de Usuario
- Navegación intuitiva
- Modales responsivos
- Notificaciones toast
- Animaciones suaves
- Scroll effects
- Lazy loading de imágenes

### Responsive Design
- Mobile-first approach
- Breakpoints optimizados
- Touch-friendly interactions
- Performance optimizada

## 🛠️ Instalación y Uso

### Requisitos
- Navegador web moderno con soporte ES6
- Servidor web local (para módulos ES6)

### Instalación Local

1. **Clonar o descargar el proyecto**
```bash
git clone [url-del-proyecto]
cd floreria
```

2. **Servidor web local**

Opción A - Python:
```bash
python -m http.server 8000
```

Opción B - Node.js:
```bash
npx http-server
```

Opción C - VS Code Live Server:
- Instalar extensión "Live Server"
- Click derecho en `index.html` > "Open with Live Server"

3. **Abrir en navegador**
```
http://localhost:8000
```

## 📋 Configuración

La configuración principal se encuentra en `config/config.js` y en el objeto global `window.AppConfig` en `index.html`:

```javascript
window.AppConfig = {
    api: {
        baseUrl: '/api'  // URL base para API
    },
    shipping: {
        cost: 15.00,           // Costo de envío
        freeThreshold: 100.00  // Compra mínima para envío gratis
    },
    tax: {
        rate: 0.18  // IGV Perú (18%)
    },
    contact: {
        phone: '+51977713388',
        email: 'info@limarose.com',
        whatsapp: 'https://api.whatsapp.com/send/...'
    }
};
```

## 🎨 Personalización

### Colores y Estilos
Editar variables CSS en `assets/css/base.css`:

```css
:root {
    --primary-color: #e91e63;     /* Color principal */
    --primary-dark: #c2185b;     /* Color principal oscuro */
    --primary-light: #f8bbd9;    /* Color principal claro */
    /* ... más variables */
}
```

### Productos
Modificar el catálogo en `data/products.json`:

```json
{
    "products": [
        {
            "id": 1,
            "name": "Nombre del producto",
            "category": "ramos",
            "price": 89.90,
            "image": "URL_de_imagen",
            "description": "Descripción del producto"
        }
    ]
}
```

## 🔧 Desarrollo

### Estructura de Módulos

#### Services (`assets/js/modules/services.js`)
- **ApiService**: Manejo de llamadas HTTP
- **StorageService**: Persistencia local
- **NotificationService**: Sistema de notificaciones
- **EventEmitter**: Comunicación entre módulos
- **Utils**: Funciones de utilidad

#### Products Manager (`assets/js/modules/products.js`)
- Carga y gestión del catálogo
- Filtrado y búsqueda
- Renderizado de productos
- Eventos de productos

#### Cart Manager (`assets/js/modules/cart.js`)
- Gestión del carrito
- Persistencia en localStorage
- Cálculos de totales
- UI del carrito lateral

#### Modal Manager (`assets/js/modules/modals.js`)
- Sistema de modales
- Modal de detalles de producto
- Modal de checkout
- Modal de login

### Eventos Principales

```javascript
// Escuchar eventos de la aplicación
window.floreriaApp.on('appInitialized', () => {
    console.log('App lista');
});

// Eventos del carrito
window.cartManager.on('itemAdded', (data) => {
    console.log('Producto agregado:', data);
});

// Eventos de productos
window.productsManager.on('productsFiltered', (data) => {
    console.log('Productos filtrados:', data);
});
```

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (320px - 767px)

## 🚀 Despliegue

### Para Producción

1. **Optimizar imágenes**
   - Comprimir imágenes de productos
   - Usar formatos WebP cuando sea posible

2. **Minificar archivos**
   - CSS: Usar herramientas como cssnano
   - JS: Usar herramientas como terser

3. **Configurar servidor**
   - Habilitar compresión gzip
   - Configurar cache headers
   - HTTPS obligatorio

### Hosting Recomendado
- **Netlify**: Deploy automático desde Git
- **Vercel**: Optimizado para aplicaciones web
- **GitHub Pages**: Para proyectos simples
- **Servidor tradicional**: Apache/Nginx

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Teléfono**: +51 977 713 388
- **Email**: info@limarose.com
- **WhatsApp**: [Enviar mensaje](https://api.whatsapp.com/send/?phone=51977713388&text=%C2%A1Hola!+Tengo+una+consulta+o+solicitud.)

## 🚀 Deploy en Netlify con Backend Completo

### Preparado para Netlify Functions

Este proyecto incluye **Netlify Functions** para tener un backend serverless completo:

#### APIs Disponibles:
- `/.netlify/functions/products` - Gestión de productos
- `/.netlify/functions/login` - Autenticación de usuarios  
- `/.netlify/functions/verify` - Verificación de tokens
- `/.netlify/functions/logout` - Cerrar sesión

#### Opciones de Deploy:

**Opción 1: Deploy Automático desde Git**
1. Sube tu código a GitHub/GitLab
2. Conecta tu repositorio en [Netlify](https://app.netlify.com)
3. Netlify detectará automáticamente `netlify.toml`

**Opción 2: Deploy Manual con Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

**Opción 3: Deploy por Arrastrar y Soltar**
1. Comprime toda la carpeta del proyecto
2. Ve a https://app.netlify.com/drop
3. Arrastra tu archivo ZIP

#### Variables de Entorno Requeridas:
En Netlify Dashboard → Site Settings → Environment Variables:
- `JWT_SECRET`: clave-secreta-para-jwt
- `NODE_ENV`: production

#### Estructura Backend:
```
netlify/functions/
├── products.js    # CRUD de productos
├── login.js       # Autenticación  
├── verify.js      # Validación JWT
└── logout.js      # Cerrar sesión
```

#### Funcionalidades Serverless:
- ✅ **Autenticación JWT** con cookies seguras
- ✅ **CRUD de productos** con persistencia JSON
- ✅ **Panel de admin** completamente funcional  
- ✅ **Upload de imágenes** (base64 encoding)
- ✅ **CORS configurado** para APIs
- ✅ **Seguridad** con bcrypt y tokens

#### Credenciales Predeterminadas:
- **Usuario**: admin
- **Contraseña**: limarose2025

#### URLs del Sitio en Producción:
- **Sitio principal**: https://tu-sitio.netlify.app
- **Panel admin**: https://tu-sitio.netlify.app/admin-new.html

---

🌹 **Lima Rose Florería** - Sistema completo de e-commerce con backend serverless
Desarrollado con ❤️ usando Netlify Functions