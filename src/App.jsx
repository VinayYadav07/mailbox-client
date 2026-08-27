// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Compose from "./components/Compose";
import Inbox from "./components/Inbox";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

const App = () => {
  const isAuthenticated = localStorage.getItem("token");
  const [unreadCount, setUnreadCount] = useState(0);

  // Unread count ko update karne ka function
  const handleUnreadCountChange = (newCount) => {
    setUnreadCount(newCount);
  };

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        {isAuthenticated && <Sidebar unreadCount={unreadCount} />}
        <div style={{ flex: 1 }}>
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
              element={
                isAuthenticated ? (
                  <Inbox onUnreadCountChange={handleUnreadCountChange} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
