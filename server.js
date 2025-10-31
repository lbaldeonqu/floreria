const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'lima-rose-secret-key-2025';

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./database.db');

// Create tables if they don't exist
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        occasion TEXT,
        image TEXT,
        originalPrice REAL,
        discount REAL DEFAULT 0,
        badge TEXT,
        description TEXT,
        filter TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create default admin user (username: admin, password: limarose2025)
    const defaultPassword = bcrypt.hashSync('limarose2025', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES ('admin', ?)`, [defaultPassword]);
});

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
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error del servidor' });
        }
        
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
    db.all('SELECT * FROM products ORDER BY created_at DESC', (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        
        // Group products by filter
        const groupedProducts = {
            destacados: [],
            ofertas: [],
            vendidos: [],
            especiales: []
        };
        
        products.forEach(product => {
            if (groupedProducts[product.filter]) {
                groupedProducts[product.filter].push(product);
            }
        });
        
        res.json(groupedProducts);
    });
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
    
    const sql = `INSERT INTO products (name, price, category, occasion, image, originalPrice, discount, badge, description, filter) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
        name, 
        parseFloat(price), 
        category, 
        occasion || null, 
        imagePath, 
        originalPrice ? parseFloat(originalPrice) : null, 
        parseFloat(discount) || 0, 
        badge || null, 
        description || null, 
        filter
    ];
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        
        res.json({ 
            success: true, 
            productId: this.lastID,
            message: 'Producto agregado exitosamente' 
        });
    });
});

// Update product (protected)
app.put('/api/products/:id', verifyToken, upload.single('image'), (req, res) => {
    const productId = req.params.id;
    const { name, price, category, occasion, originalPrice, discount, badge, description, filter } = req.body;
    
    if (!name || !price || !category || !filter) {
        return res.status(400).json({ error: 'Campos requeridos: name, price, category, filter' });
    }
    
    // First, get the current product to preserve the image if no new image is uploaded
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, currentProduct) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producto' });
        }
        
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
                    fs.unlinkSync(oldImagePath);
                }
            }
        }
        
        const sql = `UPDATE products SET 
                     name = ?, price = ?, category = ?, occasion = ?, image = ?, 
                     originalPrice = ?, discount = ?, badge = ?, description = ?, filter = ?,
                     updated_at = CURRENT_TIMESTAMP
                     WHERE id = ?`;
        
        const params = [
            name, 
            parseFloat(price), 
            category, 
            occasion || null, 
            imagePath, 
            originalPrice ? parseFloat(originalPrice) : null, 
            parseFloat(discount) || 0, 
            badge || null, 
            description || null, 
            filter,
            productId
        ];
        
        db.run(sql, params, function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar producto' });
            }
            
            res.json({ 
                success: true, 
                message: 'Producto actualizado exitosamente' 
            });
        });
    });
});

// Delete product (protected)
app.delete('/api/products/:id', verifyToken, (req, res) => {
    const productId = req.params.id;
    
    // Get product to delete associated image
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producto' });
        }
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Delete the product from database
        db.run('DELETE FROM products WHERE id = ?', [productId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar producto' });
            }
            
            // Delete associated image file
            if (product.image && product.image.startsWith('/uploads/')) {
                const imagePath = '.' + product.image;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            res.json({ 
                success: true, 
                message: 'Producto eliminado exitosamente' 
            });
        });
    });
});

// Get product statistics (protected)
app.get('/api/stats', verifyToken, (req, res) => {
    const queries = {
        totalProducts: 'SELECT COUNT(*) as count FROM products',
        totalCategories: 'SELECT COUNT(DISTINCT category) as count FROM products',
        featuredProducts: 'SELECT COUNT(*) as count FROM products WHERE filter = "destacados"'
    };
    
    const stats = {};
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.get(queries[key], (err, result) => {
            if (err) {
                stats[key] = 0;
            } else {
                stats[key] = result.count;
            }
            
            completed++;
            if (completed === Object.keys(queries).length) {
                res.json(stats);
            }
        });
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(PORT, () => {
    console.log(`🌹 Lima Rose Florería server running on http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`👤 Default login: admin / limarose2025`);
});

module.exports = app;