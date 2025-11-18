import express from 'express';
const router  = express.Router();
import multer from 'multer';
import productController, { getProductsByBusinessId } from '../controllers/productController.js';
import auth from'../middleware/authMiddleware.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'products/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});


const upload = multer({storage});

router.post(
'/products', auth,
upload.fields([{name: 'product_image', maxCount: 1}]), 
productController.createProducts);

router.get('/products', productController.getAllProducts);
router.post('/products/verify', productController.verifyProductByQr);
router.get("/products/my-products", auth, getProductsByBusinessId)


export default router;
