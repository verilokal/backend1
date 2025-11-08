import { create } from 'domain';
import Business from '../models/businessModel.js';
import bcrypt from 'bcrypt';

export const createBusiness = async (req, res) => {
  const { name, address, registered_business_name, registration_number, description, email, password } = req.body;
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
    password: hashedPassword
  };

  if (!email || !password){
    return res.status(400).json({message: 'Email and Password Required!'});
  }

  Business.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
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
  const { name, address, registered_business_name, registration_number, description, socials} = req.body;

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
    socials
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
