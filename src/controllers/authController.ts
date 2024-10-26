import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../models/User";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
const JWT_ACCESS_EXPIRE_AT = process.env.JWT_ACCESS_TOKEN_EXPIRE_AT as string;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string;
const JWT_REFRESH_EXPIRE_AT = process.env.JWT_REFRESH_TOKEN_EXPIRE_AT as string;

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists with that email.");
            (error as any).statusCode = 409;
            throw error;
        }

        // Hash the password after generating the Salt
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Return success response
        res.status(201).json({ message: "User registered successfully." });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Finding a user on the provided email
        const user = await User.findOne({ email });

        // Check if the password matches the found user's, if any.
        const isPasswordValid = user && await bcrypt.compare(password, user.password);

        // Check if the credentials provided match a user in the database or not.
        if (!user || !isPasswordValid) {
            const error = new Error("Invalid sign in credentials, please try again.");
            (error as any).statusCode = 401;
            throw error;
        }

        // Generating JWT
        const accessToken = jwt.sign(
            { id: user._id },
            JWT_ACCESS_SECRET,
            { expiresIn: JWT_ACCESS_EXPIRE_AT }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            JWT_REFRESH_SECRET,
            { expiresIn: JWT_REFRESH_EXPIRE_AT }
        );

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const refreshToken = (req: Request, res: Response) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            const error = new Error("Invalid token provided.");
            (error as any).statusCode = 401;
            throw error;
        }

        jwt.verify(refresh_token, JWT_REFRESH_SECRET, (err: unknown, user: any) => {
            if (err) {
                const error = new Error("Invalid token provided.");
                (error as any).statusCode = 401;
                throw error;
            }

            const accessToken = jwt.sign(
                { id: (user as JwtPayload)._id },
                JWT_ACCESS_SECRET,
                { expiresIn: JWT_ACCESS_EXPIRE_AT }
            );

            res.json({
                message: "Success.",
                access_token: accessToken,
                refresh_token,
            });
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};
