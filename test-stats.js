// Test para la función de estadísticas
const statsFunction = require('./netlify/functions/stats');

// Simulamos un evento GET para stats
const testStatsEvent = {
  httpMethod: 'GET',
  headers: {},
  queryStringParameters: null
};

const context = {};

console.log('📊 Probando función de estadísticas...\n');

statsFunction.handler(testStatsEvent, context)
  .then(response => {
    console.log('✅ Respuesta de stats:');
    console.log('Status Code:', response.statusCode);
    console.log('Headers:', response.headers);
    
    try {
      const body = JSON.parse(response.body);
      console.log('Stats Body:', JSON.stringify(body, null, 2));
    } catch (e) {
      console.log('Raw Body:', response.body);
    }
  })
  .catch(error => {
    console.error('❌ Error en test de stats:', error);
  });