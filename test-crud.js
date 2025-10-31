// Test para las funciones PUT y DELETE

const { handler } = require('./netlify/functions/products.js');

const mockEvent = (method, path, body = null) => ({
  httpMethod: method,
  path: path,
  body: body,
  headers: { 'content-type': 'application/json' }
});

async function testCRUD() {
  console.log('🧪 Testing CRUD operations...\n');

  try {
    // 1. GET products initially
    console.log('1️⃣ GET initial products');
    const getResult1 = await handler(mockEvent('GET', '/products'), {});
    const initialProducts = JSON.parse(getResult1.body);
    console.log('Initial products count:', Object.values(initialProducts).flat().length);

    // 2. POST - Add new product
    console.log('\n2️⃣ POST - Add new product');
    const newProduct = {
      name: 'Producto CRUD Test',
      price: 150.00,
      category: 'test',
      description: 'Producto para probar CRUD',
      filter: 'products'
    };
    
    const postResult = await handler(mockEvent('POST', '/products', JSON.stringify(newProduct)), {});
    const createdProduct = JSON.parse(postResult.body);
    console.log('Status:', postResult.statusCode);
    console.log('Created product ID:', createdProduct.product.id);
    const productId = createdProduct.product.id;

    // 3. PUT - Update product
    console.log('\n3️⃣ PUT - Update product');
    const updatedData = {
      name: 'Producto CRUD Test ACTUALIZADO',
      price: 200.00,
      description: 'Descripción actualizada'
    };
    
    const putResult = await handler(mockEvent('PUT', `/products/${productId}`, JSON.stringify(updatedData)), {});
    const updatedProduct = JSON.parse(putResult.body);
    console.log('Status:', putResult.statusCode);
    console.log('Updated product name:', updatedProduct.product?.name);

    // 4. GET products to verify update
    console.log('\n4️⃣ GET - Verify update');
    const getResult2 = await handler(mockEvent('GET', '/products'), {});
    const productsAfterUpdate = JSON.parse(getResult2.body);
    const foundProduct = Object.values(productsAfterUpdate).flat().find(p => p.id === productId);
    console.log('Found updated product:', foundProduct?.name);

    // 5. DELETE product
    console.log('\n5️⃣ DELETE - Remove product');
    const deleteResult = await handler(mockEvent('DELETE', `/products/${productId}`), {});
    const deletedProduct = JSON.parse(deleteResult.body);
    console.log('Status:', deleteResult.statusCode);
    console.log('Deleted product:', deletedProduct.product?.name);

    // 6. GET products to verify deletion
    console.log('\n6️⃣ GET - Verify deletion');
    const getResult3 = await handler(mockEvent('GET', '/products'), {});
    const finalProducts = JSON.parse(getResult3.body);
    const productStillExists = Object.values(finalProducts).flat().find(p => p.id === productId);
    console.log('Product still exists:', !!productStillExists);

    console.log('\n✅ CRUD tests completed successfully!');

  } catch (error) {
    console.error('❌ Error in CRUD tests:', error);
  }
}

testCRUD();