import dotenv from "dotenv";
dotenv.config();
import mysql from 'mysql2';
import fs from "fs";

const db = mysql.createConnection({
  host: 'centerbeam.proxy.rlwy.net', 
  user: 'root',
  password: 'PUjAsXzRGhrnuWIByjCBCCKEmnihLNXe',
  database: 'railway',
  port: 16896, 
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database Connection Error!', err);
  } else {
    console.log('✅ Database Connected!');
  }
});

const createBUSINESSTable = `
CREATE TABLE IF NOT EXISTS business (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL, 
  address VARCHAR(255),
  registered_business_name VARCHAR(255),
  registration_number VARCHAR(100),
  description TEXT,
  product_img TEXT,
  certificates TEXT,
  logo TEXT,
  email VARCHAR(255),
  password VARCHAR(255),
  contact_no VARCHAR(11),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
const createPRODUCTTable = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,  
  origin VARCHAR(255),
  materials TEXT,
  description TEXT,
  product_image TEXT,
  type VARCHAR(255),
  productionDate VARCHAR(100),
  qr_code TEXT,
  blockchain_hash TEXT,
  business_id INT,
  tx_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES business(id)
);
`;


db.query(createBUSINESSTable, (err) => {
  if (err) console.error('❌ Business Table Error!', err);
  else console.log('✅ Business Table Ready!');
});

db.query(createPRODUCTTable, (err) => {
  if (err) console.error('❌ Product Table Error!', err);
  else console.log('✅ Product Table Ready!');
});

export default db;
