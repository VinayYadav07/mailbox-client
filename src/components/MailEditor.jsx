import { useRef } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const MailEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const executeCommand = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="mail-editor">
      <div className="editor-toolbar d-flex flex-wrap gap-1">
        <ButtonGroup size="sm" className="me-1">
          <Button
            variant="outline-secondary"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("bold");
            }}
          >
            <strong>B</strong>
          </Button>
          <Button
            variant="outline-secondary"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("italic");
            }}
          >
            <em>I</em>
          </Button>
          <Button
            variant="outline-secondary"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("underline");
            }}
          >
            <u>U</u>
          </Button>
        </ButtonGroup>

        <select
          className="form-select form-select-sm d-inline-block me-1"
          style={{ width: "100px" }}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              executeCommand("foreColor", e.target.value);
            }
            e.target.value = "";
          }}
        >
          <option value="">Color</option>
          <option value="#000000">Black</option>
          <option value="#FF0000">Red</option>
          <option value="#0000FF">Blue</option>
          <option value="#008000">Green</option>
        </select>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        className="editor-content"
        data-placeholder="Write your message..."
      />
    </div>
  );
};

export default MailEditor;
