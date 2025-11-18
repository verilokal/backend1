import { create } from 'domain';
import Business from '../models/businessModel.js';
import bcrypt from 'bcrypt';

export const createBusiness = async (req, res) => {
  const { name, address, registered_business_name, registration_number, description, email, password, contact_no} = req.body;
  const product_img = req.files?.product_img ? req.files.product_img[0].path : null;
  const certificates = req.files?.certificates ? req.files.certificates[0].path : null;
  const logo = req.files?.logo ? req.files.logo[0].path : null;

  const hashedPassword =  await bcrypt.hash(password, 10);
  const data = {
    name,
    address,
    registered_business_name,
    registration_number,
    description,
    product_img,
    certificates,
    logo,
    email,
    password: hashedPassword,
    contact_no
  };

  if (!email || !password){
    return res.status(400).json({message: 'Email and Password Required!'});
  }

  Business.create(data, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        let message = 'Duplicate entry detected:';
        if (err.sqlMessage.includes('registered_business_name')) message += 'Registered Business Name';
        if (err.sqlMessage.includes('registration_number')) message += 'Registration Number';
        if (err.sqlMessage.includes('email')) message += 'Email';
        return res.status(400).json({message: message.trim() + 'Already exists!'});
      }
      return res.status(500).json({error: err});
    }
    res.status(201).json({ message: '✅ Business registered successfully!', id: result.insertId });
  });
};

export const getAllBusinesses = (req, res) => {
  Business.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


export const getBusinessById = (req, res) => {
  const id = req.params.id;
  Business.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Business not found' });
    res.json(result[0]);
  });
};

export const updateBusiness = (req, res) => {
  const id = req.params.id;
  const { name, address, registered_business_name, registration_number, description, contact_no} = req.body;

  const product_img = req.files?.product_img ? req.files.product_img[0].path : req.body.product_img;
  const certificates = req.files?.certificates ? req.files.certificates[0].path : req.body.certificates;
  const logo = req.files?.logo ? req.files.logo[0].path : req.body.logo;

  const data = {
    name,
    address,
    registered_business_name,
    registration_number,
    description,
    product_img,
    certificates,
    logo,
    contact_no
  };

  Business.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Business updated successfully!' });
  });
};

export const deleteBusiness = (req, res) => {
  const id = req.params.id;
  Business.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Business deleted successfully!' });
  });
};


export default { createBusiness, getAllBusinesses, getBusinessById, updateBusiness, deleteBusiness };
