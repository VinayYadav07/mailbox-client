import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Signup from "../components/Signup";

describe("Signup Component", () => {
  test("should render Signup component", () => {
    render(<Signup />);

    expect(screen.getByText("Signup")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();
  });

  test("should show error when fields are empty", () => {
    render(<Signup />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
  });

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

  test("should accept valid signup details", () => {
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

    expect(screen.getByDisplayValue("test@gmail.com")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("123456")).toHaveLength(2);
  });
});
