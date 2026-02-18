import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";
import Swal from "sweetalert2";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
      } catch (error) {
        console.log("Error fetching products ❌", error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "Please login before purchasing.",
          icon: "warning",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#ff6ec4",
        });
        return;
      }

      // Create Razorpay order
      const orderRes = await axios.post(
        "http://localhost:5000/create-payment-order",
        {
          amount: product.price,
        },
      );

      const razorpayOrder = orderRes.data;

      const options = {
        key: "rzp_test_SHMPnJhA6rdGUk", // your test key
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "WebnApp",
        description: product.name,
        order_id: razorpayOrder.id,

        handler: async function () {
          await axios.post(
            "http://localhost:5000/place-order",
            {
              products: [
                {
                  productId: product._id,
                  quantity: 1,
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          Swal.fire({
            title: "Payment Successful 🎉",
            text: "Your order has been placed successfully!",
            icon: "success",
            background: "#111",
            color: "#fff",
            confirmButtonColor: "#ff6ec4",
          });
        },

        theme: {
          color: "#ff6ec4",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Payment Successful",
        text: "Your order has been placed successfully.",
        icon: "success",
        background: "#121212",
        color: "#ffffff",
        confirmButtonColor: "#ffffff",
        customClass: {
          popup: "minimal-popup",
        },
      });

    }
  };

  return (
    <div className="products-container">
      <h2>Available Products</h2>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            )}

            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <h4>₹ {product.price}</h4>

            <button className="buy-btn" onClick={() => handleBuy(product)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
