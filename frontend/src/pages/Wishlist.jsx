import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlist } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div style={emptyStyles.wrapper}>
        <div style={emptyStyles.card}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
            alt="Wishlist"
            style={{ width: "100px", marginBottom: "20px" }}
          />
          <h2>Your Wishlist is Empty</h2>
          <p style={{ opacity: 0.7, marginBottom: "25px" }}>
            Save your favorite products here ❤️
          </p>

          <button style={emptyStyles.btn} onClick={() => navigate("/products")}>
            Discover Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h2>My Wishlist ❤️</h2>

      <div style={styles.grid}>
        {wishlist.map((item) => (
          <div key={item._id} style={styles.card}>
            <img src={item.image} alt={item.name} style={styles.image} />
            <h4>{item.name}</h4>
            <p>₹ {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "120px 8%",
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },
  card: {
    background: "#141414",
    padding: "20px",
    borderRadius: "16px",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
  },
};

const emptyStyles = {
  wrapper: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f0f0f",
    color: "#fff",
  },
  card: {
    textAlign: "center",
    background: "#141414",
    padding: "50px",
    borderRadius: "20px",
    width: "400px",
  },
  btn: {
    padding: "12px 30px",
    borderRadius: "30px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
  },
};

export default Wishlist;
