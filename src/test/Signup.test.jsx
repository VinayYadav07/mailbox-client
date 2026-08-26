import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Signup from "../components/Signup";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: {},
}));

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

describe("Signup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Signup screen render
  test("should render Signup component", () => {
    render(<Signup />);

    expect(screen.getByRole("heading", { name: "Signup" })).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();
  });

  // 2. Empty fields
  test("should show error when fields are empty", () => {
    render(<Signup />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
  });

  // 3. Password mismatch
  test("should show error when passwords do not match", () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "1234567" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  // 4. Password less than 6 characters
  test("should show error when password is less than 6 characters", () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "12345" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      screen.getByText("Password must be at least 6 characters."),
    ).toBeInTheDocument();
  });

  // 5. Successful signup
  test("should signup successfully with valid details", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        email: "test@gmail.com",
      },
    });

    sendEmailVerification.mockResolvedValue();

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      await screen.findByText(
        "Signup successful! Please check your email and verify your account.",
      ),
    ).toBeInTheDocument();

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "test@gmail.com",
      "123456",
    );

    expect(sendEmailVerification).toHaveBeenCalled();
  });
});
