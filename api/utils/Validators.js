import { errorHandler } from "./Errors.js";
import { jwtVerify } from "jose";

export const validateUsername = async (value, checkExistence) => {
  const hasInvalidCharacters = /[^a-zA-Z0-9]/.test(value);
  const isMinLengthValid = value.length >= 5;
  const isMaxLengthValid = value.length <= 16;
  if (hasInvalidCharacters) {
    return errorHandler(400, "No symbols are allowed");
  } else if (!isMinLengthValid) {
    return errorHandler(400, "Minimum length is 5");
  } else if (!isMaxLengthValid) {
    return errorHandler(400, "Maximum length is 16");
  }
  
  const res = await fetch(`/api/user/check-username?username=${value}`);
  const data = await res.json();
  if (checkExistence && data.exists) {
    return errorHandler(400, "Username is already taken");
  }

  return null;
};
  
export const validateEmail = async (value, checkExistence) => {
  const hasValidCharacters = /\S+@\S+\.\S+/.test(value);
  if (!hasValidCharacters) {
    return errorHandler(400, "Email should be valid");
  }

  const res = await fetch(`/api/user/check-email?email=${value}`);
  const data = await res.json();
  if (checkExistence && data.exists) {
    return errorHandler(400, "Email is already registered");
  }

  return null;
};
  
export const validatePassword = async (value) => {
  const hasNumbers = /\d/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasSymbols = /[!@#$%^&*()_+{}:;<>,.?~\\/-]/.test(value);
  const isMinLengthValid = value.length <= 7;
  const isMaxLengthValid = value.length >= 32;
  if (!hasNumbers) {
    return errorHandler(400, "At least 1 number is required");
  } else if (!hasUppercase) {
    return errorHandler(400, "At least 1 uppercase letter is required");
  } else if (!hasLowercase) {
    return errorHandler(400, "At least 1 lowercase letter is required");
  } else if (!hasSymbols) {
    return errorHandler(400, "At least 1 symbol is required");
  } else if (isMinLengthValid) {
    return errorHandler(400, "Minimum length is 7");
  } else if (isMaxLengthValid) {
    return errorHandler(400, "Maximum length is 32");
  }
  
  return null;
};

export const validateText = async (value) => {
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(value)) {
    return errorHandler(400, "Only letters are allowed");
  }
  
  return null;
};

export const validateCompany = async (value) => {
  const regex = /^[a-zA-Z0-9\s]+$/;
  if (!regex.test(value)) {
    return errorHandler(400, "Only letters, numbers, and spaces are allowed");
  }

  return null;
};

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const { payload: { userId } } = await jwtVerify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (error) {
    return next(errorHandler(403, "Forbidden"));
  }
};