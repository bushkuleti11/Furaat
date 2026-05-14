import React, { useState } from 'react';

function AdminPanel({ onProductAdded }) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle add product
  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productQuantity) {
      setResult({
        success: false,
        message: 'Please fill in all fields',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
        },
        body: JSON.stringify({
          name: productName,
          price: parseFloat(productPrice),
          quantity: parseInt(productQuantity),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();
      setResult({
        success: true,
        message: `Product "${result.name}" added successfully!`,
      });

      // Clear form
      setProductName('');
      setProductPrice('');
      setProductQuantity('');

      // Trigger refresh of product list
      onProductAdded();

      // Clear result after 2 seconds
      setTimeout(() => setResult(null), 2000);
    } catch (err) {
      setResult({
        success: false,
        message: `Error: ${err.message}`,
      });
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ marginTop: '20px' }}>
      <h2>⚙️ Admin Panel</h2>
      <div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              fontSize: '14px',
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            step="0.01"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              fontSize: '14px',
            }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleAddProduct}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`result ${result.success ? 'success' : 'error'}`}>
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
