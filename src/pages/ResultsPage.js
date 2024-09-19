import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { JobContext } from '../JobContext';

function ResultsPage() {
  const { jobData } = useContext(JobContext);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract isPaid from query parameters
  const queryParams = new URLSearchParams(location.search);
  const isPaid = queryParams.get('isPaid');

  useEffect(() => {
    if (isPaid !== 'true') {
      // If not paid, redirect to the checkout page
      navigate('/checkout');
      return;
    }

    // Check if cover letter was passed from the previous page
    if (location.state && location.state.coverLetter) {
      setCoverLetter(location.state.coverLetter);
      setLoading(false);
    } else {
      // Generate the cover letter if it wasn't passed
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
  }, [jobData, location.state, isPaid, navigate]);

  if (loading) {
    return <p>Generating your cover letter...</p>;
  }

  return (
    <div>
      <h1>Your Cover Letter</h1>
      <p>{coverLetter}</p>
      <div>
        <button onClick={() => navigate('/email-info')}>Continue to Email Info</button>
        <button onClick={() => navigate('/profile')}>Go to Profile/Subscription Management</button>
      </div>
    </div>
  );
}

export default ResultsPage;