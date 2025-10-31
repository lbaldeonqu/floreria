#!/bin/bash
# Script de preparación para deploy en Netlify

echo "🌹 Preparando Lima Rose Florería para Netlify..."

# Asegurar que las carpetas existen
mkdir -p data
mkdir -p uploads

# Crear archivos de datos si no existen
if [ ! -f "data/users.json" ]; then
    echo "Creando archivo de usuarios por defecto..."
    echo '[]' > data/users.json
fi

if [ ! -f "data/products.json" ]; then
    echo "Creando archivo de productos por defecto..."
    echo '{"products":[],"ofertas":[],"vendidos":[],"especiales":[]}' > data/products.json
fi

echo "✅ Preparación completada"