import { FaBars, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

function Header({ openCategory }) {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/products?search=${search}`);
    }
  };

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        {/* LEFT SECTION */}
        <div className="header-left">
          <FaBars className="menu-icon" onClick={openCategory} />
          <h2 className="logo" onClick={() => navigate("/")}>
            WebnApp
          </h2>
        </div>

        {/* CENTER SEARCH */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search premium products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* RIGHT CART */}
        <div
          className="cart-wrapper"
          onClick={() => navigate("/cart")}
          style={{ cursor: "pointer" }}
        >
          <FaShoppingCart />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </div>
      </div>
    </header>
  );
}

export default Header;
