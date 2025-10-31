# 🎉 DEPLOY EN NETLIFY - GUÍA PASO A PASO

## ✅ CÓDIGO SUBIDO A GITHUB
- Repositorio: https://github.com/lbaldeonqu/floreria
- Branch: main
- Commit: Deploy ready con Netlify Functions

---

## 🚀 PASOS PARA DEPLOY EN NETLIFY

### **Paso 1: Ir a Netlify**
1. Ve a https://app.netlify.com
2. Inicia sesión (o crea cuenta si no tienes)

### **Paso 2: Crear nuevo sitio**
1. Click en **"New site from Git"**
2. Selecciona **"GitHub"** 
3. Autoriza Netlify para acceder a tus repositorios
4. Busca y selecciona **"floreria"**

### **Paso 3: Configuración de deploy**
```
Repository: lbaldeonqu/floreria
Branch to deploy: main
Build command: npm install
Publish directory: .
```

⚠️ **IMPORTANTE:** Netlify detectará automáticamente `netlify.toml`

### **Paso 4: Variables de entorno**
Después del deploy, en **Site Settings → Environment Variables**, agregar:

| Variable | Valor |
|----------|-------|
| `JWT_SECRET` | `lima-rose-secret-2025-production` |
| `NODE_ENV` | `production` |

### **Paso 5: Deploy!**
1. Click **"Deploy site"**
2. Esperar 2-3 minutos
3. ¡Tu sitio estará listo!

---

## 🌐 URLs FINALES

**Sitio principal:**
- https://[nombre-random].netlify.app

**Panel de administración:**
- https://[nombre-random].netlify.app/admin-new.html

**Credenciales admin:**
- Usuario: `admin`
- Contraseña: `limarose2025`

---

## 🧪 PROBAR FUNCIONAMIENTO

### 1. Probar sitio principal
- Verificar que se cargan los productos
- Probar filtros y búsqueda
- Probar agregar al carrito

### 2. Probar panel admin
- Ir a /admin-new.html
- Hacer login con admin/limarose2025
- Agregar un producto nuevo
- Verificar que aparece en el sitio principal

### 3. APIs (opcional)
- Usar /test-api.html para probar endpoints

---

## 🎯 DOMINIO PERSONALIZADO (OPCIONAL)

Si tienes un dominio:
1. Site Settings → Domain Management
2. Add custom domain
3. Configurar DNS en tu proveedor

---

## ✅ CHECKLIST POST-DEPLOY

- [ ] Sitio carga correctamente
- [ ] Productos se muestran
- [ ] Login funciona
- [ ] Panel admin accesible
- [ ] Se pueden agregar productos
- [ ] Variables de entorno configuradas
- [ ] SSL automático activo

---

## 🆘 TROUBLESHOOTING

**Si algo no funciona:**

1. **Check build logs:**
   - Netlify Dashboard → Deploys → Ver logs

2. **Function logs:**
   - Netlify Dashboard → Functions → Ver logs

3. **Variables de entorno:**
   - Verificar que JWT_SECRET esté configurado

4. **Cache:**
   - Deploys → Clear cache and retry

---

## 🌹 ¡LIMA ROSE FLORERÍA EN VIVO!

Tu florería ya está lista para recibir pedidos online con:
- ✅ E-commerce completo
- ✅ Panel de administración
- ✅ Backend serverless
- ✅ Autenticación segura
- ✅ SSL gratuito
- ✅ CDN global

**¡Felicitaciones! 🎉**