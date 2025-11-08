import dotenv from "dotenv";
dotenv.config();
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'interchange.proxy.rlwy.net', 
  user: 'root',
  password: 'MWspMwOfbUvTsLHjkvGyrXrhOhRSImMq',
  database: 'railway',
  port: 41155, 
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database Connection Error!', err);
  } else {
    console.log('✅ Database Connected!');
  }
});

//BUSINESS TABLE
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

//PRODUCT TABLE
const createPRODUCTTable = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,  
  origin VARCHAR(255),
  materials TEXT,
  description TEXT,
  qr_code TEXT,
  blockchain_hash TEXT,
  business_id INT,
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
