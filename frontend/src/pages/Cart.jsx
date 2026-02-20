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
        <div style={styles.left}>
          <h2>Shopping Cart</h2>

          {cart.map((item) => (
            <div key={item._id} style={styles.productCard}>
              <img src={item.image} style={styles.image} />
              <div style={{ flex: 1 }}>
                <h4>{item.name}</h4>
                <p>₹ {item.price}</p>
                <p>Quantity: {item.quantity}</p>

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

        <div style={styles.right}>
          <h3>Order Summary</h3>

          <div style={styles.row}>
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div style={styles.row}>
            <span>Tax (18%)</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>

          <hr />

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

const styles = {
  wrapper: {
    padding: "120px 8%",
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
  },
  container: { display: "flex", gap: "40px" },
  left: { flex: 2 },
  right: {
    flex: 1,
    background: "#111",
    padding: "25px",
    borderRadius: "12px",
  },
  productCard: {
    display: "flex",
    gap: "20px",
    background: "#111",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
  },
  image: { width: "100px", borderRadius: "8px" },
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
  },
  removeBtn: {
    marginTop: "10px",
    background: "red",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
  empty: {
    padding: "120px",
    textAlign: "center",
  },
  emptyWrapper: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCard: {
    textAlign: "center",
    background: "#111",
    padding: "60px",
    borderRadius: "16px",
    width: "400px",
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
