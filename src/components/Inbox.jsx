import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // ✅ orderBy hata diya
        const q = query(
          collection(db, "mails"),
          where("to", "==", user.email.toLowerCase()),
        );
        const querySnapshot = await getDocs(q);
        const emailList = [];
        querySnapshot.forEach((doc) => {
          emailList.push({ id: doc.id, ...doc.data() });
        });
        setEmails(emailList);
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError("Failed to load emails");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [navigate]);

  const handleCompose = () => {
    navigate("/compose");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (loading) return <div>Loading emails...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>📧 Inbox</h2>
        <div>
          <button
            onClick={handleCompose}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            ✏️ Compose
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Emails List */}
      {emails.length > 0 && (
        <div>
          <h3 style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
            Today
          </h3>
          {emails.map((email) => (
            <div
              key={email.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", gap: "20px", flex: 1 }}>
                <span style={{ fontWeight: "bold", minWidth: "150px" }}>
                  {email.from}
                </span>
                <span style={{ flex: 1 }}>{email.subject}</span>
                <span style={{ color: "#666", fontSize: "14px" }}>
                  {email.message?.replace(/<[^>]*>/g, "").substring(0, 50)}...
                </span>
              </div>
              <span style={{ color: "#999", fontSize: "12px" }}>
                {email.createdAt?.toDate?.()
                  ? new Date(email.createdAt.toDate()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {emails.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "50px", color: "#666" }}>
          <p>📭 No emails yet</p>
          <p>Click Compose to send your first email!</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
