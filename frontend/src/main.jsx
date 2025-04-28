import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ correct import
import App from './App.jsx';
import { StrictMode } from 'react'; // ✅ needed for <StrictMode>

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
