import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../JobContext';

function EmailResultsPage() {
  const { jobData } = useContext(JobContext);
  const [emailContent, setEmailContent] = useState('');
  const [linkedInMessage, setLinkedInMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const generateMessages = async () => {
      try {
        const response = await axios.post('http://localhost:5001/generate-messages', {
          recipientName: jobData.recipientName,
          recipientTitle: jobData.recipientTitle,
          recipientInfo: jobData.recipientInfo,
          generateType: jobData.generateType
        });

        if (response.data.emailContent) {
          setEmailContent(response.data.emailContent);
        }

        if (response.data.linkedInContent) {
          setLinkedInMessage(response.data.linkedInContent);
        }

      } catch (error) {
        console.error('Error generating messages:', error);
      } finally {
        setLoading(false);
      }
    };

    generateMessages();
  }, [jobData]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return <p>Generating your content...</p>;
  }

  return (
    <div>
      {jobData.generateType === 'email' || jobData.generateType === 'both' ? (
        <div>
          <h2>Your Email</h2>
          <p>{emailContent}</p>
        </div>
      ) : null}

      {jobData.generateType === 'linkedin' || jobData.generateType === 'both' ? (
        <div>
          <h2>Your LinkedIn Message</h2>
          <p>{linkedInMessage}</p>
        </div>
      ) : null}

      {/* Button to go to Profile Page */}
      <button onClick={handleGoToProfile}>Go to Profile/Subscription Management</button>
    </div>
  );
}

export default EmailResultsPage;