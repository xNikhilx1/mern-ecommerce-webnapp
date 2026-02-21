import { useEffect, useState } from "react";
import "./AdSlider.css";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Next-Gen Tech Collection",
    subtitle: "Upgrade your lifestyle with premium gadgets",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Beauty Essentials",
    subtitle: "Glow with premium skincare",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Modern Accessories",
    subtitle: "Style meets performance",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1920&q=80",
  },
];

function AdSlider() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      <div
        className="slider-bg"
        style={{ backgroundImage: `url(${slides[index].image})` }}
      />

      <div className="slider-overlay" />

      <div className="slider-content">
        <h1>{slides[index].title}</h1>
        <p className="subtitle">{slides[index].subtitle}</p>
        <button onClick={() => navigate("/products")}>
          Explore Collection
        </button>
      </div>

      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default AdSlider;
