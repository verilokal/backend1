import express from 'express';
import db from '../config/db.js'; 

const router = express.Router();

router.get('/pending-businesses', (req, res) => {
  const baseUrl = "https://backend-al4l.onrender.com/uploads/"; // change if needed

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

    // Map each business to fix image paths
    const formatted = result.map((b) => ({
      ...b,
      product_img: b.product_img
        ? b.product_img.startsWith("http")
          ? b.product_img
          : baseUrl + b.product_img
        : null,

      certificates: b.certificates
        ? b.certificates.startsWith("http")
          ? b.certificates
          : baseUrl + b.certificates
        : null,

      logo: b.logo
        ? b.logo.startsWith("http")
          ? b.logo
          : baseUrl + b.logo
        : null
    }));

    res.json(formatted);
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
