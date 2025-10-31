const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'lima-rose-secret-key-2025';

// Data file paths
const USERS_FILE = './data/users.json';
const PRODUCTS_FILE = './data/products.json';

// Ensure data directory exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

// Initialize data files if they don't exist
function initializeDataFiles() {
    // Initialize users file with default admin
    if (!fs.existsSync(USERS_FILE)) {
        const defaultPassword = bcrypt.hashSync('limarose2025', 10);
        const users = [{
            id: 1,
            username: 'admin',
            password: defaultPassword,
            role: 'admin',
            created_at: new Date().toISOString()
        }];
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    
    // Initialize products file
    if (!fs.existsSync(PRODUCTS_FILE)) {
        const products = {
            destacados: [],
            ofertas: [],
            vendidos: [],
            especiales: []
        };
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    }
}

initializeDataFiles();

// Helper functions to read/write data
function readUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (error) {
        return [];
    }
}

function readProducts() {
    try {
        return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    } catch (error) {
        return { destacados: [], ofertas: [], vendidos: [], especiales: [] };
    }
}

function writeProducts(products) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WebP)'));
        }
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Routes

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.cookie('token', token, { 
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'lax'
    });
    
    res.json({ 
        success: true, 
        user: { username: user.username, role: user.role },
        token: token 
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// Verify authentication
app.get('/api/verify', verifyToken, (req, res) => {
    res.json({ 
        authenticated: true, 
        user: { username: req.user.username, role: req.user.role } 
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Add product (protected)
app.post('/api/products', verifyToken, upload.single('image'), (req, res) => {
    const { name, price, category, occasion, originalPrice, discount, badge, description, filter } = req.body;
    
    if (!name || !price || !category || !filter) {
        return res.status(400).json({ error: 'Campos requeridos: name, price, category, filter' });
    }
    
    let imagePath = null;
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
    }
    
    const products = readProducts();
    const newId = Date.now(); // Simple ID generation
    
    const newProduct = {
        id: newId,
        name,
        price: parseFloat(price),
        category,
        occasion: occasion || null,
        image: imagePath,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discount: parseFloat(discount) || 0,
        badge: badge || null,
        description: description || null,
        filter,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    if (!products[filter]) {
        products[filter] = [];
    }
    
    products[filter].push(newProduct);
    writeProducts(products);
    
    res.json({ 
        success: true, 
        productId: newId,
        message: 'Producto agregado exitosamente' 
    });
});

// Update product (protected)
app.put('/api/products/:id', verifyToken, upload.single('image'), (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price, category, occasion, originalPrice, discount, badge, description, filter } = req.body;
    
    if (!name || !price || !category || !filter) {
        return res.status(400).json({ error: 'Campos requeridos: name, price, category, filter' });
    }
    
    const products = readProducts();
    let currentProduct = null;
    let currentFilter = null;
    
    // Find current product
    Object.keys(products).forEach(filterKey => {
        const product = products[filterKey].find(p => p.id === productId);
        if (product) {
            currentProduct = product;
            currentFilter = filterKey;
        }
    });
    
    if (!currentProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    let imagePath = currentProduct.image; // Keep existing image
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
        
        // Delete old image if exists
        if (currentProduct.image && currentProduct.image.startsWith('/uploads/')) {
            const oldImagePath = '.' + currentProduct.image;
            if (fs.existsSync(oldImagePath)) {
                try {
                    fs.unlinkSync(oldImagePath);
                } catch (error) {
                    console.log('Could not delete old image:', error);
                }
            }
        }
    }
    
    // Remove from current filter
    products[currentFilter] = products[currentFilter].filter(p => p.id !== productId);
    
    // Add to new filter (might be same)
    if (!products[filter]) {
        products[filter] = [];
    }
    
    const updatedProduct = {
        ...currentProduct,
        name,
        price: parseFloat(price),
        category,
        occasion: occasion || null,
        image: imagePath,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discount: parseFloat(discount) || 0,
        badge: badge || null,
        description: description || null,
        filter,
        updated_at: new Date().toISOString()
    };
    
    products[filter].push(updatedProduct);
    writeProducts(products);
    
    res.json({ 
        success: true, 
        message: 'Producto actualizado exitosamente' 
    });
});

// Delete product (protected)
app.delete('/api/products/:id', verifyToken, (req, res) => {
    const productId = parseInt(req.params.id);
    const products = readProducts();
    let deletedProduct = null;
    
    // Find and remove product
    Object.keys(products).forEach(filterKey => {
        const productIndex = products[filterKey].findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            deletedProduct = products[filterKey][productIndex];
            products[filterKey].splice(productIndex, 1);
        }
    });
    
    if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Delete associated image file
    if (deletedProduct.image && deletedProduct.image.startsWith('/uploads/')) {
        const imagePath = '.' + deletedProduct.image;
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (error) {
                console.log('Could not delete image file:', error);
            }
        }
    }
    
    writeProducts(products);
    
    res.json({ 
        success: true, 
        message: 'Producto eliminado exitosamente' 
    });
});

// Get product statistics (protected)
app.get('/api/stats', verifyToken, (req, res) => {
    const products = readProducts();
    
    const allProducts = Object.values(products).flat();
    const categories = [...new Set(allProducts.map(p => p.category))];
    const featuredProducts = products.destacados ? products.destacados.length : 0;
    
    res.json({
        totalProducts: allProducts.length,
        totalCategories: categories.length,
        featuredProducts: featuredProducts
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Error en la subida de archivo: ' + error.message });
    } else if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

// Start server
app.listen(PORT, () => {
    console.log(`🌹 Lima Rose Florería server running on http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin-new.html`);
    console.log(`👤 Default login: admin / limarose2025`);
    console.log(`📁 Data storage: JSON files in ./data/`);
});

module.exports = app;