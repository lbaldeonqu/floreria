// Función principal para manejar productos
const jwt = require('jsonwebtoken');
const sharedStorage = require('./shared-storage');

exports.handler = async (event, context) => {
  console.log('🔄 Products function called:', event.httpMethod, event.path);
  
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
    if (event.httpMethod === 'GET') {
      console.log('📦 Returning products from shared storage');
      const products = sharedStorage.getProductsFromStorage();
      console.log('📊 Total products loaded:', Object.values(products).flat().length);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }

    if (event.httpMethod === 'POST') {
      console.log('➕ Adding new product');
      
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
      } catch (parseError) {
        console.error('❌ Error parsing request body:', parseError);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid request body format' })
        };
      }
      
      console.log('📝 Product data received:', productData);

      // Add product using shared storage
      const category = productData.filter || 'products';
      const newProduct = sharedStorage.addProduct(productData, category);

      console.log('✅ Product added successfully with ID:', newProduct.id);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Product created successfully',
          product: newProduct
        })
      };
    }

    // PUT y DELETE methods redirected to their specific functions
    if (event.httpMethod === 'PUT' || event.httpMethod === 'DELETE') {
      const operation = event.httpMethod === 'PUT' ? 'update' : 'delete';
      return {
        statusCode: 301,
        headers: {
          ...headers,
          'Location': `/api/${operation}-product`
        },
        body: JSON.stringify({ 
          message: `Please use /api/${operation}-product endpoint for ${operation} operations`
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('❌ Products function error:', error);
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