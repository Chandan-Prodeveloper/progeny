// Validation utilities for signup form

export const validateName = (name: string): { valid: boolean; error: string } => {
  // Only letters, spaces, and hyphens allowed (for names like "Mary-Jane")
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  
  if (!name.trim()) {
    return { valid: false, error: "Name is required" };
  }
  
  if (name.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  
  if (!nameRegex.test(name)) {
    return { valid: false, error: "Name can only contain letters, spaces, and hyphens" };
  }
  
  return { valid: true, error: "" };
};

export interface PasswordRequirements {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  meetsAll: boolean;
}

export const validatePassword = (password: string): PasswordRequirements => {
  const requirements: PasswordRequirements = {
    hasMinLength: password.length > 8,
    hasUppercase: (password.match(/[A-Z]/g) || []).length >= 2,
    hasLowercase: (password.match(/[a-z]/g) || []).length >= 2,
    hasNumbers: (password.match(/[0-9]/g) || []).length >= 2,
    hasSpecialChar: (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2,
    meetsAll: false,
  };
  
  requirements.meetsAll =
    requirements.hasMinLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumbers &&
    requirements.hasSpecialChar;
  
  return requirements;
};
