import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.icon}>✓</div>

        <h1>Order Confirmed</h1>
        <p>
          Your payment was successful and your order is now being processed.
        </p>

        <div style={styles.buttonRow}>
          <button style={styles.primary} onClick={() => navigate("/orders")}>
            View Orders
          </button>

          <button
            style={styles.secondary}
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
  },
  card: {
  background: "#111",
  padding: "60px",
  borderRadius: "20px",
  textAlign: "center",
  width: "100%",
  maxWidth: "450px",
},
  icon: {
    fontSize: "50px",
    color: "#4CAF50",
    marginBottom: "20px",
  },
  buttonRow: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "25px",
  },
  primary: {
    background: "#f0c14b",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondary: {
    background: "#222",
    border: "1px solid #333",
    color: "#fff",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Success;
