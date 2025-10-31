// Productos predeterminados para Netlify Functions
const DEFAULT_PRODUCTS = {
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
    },
    {
      id: 2,
      name: "Mini Ramo Catalina", 
      category: "ramos",
      price: 119.9,
      originalPrice: 149.9,
      image: "https://images.unsplash.com/photo-1563582420-f7b9e5c5f8c2?w=300&h=300&fit=crop&crop=center&q=80",
      description: "Hermoso mini ramo ideal para ocasiones íntimas.",
      inStock: true,
      featured: true,
      rating: 4.9,
      reviews: 87,
      tags: ["mini", "íntimo", "calidad"]
    },
    {
      id: 3,
      name: "Ramo Nerea",
      category: "ramos", 
      price: 209.9,
      originalPrice: 219.9,
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop&crop=center&q=80",
      description: "Ramo clásico con combinación perfecta de colores.",
      inStock: true,
      featured: false,
      rating: 4.7,
      reviews: 92,
      tags: ["clásico", "elegante", "sofisticado"]
    }
  ],
  ofertas: [
    {
      id: 4,
      name: "Ramo Halloween Especial",
      category: "ramos",
      price: 119.9,
      originalPrice: 149.9,
      discount: 30,
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      badge: "SALE",
      description: "Ramo temático especial para Halloween.",
      inStock: true,
      rating: 4.5,
      reviewCount: 45
    }
  ],
  vendidos: [],
  especiales: []
};

// Almacenamiento global en memoria (se resetea con cada deploy)
global.productsStore = global.productsStore || JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));

exports.handler = async (event, context) => {
  console.log('Products function called:', event.httpMethod, event.path);
  
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
      console.log('Returning products from memory store');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(global.productsStore)
      };
    }

    if (event.httpMethod === 'POST') {
      console.log('Adding new product');
      
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Request body is required' })
        };
      }

      let productData;
      
      // Handle both JSON and FormData
      try {
        // Check if it's JSON
        if (event.headers['content-type'] && event.headers['content-type'].includes('application/json')) {
          productData = JSON.parse(event.body);
        } else {
          // Handle FormData - for now, assume it's JSON in body
          // In real Netlify deployment, FormData would need multipart parsing
          productData = JSON.parse(event.body);
        }
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid request body format' })
        };
      }
      
      console.log('Product data received:', productData);

      // Generate new ID
      const newId = Date.now();
      const newProduct = {
        ...productData,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to appropriate category
      const category = productData.filter || 'products';
      if (!global.productsStore[category]) {
        global.productsStore[category] = [];
      }
      
      global.productsStore[category].push(newProduct);
      console.log('Product added successfully');

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Product created successfully',
          product: newProduct
        })
      };
    }

    if (event.httpMethod === 'PUT') {
      console.log('Updating product');
      console.log('Event path:', event.path);
      console.log('Event queryStringParameters:', event.queryStringParameters);
      
      // Extract product ID from path - Netlify Functions path handling
      let productId = null;
      
      // Try different ways to get the product ID
      if (event.path) {
        const pathParts = event.path.split('/');
        productId = parseInt(pathParts[pathParts.length - 1]);
      }
      
      // Fallback: try to get from query parameters
      if (!productId && event.queryStringParameters && event.queryStringParameters.id) {
        productId = parseInt(event.queryStringParameters.id);
      }
      
      console.log('Extracted product ID:', productId);
      
      if (!productId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Product ID is required' })
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
          body: JSON.stringify({ message: 'Invalid request body format' })
        };
      }

      // Find and update product in all categories
      let productFound = false;
      let updatedProduct = null;

      for (const category in global.productsStore) {
        const categoryProducts = global.productsStore[category];
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

      console.log('Product updated successfully');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Product updated successfully',
          product: updatedProduct
        })
      };
    }

    if (event.httpMethod === 'DELETE') {
      console.log('Deleting product');
      console.log('Event path:', event.path);
      console.log('Event queryStringParameters:', event.queryStringParameters);
      
      // Extract product ID from path - Netlify Functions path handling
      let productId = null;
      
      // Try different ways to get the product ID
      if (event.path) {
        const pathParts = event.path.split('/');
        productId = parseInt(pathParts[pathParts.length - 1]);
      }
      
      // Fallback: try to get from query parameters
      if (!productId && event.queryStringParameters && event.queryStringParameters.id) {
        productId = parseInt(event.queryStringParameters.id);
      }
      
      console.log('Extracted product ID:', productId);
      
      if (!productId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Product ID is required' })
        };
      }

      // Find and delete product from all categories
      let productFound = false;
      let deletedProduct = null;

      for (const category in global.productsStore) {
        const categoryProducts = global.productsStore[category];
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

      console.log('Product deleted successfully');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Product deleted successfully',
          product: deletedProduct
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Products function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};