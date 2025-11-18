import db from '../config/db.js';


const Business = {
  create: (data, callback) => {
    const sql = `INSERT INTO business 
      (name, address, registered_business_name, registration_number, description, product_img, certificates, logo, email, password, contact_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [
      data.name,
      data.address,
      data.registered_business_name,
      data.registration_number,
      data.description,
      data.product_img,
      data.certificates,
      data.logo,
      data.email,
      data.password,
      data.contact_no
    ], callback);
  },


  getAll: (callback) => {
    db.query('SELECT * FROM business', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM business WHERE id = ?', [id], callback);
  },

   getByEmail: (email, callback) => {
    db.query('SELECT * FROM business WHERE email = ?', [email], callback);
  },

  update: (id, data, callback) => {
    const sql = `UPDATE business SET
      name=?, address=?, registered_business_name=?, registration_number=?, description=?, 
      product_img=?, certificates=?, logo=? WHERE id=?`;
    db.query(sql, [
      data.name,
      data.address,
      data.registered_business_name,
      data.registration_number,
      data.description,
      data.product_img,
      data.certificates,
      data.logo,
      id
    ], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM business WHERE id = ?', [id], callback);
  }
};

export default Business;
