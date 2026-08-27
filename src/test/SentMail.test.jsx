/* eslint-env jest */
// src/test/SentMail.test.jsx
import { render, screen } from "@testing-library/react";
import SentMail from "../components/SentMail";
import axios from "axios";
import "@testing-library/jest-dom";

// Vitest mein "vi" use hota hai, "jest" nahi!
vi.mock("axios");

describe("SentMail Component", () => {
  // Test Case 1: Loading State
  test("shows loading text while fetching emails", () => {
    axios.get = vi.fn().mockReturnValue(new Promise(() => {}));
    render(<SentMail />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  // Test Case 2: Success State (Data Render)
  test("renders the list of sent emails after successful API call", async () => {
    const mockEmails = [
      { id: 1, to: "test@example.com", subject: "Hello World" },
      { id: 2, to: "john@example.com", subject: "Meeting" },
    ];
    axios.get = vi.fn().mockResolvedValue({ data: mockEmails });
    render(<SentMail />);

    expect(await screen.findByText(/Hello World/)).toBeInTheDocument();
    expect(screen.getByText(/Meeting/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  // Test Case 3: Error State
  test("shows an error message if the API request fails", async () => {
    axios.get = vi.fn().mockRejectedValue(new Error("Network Error"));
    render(<SentMail />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
