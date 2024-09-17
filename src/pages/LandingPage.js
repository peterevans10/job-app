import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1>Welcome to JobApp</h1>
      <Link to="/job-info">
        <button>Start Now</button>
      </Link>
    </div>
  );
}

export default LandingPage;