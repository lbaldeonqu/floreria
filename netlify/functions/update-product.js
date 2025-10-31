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

    // Get current products
    const products = getProductsFromStorage();
    console.log('📊 Available categories:', Object.keys(products));
    console.log('📦 Total products in each category:');
    Object.keys(products).forEach(cat => {
      console.log(`   ${cat}: ${products[cat].length} products`);
    });

    // Find and update product in all categories
    let productFound = false;
    let updatedProduct = null;
    let searchDetails = [];

    for (const category in products) {
      const categoryProducts = products[category];
      console.log(`🔍 Searching in category '${category}' for ID ${productId}`);
      
      categoryProducts.forEach((p, index) => {
        searchDetails.push(`${category}[${index}]: ID=${p.id}, name="${p.name}"`);
      });
      
      const productIndex = categoryProducts.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        console.log(`✅ Found product at ${category}[${productIndex}]`);
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
      console.log('❌ Product not found! Search details:');
      searchDetails.forEach(detail => console.log(`   ${detail}`));
    }

    if (!productFound) {
      console.log('❌ Product not found in any category');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          message: 'Product not found',
          searchedId: productId,
          availableProducts: searchDetails
        })
      };
    }

    // Save updated products
    const saveResult = saveProductsToStorage(products);
    console.log('💾 Save result:', saveResult);

    console.log('✅ Product updated successfully:', updatedProduct.name);
    console.log('🎯 Updated product data:', JSON.stringify(updatedProduct, null, 2));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Product updated successfully',
        product: updatedProduct,
        debug: {
          foundInCategory: Object.keys(products).find(cat => 
            products[cat].some(p => p.id === productId)
          ),
          totalCategories: Object.keys(products).length
        }
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