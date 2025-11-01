// Función específica para eliminar productos
const sharedStorage = require('./shared-storage');

exports.handler = async (event, context) => {
  console.log('🗑️ Delete product function called - v2.0');
  console.log('📝 Method:', event.httpMethod);
  console.log('🔗 Full URL Path:', event.path);
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
    console.log('🔢 Product ID type:', typeof productId);

    if (!productId || isNaN(productId)) {
      console.log('❌ Invalid product ID provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Product ID is required and must be a number (use ?id=123)',
          providedId: productId,
          queryParams: event.queryStringParameters
        })
      };
    }

    // Delete product using shared storage
    const deleted = sharedStorage.deleteProduct(productId);

    if (!deleted) {
      console.log('❌ Product not found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          message: 'Product not found',
          searchedId: productId
        })
      };
    }

    console.log('✅ Product deleted successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Product deleted successfully',
        deletedId: productId
      })
    };

  } catch (error) {
    console.error('❌ Delete product error:', error);
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