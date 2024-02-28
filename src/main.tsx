import { MsalProvider } from '@azure/msal-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { auth } from './API';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={auth.clientApplication}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
)
