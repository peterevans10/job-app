import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { JobContext } from '../JobContext';

function ResultsPage() {
  const { jobData } = useContext(JobContext);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get the cover letter if it's passed through location.state
  
  // Check if cover letter was passed from the previous page
  useEffect(() => {
    if (location.state && location.state.coverLetter) {
      // If the cover letter is already passed from JobInfoPage, use it directly
      setCoverLetter(location.state.coverLetter);
      setLoading(false);
    } else {
      // Only make the API call if the cover letter wasn't passed through location.state
      const generateCoverLetter = async () => {
        try {
          const formData = new FormData();
          formData.append('jobDescription', jobData.jobDescription);
          formData.append('companyDetails', jobData.companyDetails);
          formData.append('excitement', jobData.excitement);
          formData.append('resume', jobData.resume);

          const response = await axios.post('http://localhost:5001/generate-cover-letter', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          setCoverLetter(response.data.coverLetter);
        } catch (error) {
          console.error('Error generating cover letter:', error);
        } finally {
          setLoading(false);
        }
      };

      generateCoverLetter();
    }
  }, [jobData, location.state]);

  const handleContinueToEmail = () => {
    navigate('/email-info');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

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