import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const token = localStorage.getItem("token");

  if (!token) navigate("/login");

  if (cart.length === 0) {
    return (
      <div style={{ padding: "120px", color: "#fff" }}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  const validateAddress = () => {
    return Object.values(address).every((val) => val.trim() !== "");
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const orderRes = await axios.post(`${API}/create-payment-order`, {
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
            `${API}/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              products: cart.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
              })),
              shippingAddress: address,
              paymentMethod: "Razorpay",
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          clearCart();
          navigate("/success");
        },
        theme: { color: "#ffffff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (error) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

 return (
   <div style={styles.wrapper}>
     <div style={{ width: "100%", maxWidth: "900px" }}>
       <h2>Checkout</h2>

       {step === 1 && (
         <div style={styles.card}>
           <h3>Delivery Address</h3>

           {error && <div style={styles.errorBox}>{error}</div>}

           {Object.keys(address).map((field) => (
             <input
               key={field}
               placeholder={field}
               value={address[field]}
               onChange={(e) => {
                 setError("");
                 setAddress({ ...address, [field]: e.target.value });
               }}
               style={{
                 ...styles.input,
                 border:
                   error && address[field].trim() === ""
                     ? "1px solid #ff4d4d"
                     : "1px solid #333",
               }}
             />
           ))}

           <button
             style={styles.primaryBtn}
             onClick={() => {
               if (!validateAddress()) {
                 setError("Please fill all required address fields.");
                 return;
               }
               setStep(2);
             }}
           >
             Continue to Payment
           </button>
         </div>
       )}

       {step === 2 && (
         <div style={styles.card}>
           <h3>Order Summary</h3>
           <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
           <p>Tax: ₹ {tax.toFixed(2)}</p>
           <h4>Total: ₹ {total.toFixed(2)}</h4>

           <button
             style={styles.primaryBtn}
             onClick={handlePayment}
             disabled={loading}
           >
             {loading ? "Processing..." : "Proceed to Payment"}
           </button>
         </div>
       )}
     </div>
   </div>
 );
}

const styles = {
 wrapper: {
  padding: "120px 8%",
  background: "#000",
  color: "#fff",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
},
  card: {
    background: "#111",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "500px",
    marginTop: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    background: "#000",
    color: "#fff",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    background: "#f0c14b",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  errorBox: {
    background: "#2a0000",
    color: "#ff4d4d",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
};

export default Checkout;
