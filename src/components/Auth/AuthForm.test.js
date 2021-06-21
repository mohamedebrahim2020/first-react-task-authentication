import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import AuthForm from "./AuthForm";

test("renders  if the switch button was clicked", () => {
  // Arrange
  render(
    <Router>
      <AuthForm />
    </Router>
  );

  // Act
  const buttonElement = screen.getByRole("switchButton");
  userEvent.click(buttonElement);

  // Assert

  const outputElement2 = screen.getByText("Login with existing account");
  expect(outputElement2).toBeInTheDocument();
});

test("renders if the switch button was not clicked", () => {
  // Arrange
  render(
    <Router>
      <AuthForm />
    </Router>
  );

  // Act

  // Assert
  const outputElement2 = screen.getByText("Create new account");
  expect(outputElement2).toBeInTheDocument();
});
