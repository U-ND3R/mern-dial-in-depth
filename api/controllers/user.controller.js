import User from "../models/user.model.js";
import { errorHandler } from "../utils/Errors.js";
import bcryptjs from "bcryptjs"

export const checkUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking username in the database:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking email in the database:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const updateUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    if(req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        company: req.body.company,
        position: req.body.position,
      }
    }, { new: true })

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error)
  }
}