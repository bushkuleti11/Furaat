import React, { useState, useEffect } from 'react';

function ProductList({ role, onAddToCart, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/products', {
        headers: {
          'x-user-role': role,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity input change
  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: Math.max(1, parseInt(value) || 1),
    });
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    
    // Add multiple items to cart
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    
    // Reset quantity input
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  if (loading) {
    return <div className="section"><div className="loading">Loading products...</div></div>;
  }

  if (error) {
    return (
      <div className="section">
        <h2>Products</h2>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>📦 Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <div className="product-price">${product.price.toFixed(2)}</div>
            <div className="product-quantity">Stock: {product.quantity}</div>
            {role === 'cashier' && (
              <div className="product-actions">
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  disabled={product.quantity === 0}
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
