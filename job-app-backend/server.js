require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/generate-cover-letter', async (req, res) => {
    const { jobDescription, companyDetails, excitement } = req.body;
  
    // const prompt = `
    //   Write a professional cover letter for the following job description:
    //   Job Description: ${jobDescription}.
    //   Company details: ${companyDetails}.
    //   What excites me about the role: ${excitement}.
    // `;
  
    // try {
    //   const response = await axios.post(
    //     'https://api.openai.com/v1/chat/completions',  // Chat API endpoint for gpt-4 or gpt-3.5-turbo
    //     {
    //       model: 'gpt-4o',  // Or 'gpt-3.5-turbo' if you want to use GPT-3.5
    //       messages: [
    //         { role: 'system', content: 'You are a helpful assistant that writes professional, personalized cover letters.' },
    //         { role: 'user', content: prompt }
    //       ],
    //       max_tokens: 500,
    //     },
    //     {
    //       headers: {
    //         'Authorization': `Bearer ${OPENAI_API_KEY}`,
    //         'Content-Type': 'application/json',
    //       }
    //     }
    //   );
      
    //   res.json({ coverLetter: response.data.choices[0].message.content });
    // } catch (error) {
    //   console.error('Error generating cover letter:', error.response ? error.response.data : error.message);
    //   res.status(500).json({ error: error.response ? error.response.data : error.message });
    // }

    const placeholderCoverLetter = `
    Dear Hiring Manager,
    
    I am excited to apply for this role and am confident that my experience aligns with your job description. I look forward to contributing to the company's success and growing professionally in this position.
    
    Sincerely,
    Test User
  `;

  res.json({ coverLetter: placeholderCoverLetter });
  });

app.post('/generate-messages', async (req, res) => {
  const { recipientName, recipientTitle, recipientInfo, generateType } = req.body;

  const emailPrompt = `
    Write a professional email to ${recipientName}, ${recipientTitle}, referencing their background: ${recipientInfo}.
    The email should express interest in working together and discussing potential opportunities.
  `;

  const linkedInPrompt = `
    Write a concise LinkedIn message (less than 300 characters) to ${recipientName}, referencing their role as ${recipientTitle}, and briefly mentioning their background (${recipientInfo}).
    The message should request to connect and express interest in opportunities.
  `;

  try {
    let emailResponse, linkedInResponse;
    
    if (generateType === 'email' || generateType === 'both') {
      emailResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that writes personalized, professional, cold emails to help job applicants obtain job interviews.' },
            { role: 'user', content: emailPrompt }
          ],
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    if (generateType === 'linkedin' || generateType === 'both') {
      linkedInResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that writes personalized, professional, cold LinkedIn connection requests to help job applicants obtain job interviews.' },
            { role: 'user', content: linkedInPrompt }
          ],
          max_tokens: 150,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    res.json({
      emailContent: emailResponse ? emailResponse.data.choices[0].message.content : null,
      linkedInContent: linkedInResponse ? linkedInResponse.data.choices[0].message.content : null
    });

  } catch (error) {
    console.error('Error generating messages:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
  });
  
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});