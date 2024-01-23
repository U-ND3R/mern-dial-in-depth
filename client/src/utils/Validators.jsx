export const validateUsername = async (value) => {
    const hasInvalidCharacters = /[^a-zA-Z0-9]/.test(value);
    const isMinLengthValid = value.length >= 5;
    const isMaxLengthValid = value.length <= 16;
    if (hasInvalidCharacters) {
        return "No symbols are allowed";
    } else if (!isMinLengthValid) {
        return "Minimum length is 5";
    } else if (!isMaxLengthValid) {
        return "Maximum length is 16";
    }

    return null;
};
  
export const validateEmail = async (value) => {
    const hasValidCharacters = /\S+@\S+\.\S+/.test(value);
    if (!hasValidCharacters) {
        return "Email should be valid";
    }
    
    return null;
};
  
  export const validatePassword = (value) => {
    const hasNumbers = /\d/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasSymbols = /[!@#$%^&*()_+{}:;<>,.?~\\/-]/.test(value);
    const isMinLengthValid = value.length <= 7;
    const isMaxLengthValid = value.length >= 32;
    if (!hasNumbers) {
        return "At least 1 number is required";
    } else if (!hasUppercase) {
        return "At least 1 uppercase letter is required";
    } else if (!hasLowercase) {
        return "At least 1 lowercase letter is required";
    } else if (!hasSymbols) {
        return "At least 1 symbol is required";
    } else if (isMinLengthValid) {
        return "Minimum length is 7";
    } else if (isMaxLengthValid) {
        return "Maximum length is 32";
    }
    return null;
};