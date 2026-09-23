import { useEffect, useState } from "react";
import { Spinner, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useMail } from "../hooks/useMail";
import { useMailContext } from "../store/MailContext";

const Inbox = () => {
  const { user } = useAuth();
  const { getInboxMails, markAsRead, deleteMail } = useMail();
  const { state, dispatch } = useMailContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const loadMails = async () => {
    if (!user?.email) return;
    try {
      const data = await getInboxMails(user.email);
      dispatch({ type: "SET_MAILS", payload: data });
    } catch (error) {
      console.error("Error loading mails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMails();
    const interval = setInterval(loadMails, 2000);
    return () => clearInterval(interval);
  }, [user?.email]);

  const openMail = async (mail) => {
    if (!mail.receiverRead) {
      try {
        await markAsRead(mail.id, "inbox");
        dispatch({ type: "MARK_AS_READ", payload: mail.id });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
    navigate(`/mail/${mail.id}`, { state: { mail, type: "inbox" } });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMail(id);
      dispatch({ type: "REMOVE_MAIL", payload: id });
    } catch (error) {
      console.error("Error deleting mail:", error);
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

  const mails = state?.mails || [];
  const unreadCount = state?.unreadCount || 0;

  return (
    <div className="inbox-container">
      {/* ✅ Inbox Header */}
      <div className="inbox-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">📥 Inbox</h5>
        <Badge bg="danger" pill className="fs-6">
          {unreadCount} unread
        </Badge>
      </div>

      {/* ✅ Mail List */}
      <div className="mail-list">
        {mails.length === 0 ? (
          <div className="text-center p-5">
            <div style={{ fontSize: "48px" }}>📭</div>
            <h6 className="mt-3 text-muted">No mails in your inbox</h6>
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
              className={`mail-item d-flex align-items-center ${!mail.receiverRead ? "unread" : ""}`}
              onClick={() => openMail(mail)}
            >
              {/* ✅ Unread Dot */}
              {!mail.receiverRead && <span className="unread-dot"></span>}

              {/* ✅ Sender */}
              <div className="mail-sender">{mail.from}</div>

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

export default Inbox;
