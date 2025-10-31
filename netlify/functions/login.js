const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'lima-rose-secret-key-2025';

// Helper function to read JSON files
const readJsonFile = (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const data = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading file:', error);
  }
  return null;
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
};

// Initialize default admin user
const initializeUsers = () => {
  const defaultPassword = bcrypt.hashSync('limarose2025', 10);
  return [{
    id: 1,
    username: 'admin',
    password: defaultPassword,
    email: 'admin@limaroseflores.pe',
    role: 'admin',
    created_at: new Date().toISOString()
  }];
};

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
    const { httpMethod, body } = event;

    if (httpMethod === 'POST') {
      const { username, password } = JSON.parse(body);

      // Read users file
      let users = readJsonFile('data/users.json');
      
      if (!users) {
        // Create default admin user
        users = initializeUsers();
        writeJsonFile('data/users.json', users);
      }

      // Find user
      const user = users.find(u => u.username === username);
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' })
        };
      }

      // Verify password
      const validPassword = bcrypt.compareSync(password, user.password);
      
      if (!validPassword) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' })
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set cookie header
      const cookieHeader = `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': cookieHeader
        },
        body: JSON.stringify({ 
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Login function error:', error);
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