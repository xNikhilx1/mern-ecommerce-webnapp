import {
  FaLaptop,
  FaTshirt,
  FaMobileAlt,
  FaHeart,
  FaHeadphones,
} from "react-icons/fa";
import "./CategoryStrip.css";

const categories = [
  { name: "Electronics", icon: <FaLaptop /> },
  { name: "Fashion", icon: <FaTshirt /> },
  { name: "Mobiles", icon: <FaMobileAlt /> },
  { name: "Beauty", icon: <FaHeart /> },
  { name: "Accessories", icon: <FaHeadphones /> },
];

function CategoryStrip() {
  return (
    <div className="category-strip">
      {categories.map((cat, index) => (
        <div key={index} className="category-card">
          <div className="category-icon">{cat.icon}</div>
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}

export default CategoryStrip;
