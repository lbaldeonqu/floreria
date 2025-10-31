// Helper function to process base64 image (for Netlify Functions)
// Note: In Netlify Functions, we return the base64 data directly since we can't save files
const processBase64Image = (base64Data, filename) => {
  try {
    // Generate unique filename for reference
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const extension = filename ? filename.split('.').pop() : 'jpg';
    const uniqueFilename = `product-${timestamp}-${randomNum}.${extension}`;
    
    // Return the base64 data URL (since we can't save files in Netlify Functions)
    return base64Data.startsWith('data:') ? base64Data : `data:image/${extension};base64,${base64Data}`;
  } catch (error) {
    console.error('Error processing image:', error);
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

    // Process the image (return base64 data URL for Netlify Functions)
    const processedImagePath = processBase64Image(imageData, filename);

    if (!processedImagePath) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Failed to process image' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Image processed successfully',
        imagePath: processedImagePath
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