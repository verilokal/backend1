import express from 'express';
const router = express.Router();
import multer from 'multer';
import businessController from '../controllers/businessController.js';
import authBusinessController from '../controllers/authBusinessController.js';
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({storage: storage });

router.post(
  '/business',
  upload.fields([{ name: 'product_img' }, { name: 'certificates' }, {name: 'logo'}]),
  businessController.createBusiness
);

router.post('/login', authBusinessController.login);
router.get('/business', businessController.getAllBusinesses);
router.get('/business/:id', businessController.getBusinessById);

router.put(
  '/business/:id',
  upload.fields([{ name: 'product_img' }, { name: 'certificates' }, {name: 'logo'}]),
  businessController.updateBusiness
);

router.get('/business/:id/profile', businessController.getBusinessProfile);

router.delete('/business/:id', businessController.deleteBusiness);

export default router;
