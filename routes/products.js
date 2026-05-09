const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pushpa17.pk@gmail.com',
    pass: 'ukqc bcbe upqa mmsy'
  }
});
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// GET ALL PRODUCTS

router.get('/',  (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    res.json(rows);
  });
});

// ADD PRODUCT

router.post('/', (req, res) => {
  const { name, price, quantity, image } = req.body;

  db.run(
    'INSERT INTO products (name, price, quantity, image) VALUES (?, ?, ?, ?)',
    [name, price, quantity, image],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error adding product' });
      }

      res.json({
        id: this.lastID,
        message: 'Product added'
      });
    }
  );
});

// SELL PRODUCT

router.put('/sell/:id', (req, res) => {

  const id = req.params.id;

  db.get(
    'SELECT * FROM products WHERE id = ?',
    [id],
    (err, product) => {

      if(err || !product){
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      db.run(
        'UPDATE products SET quantity = quantity - 1 WHERE id = ? AND quantity > 0',
        [id],
        function(err){

          if(err){
            return res.status(500).json({
              message: 'Error selling product'
            });
          }

          transporter.sendMail({

            from: 'pushpa17.pk@gmail.com',

            to: 'pushpa17.pk@gmail.com',

            subject: 'Stockr Sale Alert',

            text: `
Sold Item: ${product.name}

Price: ₹${product.price}

Quantity Left: ${product.quantity - 1}

Time: ${new Date().toLocaleString()}
`

          });

          res.json({
            message: 'Product sold'
          });

        }
      );

    }
  );

});

// RESTOCK

router.put('/restock/:id', (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;

  db.run(
    'UPDATE products SET quantity = quantity + ? WHERE id = ?',
    [amount, id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error restocking' });
      }

      res.json({ message: 'Restocked successfully' });
    }
  );
});

module.exports = router;