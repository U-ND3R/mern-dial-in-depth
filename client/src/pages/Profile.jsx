import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { validateText, validateCompany, validateUsername, validateEmail, validatePassword } from "../../../api/utils/Validators.js";
import { errorHandler } from "../../../api/utils/Errors.js";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";

const ProfilePage = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user) || {};
  const [formData, setFormData] = useState({
    fname: currentUser.rest.fname || "",
    lname: currentUser.rest.lname || "",
    company: currentUser.rest.company || "",
    position: currentUser.rest.position || "",
    newUsername: "",
    newEmail: "",
    newPassword: ""
  });
  
  const [textErrors, setTextErrors] = useState({
    fname: null,
    lname: null,
    company: null,
    position: null
  });
  
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [updateMessage, setUpdateMessage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const [selectedLink, setSelectedLink] = useState('Personal Info');

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

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
  
    await validateField(fieldId, inputValue);
  };

  const clearFieldError = (fieldId) => {
    switch (fieldId) {
      case 'fname':
        setTextErrors({
          ...textErrors,
          fname: null
        });
        break;
      case 'lname':
        setTextErrors({
          ...textErrors,
          lname: null
        });
        break;
      case 'company':
        setTextErrors({
          ...textErrors,
          company: null
        });
        break;
      case 'position':
        setTextErrors({
          ...textErrors,
          position: null
        });
        break;
      case 'username':
        setUsernameError(null);
        break;
      case 'email':
        setEmailError(null);
        break;
      case 'password':
        setPasswordError(null);
        break;
      default:
        break;
    }
  };

  const validateField = async (field, value, checkExistence = false) => {
    if (touchedFields[field] || value) {
      let error = null;
      switch (field) {
        case "company":
          error = await validateCompany(value);
          setTextErrors({
            ...textErrors,
            [field]: error
          });
          break;
        case "fname":
        case "lname":
        case "position":
          error = await validateText(value);
          setTextErrors({
            ...textErrors,
            [field]: error
          });
          break;
        case "username":
          error = await validateUsername(value);
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
      clearFieldError(field);
    }
  };

  const renderError = (error) => {
    if (!error) return null;
    return (
      <li className="flex items-center text-red-500">
        <span className="mr-2"><FaXmark className="text-red-500" /></span>
        {`${error}`}
      </li>
    );
  };

  const renderSuccess = (fieldName) => {
    return (
      <li className="flex items-center text-green-500">
        <span className="mr-2"><FaCheck className='text-green-500' /></span>
        {`${fieldName} is OK`}
      </li>
    );
  };

  const isFormValid = () => {
    const hasTextErrors = Object.values(textErrors).some(error => error !== null);
    return !hasTextErrors && !usernameError && !emailError && !passwordError;
  };

  const renderForm = () => {
    switch (selectedLink) {
      case "Change Password":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" placeholder="Enter new password" className={`border p-3 rounded-lg ${
              passwordError ? "border-red-500" : 
              touchedFields.newPassword && formData.newPassword ? "border-indigo-500" : 
              updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="newPassword" onChange={handleChange} value={formData.newPassword} required />
            {passwordError && <ul className="mt-1">{renderError(passwordError)}</ul>}
            {updateMessage && <div className={`mt-1 text-${updateMessage.type === 'error' ? 'red' : 'green'}-500`}>{updateMessage.message}</div>}

          </form>
        );
      case "Change Email":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="currentEmail">Current Email:</label>
            <input type="email" placeholder="Your current email" className="border p-3 rounded-lg" id="currentEmail" defaultValue={currentUser.rest.email} disabled />

            <label htmlFor="newEmail">New Email:</label>
            <input type="email" placeholder="Enter new email" className={`border p-3 rounded-lg ${
              emailError ? "border-red-500" : 
              touchedFields.newEmail && formData.newEmail ? "border-indigo-500" : 
              updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="newEmail" onChange={handleChange} value={formData.newEmail} required />
            {emailError && <ul className="mt-1">{renderError(emailError)}</ul>}
            {updateMessage && <div className={`mt-1 text-${updateMessage.type === 'error' ? 'red' : 'green'}-500`}>{updateMessage.message}</div>}
          </form>
        );
      case "Change Username":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="newUsername">New Username:</label>
            <input type="text" placeholder="Enter new username" className={`border p-3 rounded-lg ${
              usernameError ? "border-red-500" : 
              touchedFields.newUsername && formData.newUsername ? "border-indigo-500" : 
              updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="newUsername" onChange={handleChange} value={formData.newUsername} required />
            {usernameError && <ul className="mt-1">{renderError(usernameError)}</ul>}
            {updateMessage && <div className={`mt-1 text-${updateMessage.type === 'error' ? 'red' : 'green'}-500`}>{updateMessage.message}</div>}
          </form>
        );
      case "Delete Account":
        return (
          <div>Delete Account</div>
        );
        default:
          return (
            <form action="" className="flex flex-col gap-4">
              <div className="flex gap-6">
                <div className="w-1/2 gap-4">
                  <label htmlFor="fname">First Name:</label>
                  <input type="text" placeholder="Enter first name" className={`border p-3 rounded-lg ${
                    textErrors ? "border-red-500" : 
                    touchedFields.fname && formData.fname ? "border-indigo-500" : 
                    updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="fname" onChange={handleChange} defaultValue={currentUser.rest.fname} required />
                  {textErrors && <ul className="mt-1">{renderError(textErrors.fname)}</ul>}
                  {updateMessage && <div className={`mt-1 text-${updateMessage.type === 'error' ? 'red' : 'green'}-500`}>{updateMessage.message}</div>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="lname">Last Name:</label>
                  <input type="text" placeholder="Enter last name" className={`border p-3 rounded-lg ${
                    textErrors ? "border-red-500" : 
                    touchedFields.lname && formData.lname ? "border-indigo-500" : 
                    updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="lname" onChange={handleChange} defaultValue={currentUser.rest.lname} required />
                  {textErrors && <ul className="mt-1">{renderError(textErrors.lname)}</ul>}
                  {updateMessage && <div className={`mt-1 text-${updateMessage.type === 'error' ? 'red' : 'green'}-500`}>{updateMessage.message}</div>}
                </div>
              </div>
    
              <div className="flex gap-6">
                <div className="w-1/2">
                  <label htmlFor="company">Company:</label>
                  <input type="text" placeholder="Enter company name" className={`border p-3 rounded-lg ${
                    textErrors ? "border-red-500" : 
                    touchedFields.company && formData.company ? "border-indigo-500" : 
                    updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="company" onChange={handleChange} defaultValue={currentUser.rest.company} required />
                  {textErrors && <ul className="mt-1">{renderError(textErrors.company)}</ul>}
                  {updateMessage && <div className={`mt-1 text-${updateMessage.type === 'error' ? 'red' : 'green'}-500`}>{updateMessage.message}</div>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="position">Position:</label>
                  <input type="text" placeholder="Enter your position" className={`border p-3 rounded-lg ${
                    textErrors ? "border-red-500" : 
                    touchedFields.position && formData.position ? "border-indigo-500" : 
                    updateMessage && updateMessage.type === 'success' ? "border-green-500" : ""}`} id="position" onChange={handleChange} defaultValue={currentUser.rest.position} required />
                  {textErrors && <ul className="mt-1">{renderError(textErrors.position)}</ul>}
                  {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Text")}</ul>)}
                </div>
              </div>
    
              <div className="flex items-center">
                <input type="checkbox" id="displayPersonalData" />
                <label htmlFor="displayPersonalData" className="ml-2">Display personal data to all users</label>
              </div>
            </form>
          );
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormSubmitted(true);
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser.rest._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success === false) {
          dispatch(updateUserFailure(error.message));
          return;
        }
        setUpdateMessage({ type: 'success', message: 'User updated successfully' });
        dispatch(updateUserSuccess(data));
      } catch (error) {
        console.error("Error during update:", error);
        const errorMessage = errorHandler(error);
        setUpdateMessage({ type: "error", content: errorMessage || "An unexpected error occurred during update" });
        dispatch(updateUserFailure(error.message));
      }
    }

    

  return (
    <div className="p-3 pt-16 flex">
      <div className="w-1/4 bg-slate-100 p-4 shadow-md">
        <ul className="p-4">
          <li className="mb-10">
            <Link className="link-effect" onClick={() => handleLinkClick('Personal Info')}>Personal Info</Link>
          </li>
          <li className="mb-10">
            <Link className="link-effect" onClick={() => handleLinkClick('Change Password')}>Change Password</Link>
          </li>
          <li className="mb-10">
            <Link className="link-effect" onClick={() => handleLinkClick('Change Username')}>Change Username</Link>
          </li>
          <li className="mb-10">
            <Link className="link-effect" onClick={() => handleLinkClick('Change Email')}>Change Email</Link>
          </li>
          <li className="mb-10">
            <Link className="link-effect danger" onClick={() => handleLinkClick('Delete Account')}>Delete Account</Link>
          </li>
        </ul>
      </div>

      <div className="w-3/4 p-4">
        <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
        <h3 className={`text-lg text-center font-medium my-7 text-indigo-700`}>{selectedLink}</h3>
        <div className="p-3 pt-8 max-w-lg mx-auto">
          {renderForm()}
          <button
            className={`${loading || !isFormValid() ? 'button-disabled' : 'button-stable'} w-full max-w-lg p-3 rounded-lg mt-6`}
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}>
            {loading ? 'Loading...' : !isFormValid() ? 'Errors occurred' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
