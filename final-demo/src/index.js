import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// OWASP A08 – Software and Data Integrity Failures
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ErrorBoundary catches unexpected runtime errors and prevents
        raw stack traces from being displayed to users */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
