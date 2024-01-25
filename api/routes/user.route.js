import express from "express";
import { checkUsername, checkEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/check-username", checkUsername);
router.get("/check-email", checkEmail);

export default router;