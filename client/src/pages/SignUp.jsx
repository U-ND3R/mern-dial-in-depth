import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { validateUsername, validateEmail, validatePassword } from "../../../api/utils/Validators.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

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
    if (!inputValue) {
      setUsernameError(null);
      setEmailError(null);
      setPasswordError(null);
    } else {
      await validateField(fieldId, inputValue);
    }
  };
  
  const validateField = async (field, value) => {
    if (touchedFields[field] || value) {
      let error = null;
  
      switch (field) {
        case "username":
          error = await validateUsername(value);
          setUsernameError(error);
          break;
        case "email":
          error = await validateEmail(value);
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
        {`Input error: ${error}`}
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
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

        <button className={loading || isFormValid ? `bg-indigo-800 text-white px-4 py-2 rounded-md focus:outline-none focus:bg-indigo-600 focus:ring focus:border-indigo-300` : `bg-indigo-800 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed disabled:opacity-50 disabled:bg-gray-400 focus:outline-none focus:bg-indigo-600 focus:ring focus:border-indigo-300` } disabled={loading || !isFormValid}>
          {loading ? "Loading..." : isFormValid ? "Sign Up" : "Errors occured"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an Account?</p>
        <Link to={"/sign-in"}>
          <span className="text-indigo-700 hover:underline">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;