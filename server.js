const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pushpa17.pk@gmail.com',
    pass: 'ukqc bcbe upqa mmsy'
  }
});
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

require('./database/db');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => {
  res.send('Stockr Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});