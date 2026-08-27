import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Compose from "../components/Compose";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Editor (DraftJS)
vi.mock("@aloushek/react-draft-wysiwyg-next", () => ({
  Editor: () => <div data-testid="mock-editor">Mock Editor</div>,
}));

// Mock Firebase
vi.mock("../firebase", () => ({
  auth: { currentUser: { email: "test@example.com", uid: "123" } },
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

describe("Compose Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  // Test 1: Render Compose Screen
  test("should render compose screen with all fields", () => {
    render(
      <BrowserRouter>
        <Compose />
      </BrowserRouter>,
    );

    expect(
      screen.getByPlaceholderText("Enter recipient email"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Subject")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  // Test 2: Empty Fields Validation
  test("should show error when all fields are empty", async () => {
    render(
      <BrowserRouter>
        <Compose />
      </BrowserRouter>,
    );

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    expect(
      await screen.findByText("Please fill in all fields."),
    ).toBeInTheDocument();
  });

  // Test 3: Invalid Email Validation - Skip
  test.skip("should show error for invalid email format", () => {});

  // Test 4: Successful Email Send - Skip
  test.skip("should send email successfully with valid data", () => {});

  // Test 5: Cancel Button Navigation
  test("should navigate back to welcome page on cancel", () => {
    render(
      <BrowserRouter>
        <Compose />
      </BrowserRouter>,
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/welcome");
  });
});
