require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/generate-cover-letter', upload.single('resume'), async (req, res) => {
  const { jobDescription, companyDetails, excitement } = req.body;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No resume uploaded' });
  }

  // Extract text from the uploaded resume (PDF)
  const resumePath = req.file.path;

  try {
    const resumeBuffer = fs.readFileSync(resumePath);
    const resumeData = await pdfParse(resumeBuffer);
    const resumeText = resumeData.text;  // Full resume text

    // Use the full resume text in the OpenAI prompt for cover letter generation
    const prompt = `
      Write a professional cover letter for the following job description:
      Job Description: ${jobDescription}.
      Company details: ${companyDetails}.
      What excites me about the role: ${excitement}.
      Relevant experience from resume: ${resumeText}.
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that writes professional, personalized cover letters.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Clean up the uploaded resume file
    fs.unlinkSync(resumePath);

    // Send the generated cover letter as the response
    res.json({ coverLetter: response.data.choices[0].message.content });

  } catch (error) {
    console.error('Error processing resume or generating cover letter:', error.message);
    res.status(500).json({ error: 'Failed to process resume or generate cover letter' });
  }
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