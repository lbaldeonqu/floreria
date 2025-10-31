// Test para debuggear la función de actualización
const updateProduct = require('./netlify/functions/update-product');

// Simulamos un evento de Netlify
const testUpdateEvent = {
  httpMethod: 'PUT',
  queryStringParameters: { id: '1' },
  body: JSON.stringify({
    name: "Ramo Emma Actualizado",
    price: 299.9,
    category: "ramos",
    description: "Descripción actualizada para probar"
  }),
  headers: {}
};

const context = {};

console.log('🧪 Probando actualización de producto...\n');

updateProduct.handler(testUpdateEvent, context)
  .then(response => {
    console.log('✅ Respuesta recibida:');
    console.log('Status Code:', response.statusCode);
    console.log('Headers:', response.headers);
    
    try {
      const body = JSON.parse(response.body);
      console.log('Body:', JSON.stringify(body, null, 2));
    } catch (e) {
      console.log('Raw Body:', response.body);
    }
  })
  .catch(error => {
    console.error('❌ Error durante la prueba:', error);
  });