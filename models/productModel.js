import db from '../config/db.js';


const Product = {
    create: (data, callback) => {
        const sql = `INSERT INTO products
        (name, origin, materials, description, product_image, type, qr_code, blockchain_hash, business_id, productionDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
    db.query(sql, [
        data.name,
        data.origin,
        data.materials,
        data.description,
        data.product_image,
        data.type,
        data.qr_code,
        data.blockchain_hash,
        data.business_id,
        data.productionDate
    ], callback);
    },

    getAll: (callback) => {
        db.query('SELECT * FROM products', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM products WHERE id = ?', [id], callback)
    },

    ProductsByBusinessId: (business_id, callback) => {
        const query = `SELECT * FROM products WHERE business_id = ?`;
        db.query(query, [business_id], callback);
    }

};

export default Product;