import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemingProvider from './theme/provider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemingProvider>
      <App />
    </ThemingProvider>
  </React.StrictMode>
);
