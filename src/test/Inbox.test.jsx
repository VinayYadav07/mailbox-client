import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

import { getDocs, updateDoc, deleteDoc } from "firebase/firestore";

describe("Inbox Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  // Helper function to mock getDocs response
  const mockGetDocsResponse = (emails) => {
    getDocs.mockResolvedValue({
      forEach: (callback) => {
        emails.forEach((email) => callback(email));
      },
      docs: emails,
    });
  };

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
      forEach: () => {},
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
          read: false,
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
          read: true,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("sender1@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Test Subject 1")).toBeInTheDocument();
      expect(screen.getByText("sender2@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Test Subject 2")).toBeInTheDocument();
    });
  });

  // Test 4: Compose button navigation
  test("should navigate to compose page on compose button click", async () => {
    getDocs.mockResolvedValue({
      forEach: () => {},
      docs: [],
    });

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

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
      forEach: () => {},
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

  // Test 6: Show blue dot for unread emails
  test("should show blue dot for unread emails", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Unread Subject",
          message: "Unread message",
          read: false,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Unread Subject")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  // Test 7: No blue dot for read emails
  test("should not show blue dot for read emails", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Read Subject",
          message: "Read message",
          read: true,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Read Subject")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  // Test 8: Click on unread email marks it as read
  test("should mark email as read when clicked", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Test Subject",
          message: "Test message",
          read: false,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);
    updateDoc.mockResolvedValue();

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Subject")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Test Subject"));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  // ========== DELETE TESTS ==========

  // Test 9: Delete button should be visible for each email
  test("should show delete button for each email", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Test Subject 1",
          message: "Test message 1",
          read: false,
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
          read: true,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByText("🗑️ Delete");
      expect(deleteButtons.length).toBe(2);
    });
  });

  // Test 10: Delete button click should call deleteDoc
  test("should call deleteDoc when delete button is clicked", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Test Subject",
          message: "Test message",
          read: false,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);
    deleteDoc.mockResolvedValue();

    // Mock confirm to return true
    window.confirm = vi.fn(() => true);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Subject")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("🗑️ Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled();
    });
  });

  // Test 11: Email should be removed from list after delete
  test("should remove email from list after successful delete", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Test Subject",
          message: "Test message",
          read: false,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);
    deleteDoc.mockResolvedValue();

    // Mock confirm to return true
    window.confirm = vi.fn(() => true);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Subject")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("🗑️ Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Test Subject")).not.toBeInTheDocument();
    });
  });

  // Test 12: Unread count should update after deleting unread email
  test("should update unread count after deleting an unread email", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Unread Email",
          message: "Test message",
          read: false,
          createdAt: { toDate: () => new Date() },
        }),
      },
      {
        id: "2",
        data: () => ({
          from: "sender2@gmail.com",
          to: "test@example.com",
          subject: "Read Email",
          message: "Test message",
          read: true,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);
    deleteDoc.mockResolvedValue();

    // Mock confirm to return true
    window.confirm = vi.fn(() => true);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("🗑️ Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  // Test 13: Unread count should not change after deleting read email
  test("should not change unread count after deleting a read email", async () => {
    const mockEmails = [
      {
        id: "1",
        data: () => ({
          from: "sender1@gmail.com",
          to: "test@example.com",
          subject: "Read Email",
          message: "Test message",
          read: true,
          createdAt: { toDate: () => new Date() },
        }),
      },
      {
        id: "2",
        data: () => ({
          from: "sender2@gmail.com",
          to: "test@example.com",
          subject: "Read Email 2",
          message: "Test message",
          read: true,
          createdAt: { toDate: () => new Date() },
        }),
      },
    ];

    mockGetDocsResponse(mockEmails);
    deleteDoc.mockResolvedValue();

    // Mock confirm to return true
    window.confirm = vi.fn(() => true);

    render(
      <BrowserRouter>
        <Inbox />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("🗑️ Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
