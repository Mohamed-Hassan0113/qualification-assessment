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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
function isLogged(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.jwt;
        try {
            if (!token) {
                const error = new Error("User not logged in.");
                error.statusCode = 401;
                throw error;
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const userID = decodedToken.id;
            if (!userID) {
                const error = new Error("Invalid token provided.");
                error.statusCode = 401;
                throw error;
            }
            req.userID = userID;
            next();
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
}
exports.default = isLogged;
