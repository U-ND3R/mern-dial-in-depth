import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/Errors.js";

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

export const checkUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking username in the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email in the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      const emailError = errorHandler(401, "Invalid email");
      return res.status(emailError.statusCode).json({ success: false, message: emailError.message });
    }

    if (bcryptjs.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }).status(200).json({ success: true, message: "User signed in successfully", rest });
    } else {
      const passwordError = errorHandler(401, "Invalid password");
      res.status(passwordError.statusCode).json({ success: false, message: passwordError.message });
    }
  } catch (error) {
    const customError = errorHandler(500, "Internal Server Error");
    res.status(customError.statusCode).json({ success: false, message: customError.message });
  }
};