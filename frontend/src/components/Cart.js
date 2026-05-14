import React, { useState } from 'react';

function Cart({ cart, onRemoveFromCart, onUpdateQuantity, onClearCart, role }) {
  const [paid, setPaid] = useState('');
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setCheckoutResult({
        success: false,
        message: 'Cart is empty!',
      });
      return;
    }

    if (!paid || parseFloat(paid) <= 0) {
      setCheckoutResult({
        success: false,
        message: 'Please enter a valid payment amount!',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare items for checkout
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Send checkout request
      const response = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
        },
        body: JSON.stringify({
          items,
          paid: parseFloat(paid),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const result = await response.json();
      setCheckoutResult({
        success: result.success,
        message: result.message,
        total: result.total,
        paid: result.paid,
        balance: result.balance,
      });

      // Clear cart and inputs if successful
      if (result.success && result.balance >= 0) {
        setTimeout(() => {
          onClearCart();
          setPaid('');
          setCheckoutResult(null);
        }, 2000);
      }
    } catch (err) {
      setCheckoutResult({
        success: false,
        message: `Error: ${err.message}`,
      });
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>🛒 Cart</h2>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                  style={{ width: '50px', padding: '5px' }}
                />
                <button
                  className="cart-item-remove"
                  onClick={() => onRemoveFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Section */}
      {cart.length > 0 && (
        <div className="checkout-section">
          <h3>💳 Checkout</h3>
          <div className="checkout-summary">
            <p>
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </p>
            <p>
              <span>Tax (0%):</span>
              <span>$0.00</span>
            </p>
            <p className="total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </p>
          </div>

          <div className="checkout-input">
            <input
              type="number"
              placeholder="Amount Paid"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              step="0.01"
              disabled={loading}
            />
            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      )}

      {/* Checkout Result */}
      {checkoutResult && (
        <div className={`result ${checkoutResult.success && checkoutResult.balance >= 0 ? 'success' : 'error'}`}>
          <h4>{checkoutResult.message}</h4>
          {checkoutResult.total !== undefined && (
            <>
              <p>Total: ${checkoutResult.total.toFixed(2)}</p>
              <p>Paid: ${checkoutResult.paid.toFixed(2)}</p>
              <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Balance: ${checkoutResult.balance.toFixed(2)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
