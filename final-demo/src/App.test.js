import { render } from '@testing-library/react';
import React from 'react';

// Mock react-router-dom to avoid Jest resolution issues with v7 in legacy environments
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({children}) => <div>{children}</div>,
  Routes: ({children}) => <div>{children}</div>,
  Route: () => <div data-testid="mock-route" />,
  Link: ({children}) => <a>{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useAuthStateChanged: () => jest.fn(),
}));

// Mock components that depend on Firebase or complex logic if necessary
jest.mock('./pages/authentication/Login', () => () => <div data-testid="login-page">Login Page</div>);

import App from './App';

test('App component loads without crashing', () => {
  render(<App />);
});
