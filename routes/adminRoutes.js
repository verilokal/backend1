import express from 'express';
import db from '../config/db.js'; // your DB connection

const router = express.Router();

// Get pending businesses
router.get('/pending-businesses', (req, res) => {
  const sql = `
    SELECT 
      id, 
      name, 
      address, 
      registered_business_name, 
      description, 
      product_img, 
      certificates, 
      logo, 
      contact_no
    FROM business
    WHERE verified = 0
    ORDER BY created_at ASC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

// Verify a business
router.put('/verify/:id', (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE business SET verified = 1 WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: 'Business verified!' });
  });
});

export default router;
