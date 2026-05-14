import React, { useState } from 'react';
import './index.css';
import RoleSelector from './components/RoleSelector';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SalesSummary from './components/SalesSummary';
import AdminPanel from './components/AdminPanel';

function App() {
  // State for selected role
  const [role, setRole] = useState('cashier');
  
  // State for cart items
  const [cart, setCart] = useState([]);
  
  // State to trigger data refresh
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // If already in cart, increase quantity
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }]);
    }
  };

  // Function to remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Function to update quantity in cart
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Function to clear cart after checkout
  const clearCart = () => {
    setCart([]);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>💰 Mini Cashier System</h1>
        <p>Simple POS System for Learning</p>
      </div>

      {/* Role Selector */}
      <RoleSelector role={role} setRole={setRole} />

      {/* Main Content */}
      <div className="main-content">
        {/* Left Side: Products */}
        <ProductList 
          role={role} 
          onAddToCart={addToCart}
          refreshKey={refreshKey}
        />

        {/* Right Side: Cart or Summary */}
        {role === 'cashier' ? (
          <Cart 
            cart={cart} 
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            onClearCart={clearCart}
            role={role}
          />
        ) : (
          <SalesSummary role={role} refreshKey={refreshKey} />
        )}
      </div>

      {/* Admin Panel - Only show for admin */}
      {role === 'admin' && <AdminPanel onProductAdded={clearCart} />}
    </div>
  );
}

export default App;
