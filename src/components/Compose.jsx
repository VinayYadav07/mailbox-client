import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "@aloushek/react-draft-wysiwyg-next";
import "@aloushek/react-draft-wysiwyg-next/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const Compose = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  // ✅ Auth check in useEffect with proper mounting
  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      if (!user) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // ✅ Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const plainText = editorState.getCurrentContent().getPlainText();

    if (!to || !subject || !plainText.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      const rawContent = convertToRaw(editorState.getCurrentContent());
      const message = draftToHtml(rawContent);

      const mail = {
        from: currentUser.email,
        to: to.toLowerCase(),
        subject: subject,
        message: message,
        createdAt: serverTimestamp(),
        read: false,
      };

      await addDoc(collection(db, "mails"), mail);

      setSuccess("Email sent successfully!");
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());

      setTimeout(() => {
        navigate("/welcome");
      }, 2000);
    } catch (error) {
      console.error("Error sending mail:", error);
      setError("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2>✏️ Compose Mail</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>To</label>
          <br />
          <input
            type="email"
            placeholder="Enter recipient email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Subject</label>
          <br />
          <input
            type="text"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Message</label>
          <br />
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 24px",
              background: loading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/welcome")}
            style={{
              padding: "10px 24px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Compose;
