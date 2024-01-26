import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
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
    if (user && bcryptjs.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }).status(200).json({ success: true, message: "User signed in successfully", rest });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};