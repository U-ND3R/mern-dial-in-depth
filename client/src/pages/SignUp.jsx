import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6"
import { validateUsername, validateEmail, validatePassword } from "../../../api/utils/Validators.js";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [countdown, setCountdown] = useState(null);
  const [signupMessage, setSignupMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const inputValue = e.target.value;
    const fieldId = e.target.id;
  
    setFormData({
      ...formData,
      [fieldId]: inputValue,
    });
  
    setTouchedFields((prevTouchedFields) => ({
      ...prevTouchedFields,
      [fieldId]: true,
    }));
  
    Object.keys(touchedFields).forEach((field) => {
      if (field !== fieldId) {
        validateField(field, formData[field]);
      }
    });
  
    if (!inputValue) {
      setUsernameError(null);
      setEmailError(null);
      setPasswordError(null);
    } else {
      await validateField(fieldId, inputValue);
    }
  };
  
  const validateField = async (field, value, checkExistence = true) => {
    if (touchedFields[field] || value) {
      let error = null;
      switch (field) {
        case "username":
          error = await validateUsername(value, checkExistence);
          setUsernameError(error);
          break;
        case "email":
          error = await validateEmail(value, checkExistence);
          setEmailError(error);
          break;
        case "password":
          error = await validatePassword(value);
          setPasswordError(error);
          break;
        default:
          break;
      }
    } else {
      setUsernameError(null);
      setEmailError(null);
      setPasswordError(null);
    }
  };
  
  const renderError = (error) => {
    return (
      <li className="flex items-center text-red-500">
        <span className="mr-2"><FaXmark className="text-red-500" /></span>
        {`${error}`}
      </li>
    );
  };

  const renderSuccess = (field) => {
    return (
      <li className="flex items-center text-green-500">
        <span className="mr-2"><FaCheck className='text-green-500' /></span>
        {`${field} is OK`}
      </li>
    );
  };

  const isFormValid = !usernameError && !emailError && !passwordError;

  const startCountdown = () => {
    let seconds = 10;
    setCountdown(seconds);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setCountdown(null);
    }, seconds * 1000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
    
      if (response.ok) {
        setSignupMessage({
          type: "success",
          content: "User successfully created.",
        });
        startCountdown();
        setTimeout(() => {
          navigate('/sign-in');
        }, 10000);
      } else {
        console.error("Sign-up failed:", data.message);
        setSignupMessage({ type: "error", content: data.message });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setSignupMessage({
        type: "error",
        content: "An unexpected error occurred during sign-up",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 pt-16 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" className={`border p-3 rounded-lg ${usernameError ? "border-red-500" : touchedFields.username && formData.username ? "border-green-500" : ""}`} id="username" onChange={handleChange} required />
        {usernameError && <ul className="mt-1">{renderError(usernameError)}</ul>}
        {!usernameError && touchedFields.username && formData.username && <ul className="mt-1">{renderSuccess("Username")}</ul>}

        <input type="email" placeholder="Email" className={`border p-3 rounded-lg ${emailError ? "border-red-500" : touchedFields.email && formData.email ? "border-green-500" : ""}`} id="email" onChange={handleChange} required />
        {emailError && <ul className="mt-1">{renderError(emailError)}</ul>}
        {!emailError && touchedFields.email && formData.email && <ul className="mt-1">{renderSuccess("Email")}</ul>}

        <input type="password" placeholder="Password" className={`border p-3 rounded-lg ${passwordError ? "border-red-500" : touchedFields.password && formData.password ? "border-green-500" : ""}`} id="password" onChange={handleChange} required />
        {passwordError && <ul className="mt-1">{renderError(passwordError)}</ul>}
        {!passwordError && touchedFields.password && formData.password && <ul className="mt-1">{renderSuccess("Password")}</ul>}

        <button className={loading || !isFormValid || countdown ? "button-disabled" : "button-stable"} disabled={loading || !isFormValid || countdown}>
          {loading ? "Loading..." : isFormValid ? countdown ? `Redirecting in ${countdown}s` : "Sign Up" : "Errors occurred"}
        </button>
      </form>

      {signupMessage && signupMessage.type === 'error' && (
        <div className={`mt-4 text-red-500`}>
          {signupMessage.content}
        </div>
      )}

      {signupMessage && signupMessage.type === 'success' && (
        <div className={`mt-4 text-green-500`}>
          {signupMessage.content}
        </div>
      )}

      <div className="flex gap-2 items-center my-8">
        <h2 className="text-black">Have an Account?</h2>
        <Link to={"/sign-in"} className="link-effect">
          <span className="text-indigo-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
