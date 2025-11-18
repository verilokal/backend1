import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import businessRoutes from './routes/businessRoutes.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));
app.use('/qrcodes', express.static('qrcodes'));

app.use('/uploads', express.static('uploads'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/products', express.static('products'));

app.use('/api', businessRoutes);
app.use('/api', productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
