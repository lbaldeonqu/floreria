// Función específica para eliminar productos
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
  console.log('Delete product function called');
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
    if (event.httpMethod !== 'DELETE') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Only DELETE method allowed' })
      };
    }

    // Get product ID from query parameters or body
    let productId = null;
    
    if (event.queryStringParameters && event.queryStringParameters.id) {
      productId = parseInt(event.queryStringParameters.id);
    } else if (event.body) {
      try {
        const bodyData = JSON.parse(event.body);
        productId = bodyData.id;
      } catch (e) {
        // Body parsing failed, ignore
      }
    }

    console.log('Product ID to delete:', productId);

    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Product ID is required (use ?id=123 or send in body)' })
      };
    }

    // Get current products
    const products = getProductsFromStorage();

    // Find and delete product from all categories
    let productFound = false;
    let deletedProduct = null;

    for (const category in products) {
      const categoryProducts = products[category];
      const productIndex = categoryProducts.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        deletedProduct = categoryProducts[productIndex];
        categoryProducts.splice(productIndex, 1);
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

    console.log('Product deleted successfully:', deletedProduct.name);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Product deleted successfully',
        product: deletedProduct
      })
    };

  } catch (error) {
    console.error('Delete product error:', error);
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