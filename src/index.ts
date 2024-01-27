import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { dbConnect } from './config/dbConnect';
import authRouter from './routes/authRoutes';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use('/api/user', authRouter);

//middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
