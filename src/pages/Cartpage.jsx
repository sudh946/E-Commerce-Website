import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage({ cart, updateQuantity, removeFromCart }) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const navigate = useNavigate();

const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);

  if (cart.length === 0) return <h2 className="empty">Cart is empty</h2>;

    const handleCheckout = () => {
    setShowConfirmPopup(true);
  };

  const confirmOrder = () => {
    setShowConfirmPopup(false);
    setShowOrderPopup(true);

    let counter = 5;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);

      if (counter === 0) {
        clearInterval(interval);
        navigate("/");
      }
    }, 1000);
  };

  return (
    <div className="cart-page">
      <div className="cart-list">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} />

            <div className="cart-info">
              <h3>{item.title}</h3>
              <p>${item.price}</p>

              <div className="qty-box">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="summary">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>

      {/* CONFIRMATION POPUP */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Checkout?</h3>
            <p>Do you want to place the order?</p>
            <div className="popup-buttons">
              <button className="yes-btn" onClick={confirmOrder}>Yes</button>
              <button className="no-btn" onClick={() => setShowConfirmPopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showOrderPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Order Placed 🎉</h3>
            <p>Redirecting to home in {countdown}...</p>
          </div>
        </div>
      )}
    </div>
  );
};