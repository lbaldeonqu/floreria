// Función DELETE independiente para debug - sin shared-storage
exports.handler = async (event, context) => {
  console.log('🗑️ DELETE STANDALONE function called - TESTING');
  console.log('📝 Method:', event.httpMethod);
  console.log('🔗 Path:', event.path);
  console.log('🔍 Query params:', event.queryStringParameters);
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    if (event.httpMethod !== 'DELETE') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Only DELETE method allowed' })
      };
    }

    // Get product ID from query parameters
    let productId = null;
    
    if (event.queryStringParameters && event.queryStringParameters.id) {
      productId = parseInt(event.queryStringParameters.id);
    }

    console.log('🆔 Product ID to delete:', productId);

    if (!productId || isNaN(productId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Product ID required (use ?id=123)',
          receivedParams: event.queryStringParameters
        })
      };
    }

    // Simulate deletion (for now, just return success)
    console.log('✅ SIMULATED: Product deleted successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `DELETE test successful - Product ID ${productId} would be deleted`,
        deletedId: productId,
        timestamp: new Date().toISOString(),
        status: 'TESTING - NO REAL DELETE YET'
      })
    };

  } catch (error) {
    console.error('❌ Delete function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};