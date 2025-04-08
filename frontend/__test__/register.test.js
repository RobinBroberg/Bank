import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../pages/register";
import { registerUser } from "../utils/api";

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../utils/api", () => ({
  registerUser: jest.fn(),
}));

test("register form works and calls API", async () => {
  render(<Register />);

  const usernameInput = screen.getByLabelText("Användarnamn");
  const passwordInput = screen.getByLabelText("Lösenord");
  const submitButton = screen.getByRole("button", {
    name: "Skapa användare",
  });

  fireEvent.change(usernameInput, { target: { value: "Robin" } });
  fireEvent.change(passwordInput, { target: { value: "test123" } });
  fireEvent.click(submitButton);

  expect(registerUser).toHaveBeenCalledWith("Robin", "test123");
});

test("renders the correct heading", () => {
  render(<Register />);
  const headingElement = screen.getByRole("heading", { level: 2 });
  expect(headingElement).toHaveTextContent("Skapa användare");
});
