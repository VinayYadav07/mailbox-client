import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Compose from "./components/Compose";
import Inbox from "./components/Inbox";

const App = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/inbox" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/welcome"
          element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />}
        />
        <Route
          path="/compose"
          element={isAuthenticated ? <Compose /> : <Navigate to="/login" />}
        />
        <Route
          path="/inbox"
          element={isAuthenticated ? <Inbox /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
