import Business from '../models/businessModel.js';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = (req, res) => {
    const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json({message: 'Email and Password Required!'});
    }

    const credentials = {
        email,
        password
    };

    Business.getByEmail(email, async (err, result) => {
        if (err) return res.status(500)({message: 'Database error', error: err});
        if (result.length === 0 ) {
            return res.status(404).json({message: 'Business Not Found!'});
        }
        const business = result[0];
        const isMatch = await bcrypt.compare(password, business.password);
        if (!isMatch) {
            return res.status(404).json({message: 'Incorrect Password'});
        }
        const token = jwt.sign(
            {id: business.id, email: business.email},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );
        res.status(200).json({
            message: 'Login Successfully!',
            token: token,
            business: {
                id: business.id,
                name: business.name,
                email: business.email,
            },
        });
    });
};

export default {login};