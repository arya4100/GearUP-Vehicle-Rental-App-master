import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock react-router-dom to avoid Jest resolution issues with v7 in legacy environments
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({children}) => <div>{children}</div>,
  Routes: ({children}) => <div>{children}</div>,
  Route: () => <div data-testid="mock-route" />,
  Link: ({children}) => <a href="/">{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useAuthStateChanged: () => jest.fn(),
}));

// Mock components that depend on Firebase or complex logic if necessary
jest.mock('./pages/authentication/Login', () => () => <div data-testid="login-page">Login Page</div>);

test('App component loads without crashing', () => {
  render(<App />);
});
