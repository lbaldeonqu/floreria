// Test de las funciones separadas de Netlify
async function testSeparateFunctions() {
  console.log('🧪 Testing separate Netlify Functions...\n');

  try {
    // Test delete function
    console.log('1️⃣ Testing delete-product function');
    const { handler: deleteHandler } = require('./netlify/functions/delete-product.js');
    
    const deleteEvent = {
      httpMethod: 'DELETE',
      queryStringParameters: { id: '123' },
      headers: { 'content-type': 'application/json' }
    };
    
    const deleteResult = await deleteHandler(deleteEvent, {});
    console.log('Delete Status:', deleteResult.statusCode);
    console.log('Delete Response:', JSON.parse(deleteResult.body));

    // Test update function  
    console.log('\n2️⃣ Testing update-product function');
    const { handler: updateHandler } = require('./netlify/functions/update-product.js');
    
    const updateEvent = {
      httpMethod: 'PUT',
      queryStringParameters: { id: '1' },
      body: JSON.stringify({
        name: 'Producto Actualizado',
        price: 199.99
      }),
      headers: { 'content-type': 'application/json' }
    };
    
    const updateResult = await updateHandler(updateEvent, {});
    console.log('Update Status:', updateResult.statusCode);
    console.log('Update Response:', JSON.parse(updateResult.body));

    console.log('\n✅ Separate functions tests completed!');

  } catch (error) {
    console.error('❌ Error in separate functions tests:', error);
  }
}

testSeparateFunctions();