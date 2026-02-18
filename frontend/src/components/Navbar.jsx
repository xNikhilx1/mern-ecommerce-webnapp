import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">WebnApp</h2>

      <div className="links">
        <NavLink to="/" end>
          Home
        </NavLink>

        {token && <NavLink to="/products">Products</NavLink>}

        {!token && <NavLink to="/login">Login</NavLink>}

        {!token && <NavLink to="/register">Register</NavLink>}

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
