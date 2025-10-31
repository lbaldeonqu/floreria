// Almacenamiento en memoria para Netlify (sin persistencia entre despliegues)
// En producción se podría usar FaunaDB, Supabase, o similar
let productsStorage = null;

// Helper function to get products from storage
const getProductsFromStorage = () => {
  if (!productsStorage) {
    productsStorage = getDefaultProducts();
  }
  return productsStorage;
};

// Helper function to save products to storage  
const saveProductsToStorage = (data) => {
  try {
    productsStorage = data;
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

// Default products for fallback
const getDefaultProducts = () => ({
  products: [
    {
      id: 1,
      name: "Ramo Emma",
      category: "ramos",
      price: 209.9,
      originalPrice: 249.9,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center&q=80",
      description: "Elegante ramo con rosas mixtas y flores de temporada, perfecto para expresar sentimientos especiales.",
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
      description: "Hermoso mini ramo ideal para ocasiones íntimas, diseñado con flores selectas de la mejor calidad.",
      inStock: true,
      featured: true,
      rating: 4.9,
      reviews: 87,
      tags: ["mini", "íntimo", "calidad"]
    }
  ],
  ofertas: [
    {
      id: 7,
      name: "Ramo Halloween Especial",
      category: "Ramos",
      price: 119.9,
      originalPrice: 149.9,
      discount: 30,
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      badge: "SALE",
      description: "Ramo temático especial para Halloween con flores en tonos oscuros y detalles únicos.",
      inStock: true,
      rating: 4.5,
      reviewCount: 45
    }
  ],
  vendidos: [],
  especiales: []
});

exports.handler = async (event, context) => {
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
    const { httpMethod, path } = event;

    if (httpMethod === 'GET') {
      // Get all products from memory storage
      const products = getProductsFromStorage();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }

    if (httpMethod === 'POST') {
      // Add new product
      const productData = JSON.parse(event.body);
      let products = getProductsFromStorage();

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
      if (!products[category]) {
        products[category] = [];
      }
      products[category].push(newProduct);

      // Save to storage
      if (saveProductsToStorage(products)) {
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ 
            message: 'Product created successfully', 
            product: newProduct 
          })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: 'Failed to save product' })
        };
      }
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
        error: error.message 
      })
    };
  }
};