import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import JobInfoPage from './pages/JobInfoPage';
import ResultsPage from './pages/ResultsPage';
import EmailInfoPage from './pages/EmailInfoPage';
import ProfilePage from './pages/ProfilePage'; // Assume this is the profile page
import EmailResultsPage from './pages/EmailResultsPage';
import CheckoutPage from './pages/CheckoutPage';
import LoadingPage from './pages/LoadingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/job-info" element={<JobInfoPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/email-info" element={<EmailInfoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/email-results" element={<EmailResultsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </Router>
  );
}

export default App;