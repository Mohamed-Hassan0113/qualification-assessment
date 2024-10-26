import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;

interface CustomRequest extends Request {
    userID?: string;
}

async function isLogged(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;
    try {
        if (!token) {
            const error = new Error("User not logged in.");
            (error as any).statusCode = 401;
            throw error;
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const userID = decodedToken.id as string;
        if (!userID) {
            const error = new Error("Invalid token provided.");
            (error as any).statusCode = 401;
            throw error;
        }

        req.userID = userID;
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
}

export default isLogged;
