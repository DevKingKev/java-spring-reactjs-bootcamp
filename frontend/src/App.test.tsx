import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders movie search app", () => {
  render(<App />);
  const headingElement = screen.getByText(/Welcome to Movie Search/i);
  expect(headingElement).toBeInTheDocument();
});

test("renders navigation links", () => {
  render(<App />);
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
  expect(screen.getByText("Favourites")).toBeInTheDocument();
  expect(screen.getByText("History")).toBeInTheDocument();
});

test("renders theme toggle button", () => {
  render(<App />);
  const themeToggle = screen.getByText("🌙");
  expect(themeToggle).toBeInTheDocument();
});
