import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", form);

      // 🔥 Save token
      localStorage.setItem("token", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#ffffff",
      });


      // Redirect to home
      navigate("/");
    } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.response?.data?.message || "Invalid credentials",
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#ffffff",
    });

    }
  };

  return (
    <>
      {/* Big Centered Logo */}
      <div className="logo-container">
        <h1 className="main-logo">WebnApp</h1>
      </div>

      {/* Login Card */}
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );

}

export default Login;
