import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JobContext } from '../JobContext';

function ResultsPage() {
  const { jobData } = useContext(JobContext);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleContinueToEmail = () => {
    navigate('/email-info');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const generateCoverLetter = async () => {
      try {
        const response = await axios.post('http://localhost:5001/generate-cover-letter', {
          jobDescription: jobData.jobDescription,
          companyDetails: jobData.companyDetails,
          excitement: jobData.excitement
        });
        setCoverLetter(response.data.coverLetter);
      } catch (error) {
        console.error('Error generating cover letter:', error);
      } finally {
        setLoading(false);
      }
    };

    generateCoverLetter();
  }, [jobData]);

  if (loading) {
    return <p>Generating your cover letter...</p>;
  }

  return (
    <div>
      <h1>Your Cover Letter</h1>
      <p>{coverLetter}</p>
      <div>
        <button onClick={handleContinueToEmail}>Continue to Email Info</button>
        <button onClick={handleGoToProfile}>Go to Profile/Subscription Management</button>
      </div>
    </div>
  );
}

export default ResultsPage;