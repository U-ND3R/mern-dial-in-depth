import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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