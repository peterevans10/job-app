import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { JobProvider } from './JobContext';

ReactDOM.render(
  <React.StrictMode>
    <JobProvider>
      <App />
    </JobProvider>
  </React.StrictMode>,
  document.getElementById('root')
);