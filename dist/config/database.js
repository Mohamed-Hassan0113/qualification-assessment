"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local";
// Connect to MongoDB
const connectToDatabase = () => mongoose_1.default
    .connect(mongoUrl)
    .then(() => console.log("Connected to database"))
    .catch((error) => console.error("Database connection error:", error));
exports.default = connectToDatabase;
