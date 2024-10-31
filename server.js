require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit to handle large base64 images

app.post('/send-email', async (req, res) => {
  const { to, subject, text, chartImage } = req.body;
  console.log("SEND EMAIL WORKS", {to, chartImage});
  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.resend.com', // Replace with Resend SMTP host
    port: 587, // Replace with the appropriate port for Resend
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable for Resend user
      pass: process.env.EMAIL_PASS // Use environment variable for Resend password
    }
  });

  // Define email options
  let mailOptions = {
    from: "test@resend.dev", // Use environment variable
    to: to,
    subject: "your chart image",
    text: "your chart is attached",
    attachments: [
      {
        filename: 'chart.png',
        content: chartImage.split("base64,")[1],
        encoding: 'base64'
      }
    ]
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    res.status(500).send('Failed to send email: ' + error.message);
  } 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});