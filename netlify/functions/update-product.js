// Función específica para editar productos
const fs = require('fs');

// Almacenamiento en memoria para Netlify
let productsStorage = null;

// Default products para inicializar
const getDefaultProducts = () => ({
  products: [
    {
      id: 1,
      name: "Ramo Emma",
      category: "ramos",
      price: 209.9,
      originalPrice: 249.9,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center&q=80",
      description: "Elegante ramo con rosas mixtas y flores de temporada.",
      inStock: true,
      featured: true,
      rating: 4.8,
      reviews: 124,
      tags: ["romántico", "elegante", "premium"]
    }
  ],
  ofertas: [],
  vendidos: [],
  especiales: []
});

// Get products from storage
const getProductsFromStorage = () => {
  if (!productsStorage) {
    productsStorage = getDefaultProducts();
  }
  return productsStorage;
};

// Save products to storage
const saveProductsToStorage = (data) => {
  try {
    productsStorage = data;
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

exports.handler = async (event, context) => {
  console.log('Update product function called');
  console.log('Method:', event.httpMethod);
  console.log('Query params:', event.queryStringParameters);
  console.log('Body:', event.body);
  
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

    console.log('Product ID to update:', productId);

    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Product ID is required (use ?id=123)' })
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
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid JSON in request body' })
      };
    }

    // Get current products
    const products = getProductsFromStorage();

    // Find and update product in all categories
    let productFound = false;
    let updatedProduct = null;

    for (const category in products) {
      const categoryProducts = products[category];
      const productIndex = categoryProducts.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        updatedProduct = {
          ...categoryProducts[productIndex],
          ...productData,
          id: productId,
          updated_at: new Date().toISOString()
        };
        categoryProducts[productIndex] = updatedProduct;
        productFound = true;
        break;
      }
    }

    if (!productFound) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Product not found' })
      };
    }

    // Save updated products
    saveProductsToStorage(products);

    console.log('Product updated successfully:', updatedProduct.name);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Product updated successfully',
        product: updatedProduct
      })
    };

  } catch (error) {
    console.error('Update product error:', error);
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