import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../JobContext';

function EmailInfoPage() {
  const { setJobData } = useContext(JobContext);
  const [recipientName, setRecipientName] = useState('');
  const [recipientTitle, setRecipientTitle] = useState('');
  const [recipientInfo, setRecipientInfo] = useState('');
  const navigate = useNavigate();

  const handleGenerateEmail = () => {
    // Save the email data to the context
    setJobData((prevData) => ({
      ...prevData,
      recipientName,
      recipientTitle,
      recipientInfo,
      generateType: 'email', // Indicate email generation
    }));
    navigate('/email-results');
  };

  const handleGenerateLinkedIn = () => {
    // Save the LinkedIn message data to the context
    setJobData((prevData) => ({
      ...prevData,
      recipientName,
      recipientTitle,
      recipientInfo,
      generateType: 'linkedin', // Indicate LinkedIn message generation
    }));
    navigate('/email-results');
  };

  const handleGenerateBoth = () => {
    // Save both email and LinkedIn message data to the context
    setJobData((prevData) => ({
      ...prevData,
      recipientName,
      recipientTitle,
      recipientInfo,
      generateType: 'both', // Indicate both email and LinkedIn message generation
    }));
    navigate('/email-results');
  };

  return (
    <div>
      <h1>Enter Recipient Information</h1>
      <form>
        <div>
          <label>Recipient's Name:</label>
          <input 
            type="text" 
            value={recipientName} 
            onChange={(e) => setRecipientName(e.target.value)} 
            placeholder="Name of the person you're emailing"
            required 
          />
        </div>
        <div>
          <label>Recipient's Title:</label>
          <input 
            type="text" 
            value={recipientTitle} 
            onChange={(e) => setRecipientTitle(e.target.value)} 
            placeholder="Recipient's job title"
            required 
          />
        </div>
        <div>
          <label>Recipient Info (LinkedIn or Personal Bio):</label>
          <textarea 
            value={recipientInfo} 
            onChange={(e) => setRecipientInfo(e.target.value)} 
            placeholder="LinkedIn profile or personal bio"
            required
          />
        </div>
      </form>

      <div>
        <button onClick={handleGenerateEmail}>Generate Email</button>
        <button onClick={handleGenerateLinkedIn}>Generate LinkedIn Message</button>
        <button onClick={handleGenerateBoth}>Generate Both</button>
      </div>
    </div>
  );
}

export default EmailInfoPage;