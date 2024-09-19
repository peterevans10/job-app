import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../JobContext';

function JobInfoPage() {
  const { setJobData } = useContext(JobContext);
  const [jobDescription, setJobDescription] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [excitement, setExcitement] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Save the job data to the context (for processing later)
    setJobData({
      jobDescription,
      companyDetails,
      excitement,
      resume,
    });
  
    // Redirect to the loading page to handle payment check
    navigate('/loading');
  };  

  return (
    <div>
      <h1>Job Info</h1>
      {loading ? (
        <p>Generating your cover letter...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Upload Resume (PDF only):</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
          </div>
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
          <button type="submit" disabled={loading}>Generate Cover Letter</button>
        </form>
      )}
    </div>
  );
}

export default JobInfoPage;