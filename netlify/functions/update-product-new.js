// Función específica para editar productos
const sharedStorage = require('./shared-storage');

exports.handler = async (event, context) => {
  console.log('🔄 Update product function called');
  console.log('📝 Method:', event.httpMethod);
  console.log('🔗 Full URL Path:', event.path);
  console.log('🔍 Query params:', event.queryStringParameters);
  console.log('📦 Body length:', event.body ? event.body.length : 'No body');
  console.log('🎯 Raw body:', event.body);
  
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
    if (event.httpMethod !== 'PUT') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Only PUT method allowed' })
      };
    }

    // Get product ID from query parameters
    let productId = null;
    
    if (event.queryStringParameters && event.queryStringParameters.id) {
      productId = parseInt(event.queryStringParameters.id);
    }

    console.log('🆔 Product ID to update:', productId);
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

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    let productData;
    try {
      productData = JSON.parse(event.body);
      console.log('✅ Parsed product data:', JSON.stringify(productData, null, 2));
    } catch (parseError) {
      console.log('❌ JSON parse error:', parseError.message);
      console.log('📝 Raw body was:', event.body);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Invalid JSON in request body',
          parseError: parseError.message,
          rawBody: event.body
        })
      };
    }

    // Update product using shared storage
    const updatedProduct = sharedStorage.updateProduct(productId, productData);

    if (!updatedProduct) {
      console.log('❌ Product not found in any category');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          message: 'Product not found',
          searchedId: productId
        })
      };
    }

    console.log('✅ Product updated successfully:', updatedProduct.name);
    console.log('🎯 Updated product data:', JSON.stringify(updatedProduct, null, 2));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Product updated successfully',
        product: updatedProduct
      })
    };

  } catch (error) {
    console.error('❌ Update product error:', error);
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