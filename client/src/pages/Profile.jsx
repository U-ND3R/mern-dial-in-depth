import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { validateText, validateUsername, validateEmail, validatePassword } from "../../../api/utils/Validators.js";
// import { errorHandler } from "../../../api/utils/Errors.js";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";


const ProfilePage = () => {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.user);
  const [selectedLink, setSelectedLink] = useState('Personal Info');
  const [textError, setTextError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [updateMessage, setUpdateMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [formSubmitted] = useState(false);
  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  const handleChange = (e) => {
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
      clearFieldError(fieldId);
    } else {
      validateField(fieldId, inputValue);
    }
  };

  const clearFieldError = (fieldId) => {
    switch (fieldId) {
      case 'fname':
        setTextError(null);
        break;
      case 'lname':
        setTextError(null);
        break;
      case 'company':
        setTextError(null);
        break;
      case 'position':
        setTextError(null);
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
    let error = null;
    switch (field) {
      case "fname":
      case "lname":
      case "company":
      case "position":
        error = await validateText(value);
        setTextError(error);
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

  const renderForm = () => {
    switch (selectedLink) {
      case "Change Password":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="currentPassword">Current Password:</label>
            <input type="password" placeholder="Enter current password" className="border p-3 rounded-lg" id="currentPassword" defaultValue={currentUser.password} />

            <label htmlFor="newPassword">New Password:</label>
            <input type="password" placeholder="Enter new password" className="border p-3 rounded-lg" id="newPassword" onChange={handleChange} value={formData.newPassword} />
            {passwordError && <ul className="mt-1">{renderError(passwordError)}</ul>}
            {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Password")}</ul>)}

          </form>
        );
      case "Change Email":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="currentEmail">Current Email:</label>
            <input type="email" placeholder="Enter current email" className="border p-3 rounded-lg" id="currentEmail" defaultValue={currentUser.email} disabled />

            <label htmlFor="newEmail">New Email:</label>
            <input type="email" placeholder="Enter new email" className="border p-3 rounded-lg" id="newEmail" onChange={handleChange} value={formData.newEmail} />
            {emailError && <ul className="mt-1">{renderError(emailError)}</ul>}
            {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Email")}</ul>)}

          </form>
        );
      case "Change Username":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="newUsername">New Username:</label>
            <input type="text" placeholder="Enter new username" className="border p-3 rounded-lg" id="newUsername" onChange={handleChange} value={formData.newUsername} />
            {usernameError && <ul className="mt-1">{renderError(usernameError)}</ul>}
            {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Username")}</ul>)}
          </form>
        );
      case "Delete Account":
        return (
          <form action="" className="flex flex-col gap-4">
            <label htmlFor="currentEmail">Current Email:</label>
            <input type="email" placeholder="Enter current email" className="border p-3 rounded-lg" id="currentEmail" onChange={handleChange} value={formData.currentEmail} />
            {emailError && <ul className="mt-1">{renderError(emailError)}</ul>}
            {deleteMessage && deleteMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Email")}</ul>)}

            <label htmlFor="currentPassword">Current Password:</label>
            <input type="password" placeholder="Enter current password" className="border p-3 rounded-lg" id="currentPassword" onChange={handleChange} value={formData.currentPassword} />
            {passwordError && <ul className="mt-1">{renderError(passwordError)}</ul>}
            {deleteMessage && deleteMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Password")}</ul>)}
          </form>
        );
      default:
        return (
          <form action="" className="flex flex-col gap-4">
            <div className="flex gap-6">
              <div className="w-1/2 gap-4">
                <label htmlFor="fname">First Name:</label>
                <input type="text" placeholder="Enter first name" className="border p-3 rounded-lg" id="fname" onChange={handleChange} value={formData.fname} />
                {textError && <ul className="mt-1">{renderError(textError)}</ul>}
                {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Text")}</ul>)}
              </div>
              <div className="w-1/2">
                <label htmlFor="lname">Last Name:</label>
                <input type="text" placeholder="Enter last name" className="border p-3 rounded-lg" id="lname" onChange={handleChange} value={formData.lname} />
                {textError && <ul className="mt-1">{renderError(textError)}</ul>}
                {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Text")}</ul>)}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-1/2">
                <label htmlFor="company">Company:</label>
                <input type="text" placeholder="Enter company name" className="border p-3 rounded-lg" id="company" onChange={handleChange} value={formData.company} />
                {textError && <ul className="mt-1">{renderError(textError)}</ul>}
                {updateMessage && updateMessage.type === 'success' && formSubmitted && (<ul className="mt-1">{renderSuccess("Text")}</ul>)}
              </div>
              <div className="w-1/2">
                <label htmlFor="position">Position:</label>
                <input type="text" placeholder="Enter your position" className="border p-3 rounded-lg" id="position" onChange={handleChange} value={formData.position} />
                {textError && <ul className="mt-1">{renderError(textError)}</ul>}
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
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
        if (selectedLink === 'Delete Account') {
          setDeleteMessage({ type: 'success', message: 'User deleted successfully' });
        } else {
          setUpdateMessage({ type: 'success', message: 'User updated successfully' });
        }
        dispatch(updateUserSuccess(data));
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        if (selectedLink === 'Delete Account') {
          setDeleteMessage({ type: 'error', message: error.message });
        } else {
          setUpdateMessage({ type: 'error', message: error.message });
        }
      }
    };

  const getHeaderTextClass = () => {
    return selectedLink === 'Delete Account' ? 'text-red-500' : 'text-indigo-700';
  };

  const getButtonName = () => {
    return selectedLink === 'Delete Account' ? 'Delete account' : 'Update';
  };

  const getButtonClass = () => {
    return selectedLink === 'Delete Account' ? 'button-danger' : 'button-stable';
  };

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
        <h3 className={`text-lg text-center font-medium my-7 ${getHeaderTextClass()}`}>{selectedLink}</h3>
        <div className="p-3 pt-8 max-w-lg mx-auto">
          {renderForm()}
          <button className={`${getButtonClass()} w-full max-w-lg p-3 rounded-lg mt-6`} onClick={handleSubmit}>{getButtonName()}</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
