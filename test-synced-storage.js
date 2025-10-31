// Test completo del sistema de almacenamiento sincronizado
const productsFunction = require('./netlify/functions/products');
const statsFunction = require('./netlify/functions/stats');
const updateFunction = require('./netlify/functions/update-product');
const deleteFunction = require('./netlify/functions/delete-product');

async function testSyncedStorage() {
  console.log('🧪 INICIANDO TEST DE ALMACENAMIENTO SINCRONIZADO\n');
  
  // 1. Verificar productos iniciales
  console.log('1️⃣ Obteniendo productos iniciales...');
  const initialProducts = await productsFunction.handler({
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: null
  });
  
  const initialData = JSON.parse(initialProducts.body);
  console.log('📦 Productos iniciales:', Object.values(initialData).flat().length);
  
  // 2. Obtener estadísticas iniciales
  console.log('\n2️⃣ Obteniendo estadísticas iniciales...');
  const initialStats = await statsFunction.handler({
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: null
  });
  
  const initialStatsData = JSON.parse(initialStats.body);
  console.log('📊 Stats iniciales:', initialStatsData);
  
  // 3. Agregar un producto nuevo
  console.log('\n3️⃣ Agregando producto nuevo...');
  const newProduct = {
    name: "Ramo Test Sincronización",
    category: "ramos",
    price: 199.99,
    description: "Producto de prueba para verificar sincronización",
    filter: "products",
    featured: true
  };
  
  const addResult = await productsFunction.handler({
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newProduct)
  });
  
  const addedProduct = JSON.parse(addResult.body);
  console.log('✅ Producto agregado:', addedProduct.product.name, 'ID:', addedProduct.product.id);
  
  // 4. Verificar que el producto aparece en GET
  console.log('\n4️⃣ Verificando que el producto aparece en GET...');
  const updatedProducts = await productsFunction.handler({
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: null
  });
  
  const updatedData = JSON.parse(updatedProducts.body);
  const totalProducts = Object.values(updatedData).flat().length;
  console.log('📦 Total productos después de agregar:', totalProducts);
  
  // 5. Verificar que las estadísticas se actualizaron
  console.log('\n5️⃣ Verificando estadísticas actualizadas...');
  const updatedStats = await statsFunction.handler({
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: null
  });
  
  const updatedStatsData = JSON.parse(updatedStats.body);
  console.log('📊 Stats actualizadas:', updatedStatsData);
  
  // 6. Editar el producto
  console.log('\n6️⃣ Editando el producto...');
  const editResult = await updateFunction.handler({
    httpMethod: 'PUT',
    queryStringParameters: { id: addedProduct.product.id.toString() },
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: "Ramo Test EDITADO",
      price: 299.99
    })
  });
  
  const editedProduct = JSON.parse(editResult.body);
  console.log('✏️ Producto editado:', editedProduct.product.name, 'Nuevo precio:', editedProduct.product.price);
  
  // 7. Eliminar el producto
  console.log('\n7️⃣ Eliminando el producto...');
  const deleteResult = await deleteFunction.handler({
    httpMethod: 'DELETE',
    queryStringParameters: { id: addedProduct.product.id.toString() },
    headers: {}
  });
  
  const deleteResponse = JSON.parse(deleteResult.body);
  console.log('🗑️ Producto eliminado:', deleteResponse.message);
  
  // 8. Verificar estadísticas finales
  console.log('\n8️⃣ Verificando estadísticas finales...');
  const finalStats = await statsFunction.handler({
    httpMethod: 'GET',
    headers: {},
    queryStringParameters: null
  });
  
  const finalStatsData = JSON.parse(finalStats.body);
  console.log('📊 Stats finales:', finalStatsData);
  
  // 9. Resumen
  console.log('\n🎯 RESUMEN DEL TEST:');
  console.log('- Productos iniciales:', initialStatsData.totalProducts);
  console.log('- Después de agregar:', updatedStatsData.totalProducts);
  console.log('- Después de eliminar:', finalStatsData.totalProducts);
  console.log('- ✅ Sincronización:', 
    initialStatsData.totalProducts === finalStatsData.totalProducts ? 'CORRECTA' : 'FALLIDA'
  );
}

// Ejecutar test
testSyncedStorage().catch(console.error);