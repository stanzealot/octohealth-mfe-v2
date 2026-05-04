import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <div style={{ padding: '2rem', fontFamily: 'Montserrat, sans-serif' }}>
      <h2>Remote CRM — loaded via Module Federation</h2>
      <p>Start the shell at :3000 and navigate to /crm to see the contacts module.</p>
    </div>
  </BrowserRouter>,
);
