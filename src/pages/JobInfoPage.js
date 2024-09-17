import React, { useState, useContext } from 'react';
import { JobContext } from '../JobContext';
import { useNavigate } from 'react-router-dom';

function JobInfoPage() {
  const { setJobData } = useContext(JobContext);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [excitement, setExcitement] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save data to context
    setJobData({ resume, jobDescription, companyDetails, excitement });
    // Navigate to the results page (we'll set this up next)
    navigate('/results');
  };

  return (
    <div>
      <h1>Job Info</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Resume:</label>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={(e) => setResume(e.target.files[0])} 
          />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here"
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
        <button type="submit">Next</button>
      </form>
    </div>
  );
}

export default JobInfoPage;