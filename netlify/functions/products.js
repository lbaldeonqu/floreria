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

    if (event.httpMethod === 'DELETE') {
      console.log('🗑️ DELETE request in products.js');
      
      // Get product ID from query parameters or path
      let productId = null;
      
      if (event.queryStringParameters && event.queryStringParameters.id) {
        productId = parseInt(event.queryStringParameters.id);
      } else if (event.path) {
        const pathParts = event.path.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (!isNaN(lastPart)) {
          productId = parseInt(lastPart);
        }
      }

      console.log('🆔 Product ID to delete:', productId);

      if (!productId || isNaN(productId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            message: 'Product ID is required (use ?id=123 or /products/123)',
            queryParams: event.queryStringParameters,
            path: event.path
          })
        };
      }

      // Delete using shared storage
      const deleted = sharedStorage.deleteProduct(productId);

      if (!deleted) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            message: 'Product not found',
            searchedId: productId
          })
        };
      }

      console.log('✅ Product deleted successfully via products.js');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Product deleted successfully',
          deletedId: productId
        })
      };
    }

    if (event.httpMethod === 'PUT') {
      console.log('✏️ PUT request in products.js');
      
      // Get product ID from query parameters or path
      let productId = null;
      
      if (event.queryStringParameters && event.queryStringParameters.id) {
        productId = parseInt(event.queryStringParameters.id);
      } else if (event.path) {
        const pathParts = event.path.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (!isNaN(lastPart)) {
          productId = parseInt(lastPart);
        }
      }

      console.log('🆔 Product ID to update:', productId);

      if (!productId || isNaN(productId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            message: 'Product ID is required (use ?id=123 or /products/123)',
            queryParams: event.queryStringParameters,
            path: event.path
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
        console.log('✅ Parsed update data:', productData);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            message: 'Invalid JSON in request body',
            parseError: parseError.message
          })
        };
      }

      // Update using shared storage
      const updatedProduct = sharedStorage.updateProduct(productId, productData);

      if (!updatedProduct) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            message: 'Product not found',
            searchedId: productId
          })
        };
      }

      console.log('✅ Product updated successfully via products.js');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Product updated successfully',
          product: updatedProduct
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