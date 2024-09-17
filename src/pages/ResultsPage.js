import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { JobContext } from '../JobContext';

function ResultsPage() {
  const { jobData } = useContext(JobContext);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);

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
    </div>
  );
}

export default ResultsPage;