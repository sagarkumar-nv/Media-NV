import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import loggerMiddleware from './middleware/logger.js';
import authRoute from './routes/authRoute.js'
import taskRoutes from './routes/taskRoutes.js';
import errMiddleware from './middleware/error.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use("/auth", authRoute);
app.use("/tasks", taskRoutes);
// app.use(errMiddleware);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})