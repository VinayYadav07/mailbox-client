import { useEffect, useState } from "react";
import { Spinner, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useMail } from "../hooks/useMail";

const Sent = () => {
  const { user } = useAuth();
  const { getSentMails, deleteMail } = useMail();
  const navigate = useNavigate();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMails = async () => {
    if (!user?.email) return;
    try {
      const data = await getSentMails(user.email);
      setMails(data);
    } catch (error) {
      console.error("Error loading sent mails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMails();
    const interval = setInterval(loadMails, 2000);
    return () => clearInterval(interval);
  }, [user?.email]);

  const handleDelete = async (id) => {
    try {
      await deleteMail(id);
      setMails(mails.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting mail:", error);
      alert("Unable to delete mail");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="inbox-container">
      {/* ✅ Header */}
      <div className="inbox-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">📤 Sent</h5>
        <Badge bg="secondary" pill className="fs-6">
          {mails.length} sent
        </Badge>
      </div>

      {/* ✅ Mail List */}
      <div className="mail-list">
        {mails.length === 0 ? (
          <div className="text-center p-5">
            <div style={{ fontSize: "48px" }}>📤</div>
            <h6 className="mt-3 text-muted">No sent mails</h6>
            <p className="text-muted small">You haven't sent any mails yet</p>
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => navigate("/compose")}
            >
              ✏️ Compose Mail
            </Button>
          </div>
        ) : (
          mails.map((mail) => (
            <div
              key={mail.id}
              className="mail-item d-flex align-items-center"
              onClick={() =>
                navigate(`/mail/${mail.id}`, { state: { mail, type: "sent" } })
              }
            >
              {/* ✅ To: Recipient */}
              <div className="mail-sender">
                <span className="text-muted">To:</span> {mail.to}
              </div>

              {/* ✅ Subject & Preview */}
              <div className="mail-content flex-grow-1">
                <span className="fw-semibold me-2">{mail.subject}</span>
                <span className="text-muted">
                  {mail.body?.replace(/<[^>]*>/g, "").substring(0, 100)}
                  {mail.body?.replace(/<[^>]*>/g, "").length > 100 && "..."}
                </span>
              </div>

              {/* ✅ Delete Button */}
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(mail.id);
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sent;
