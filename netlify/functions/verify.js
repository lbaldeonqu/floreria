const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lima-rose-secret-key-2025';

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
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    // Get token from cookie or Authorization header
    let token = null;
    
    // Check Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Check cookies
    if (!token && event.headers.cookie) {
      const cookies = event.headers.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {});
      token = cookies.token;
    }

    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'No token provided' })
      };
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Token valid',
          user: {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role
          }
        })
      };
    } catch (jwtError) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid token' })
      };
    }

  } catch (error) {
    console.error('Verify function error:', error);
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