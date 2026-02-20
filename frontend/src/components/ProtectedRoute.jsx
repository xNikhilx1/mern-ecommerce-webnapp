import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Sign In Required",
        text: "Please sign in to access this feature.",
        icon: "info",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonText: "Login Now",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
        confirmButtonColor: "#ffffff",
        cancelButtonColor: "#333",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location.pathname } });
        } else {
          navigate("/");
        }
      });
    }
  }, [token, navigate, location]);

  if (!token) return null;

  return children;
}

export default ProtectedRoute;
