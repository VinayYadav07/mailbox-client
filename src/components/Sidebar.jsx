import { Button, Nav, Badge } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useMailContext } from "../store/MailContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { state } = useMailContext();
  const mails = state?.mails || [];
  const unreadCount = mails.filter((mail) => !mail.receiverRead).length;

  return (
    <div className="sidebar p-3">
      {/* ✅ Compose Button */}
      <Button
        variant="primary"
        className="w-100 rounded-pill mb-4 fw-bold shadow-sm"
        onClick={() => navigate("/compose")}
        style={{
          padding: "10px 0",
          fontSize: "14px",
          backgroundColor: "#0d6efd",
          border: "none",
        }}
      >
        ✏️ Compose
      </Button>

      {/* ✅ Main Navigation */}
      <Nav className="flex-column gap-1 mb-3">
        <Nav.Link
          as={NavLink}
          to="/inbox"
          className="sidebar-link d-flex align-items-center"
          end
        >
          <span className="me-2">📥</span>
          <span className="flex-grow-1">Inbox</span>
          {unreadCount > 0 && (
            <Badge bg="danger" pill className="ms-2">
              {unreadCount}
            </Badge>
          )}
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/sent"
          className="sidebar-link d-flex align-items-center"
        >
          <span className="me-2">📤</span>
          <span className="flex-grow-1">Sent</span>
        </Nav.Link>

        {/* ✅ New: Starred */}
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">⭐</span>
          <span className="flex-grow-1">Starred</span>
        </Nav.Link>

        {/* ✅ New: Drafts */}
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📝</span>
          <span className="flex-grow-1">Drafts</span>
          <Badge bg="secondary" pill className="ms-2">
            0
          </Badge>
        </Nav.Link>

        {/* ✅ New: Archive */}
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📁</span>
          <span className="flex-grow-1">Archive</span>
        </Nav.Link>

        {/* ✅ New: Spam */}
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">🚫</span>
          <span className="flex-grow-1">Spam</span>
        </Nav.Link>

        {/* ✅ New: Trash */}
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">🗑️</span>
          <span className="flex-grow-1">Trash</span>
        </Nav.Link>
      </Nav>

      <hr className="my-2" />

      {/* ✅ Folders Section */}
      <div className="text-muted small fw-bold mb-2 text-uppercase">
        Folders
      </div>
      <Nav className="flex-column gap-1">
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📂</span>
          <span className="flex-grow-1">Work</span>
        </Nav.Link>
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📂</span>
          <span className="flex-grow-1">Personal</span>
        </Nav.Link>
        <Nav.Link className="sidebar-link d-flex align-items-center text-primary">
          <span className="me-2">➕</span>
          <span className="flex-grow-1">New folder</span>
        </Nav.Link>
      </Nav>

      <hr className="my-2" />

      {/* ✅ Views Section */}
      <div className="text-muted small fw-bold mb-2 text-uppercase">Views</div>
      <Nav className="flex-column gap-1">
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📸</span>
          <span className="flex-grow-1">Photos</span>
        </Nav.Link>
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📄</span>
          <span className="flex-grow-1">Documents</span>
        </Nav.Link>
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">📰</span>
          <span className="flex-grow-1">Subscriptions</span>
        </Nav.Link>
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">🏷️</span>
          <span className="flex-grow-1">Deals</span>
        </Nav.Link>
        <Nav.Link className="sidebar-link d-flex align-items-center">
          <span className="me-2">✈️</span>
          <span className="flex-grow-1">Travel</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
