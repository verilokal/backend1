import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and Password required!' });

  const sql = 'SELECT * FROM admins WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Admin not found!' });

    const admin = result[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password!' });

    const token = jwt.sign(
      { id: admin.admin_id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login Successful!',
      token,
      admin: {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      },
    });
  });
};

export default { loginAdmin };
