import Products from '../models/productModel.js';
import QRCode from "qrcode";
import fs from 'fs';
import path from 'path';
import crypto, { Verify } from 'crypto';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import contract from '../blockchain/blockchain.js'



export const createProducts = (req, res) => {
  try {
    const { name, origin, materials, description, type, productionDate} = req.body;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const product_image = req.files?.product_image ? req.files.product_image[0].path : null;
    const qrFolder = path.join(__dirname, '../qrcodes');
    const productDataString = `${name}|${origin}|${materials}|${description}|${type}|${Date.now()}`;
    const blockchain_hash = crypto.createHash('sha256').update(productDataString).digest('hex');
    const business_id = req.user.id;

    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder);
    }

    const data = {
      name,
      origin,
      materials,
      description,
      product_image,
      type,
      productionDate,
      qr_code: '',
      blockchain_hash,
      business_id
    };


    Products.create(data, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      
      const qrCodeFileName = `${name.replace(/\s/g, '-')}-${Date.now()}.png`;
      const qrCodePath = path.join(qrFolder, qrCodeFileName); 
      const qrCodeDbPath = `qrcodes/${qrCodeFileName}`;
      const product_id = result.insertId;
      const url =  `${product_id}|${blockchain_hash}`;
      
      QRCode.toFile(qrCodePath, url, (err) => {
        if (err) return res.status(500).json({error: 'FAILED TO GENERATE QRCODE'});
        db.query('UPDATE products SET qr_code=? WHERE id=?', [qrCodeDbPath, product_id]);
      });

      const tx = await contract.registerProduct(product_id, blockchain_hash);
      await tx.wait();

        res.status(201).json({
        message: 'Product Registered Successfully',
        result: {
          id: result.insertId,
          qr_code: `/qrcodes/${qrCodeFileName}`,
          blockchain_hash: blockchain_hash
        }
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};


export const getAllProducts = (req, res) => {
  Products.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getProductsByBusinessId = (req, res) => {
  try {
    const business_id = req.user.id;
 
  Products.ProductsByBusinessId(business_id, (err, results) => {
    if (err) return res.status(500).json({error: err.message});

    if (!results || results.length === 0) {
      return res.status(404).json({message: "Products not found!"});
    }
    res.status(200).json(results);
  });
} catch (error) {
    res.status(500).json({error: "Failed to fetch business products"});
}
};


export const verifyProductByQr = async (req, res) => {
   const {product_id, blockchain_hash} = req.body;

  try {
    
    Products.getById(product_id, async (err, result) => {
      if (err) return res.status(500).json({verified:false, message: err.message});
      if (!result || result.length === 0){
        return res.status(404).json({verified: false, message: "Product not Found in Database!"});
      } 
      
      const dbProduct = result[0];
      const [exists, onChainId, owner] = await contract.verify(blockchain_hash);
      if (!exists) {
        return res.status(404).json({verified: false, message: "Product not Found in Blockchain!"})
      }
      const response = onChainId.toString();

      res.json({
      verified:true,
      product: product_id,
      blockchain: {product_id, response, owner},
      message: "Product verified successfully",
    });
    }); 
  } catch (error) {
    res.status(500).json({
      verified: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export default { createProducts, getAllProducts, verifyProductByQr, getProductsByBusinessId };