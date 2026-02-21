import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, getTotal, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div style={styles.emptyWrapper}>
        <div style={styles.emptyCard}>
          <div style={styles.cartIcon}>🛒</div>

          <h2>Your Cart is Empty</h2>
          <p style={{ opacity: 0.6, marginBottom: "25px" }}>
            Looks like you haven’t added anything yet.
          </p>

          <button style={styles.shopBtn} onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h2 style={{ marginBottom: "20px" }}>Shopping Cart</h2>

          {cart.map((item) => (
            <div key={item._id} style={styles.productCard}>
              <img src={item.image} alt={item.name} style={styles.image} />

              <div style={styles.productInfo}>
                <h4 style={{ marginBottom: "6px" }}>{item.name}</h4>
                <p>₹ {item.price}</p>
                <p style={{ opacity: 0.7 }}>Quantity: {item.quantity}</p>

                <button
                  style={styles.removeBtn}
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>

          <div style={styles.row}>
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div style={styles.row}>
            <span>Tax (18%)</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>

          <hr style={{ margin: "15px 0", opacity: 0.2 }} />

          <div style={styles.total}>
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>

          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    padding: "100px 5%",
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
  },

  container: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap", // ✅ allows stacking on mobile
  },

  left: {
    flex: "2 1 500px", // ✅ responsive grow/shrink
  },

  right: {
    flex: "1 1 300px",
    background: "#111",
    padding: "25px",
    borderRadius: "12px",
    minWidth: "280px",
  },

  productCard: {
    display: "flex",
    gap: "20px",
    background: "#111",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    flexWrap: "wrap", // ✅ stack image + content on small screen
  },

  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  productInfo: {
    flex: 1,
    minWidth: "200px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "18px",
  },

  primaryBtn: {
    marginTop: "20px",
    padding: "14px",
    background: "#f0c14b",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "6px",
    width: "100%",
  },

  removeBtn: {
    marginTop: "10px",
    background: "#ff3b3b",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    color: "#fff",
    borderRadius: "6px",
  },

  /* Empty Cart */
  emptyWrapper: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCard: {
    textAlign: "center",
    background: "#111",
    padding: "50px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)",
  },

  cartIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },

  shopBtn: {
    padding: "14px 30px",
    background: "#f0c14b",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Cart;
