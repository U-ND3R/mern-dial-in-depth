import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { validateEmail, validatePassword } from "../../../api/utils/Validators.js";
import { errorHandler } from "../../../api/utils/Errors.js";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [signinMessage, setSigninMessage] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectCountdown > 0) {
      const countdownTimer = setInterval(() => {
        setRedirectCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [redirectCountdown]);

  const handleChange = async (e) => {
    const inputValue = e.target.value;
    const fieldId = e.target.id;

    setFormData({
      ...formData,
      [fieldId]: inputValue,
    });

    setTouchedFields({
      ...touchedFields,
      [fieldId]: true,
    });

    Object.keys(touchedFields).forEach((field) => {
      if (field !== fieldId) {
        validateField(field, formData[field]);
      }
    });

    if (!inputValue) {
      setEmailError(null);
      setPasswordError(null);
    } else {
      await validateField(fieldId, inputValue);
    }
  };

  const validateField = async (field, value, checkExistence = false) => {
    if (touchedFields[field] || value) {
      let error = null;
      switch (field) {
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

  const isFormValid = !emailError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSigninMessage({
          type: "success",
          content: "You have successfully logged in"
        });
        dispatch(signInSuccess(data));
        setRedirectCountdown(10);
        setTimeout(() => {
          navigate('/profile');
        }, 10000);
      } else {
        console.error("Sign-in failed:", data.message);
        setSigninMessage({ type: "error", content: data.message });
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      const errorMessage = errorHandler(error);
      setSigninMessage({ type: "error", content: errorMessage || "An unexpected error occurred during sign-in" });
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 pt-16 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className={`border p-3 rounded-lg ${emailError ? "border-red-500" : touchedFields.email && formData.email && !signinMessage ? "border-indigo-500" : signinMessage && signinMessage.type === 'success' ? "border-green-500" : ""}`} id="email" onChange={handleChange} required />
        {emailError && <ul className="mt-1">{renderError(emailError)}</ul>}
        {signinMessage && signinMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Email")}</ul>)}

        <input type="password" placeholder="Password" className={`border p-3 rounded-lg ${passwordError ? "border-red-500" : touchedFields.password && formData.password && !signinMessage ? "border-indigo-500" : signinMessage && signinMessage.type === 'success' ? "border-green-500" : ""}`} id="password" onChange={handleChange} required />
        {passwordError && <ul className="mt-1">{renderError(passwordError)}</ul>}
        {signinMessage && signinMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Password")}</ul>)}

        <button className={`${loading || !isFormValid || redirectCountdown ? 'button-disabled': 'button-stable'}`} disabled={loading || !isFormValid || redirectCountdown}>
          {loading ? 'Loading...' : isFormValid ? redirectCountdown ? `Redirecting in ${redirectCountdown}s` : 'Sign In' : 'Errors occurred'}
        </button>
      </form>

      {signinMessage && signinMessage.type === 'error' && (
        <div className={`mt-4 text-red-500`}>
          {signinMessage.content}
        </div>
      )}

      {signinMessage && signinMessage.type === 'success' && (
        <div className={`mt-4 text-green-500`}>
          {signinMessage.content}
        </div>
      )}

      <div className="flex gap-2 items-center mt-8">
        <h2 className="text-black">Don&apos;t have an Account?</h2>
        <Link to={"/sign-up"} className="link-effect">
          <span className="text-indigo-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
