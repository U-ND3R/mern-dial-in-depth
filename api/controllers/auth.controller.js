import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/Errors.js";
import { jwtVerify } from "jose";

const generateToken = (userId) => {
  const token = JWT.sign({ userId }, process.env.JWT_SECRET);
  return token;
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      const emailError = errorHandler(400, "Email is already used");
      return res.status(emailError.statusCode).json({ success: false, message: emailError.message });
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      const usernameError = errorHandler(400, "Username is already used");
      return res.status(usernameError.statusCode).json({ success: false, message: usernameError.message });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      const authError = errorHandler(401, "Invalid credentials");
      return res.status(authError.statusCode).json({ success: false, message: authError.message });
    }

    const token = generateToken(user._id);
    const { password: pass, ...rest } = user._doc;
    res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }).status(200).json({ success: true, message: "User signed in successfully", rest });
  } catch (error) {
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const { userId } = await jwtVerify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (error) {
    return next(errorHandler(403, "Forbidden"));
  }
};