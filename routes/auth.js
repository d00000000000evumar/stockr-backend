const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// REGISTER

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    function(err) {
      if (err) {
        return res.status(400).json({ message: 'User already exists' });
      }

      res.json({ message: 'User registered' });
    }
  );
});

// LOGIN

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );

      res.json({
        token,
        username: user.username,
        role: user.role
      });
    }
  );
});

module.exports = router;