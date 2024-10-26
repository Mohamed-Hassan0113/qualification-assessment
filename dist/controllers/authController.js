"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const JWT_ACCESS_EXPIRE_AT = process.env.JWT_ACCESS_TOKEN_EXPIRE_AT;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const JWT_REFRESH_EXPIRE_AT = process.env.JWT_REFRESH_TOKEN_EXPIRE_AT;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists with that email.");
            error.statusCode = 409;
            throw error;
        }
        // Hash the password after generating the Salt
        const salt = yield bcryptjs_1.default.genSalt();
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create a new user
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
        });
        // Save the user to the database
        yield newUser.save();
        // Return success response
        res.status(201).json({ message: "User registered successfully." });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Finding a user on the provided email
        const user = yield User_1.default.findOne({ email });
        // Check if the password matches the found user's, if any.
        const isPasswordValid = user && (yield bcryptjs_1.default.compare(password, user.password));
        // Check if the credentials provided match a user in the database or not.
        if (!user || !isPasswordValid) {
            const error = new Error("Invalid sign in credentials, please try again.");
            error.statusCode = 401;
            throw error;
        }
        // Generating JWT
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRE_AT });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE_AT });
        // Return success response with token and a cookie with the token.
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 30,
        });
        res.status(200).json({
            message: "Login is successful.",
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.signIn = signIn;
const refreshToken = (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            const error = new Error("Invalid token provided.");
            error.statusCode = 401;
            throw error;
        }
        jsonwebtoken_1.default.verify(refresh_token, JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                const error = new Error("Invalid token provided.");
                error.statusCode = 401;
                throw error;
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRE_AT });
            res.json({
                message: "Success.",
                access_token: accessToken,
                refresh_token,
            });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};
exports.refreshToken = refreshToken;
