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