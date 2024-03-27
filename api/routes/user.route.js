import express from "express";
import { checkUsername, checkEmail, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/Validators.js";

const router = express.Router();

router.get("/check-username", checkUsername);
router.get("/check-email", checkEmail);
router.post("/update/:id", verifyToken, updateUser);

export default router;