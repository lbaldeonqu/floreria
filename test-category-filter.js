// Test para verificar filtrado por categorías
const sharedStorage = require('./netlify/functions/shared-storage');

console.log('🧪 PROBANDO FILTRADO POR CATEGORÍAS\n');

// 1. Obtener productos iniciales
const initialProducts = sharedStorage.getProductsFromStorage();
console.log('📦 Productos iniciales por sección:');
Object.keys(initialProducts).forEach(section => {
  console.log(`  ${section}: ${initialProducts[section].length} productos`);
});

// 2. Agregar un producto nuevo con categoría específica
const newProduct = {
  name: "Ramo Test Categoría",
  category: "ramos",
  price: 150.00,
  description: "Producto de prueba para verificar filtrado por categoría",
  filter: "products", // Sección donde se almacena
  featured: false
};

console.log('\n➕ Agregando producto:', newProduct.name);
console.log('🏷️ Categoría:', newProduct.category);
console.log('📂 Sección almacenamiento:', newProduct.filter);

const addedProduct = sharedStorage.addProduct(newProduct, newProduct.filter);

// 3. Verificar que se agregó correctamente
const updatedProducts = sharedStorage.getProductsFromStorage();
console.log('\n📦 Productos después de agregar:');
Object.keys(updatedProducts).forEach(section => {
  console.log(`  ${section}: ${updatedProducts[section].length} productos`);
});

// 4. Simular filtrado por categoría "ramos"
console.log('\n🔍 Simulando filtrado por categoría "ramos":');
const allProducts = Object.values(updatedProducts).flat();
const ramosProducts = allProducts.filter(product => 
  product.category.toLowerCase() === 'ramos'
);

console.log('🌸 Productos en categoría "ramos":');
ramosProducts.forEach(p => {
  console.log(`  - ${p.name} (ID: ${p.id}) - Categoría: ${p.category}`);
});

// 5. Verificar que el nuevo producto aparezca
const newProductInFilter = ramosProducts.find(p => p.id === addedProduct.id);
if (newProductInFilter) {
  console.log('✅ ¡ÉXITO! El producto nuevo aparece en el filtrado por categoría');
} else {
  console.log('❌ ERROR: El producto nuevo NO aparece en el filtrado por categoría');
}