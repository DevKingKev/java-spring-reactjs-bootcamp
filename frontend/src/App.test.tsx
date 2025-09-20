import { render, screen } from '@testing-library/react';
import App from './App';

test('renders React Frontend heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/React Frontend/i);
  expect(headingElement).toBeInTheDocument();
});