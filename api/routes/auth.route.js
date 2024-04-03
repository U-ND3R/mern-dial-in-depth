import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";
import { checkUsername, checkEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.get("/check-username", checkUsername);
router.get("/check-email", checkEmail);

export default router;