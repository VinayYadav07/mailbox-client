// src/components/Inbox.jsx (Updated with Custom Hook)
import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useFetchEmails } from "../hooks/useFetchEmails"; // Custom hook imported

// Reducer for state management
const initialState = {
  emails: [],
  unreadCount: 0,
  loading: true,
  error: null,
  selectedEmail: null,
  currentView: "inbox",
};

const inboxReducer = (state, action) => {
  switch (action.type) {
    case "SET_EMAILS":
      return {
        ...state,
        emails: action.payload,
        unreadCount: action.payload.filter((email) => !email.read).length,
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SELECT_EMAIL":
      return { ...state, selectedEmail: action.payload };
    case "MARK_AS_READ":
      return {
        ...state,
        emails: state.emails.map((email) =>
          email.id === action.payload ? { ...email, read: true } : email,
        ),
        unreadCount: state.unreadCount - 1,
      };
    case "DELETE_EMAIL":
      return {
        ...state,
        emails: state.emails.filter((email) => email.id !== action.payload),
        unreadCount:
          state.unreadCount -
          (state.emails.find((e) => e.id === action.payload)?.read ? 0 : 1),
      };
    case "SET_VIEW":
      return { ...state, currentView: action.payload, selectedEmail: null };
    default:
      return state;
  }
};

const Inbox = ({ onUnreadCountChange }) => {
  const [state, dispatch] = useReducer(inboxReducer, initialState);
  const navigate = useNavigate();

  // Custom Hook use kiya
  const { emails, loading, error } = useFetchEmails(state.currentView);

  // Custom hook se aaye emails ko state mein update karein
  useEffect(() => {
    dispatch({ type: "SET_EMAILS", payload: emails });
    if (onUnreadCountChange) {
      onUnreadCountChange(emails.filter((email) => !email.read).length);
    }
  }, [emails, onUnreadCountChange]);

  const handleEmailClick = async (email) => {
    if (email.read) {
      dispatch({ type: "SELECT_EMAIL", payload: email });
      return;
    }

    try {
      const emailRef = doc(db, "mails", email.id);
      await updateDoc(emailRef, { read: true });
      dispatch({ type: "MARK_AS_READ", payload: email.id });
      dispatch({ type: "SELECT_EMAIL", payload: { ...email, read: true } });
    } catch (err) {
      console.error("Error marking email as read:", err);
    }
  };

  const handleDelete = async (e, emailId) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      const emailRef = doc(db, "mails", emailId);
      await deleteDoc(emailRef);
      dispatch({ type: "DELETE_EMAIL", payload: emailId });
    } catch (err) {
      console.error("Error deleting email:", err);
      alert("Failed to delete email. Please try again.");
    }
  };

  const handleBackToInbox = () => {
    dispatch({ type: "SELECT_EMAIL", payload: null });
  };

  const handleViewChange = (view) => {
    dispatch({ type: "SET_VIEW", payload: view });
  };

  const handleCompose = () => {
    navigate("/compose");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading emails...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  if (state.selectedEmail) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <button
          onClick={handleBackToInbox}
          style={{
            padding: "8px 16px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ⬅️ Back to {state.currentView === "sent" ? "Sent" : "Inbox"}
        </button>
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
          <h3>{state.selectedEmail.subject}</h3>
          <p>
            <strong>From:</strong> {state.selectedEmail.from}
          </p>
          <p>
            <strong>To:</strong> {state.selectedEmail.to}
          </p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            {state.selectedEmail.createdAt?.toDate?.()
              ? new Date(
                  state.selectedEmail.createdAt.toDate(),
                ).toLocaleString()
              : "Just now"}
          </p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p>{state.selectedEmail.message?.replace(/<[^>]*>/g, "")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
      }}
    >
      {/* Left Sidebar */}
      <div style={{ width: "250px", minWidth: "250px" }}>
        <button
          onClick={handleCompose}
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          ✏️ Compose
        </button>

        {/* Inbox */}
        <div
          onClick={() => handleViewChange("inbox")}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
            background:
              state.currentView === "inbox" ? "#e3f2fd" : "transparent",
            borderRadius: "4px",
            paddingLeft: "8px",
          }}
        >
          <span style={{ fontSize: "20px", marginRight: "10px" }}>📧</span>
          <span style={{ fontWeight: "bold" }}>Inbox</span>
          <span
            style={{
              marginLeft: "auto",
              background: "#e3f2fd",
              color: "#1976d2",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "14px",
            }}
          >
            {state.unreadCount}
          </span>
        </div>

        {/* Sent */}
        <div
          onClick={() => handleViewChange("sent")}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 0",
            cursor: "pointer",
            background:
              state.currentView === "sent" ? "#e3f2fd" : "transparent",
            borderRadius: "4px",
            paddingLeft: "8px",
          }}
        >
          <span style={{ fontSize: "18px", marginRight: "10px" }}>📤</span>
          <span style={{ fontWeight: "bold" }}>Sent</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Email List */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {state.currentView === "sent" ? "📤 Sent Mail" : "📧 Inbox"}
          </h2>
          <span style={{ color: "#666", fontSize: "14px" }}>
            {state.emails.length} emails
            {state.currentView === "inbox" && ` • ${state.unreadCount} unread`}
          </span>
        </div>

        {state.emails.length === 0 && (
          <div
            style={{ textAlign: "center", marginTop: "50px", color: "#666" }}
          >
            <p>
              {state.currentView === "sent"
                ? "📤 No sent emails yet"
                : "📭 No emails yet"}
            </p>
            <p>Click Compose to send your first email!</p>
          </div>
        )}

        {state.emails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailClick(email)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 15px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
              background: email.read ? "white" : "#f8faff",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = email.read
                ? "white"
                : "#f8faff")
            }
          >
            {/* Blue dot only for inbox unread */}
            {state.currentView === "inbox" && !email.read && (
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#1a73e8",
                  marginRight: "12px",
                  flexShrink: 0,
                }}
              />
            )}
            {(state.currentView === "sent" || email.read) && (
              <span
                style={{
                  width: "22px",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                flex: 1,
                gap: "15px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontWeight: email.read ? "normal" : "bold",
                  minWidth: "150px",
                }}
              >
                {state.currentView === "sent" ? email.to : email.from}
              </span>
              <span
                style={{ fontWeight: email.read ? "normal" : "bold", flex: 1 }}
              >
                {email.subject}
              </span>
              <span
                style={{
                  color: "#666",
                  fontSize: "13px",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {email.message?.replace(/<[^>]*>/g, "").substring(0, 60)}...
              </span>
            </div>

            <span
              style={{ color: "#999", fontSize: "12px", marginRight: "10px" }}
            >
              {email.createdAt?.toDate?.()
                ? new Date(email.createdAt.toDate()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now"}
            </span>

            <button
              onClick={(e) => handleDelete(e, email.id)}
              style={{
                padding: "4px 10px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
