import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdSlider from "../components/AdSlider";
import CategoryStrip from "../components/CategoryStrip";

import "./Home.css";

const API_URL = "http://localhost:5000";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data.slice(0, 4));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-wrapper">
      <AdSlider />
      <CategoryStrip />
      {/* FEATURED */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>

        <div className="featured-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="featured-card"
              onClick={() => navigate("/products")}
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹ {product.price}</p>
            </div>
          ))}
        </div>

        <div className="view-all">
          <button onClick={() => navigate("/products")}>
            View All Products
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
