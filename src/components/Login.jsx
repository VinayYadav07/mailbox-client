import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import Welcome from "./Welcome";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Welcome />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill the field");
      return;
    }
    console.log(email);
    console.log(password);

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      console.log("Login successfully");

      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Try again later.";
      }

      setError(errorMessage);
      console.log("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Login</h2>

      <form onSubmit={handleLoginSubmit}>
        <label>Email</label>
        <br />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <label>Password</label>
        <br />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
