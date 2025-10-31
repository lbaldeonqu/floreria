// Función específica para obtener estadísticas del dashboard
const sharedStorage = require('./shared-storage');

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
    },
    {
      id: 2,
      name: "Arreglo Primaveral",
      category: "arreglos",
      price: 159.9,
      originalPrice: 189.9,
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop&crop=center&q=80",
      description: "Hermoso arreglo floral con flores de temporada.",
      inStock: true,
      featured: false,
      rating: 4.6,
      reviews: 89,
      tags: ["colorido", "fresco", "natural"]
    },
    {
      id: 3,
      name: "Corona Funeral",
      category: "funerarios",
      price: 299.9,
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=300&h=300&fit=crop&crop=center&q=80",
      description: "Corona elegante para servicios funerarios.",
      inStock: true,
      featured: false,
      rating: 4.9,
      reviews: 45,
      tags: ["respeto", "elegante", "tradicional"]
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

// Calcular estadísticas
const calculateStats = (products) => {
  console.log('📊 Calculating stats for products structure:', Object.keys(products));
  
  let totalProducts = 0;
  let featuredProducts = 0;
  let totalCategories = 0;
  
  // Contar productos en todas las categorías
  Object.keys(products).forEach(category => {
    const categoryProducts = products[category];
    if (Array.isArray(categoryProducts)) {
      totalProducts += categoryProducts.length;
      
      // Contar productos destacados
      featuredProducts += categoryProducts.filter(p => p.featured === true).length;
      
      // Contar categorías que tienen productos
      if (categoryProducts.length > 0) {
        totalCategories++;
      }
    }
  });
  
  const stats = {
    totalProducts,
    totalCategories,
    featuredProducts
  };
  
  console.log('📈 Calculated stats:', stats);
  return stats;
};

exports.handler = async (event, context) => {
  console.log('📊 Stats function called');
  console.log('📝 Method:', event.httpMethod);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Only GET method allowed' })
      };
    }

    // Get stats from shared storage
    const stats = sharedStorage.getStats();

    console.log('✅ Stats calculated successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stats)
    };

  } catch (error) {
    console.error('❌ Stats calculation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error calculating stats',
        error: error.message
      })
    };
  }
};