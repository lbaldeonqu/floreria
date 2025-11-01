// Almacenamiento global compartido para todas las funciones de Netlify
// Este módulo será importado por todas las funciones para mantener sincronización

// Storage global para todas las funciones
let globalProductsStorage = null;

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

// Función para obtener el siguiente ID disponible
const getNextId = (products) => {
  let maxId = 0;
  Object.values(products).forEach(categoryProducts => {
    if (Array.isArray(categoryProducts)) {
      categoryProducts.forEach(product => {
        if (product.id > maxId) {
          maxId = product.id;
        }
      });
    }
  });
  return maxId + 1;
};

// Get products from storage
const getProductsFromStorage = () => {
  if (!globalProductsStorage) {
    console.log('🔄 Inicializando storage global con productos por defecto');
    globalProductsStorage = getDefaultProducts();
  }
  return globalProductsStorage;
};

// Save products to storage
const saveProductsToStorage = (data) => {
  try {
    globalProductsStorage = data;
    console.log('💾 Storage global actualizado exitosamente');
    
    // Log para debugging
    const totalProducts = Object.values(data).flat().length;
    console.log(`📊 Total productos en storage: ${totalProducts}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error guardando en storage global:', error);
    return false;
  }
};

// Función para agregar un producto
const addProduct = (productData, category = 'products') => {
  const products = getProductsFromStorage();
  const newId = getNextId(products);
  
  const newProduct = {
    ...productData,
    id: newId,
    created_at: new Date().toISOString()
  };
  
  if (!products[category]) {
    products[category] = [];
  }
  
  products[category].push(newProduct);
  saveProductsToStorage(products);
  
  console.log(`✅ Producto agregado: ID ${newId}, Sección: ${category}`);
  return newProduct;
};

// Función para encontrar un producto por ID
const findProductById = (productId) => {
  const products = getProductsFromStorage();
  
  for (const category in products) {
    const categoryProducts = products[category];
    if (Array.isArray(categoryProducts)) {
      const product = categoryProducts.find(p => p.id === productId);
      if (product) {
        return { product, category, products };
      }
    }
  }
  
  return null;
};

// Función para actualizar un producto
const updateProduct = (productId, updates) => {
  const result = findProductById(productId);
  
  if (!result) {
    return null;
  }
  
  const { product, category, products } = result;
  const categoryProducts = products[category];
  const productIndex = categoryProducts.findIndex(p => p.id === productId);
  
  // Filtrar valores undefined/null para preservar datos existentes
  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined && updates[key] !== null && updates[key] !== '') {
      filteredUpdates[key] = updates[key];
    }
  });
  
  const updatedProduct = {
    ...product,
    ...filteredUpdates,
    id: productId,
    updated_at: new Date().toISOString()
  };
  
  console.log(`🔄 Actualizando producto ${productId}:`, filteredUpdates);
  console.log(`🖼️ Imagen preservada:`, updatedProduct.image ? 'SÍ' : 'NO');
  
  categoryProducts[productIndex] = updatedProduct;
  saveProductsToStorage(products);
  
  console.log(`✅ Producto actualizado: ID ${productId}`);
  return updatedProduct;
};

// Función para eliminar un producto
const deleteProduct = (productId) => {
  const result = findProductById(productId);
  
  if (!result) {
    return false;
  }
  
  const { category, products } = result;
  const categoryProducts = products[category];
  const productIndex = categoryProducts.findIndex(p => p.id === productId);
  
  categoryProducts.splice(productIndex, 1);
  saveProductsToStorage(products);
  
  console.log(`✅ Producto eliminado: ID ${productId}`);
  return true;
};

// Función para obtener estadísticas
const getStats = () => {
  const products = getProductsFromStorage();
  
  let totalProducts = 0;
  let featuredProducts = 0;
  let totalCategories = 0;
  
  Object.keys(products).forEach(category => {
    const categoryProducts = products[category];
    if (Array.isArray(categoryProducts)) {
      totalProducts += categoryProducts.length;
      featuredProducts += categoryProducts.filter(p => p.featured === true).length;
      
      if (categoryProducts.length > 0) {
        totalCategories++;
      }
    }
  });
  
  return {
    totalProducts,
    totalCategories,
    featuredProducts
  };
};

module.exports = {
  getProductsFromStorage,
  saveProductsToStorage,
  addProduct,
  findProductById,
  updateProduct,
  deleteProduct,
  getStats,
  getNextId
};