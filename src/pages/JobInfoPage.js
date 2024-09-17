import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../JobContext';

function JobInfoPage() {
  const { setJobData } = useContext(JobContext);
  const [jobDescription, setJobDescription] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [excitement, setExcitement] = useState('');
  const [resume, setResume] = useState(null); // State to handle the resume file
  const [loading, setLoading] = useState(false); // Loading state to prevent multiple clicks
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the button is clicked

    // Save the job data to the context (for processing later)
    setJobData({
      jobDescription,
      companyDetails,
      excitement,
      resume
    });

    // Perform background processing (generate the cover letter)
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('companyDetails', companyDetails);
    formData.append('excitement', excitement);
    formData.append('resume', resume);

    try {
      const response = await axios.post('http://localhost:5001/generate-cover-letter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to the results page with the generated cover letter
      navigate('/results', { state: { coverLetter: response.data.coverLetter } });

    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setLoading(false); // Reset loading state (optional if navigating)
    }
  };

  return (
    <div>
      <h1>Job Info</h1>
      {loading ? (
        <p>Generating your cover letter...</p> // Display loading message while processing
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here"
              required
            />
          </div>
          <div>
            <label>Company Details (optional):</label>
            <input
              type="text"
              value={companyDetails}
              onChange={(e) => setCompanyDetails(e.target.value)}
              placeholder="Company name, values, or mission"
            />
          </div>
          <div>
            <label>What Excites You About This Role? (optional):</label>
            <input
              type="text"
              value={excitement}
              onChange={(e) => setExcitement(e.target.value)}
              placeholder="Why are you excited about this role?"
            />
          </div>
          <div>
            <label>Upload Resume (PDF only):</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" disabled={loading}>Generate Cover Letter</button> {/* Disable button while loading */}
        </form>
      )}
    </div>
  );
}

export default JobInfoPage;