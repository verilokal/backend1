import express from 'express';
const router  = express.Router();
import multer from 'multer';
import productController, { getProductsByBusinessId } from '../controllers/productController.js';
import auth from'../middleware/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({storage});

router.post(
'/products', auth,
upload.fields([{name: 'product_image', maxCount: 1}]), 
productController.createProducts);

router.get('/products', productController.getAllProducts);
router.post('/products/verify', productController.verifyProductByQr);
router.get("/products/my-products", auth, getProductsByBusinessId)


export default router;
