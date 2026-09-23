import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container className="mt-5">
      <Card className="shadow text-center">
        <Card.Body className="p-5">
          <h1 className="fw-bold">Welcome to your mail box</h1>
          <p className="text-muted mt-3">{user?.email}</p>
          <Button className="mt-3" onClick={() => navigate("/inbox")}>
            Go to Inbox
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Welcome;
