import express, { Router } from "express";
import { signUp, signIn, refreshToken } from "../controllers/authController";

const router: Router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh-token", refreshToken);

export default router;
