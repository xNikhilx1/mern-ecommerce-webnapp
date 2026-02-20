import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";
import { useCart } from "../context/CartContext";
import { FaHeart, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../components/Toast";

const API_URL = "https://webnapp-backend.onrender.com";

function Products() {
  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const { addToCart, wishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Extract category from URL
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  // 🔥 Re-fetch when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (error) {
        console.log("Error fetching products ❌", error);
      }
    };

    fetchProducts();
  }, [location.search]); // VERY IMPORTANT

  // 🔥 Filter safely
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() === selectedCategory.toLowerCase(),
        )
      : products;

  const handleAddToCart = (product) => {
    const success = addToCart(product);

    if (!success) {
      setToastMessage("Please login to add items to cart.");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    setToastMessage("Item added to cart successfully.");
  };

  const handleWishlist = (product) => {
    const success = toggleWishlist(product);

    if (!success) {
      setToastMessage("Please login to use wishlist.");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    setToastMessage("Added to wishlist.");
  };

  return (
    <div className="products-container">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      <h2 className="section-title">
        {selectedCategory
          ? `${selectedCategory.toUpperCase()} Products`
          : "Available Products"}
      </h2>

      {filteredProducts.length === 0 && (
        <div className="empty-products">
          <h3>No products found in this category.</h3>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.map((product) => {
          const discount = Math.floor(Math.random() * 30) + 10;
          const oldPrice = Math.round(
            product.price + (product.price * discount) / 100,
          );

          const isWishlisted = wishlist.some(
            (item) => item._id === product._id,
          );

          return (
            <div key={product._id} className="product-card">
              <div
                className="wishlist-icon"
                onClick={() => handleWishlist(product)}
              >
                <FaHeart color={isWishlisted ? "red" : "#bbb"} />
              </div>

              <div className="discount-badge">{discount}% OFF</div>

              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />

              <h3>{product.name}</h3>

              <div className="rating">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} color="#ffa41c" size={14} />
                ))}
                <span>(120)</span>
              </div>

              <div className="price-section">
                <span className="new-price">₹{product.price}</span>
                <span className="old-price">₹{oldPrice}</span>
              </div>

              <button
                className="buy-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
