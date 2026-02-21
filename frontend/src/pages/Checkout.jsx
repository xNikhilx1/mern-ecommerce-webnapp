import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://webnapp-backend.onrender.com";

function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  if (cart.length === 0) {
    return (
      <div style={styles.wrapper}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      if (!window.Razorpay) {
        setError("Payment system not loaded. Refresh page.");
        return;
      }

      setLoading(true);
      setError("");

      // ✅ CORRECT API CALL
      const orderRes = await axios.post(`${API_URL}/create-payment-order`, {
        amount: total,
      });

      const { id: order_id } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "WebnApp",
        description: "Order Payment",
        order_id,
        handler: async function (response) {
          await axios.post(
            `${API_URL}/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              products: cart.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
              })),
              paymentMethod: "Razorpay",
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          clearCart();
          navigate("/success");
        },
        theme: { color: "#f0c14b" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Order Summary</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <p>Tax: ₹ {tax.toFixed(2)}</p>
        <h3>Total: ₹ {total.toFixed(2)}</h3>

        <button
          style={styles.button}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
  padding: "100px 16px",
  background: "#000",
  color: "#fff",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},
  card: {
    background: "#111",
    padding: "24px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#f0c14b",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "6px",
    marginTop: "15px",
  },
};

export default Checkout;
