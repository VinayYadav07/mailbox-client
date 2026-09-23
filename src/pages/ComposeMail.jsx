import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useMail } from "../hooks/useMail";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ComposeMail = () => {
  const { user } = useAuth();
  const { sendMail } = useMail();
  const navigate = useNavigate();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!to.trim()) {
      setError("Please enter recipient email");
      return;
    }
    if (!subject.trim()) {
      setError("Please enter subject");
      return;
    }

    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContent);

    const plainText = htmlContent.replace(/<(.|\n)*?>/g, "").trim();
    if (!plainText) {
      setError("Please enter message");
      return;
    }

    try {
      setLoading(true);
      await sendMail({
        from: user.email,
        to: to.trim(),
        subject: subject.trim(),
        body: htmlContent,
      });
      navigate("/inbox");
    } catch (err) {
      setError(err.message || "Unable to send mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compose-container">
      <div className="compose-card">
        <div className="compose-header">
          <h5 className="mb-0 fw-bold">✏️ Compose Mail</h5>
          <button
            className="btn-close"
            onClick={() => navigate("/inbox")}
          ></button>
        </div>

        <div className="compose-body">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form onSubmit={sendHandler}>
            {/* ✅ Cc / Bcc */}
            <div className="mb-3">
              <span className="cc-bcc-link">Cc / Bcc</span>
            </div>

            {/* ✅ To Field */}
            <Form.Group className="mb-3">
              <div className="compose-field">
                <Form.Label className="compose-label">To</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="test@gmail.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="compose-input"
                />
              </div>
            </Form.Group>

            {/* ✅ Subject Field */}
            <Form.Group className="mb-3">
              <div className="compose-field">
                <Form.Label className="compose-label">Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Test mail"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="compose-input"
                />
              </div>
            </Form.Group>

            {/* ✅ Editor */}
            <Form.Group className="mb-3">
              <div className="editor-wrapper">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  toolbarClassName="rdw-editor-toolbar"
                  wrapperClassName="editor-wrapper"
                  editorClassName="rdw-editor-main"
                  placeholder="Write your message..."
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "list",
                      "textAlign",
                      "colorPicker",
                      "link",
                      "remove",
                      "history",
                    ],
                    inline: {
                      options: ["bold", "italic", "underline", "strikethrough"],
                    },
                    list: {
                      options: ["unordered", "ordered"],
                    },
                    textAlign: {
                      options: ["left", "center", "right", "justify"],
                    },
                  }}
                />
              </div>
            </Form.Group>

            {/* ✅ Send Button */}
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="send-btn"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ComposeMail;
