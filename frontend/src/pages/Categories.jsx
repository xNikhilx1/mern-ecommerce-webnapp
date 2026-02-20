import { useNavigate } from "react-router-dom";

function SideCategory({ visible, close }) {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    close(); // close drawer after click
  };

  return (
    <div
      style={{
        ...styles.overlay,
        left: visible ? "0" : "-100%",
      }}
    >
      <div style={styles.header}>
        <h3>Shop by Category</h3>
        <span style={styles.close} onClick={close}>
          ×
        </span>
      </div>

      <div
        style={styles.item}
        onClick={() => handleCategoryClick("electronics")}
      >
        💻 Electronics
      </div>

      <div style={styles.item} onClick={() => handleCategoryClick("fashion")}>
        👕 Fashion
      </div>

      <div style={styles.item} onClick={() => handleCategoryClick("mobiles")}>
        📱 Mobiles
      </div>

      <div style={styles.item} onClick={() => handleCategoryClick("beauty")}>
        ❤️ Beauty
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: "-100%",
    width: "280px",
    height: "100%",
    background: "#111",
    color: "#fff",
    padding: "20px",
    transition: "0.3s ease",
    zIndex: 1000,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  close: {
    cursor: "pointer",
    fontSize: "20px",
  },
  item: {
    padding: "15px 10px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "0.2s",
  },
};

export default SideCategory;
