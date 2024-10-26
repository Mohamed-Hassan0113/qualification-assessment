import express, { Application } from "express";
import cookieParser from "cookie-parser";
import database from "./config/database";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes";


const app: Application = express();

database();

app.use(express.json());
app.use(cookieParser());


app.use("/", authRoutes);


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
