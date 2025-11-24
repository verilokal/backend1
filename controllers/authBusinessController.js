import Business from '../models/businessModel.js';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password Required!' });
    }

    // Try business first
    Business.getByEmail(email, async (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.length > 0) {
            const business = result[0];

            if (!business.verified) {
                return res.status(403).json({ message: 'Your business is pending admin approval' });
            }

            const isMatch = await bcrypt.compare(password, business.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect Password' });
            }

            const token = jwt.sign(
                { id: business.business_id, email: business.email, role: 'business' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                message: 'Business Login Successfully!',
                token,
                user: { id: business.business_id, name: business.name, role: 'business' }
            });
        }

        // If not a business, check admin
        db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, adminResult) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            if (adminResult.length === 0) {
                return res.status(404).json({ message: 'Business or Admin Not Found!' });
            }

            const admin = adminResult[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect Password' });
            }

            const token = jwt.sign(
                { id: admin.admin_id, email: admin.email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                message: 'Admin Login Successfully!',
                token,
                user: { id: admin.admin_id, name: admin.name, role: 'admin' }
            });
        });
    });
};

export default { login };
