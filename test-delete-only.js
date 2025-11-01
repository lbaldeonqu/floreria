// Test específico para la función delete-product
const deleteFunction = require('./netlify/functions/delete-product');

async function testDeleteFunction() {
  console.log('🧪 PROBANDO FUNCIÓN DELETE-PRODUCT\n');
  
  // Simular evento DELETE con ID válido
  const testEvent = {
    httpMethod: 'DELETE',
    queryStringParameters: { id: '2' }, // ID que existe en default products
    headers: {},
    path: '/api/delete-product'
  };

  console.log('📝 Simulando DELETE request con ID: 2');
  console.log('🔗 Query params:', testEvent.queryStringParameters);
  
  try {
    const result = await deleteFunction.handler(testEvent, {});
    
    console.log('📡 Status Code:', result.statusCode);
    console.log('📨 Headers:', result.headers);
    
    const response = JSON.parse(result.body);
    console.log('📦 Response:', response);
    
    if (result.statusCode === 200) {
      console.log('✅ DELETE funcionando correctamente');
    } else {
      console.log('❌ DELETE falló:', response.message);
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDeleteFunction();