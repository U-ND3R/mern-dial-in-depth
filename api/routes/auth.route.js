import express from "express";
import { signup, checkUsername, checkEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signup);
router.get("/check-username", checkUsername);
router.get("/check-email", checkEmail);

export default router;