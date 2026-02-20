import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // refresh state properly
  };

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate("/")}>
        <FaShoppingBag style={{ marginRight: "8px" }} />
        Web<span>n</span>App
      </h2>

      <div className="links">
        <NavLink to="/" end>
          Home
        </NavLink>

        {/* Products should be visible for everyone */}
        <NavLink to="/products">Products</NavLink>

        {!token && <NavLink to="/login">Login</NavLink>}

        {!token && <NavLink to="/register">Register</NavLink>}

        {token && <NavLink to="/account">Account</NavLink>}

        {token && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
