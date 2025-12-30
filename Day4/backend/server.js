import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoute.js"

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/todo", todoRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server starts on http://localhost:${process.env.PORT}`)
});
