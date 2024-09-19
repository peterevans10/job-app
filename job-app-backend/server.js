require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Stripe = require('stripe');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// commented out real one for testing
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key
const stripe = Stripe('sk_test_51Q0B3nP7SZA2M75awGN1fK1XVjLp3FpHGVt5sSiuF5JGIRaq4kQrj3VFngUUY8LP4B7WdogouUca7Dk4cZmIYjY5001AyTgNfi'); // Use your Stripe secret key

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
    httpOnly: true, // Prevent client-side JavaScript from accessing cookies
    maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration (24 hours)
    sameSite: 'lax' // Helps with cross-site request issues during redirects
  }

}));

app.post('/generate-cover-letter', upload.single('resume'), async (req, res) => {
  const { jobDescription, companyDetails, excitement } = req.body;

  // // Check if a file was uploaded
  // if (!req.file) {
  //   return res.status(400).json({ error: 'No resume uploaded' });
  // }

  // // Extract text from the uploaded resume (PDF)
  // const resumePath = req.file.path;

  // try {
  //   const resumeBuffer = fs.readFileSync(resumePath);
  //   const resumeData = await pdfParse(resumeBuffer);
  //   const resumeText = resumeData.text;  // Full resume text

  //   // Use the full resume text in the OpenAI prompt for cover letter generation
  //   const prompt = `
  //     Write a professional cover letter for the following job description:
  //     Job Description: ${jobDescription}.
  //     Company details: ${companyDetails}.
  //     What excites me about the role: ${excitement}.
  //     Relevant experience from resume: ${resumeText}.
  //   `;

  //   const response = await axios.post(
  //     'https://api.openai.com/v1/chat/completions',
  //     {
  //       model: 'gpt-4o',
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

  //   // Clean up the uploaded resume file
  //   fs.unlinkSync(resumePath);

  //   // Send the generated cover letter as the response
  //   res.json({ coverLetter: response.data.choices[0].message.content });

  // } catch (error) {
  //   console.error('Error processing resume or generating cover letter:', error.message);
  //   res.status(500).json({ error: 'Failed to process resume or generate cover letter' });
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

  const placeholderEmail = `
    Dear ${recipientName},

    I hope this message finds you well. I wanted to connect to explore potential opportunities and discuss how my background aligns with your company. 

    Best regards,
    Test User
  `;

  const placeholderLinkedInMessage = `
    Hi ${recipientName},

    I'd love to connect and discuss opportunities. I believe my background aligns well with your role as ${recipientTitle}.

    Best, Test User
  `;

  // Return the appropriate message based on generateType
  res.json({
    emailContent: generateType === 'email' || generateType === 'both' ? placeholderEmail : null,
    linkedInContent: generateType === 'linkedin' || generateType === 'both' ? placeholderLinkedInMessage : null
  });

  // const emailPrompt = `
  //   Write a professional email to ${recipientName}, ${recipientTitle}, referencing their background: ${recipientInfo}.
  //   The email should express interest in working together and discussing potential opportunities.
  // `;

  // const linkedInPrompt = `
  //   Write a concise LinkedIn message (less than 300 characters) to ${recipientName}, referencing their role as ${recipientTitle}, and briefly mentioning their background (${recipientInfo}).
  //   The message should request to connect and express interest in opportunities.
  // `;

  // try {
  //   let emailResponse, linkedInResponse;
    
  //   if (generateType === 'email' || generateType === 'both') {
  //     emailResponse = await axios.post(
  //       'https://api.openai.com/v1/chat/completions',
  //       {
  //         model: 'gpt-4o',
  //         messages: [
  //           { role: 'system', content: 'You are a helpful assistant that writes personalized, professional, cold emails to help job applicants obtain job interviews.' },
  //           { role: 'user', content: emailPrompt }
  //         ],
  //         max_tokens: 300,
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  //   }

  //   if (generateType === 'linkedin' || generateType === 'both') {
  //     linkedInResponse = await axios.post(
  //       'https://api.openai.com/v1/chat/completions',
  //       {
  //         model: 'gpt-4o',
  //         messages: [
  //           { role: 'system', content: 'You are a helpful assistant that writes personalized, professional, cold LinkedIn connection requests to help job applicants obtain job interviews.' },
  //           { role: 'user', content: linkedInPrompt }
  //         ],
  //         max_tokens: 150,
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  //   }

  //   res.json({
  //     emailContent: emailResponse ? emailResponse.data.choices[0].message.content : null,
  //     linkedInContent: linkedInResponse ? linkedInResponse.data.choices[0].message.content : null
  //   });

  // } catch (error) {
  //   console.error('Error generating messages:', error.response ? error.response.data : error.message);
  //   res.status(500).json({ error: error.response ? error.response.data : error.message });
  // }
});

app.get('/check-payment-status', async (req, res) => {
  
  console.log('Session in check-payment-status:', req.session);

  // Check if paymentStatus exists in the session
  if (req.session.paymentStatus && req.session.paymentStatus.isPaid) {
    // If isPaid is true, return true
    res.json({ isPaid: true });
  } else {
    // If not paid, return false
    res.json({ isPaid: false });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    // Check if this is a one-time payment
    const isOneTime = priceId === 'price_1Q0CJTP7SZA2M75ahWQ4J88L';
    const mode = isOneTime ? 'payment' : 'subscription'; // 'payment' for one-time, 'subscription' for recurring

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Dynamic price from the frontend
          quantity: 1,
        },
      ],
      mode: mode, // Dynamically set mode to 'payment' or 'subscription'
      success_url: 'http://localhost:5001/success', // Redirect to success page after payment
      cancel_url: 'http://localhost:5001/cancel', // Redirect to cancel page if payment is canceled
    });

    // Save the selected plan and payment status in the session
    req.session.paymentStatus = {
      isPaid: false, // This will be updated after successful payment
      plan: isOneTime ? 'one-time' : 'subscription'
    };

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.get('/success', (req, res) => {
  // Mark the session as paid
  req.session.paymentStatus = { isPaid: true };

  // Redirect to results page with isPaid in the query string
  res.redirect(`http://localhost:3000/results?isPaid=true`);
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});