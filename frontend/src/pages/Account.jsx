import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://webnapp-backend.onrender.com";

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API}/my-addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddAddress = async () => {
    if (Object.values(newAddress).some((v) => v.trim() === "")) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(`${API}/add-address`, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowForm(false);
      setNewAddress({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* PROFILE HEADER */}
        <div style={styles.profileCard}>
          <h2>Welcome Back, {user.name}</h2>
          <p>{user.email}</p>
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.grid}>
          <div style={styles.box} onClick={() => navigate("/orders")}>
            <h3>My Orders</h3>
            <p>Track and manage your purchases</p>
          </div>

          <div style={styles.box} onClick={() => navigate("/wishlist")}>
            <h3>Wishlist</h3>
            <p>Your saved products</p>
          </div>

          <div style={styles.box} onClick={handleLogout}>
            <h3>Logout</h3>
            <p>Securely sign out</p>
          </div>
        </div>

        {/* ADDRESSES SECTION */}
        <div style={styles.addressSection}>
          <div style={styles.addressHeader}>
            <h3>Saved Addresses</h3>
            <button
              style={styles.primaryBtn}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Add Address"}
            </button>
          </div>

          {showForm && (
            <div style={styles.formCard}>
              {Object.keys(newAddress).map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      [field]: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              ))}

              <button style={styles.primaryBtn} onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          )}

          <div style={styles.addressGrid}>
            {addresses.length === 0 && (
              <p style={{ opacity: 0.6 }}>No saved addresses yet.</p>
            )}

            {addresses.map((addr, index) => (
              <div key={index} style={styles.addressCard}>
                <h4>{addr.fullName}</h4>
                <p>
                  {addr.addressLine}, {addr.city}
                </p>
                <p>
                  {addr.state} - {addr.pincode}
                </p>
                <p>📞 {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#000",
    padding: "120px 4%",
    color: "#fff",
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
  },
  profileCard: {
    background: "linear-gradient(145deg, #111, #1a1a1a)",
    padding: "40px",
    borderRadius: "20px",
    marginBottom: "40px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "50px",
  },
  box: {
    background: "#141414",
    padding: "30px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  addressSection: {
    marginTop: "40px",
  },
  addressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  addressGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  addressCard: {
    background: "#141414",
    padding: "20px",
    borderRadius: "14px",
    lineHeight: "1.6",
  },
  formCard: {
    background: "#111",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff",
  },
  primaryBtn: {
    padding: "10px 20px",
    background: "#f0c14b",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Account;
