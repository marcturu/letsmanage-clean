import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const googleFontLink = document.createElement('link');
googleFontLink.href = 'https://fonts.googleapis.com/css2?family=Arial:wght@700&display=swap';
googleFontLink.rel = 'stylesheet';
document.head.appendChild(googleFontLink);

const googleFontLink2 = document.createElement('link');
googleFontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Merriweather:wght@400;700&display=swap';
googleFontLink.rel = 'stylesheet';
document.head.appendChild(googleFontLink2);

const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.href = 'https://use.fontawesome.com/releases/v6.6.0/css/all.css';
fontAwesomeLink.rel = 'stylesheet';
document.head.appendChild(fontAwesomeLink);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
