import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Inbox from "../components/Inbox";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Firebase
vi.mock("../firebase", () => ({
  auth: { currentUser: { email: "test@example.com", uid: "123" } },
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
}));

import { getDocs } from "firebase/firestore";

describe("Inbox Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  // Test 1: Show loading state initially
  test("should show loading state initially", () => {
    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    expect(screen.getByText("Loading emails...")).toBeInTheDocument();
  });

  // Test 2: Show empty state when no emails
  test("should show empty state when no emails", async () => {
    getDocs.mockResolvedValue({
      forEach: (callback) => {},
      docs: [],
    });

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("📭 No emails yet")).toBeInTheDocument();
    });
  });

  // Test 3: Display emails when available
  test("should display emails when available", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Test Subject 1",
          message: "Test message 1",
          createdAt: { toDate: () => new Date() },
        }),
      },
      {
        id: "2",
        data: () => ({
          from: "sender2@gmail.com",
          to: "test@example.com",
          subject: "Test Subject 2",
          message: "Test message 2",
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    getDocs.mockResolvedValue({
      forEach: (callback) => mockEmails.forEach((doc) => callback(doc)),
      docs: mockEmails,
    });

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText("sender1@gmail.com")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Subject 1")).toBeInTheDocument();
    expect(screen.getByText("sender2@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Test Subject 2")).toBeInTheDocument();
  });

  // Test 4: Compose button navigation
  test("should navigate to compose page on compose button click", async () => {
    // Mock empty emails so loading finishes
    getDocs.mockResolvedValue({
      forEach: (callback) => {},
      docs: [],
    });

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText("✏️ Compose")).toBeInTheDocument();
    });

    const composeButton = screen.getByText("✏️ Compose");
    composeButton.click();

    expect(mockNavigate).toHaveBeenCalledWith("/compose");
  });

  // Test 5: Logout button navigation
  test("should navigate to login page on logout button click", async () => {
    getDocs.mockResolvedValue({
      forEach: (callback) => {},
      docs: [],
    });

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("🚪 Logout")).toBeInTheDocument();
    });

    const logoutButton = screen.getByText("🚪 Logout");
    logoutButton.click();

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
