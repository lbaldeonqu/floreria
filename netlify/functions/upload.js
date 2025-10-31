const fs = require('fs');
const path = require('path');

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Helper function to save base64 image
const saveBase64Image = (base64Data, filename) => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    ensureDirectoryExists(uploadsDir);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const extension = filename ? path.extname(filename) : '.jpg';
    const uniqueFilename = `product-${timestamp}-${randomNum}${extension}`;
    
    // Save file
    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, base64Image, 'base64');
    
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    return null;
  }
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
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    const { imageData, filename } = JSON.parse(event.body);

    if (!imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No image data provided' })
      };
    }

    // Save the image
    const imagePath = saveBase64Image(imageData, filename);

    if (!imagePath) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Failed to save image' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Image uploaded successfully',
        imagePath: imagePath
      })
    };

  } catch (error) {
    console.error('Upload function error:', error);
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