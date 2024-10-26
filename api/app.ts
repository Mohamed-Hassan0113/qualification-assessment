import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import orgRoutes from "./routes/orgRoutes";
import cookieParser from "cookie-parser";
import database from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

database();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/organization", orgRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
