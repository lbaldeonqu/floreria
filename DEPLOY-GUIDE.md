# 🚀 Guía Completa de Deploy en Netlify

## 📋 Checklist Pre-Deploy

- [x] ✅ Netlify Functions configuradas
- [x] ✅ netlify.toml configurado
- [x] ✅ package.json optimizado
- [x] ✅ Variables de entorno documentadas
- [x] ✅ Documentación completada

## 🌐 Opciones de Deploy

### 🔥 Opción 1: Deploy Drag & Drop (Más Fácil)

1. **Preparar archivos:**
   - Comprime toda la carpeta `floreria` en un ZIP
   - Asegúrate de incluir todas las carpetas y archivos

2. **Subir a Netlify:**
   - Ve a https://app.netlify.com/drop
   - Arrastra tu archivo ZIP
   - ¡Listo! Tendrás una URL como `https://amazing-name-123456.netlify.app`

### 🛠️ Opción 2: Deploy desde Git (Recomendado)

1. **Subir a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Lima Rose Florería"
git branch -M main
git remote add origin https://github.com/tu-usuario/lima-rose-floreria.git
git push -u origin main
```

2. **Conectar en Netlify:**
   - Ve a https://app.netlify.com
   - "New site from Git" 
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente `netlify.toml`

### ⚙️ Configuración Importante

**En Netlify Dashboard → Site Settings → Environment Variables:**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `JWT_SECRET` | `lima-rose-secret-2025-production` | Clave secreta para JWT |
| `NODE_ENV` | `production` | Entorno de producción |

## 🎯 Configuración del Dominio

### Dominio Personalizado
1. **En Netlify Dashboard:**
   - Site Settings → Domain Management
   - Add custom domain: `tudominio.com`

2. **En tu proveedor de dominio:**
   - Tipo: `CNAME`
   - Nombre: `@` o `www`
   - Valor: `tu-sitio.netlify.app`

### SSL Automático
- Netlify configurará HTTPS automáticamente
- Certificado SSL gratuito de Let's Encrypt

## 🔍 Testing Post-Deploy

### URLs de Prueba:
- **Sitio principal:** `https://tu-sitio.netlify.app`
- **Panel admin:** `https://tu-sitio.netlify.app/admin-new.html`

### APIs de Prueba:
```bash
# Productos
curl https://tu-sitio.netlify.app/.netlify/functions/products

# Login (usando curl o Postman)
curl -X POST https://tu-sitio.netlify.app/.netlify/functions/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"limarose2025"}'
```

### Credenciales de Admin:
- **Usuario:** `admin`
- **Contraseña:** `limarose2025`

## 🛠️ Troubleshooting

### Error: Function timeout
- **Causa:** Netlify Functions timeout después de 10 segundos
- **Solución:** Las funciones están optimizadas para ser rápidas

### Error: File not found
- **Causa:** Archivos de datos no inicializados
- **Solución:** Los archivos se crean automáticamente al primer uso

### Error: JWT invalid
- **Causa:** Variable de entorno `JWT_SECRET` no configurada
- **Solución:** Configurar en Netlify Dashboard

### Error: CORS
- **Causa:** Problema de configuración CORS
- **Solución:** Ya configurado en `netlify.toml`

## 🔄 Actualizaciones

### Deploy Automático:
- Cada `git push` a main → Deploy automático
- Build logs en Netlify Dashboard

### Deploy Manual:
- Netlify Dashboard → Deploys → Drag & Drop

## 📊 Monitoreo

### Analytics Integrado:
- Netlify Analytics (requiere plan pagado)
- Google Analytics (agregar código en HTML)

### Logs de Funciones:
- Netlify Dashboard → Functions → Logs
- Ver errores y performance

## 🎉 ¡Listo!

Tu florería ya está online con:
- ✅ Frontend responsivo
- ✅ Backend serverless completo
- ✅ Panel de administración seguro
- ✅ Sistema de autenticación
- ✅ CRUD de productos
- ✅ Upload de imágenes
- ✅ SSL automático
- ✅ Deploy automático

**🌹 ¡Lima Rose Florería está lista para vender flores online!**

---

### 📞 Soporte
Si necesitas ayuda: admin@limaroseflores.pe