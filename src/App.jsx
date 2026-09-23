import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Inbox from "./pages/Inbox";
import Sent from "./pages/Sent";
import ComposeMail from "./pages/ComposeMail";
import ReadMail from "./pages/ReadMail";

import { AuthProvider } from "./store/AuthContext";
import { MailProvider } from "./store/MailContext";

function App() {
  return (
    <AuthProvider>
      <MailProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Header />
                  <Container fluid className="p-0">
                    <Row className="g-0">
                      <Col md={3} lg={2} className="sidebar-col">
                        <Sidebar />
                      </Col>
                      <Col md={9} lg={10} className="content-col">
                        <Routes>
                          <Route path="/" element={<Navigate to="/inbox" />} />
                          <Route path="/welcome" element={<Welcome />} />
                          <Route path="/inbox" element={<Inbox />} />
                          <Route path="/sent" element={<Sent />} />
                          <Route path="/compose" element={<ComposeMail />} />
                          <Route path="/mail/:id" element={<ReadMail />} />
                        </Routes>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MailProvider>
    </AuthProvider>
  );
}

export default App;
