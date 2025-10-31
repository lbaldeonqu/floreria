// Función específica para obtener estadísticas del dashboard
const sharedStorage = require('./shared-storage');

exports.handler = async (event, context) => {
  console.log('📊 Stats function called');
  console.log('📝 Method:', event.httpMethod);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Only GET method allowed' })
      };
    }

    // Get stats from shared storage
    const stats = sharedStorage.getStats();

    console.log('✅ Stats calculated successfully:', stats);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stats)
    };

  } catch (error) {
    console.error('❌ Stats calculation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error calculating stats',
        error: error.message
      })
    };
  }
};