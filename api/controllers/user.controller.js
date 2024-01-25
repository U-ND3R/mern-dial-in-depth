import User from "../models/user.model.js";

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