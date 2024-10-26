import mongoose from "mongoose";

const mongoUrl: string = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local";

// Connect to MongoDB
const connectToDatabase = () =>
    mongoose
        .connect(mongoUrl)
        .then(() => console.log("Connected to database"))
        .catch((error) => console.error("Database connection error:", error));

export default connectToDatabase