import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
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

  test("should render Signup component", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    expect(screen.getByRole("heading", { name: "Signup" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();
  });

  test("should show error when fields are empty", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
  });

  test("should show error when passwords do not match", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

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

  test("should show error when password is less than 6 characters", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

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

  test("should signup successfully with valid details", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        email: "test@gmail.com",
      },
    });
    sendEmailVerification.mockResolvedValue();

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

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
