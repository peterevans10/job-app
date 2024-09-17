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
  
    const prompt = `
      Write a professional cover letter for the following job description:
      Job Description: ${jobDescription}.
      Company details: ${companyDetails}.
      What excites me about the role: ${excitement}.
    `;
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',  // Chat API endpoint for gpt-4 or gpt-3.5-turbo
        {
          model: 'gpt-4o',  // Or 'gpt-3.5-turbo' if you want to use GPT-3.5
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
      
      res.json({ coverLetter: response.data.choices[0].message.content });
    } catch (error) {
      console.error('Error generating cover letter:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
  });
  
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});