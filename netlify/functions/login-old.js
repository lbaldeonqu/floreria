const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'lima-rose-secret-key-2025';

// Default admin user (hardcoded for Netlify Functions)
const getDefaultUsers = () => {
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

      // Get default users (hardcoded for Netlify)
      const users = getDefaultUsers();

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