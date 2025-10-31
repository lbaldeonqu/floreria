// Test script para probar las Netlify Functions localmente

// Simular el contexto de Netlify
const mockEvent = (method, path, body = null, headers = {}) => ({
  httpMethod: method,
  path: path,
  body: body,
  headers: {
    'content-type': 'application/json',
    ...headers
  }
});

const mockContext = {};

async function testProductsFunction() {
  console.log('🧪 Testing Products Function...');
  
  try {
    // Import the function
    const { handler } = require('./netlify/functions/products.js');
    
    // Test GET request
    console.log('\n📋 Test 1: GET /products');
    const getEvent = mockEvent('GET', '/products');
    const getResult = await handler(getEvent, mockContext);
    console.log('Status:', getResult.statusCode);
    console.log('Response:', JSON.parse(getResult.body));
    
    // Test POST request
    console.log('\n📝 Test 2: POST /products');
    const newProduct = {
      name: 'Producto de Prueba',
      price: 99.99,
      category: 'prueba',
      description: 'Producto de prueba para verificar API',
      filter: 'products'
    };
    
    const postEvent = mockEvent('POST', '/products', JSON.stringify(newProduct));
    const postResult = await handler(postEvent, mockContext);
    console.log('Status:', postResult.statusCode);
    console.log('Response:', JSON.parse(postResult.body));
    
    console.log('\n✅ Products function tests completed');
    
  } catch (error) {
    console.error('❌ Error testing products function:', error.message);
  }
}

async function testLoginFunction() {
  console.log('\n🔐 Testing Login Function...');
  
  try {
    const { handler } = require('./netlify/functions/login.js');
    
    // Test login
    console.log('\n🔑 Test: POST /login');
    const loginData = {
      username: 'admin',
      password: 'limarose2025'
    };
    
    const loginEvent = mockEvent('POST', '/login', JSON.stringify(loginData));
    const loginResult = await handler(loginEvent, mockContext);
    console.log('Status:', loginResult.statusCode);
    console.log('Response:', JSON.parse(loginResult.body));
    
    console.log('\n✅ Login function tests completed');
    
  } catch (error) {
    console.error('❌ Error testing login function:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Netlify Functions Tests\n');
  
  await testProductsFunction();
  await testLoginFunction();
  
  console.log('\n🎉 All tests completed!');
}

// Run tests
runTests().catch(console.error);