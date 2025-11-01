// Test para verificar actualización con imagen preservada
const sharedStorage = require('./netlify/functions/shared-storage');

console.log('🧪 PROBANDO ACTUALIZACIÓN CON IMAGEN PRESERVADA\n');

// 1. Obtener productos iniciales
const products = sharedStorage.getProductsFromStorage();
console.log('📦 Productos iniciales:', Object.values(products).flat().length);

// 2. Encontrar un producto con imagen
const productWithImage = Object.values(products).flat().find(p => p.image);
if (productWithImage) {
    console.log('🖼️ Producto con imagen encontrado:', productWithImage.name, 'ID:', productWithImage.id);
    console.log('🔗 URL imagen original:', productWithImage.image?.substring(0, 50) + '...');
    
    // 3. Actualizar solo el nombre (sin enviar imagen)
    const updateData = {
        name: productWithImage.name + ' - ACTUALIZADO',
        price: productWithImage.price + 10
        // Nota: NO enviamos image, debería preservarse
    };
    
    console.log('\n🔄 Actualizando con datos:', updateData);
    
    const updatedProduct = sharedStorage.updateProduct(productWithImage.id, updateData);
    
    if (updatedProduct) {
        console.log('✅ Producto actualizado exitosamente');
        console.log('📝 Nuevo nombre:', updatedProduct.name);
        console.log('💰 Nuevo precio:', updatedProduct.price);
        console.log('🖼️ Imagen preservada:', updatedProduct.image ? 'SÍ ✅' : 'NO ❌');
        
        if (updatedProduct.image === productWithImage.image) {
            console.log('🎉 ¡PERFECTO! La imagen se preservó correctamente');
        } else {
            console.log('❌ ERROR: La imagen no se preservó');
        }
    } else {
        console.log('❌ Error actualizando producto');
    }
} else {
    console.log('❌ No se encontró producto con imagen para probar');
}