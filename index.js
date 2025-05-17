require('dotenv').config();
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

// MongoDB setup
const client = new MongoClient(process.env.MONGO_URI);
let collection;

async function connectDB() {
  await client.connect();
  const db = client.db('SkipCryRecomendation');
  collection = db.collection('WhatsApp');
}
connectDB().catch(console.error);

app.post('/webhook', async (req, res) => {
  console.log('Incoming request body:', req.body);
  
  const from = req.body.From || '';
  const message = (req.body.Body || '').trim().toLowerCase();

  const twiml = new MessagingResponse();

  // Simple welcome message for testing
  if (message === 'hi' || message === 'hello') {
    twiml.message('👋 Hello! What is the name of your child? (letters and spaces only)');
  } else {
    twiml.message('Sorry, please start by saying "hi"');
  }
console.log('Replying with TwiML:', twiml.toString());

  res.set('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
