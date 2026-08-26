import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Welcome = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || auth.currentUser?.email;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>📧 Welcome to your mail box</h1>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Logged in as: <strong>{email}</strong>
      </p>
      <div style={{ marginTop: "40px" }}>
        <button
          onClick={() => navigate("/compose")}
          style={{
            padding: "12px 30px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "15px",
          }}
        >
          ✏️ Compose Mail
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "12px 30px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
