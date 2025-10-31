const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lima-rose-secret-key-2025';

// Usuario admin predeterminado
const ADMIN_USER = {
  id: 1,
  username: 'admin',
  password: '$2a$10$xvxq89GQt98qXNe7bJS6C.64RZIy1qgw1hLSzrUC16LRPtP5lhOr2', // limarose2025
  email: 'admin@limaroseflores.pe',
  role: 'admin',
  created_at: new Date().toISOString()
};

exports.handler = async (event, context) => {
  console.log('Login function called:', event.httpMethod);
  
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
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const { username, password } = JSON.parse(event.body);
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Username and password are required' })
      };
    }

    // Verify credentials
    if (username !== ADMIN_USER.username) {
      console.log('Invalid username');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const validPassword = bcrypt.compareSync(password, ADMIN_USER.password);
    if (!validPassword) {
      console.log('Invalid password');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: ADMIN_USER.id, 
        username: ADMIN_USER.username, 
        role: ADMIN_USER.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);

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
          id: ADMIN_USER.id,
          username: ADMIN_USER.username,
          email: ADMIN_USER.email,
          role: ADMIN_USER.role
        }
      })
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