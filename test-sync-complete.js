// Test completo del sistema sincronizado
const productsFunction = require('./netlify/functions/products');
const statsFunction = require('./netlify/functions/stats');
const updateFunction = require('./netlify/functions/update-product');
const deleteFunction = require('./netlify/functions/delete-product');

const context = {};

async function runCompleteTest() {
  console.log('🧪 INICIANDO PRUEBA COMPLETA DEL SISTEMA SINCRONIZADO\n');

  try {
    // 1. Obtener estadísticas iniciales
    console.log('📊 1. Obteniendo estadísticas iniciales...');
    const initialStatsResponse = await statsFunction.handler({
      httpMethod: 'GET'
    }, context);
    
    const initialStats = JSON.parse(initialStatsResponse.body);
    console.log('Estadísticas iniciales:', initialStats);

    // 2. Agregar un producto nuevo
    console.log('\n➕ 2. Agregando producto nuevo...');
    const newProductData = {
      name: "Ramo Test Sincronizado",
      category: "ramos",
      price: 199.9,
      description: "Producto de prueba para sincronización",
      featured: true,
      filter: "products"
    };

    const addResponse = await productsFunction.handler({
      httpMethod: 'POST',
      body: JSON.stringify(newProductData)
    }, context);

    console.log('Respuesta agregar:', addResponse.statusCode);
    const addedProduct = JSON.parse(addResponse.body);
    console.log('Producto agregado:', addedProduct.product.name, 'ID:', addedProduct.product.id);

    // 3. Verificar que las estadísticas se actualicen
    console.log('\n📈 3. Verificando estadísticas actualizadas...');
    const updatedStatsResponse = await statsFunction.handler({
      httpMethod: 'GET'
    }, context);
    
    const updatedStats = JSON.parse(updatedStatsResponse.body);
    console.log('Estadísticas después de agregar:', updatedStats);
    
    const expectedProducts = initialStats.totalProducts + 1;
    const expectedFeatured = initialStats.featuredProducts + 1;
    
    console.log(`✅ Productos: ${updatedStats.totalProducts} (esperado: ${expectedProducts})`);
    console.log(`✅ Destacados: ${updatedStats.featuredProducts} (esperado: ${expectedFeatured})`);

    // 4. Editar el producto
    console.log('\n✏️ 4. Editando producto...');
    const productId = addedProduct.product.id;
    const updateData = {
      name: "Ramo Test Editado",
      price: 249.9,
      featured: false
    };

    const updateResponse = await updateFunction.handler({
      httpMethod: 'PUT',
      queryStringParameters: { id: productId.toString() },
      body: JSON.stringify(updateData)
    }, context);

    console.log('Respuesta editar:', updateResponse.statusCode);
    if (updateResponse.statusCode === 200) {
      const updatedProduct = JSON.parse(updateResponse.body);
      console.log('Producto editado:', updatedProduct.product.name);
    }

    // 5. Verificar estadísticas después de editar
    console.log('\n📊 5. Verificando estadísticas después de editar...');
    const statsAfterEditResponse = await statsFunction.handler({
      httpMethod: 'GET'
    }, context);
    
    const statsAfterEdit = JSON.parse(statsAfterEditResponse.body);
    console.log('Estadísticas después de editar:', statsAfterEdit);

    // 6. Eliminar el producto
    console.log('\n🗑️ 6. Eliminando producto...');
    const deleteResponse = await deleteFunction.handler({
      httpMethod: 'DELETE',
      queryStringParameters: { id: productId.toString() }
    }, context);

    console.log('Respuesta eliminar:', deleteResponse.statusCode);
    
    // 7. Verificar estadísticas finales
    console.log('\n📊 7. Verificando estadísticas finales...');
    const finalStatsResponse = await statsFunction.handler({
      httpMethod: 'GET'
    }, context);
    
    const finalStats = JSON.parse(finalStatsResponse.body);
    console.log('Estadísticas finales:', finalStats);
    
    console.log(`✅ Productos finales: ${finalStats.totalProducts} (esperado: ${initialStats.totalProducts})`);
    console.log(`✅ Destacados finales: ${finalStats.featuredProducts} (esperado: ${initialStats.featuredProducts})`);

    // Verificar que regresó al estado inicial
    const syncSuccess = (
      finalStats.totalProducts === initialStats.totalProducts &&
      finalStats.featuredProducts === initialStats.featuredProducts
    );

    console.log('\n🎉 RESULTADO FINAL:');
    if (syncSuccess) {
      console.log('✅ SINCRONIZACIÓN EXITOSA - Todas las funciones están sincronizadas');
    } else {
      console.log('❌ SINCRONIZACIÓN FALLIDA - Las estadísticas no coinciden');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

runCompleteTest();