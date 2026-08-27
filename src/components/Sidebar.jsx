// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ unreadCount }) => {
  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h3>Mailbox</h3>
      <div style={{ marginBottom: "10px" }}>
        <Link to="/inbox">
          <span>Inbox</span>
          <span
            style={{
              marginLeft: "10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
            }}
          >
            {unreadCount}
          </span>
        </Link>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Link to="/compose">
          <span>Compose</span>
        </Link>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Link to="/welcome">
          <span>Welcome</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
