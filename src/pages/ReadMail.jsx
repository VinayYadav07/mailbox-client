import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const ReadMail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mail = location.state?.mail;

  if (!mail) {
    return (
      <div className="text-center p-5">
        <h5>Mail not found</h5>
        <Button variant="primary" onClick={() => navigate("/inbox")}>
          Back to Inbox
        </Button>
      </div>
    );
  }

  return (
    <div className="read-container">
      <Card className="shadow-sm">
        {/* ✅ Header with Back Button */}
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/inbox")}
            className="back-btn"
          >
            ← Back
          </Button>
          <span className="text-muted small">{mail.from}</span>
        </Card.Header>

        <Card.Body>
          {/* ✅ Subject */}
          <h4 className="fw-bold mb-3">{mail.subject}</h4>

          {/* ✅ From & To */}
          <div className="mb-3 mail-meta">
            <div>
              <strong>From:</strong> {mail.from}
            </div>
            <div>
              <strong>To:</strong> {mail.to}
            </div>
          </div>

          <hr />

          {/* ✅ Mail Content */}
          <div
            className="mail-content"
            dangerouslySetInnerHTML={{
              __html:
                mail.body || "<p class='text-muted'>No message content</p>",
            }}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReadMail;
