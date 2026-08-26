import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Login from "../components/Login";

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: {},
}));

vi.mock("../components/Welcome", () => ({
  default: () => <h2>Welcome to your mail box</h2>,
}));

import { signInWithEmailAndPassword } from "firebase/auth";

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. Login screen render
  test("Login screen should render", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
  });

  // 2. Empty fields
  test("Should show error when fields are empty", () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
  });

  // 3. Wrong credentials
  test("Should show error for wrong credentials", async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credential",
      message: "Invalid credential",
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrong123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Incorrect email or password."),
    ).toBeInTheDocument();
  });

  // 4. Correct credentials
  test("Should login with correct credentials", async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: {
        emailVerified: true,
        getIdToken: vi.fn().mockResolvedValue("test-token"),
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Welcome to your mail box"),
    ).toBeInTheDocument();

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "test@gmail.com",
      "password123",
    );
  });

  // 5. Welcome screen after successful login
  test("Should show Welcome screen after successful login", async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: {
        emailVerified: true,
        getIdToken: vi.fn().mockResolvedValue("test-token"),
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Welcome to your mail box"),
    ).toBeInTheDocument();
  });
});
