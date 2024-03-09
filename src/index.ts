import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { dbConnect } from './config/dbConnect';
import authRouter from './routes/authRoutes';
import productRouter from './routes/productRoutes';
import blogRouter from './routes/blogRoute';
import productCategoryRouter from './routes/product-categoryRoute';
import blogCategoryRouter from './routes/blog-categoryRoute';
import brandRouter from './routes/brandRoute';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', productCategoryRouter);
app.use('/api/blog-category', blogCategoryRouter);
app.use('/api/brand', brandRouter);

//middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
