import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Register } from "../features/Auth";
import Header from "../components/Header";
import { VerifyOtp } from "../features/Auth";

export default function RegisterPage() {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loginId, setLoginId] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [errors, setErrors] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentStep, setCurrentStep] = React.useState("register") // "register" or "verify"
    const [otp, setOtp] = React.useState("")
    const [otpError, setOtpError] = React.useState("")
    const [passwordValidation, setPasswordValidation] = React.useState({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    })
    const [emailValidation, setEmailValidation] = React.useState({
        isValid: false,
        message: ""
    })
    const [passwordMatch, setPasswordMatch] = React.useState({
        isValid: false,
        message: ""
    })
    const [loginIdValidation, setLoginIdValidation] = React.useState({
        isValid: false,
        message: ""
    })
    const navigate = useNavigate()

    const validatePassword = (password) => {
        setPasswordValidation({
            hasMinLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        })
    }

    const validateLoginId = (loginId) => {
        // Check if loginId contains only letters (alphabetic characters)
        const onlyLettersRegex = /^[a-zA-Z]+$/
        
        if (loginId.length === 0) {
            setLoginIdValidation({
                isValid: false,
                message: ""
            })
            return
        }
        
        if (loginId.length < 3) {
            setLoginIdValidation({
                isValid: false,
                message: "Login ID must be at least 3 characters long"
            })
            return
        }
        
        if (loginId.length > 20) {
            setLoginIdValidation({
                isValid: false,
                message: "Login ID cannot exceed 20 characters"
            })
            return
        }
        
        if (!onlyLettersRegex.test(loginId)) {
            setLoginIdValidation({
                isValid: false,
                message: "Login ID can only contain letters (a-z, A-Z)"
            })
            return
        }
        
        // All validations passed
        setLoginIdValidation({
            isValid: true,
            message: "Valid login ID"
        })
    }

    const validateEmail = (email) => {
        // More comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        
        // Check basic format
        if (!emailRegex.test(email)) {
            setEmailValidation({
                isValid: false,
                message: "Please enter a valid email address"
            })
            return
        }
        
        // Additional validations
        if (email.length > 254) {
            setEmailValidation({
                isValid: false,
                message: "Email address is too long"
            })
            return
        }
        
        if (email.startsWith('.') || email.endsWith('.')) {
            setEmailValidation({
                isValid: false,
                message: "Email cannot start or end with a dot"
            })
            return
        }
        
        if (email.includes('..')) {
            setEmailValidation({
                isValid: false,
                message: "Email cannot contain consecutive dots"
            })
            return
        }
        
        const [localPart, domain] = email.split('@')
        
        // Validate local part (before @)
        if (localPart.length > 64 ) {
            setEmailValidation({
                isValid: false,
                message: "Email username part is too long"
            })
            return
        }
        
        // Local part cannot be empty
        if (localPart.length === 0) {
            setEmailValidation({
                isValid: false,
                message: "Email username part cannot be empty"
            })
            return
        }
        
        // Local part cannot start or end with a dot
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
            setEmailValidation({
                isValid: false,
                message: "Email username cannot start or end with a dot"
            })
            return
        }
        
    
        

        for(let char of localPart) {
            // Check for invalid characters
            if (/[!#$%&'*+/=?^_`{|}~-]/.test(char)) {
                setEmailValidation({
                    isValid: false,
                    message: "Email username contains invalid characters"
                })
                return
            }
        }
        
        // Local part cannot start or end with special characters (except allowed ones)
        const firstChar = localPart[0]
        const lastChar = localPart[localPart.length - 1]
        const specialChars = /[!#$%&'*+/=?^_`{|}~-]/
        
        if (specialChars.test(firstChar) || specialChars.test(lastChar)) {
            setEmailValidation({
                isValid: false,
                message: "Email username cannot start or end with special characters"
            })
            return
        }
        
        // Check for invalid characters in local part
        const invalidChars = /[()<>[\]:;@\\,"]/
        if (invalidChars.test(localPart)) {
            setEmailValidation({
                isValid: false,
                message: "Email username contains invalid characters"
            })
            return
        }
        
        
        // Validate domain part (after @)
        if (domain.length > 253) {
            setEmailValidation({
                isValid: false,
                message: "Email domain is too long"
            })
            return
        }
        
        // Check for valid domain format
        const domainParts = domain.split('.')
        if (domainParts.length < 2) {
            setEmailValidation({
                isValid: false,
                message: "Email must have a valid domain"
            })
            return
        }
        
        // Check if domain has valid TLD
        const tld = domainParts[domainParts.length - 1]
        if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
            setEmailValidation({
                isValid: false,
                message: "Email must have a valid domain extension"
            })
            return
        }
        
        // All validations passed
        setEmailValidation({
            isValid: true,
            message: "Valid email format"
        })
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        validatePassword(newPassword)
        
        // Re-validate confirm password if it exists
        if (confirmPassword.length > 0) {
            if (newPassword === confirmPassword) {
                setPasswordMatch({
                    isValid: true,
                    message: "Passwords match"
                })
            } else {
                setPasswordMatch({
                    isValid: false,
                    message: "Passwords do not match"
                })
            }
        }
    }

    const handleEmailChange = (e) => {
        const newEmail = e.target.value
        setEmail(newEmail)
        if (newEmail.length > 0) {
            validateEmail(newEmail)
        } else {
            setEmailValidation({ isValid: false, message: "" })
        }
    }

    const handleLoginIdChange = (e) => {
        const newLoginId = e.target.value
        setLoginId(newLoginId)
        if (newLoginId.length > 0) {
            validateLoginId(newLoginId)
        } else {
            setLoginIdValidation({ isValid: false, message: "" })
        }
    }

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value
        setConfirmPassword(newConfirmPassword)
        
        if (newConfirmPassword.length > 0) {
            if (password === newConfirmPassword) {
                setPasswordMatch({
                    isValid: true,
                    message: "Passwords match"
                })
            } else {
                setPasswordMatch({
                    isValid: false,
                    message: "Passwords do not match"
                })
            }
        } else {
            setPasswordMatch({ isValid: false, message: "" })
        }
    }

    const isPasswordValid = () => {
        return Object.values(passwordValidation).every(Boolean)
    }

    const isEmailValid = () => {
        return emailValidation.isValid
    }

    const isLoginIdValid = () => {
        return loginIdValidation.isValid
    }

    const isFormValid = () => {
        return isPasswordValid() && 
               isEmailValid() && 
               isLoginIdValid() &&
               name.trim() && 
               loginId.trim() && 
               passwordMatch.isValid &&
               password.length > 0 &&
               confirmPassword.length > 0
    }


    const handleRegister = (event) => {
      event.preventDefault()
      setErrors({})
      setIsLoading(true)
      if (password !== confirmPassword) {
        setErrors({ password: "Passwords do not match" })
        setIsLoading(false)
        return
      }
      if (!isPasswordValid()) {
        setErrors({ password: "Password does not meet all requirements" })
        setIsLoading(false)
        return
      }
      if (!isEmailValid()) {
        setErrors({ email: "Please enter a valid email address" })
        setIsLoading(false)
        return
      }
      if (!isLoginIdValid()) {
        setErrors({ loginId: "Please enter a valid login ID" })
        setIsLoading(false)
        return
      }
      Register( name, email, password, loginId )
      .then((data) => {
        console.log(data)
        setIsLoading(false)
        // After successful registration, move to OTP verification step
        setCurrentStep("verify")
      })
      .catch((error) => {
        console.log(error)
        setErrors(error.response)
        setIsLoading(false)
      })
    }

    const handleOtpVerification = (event) => {
      event.preventDefault()
      setOtpError("")
      setIsLoading(true)
      VerifyOtp(email, otp)
      .then((data) => {
        console.log(data)
        // Handle successful OTP verification (e.g., navigate to dashboard)
      })
      .catch((error) => {
        console.log(error)
        setOtpError("Invalid OTP")
      })
      .finally(() => {
        setIsLoading(false)
        navigate("/login")
      })
    }

    const resendOtp = () => {
      // Logic to resend OTP
      setOtpError("")
      // Make API call to resend OTP
      console.log("Resending OTP to:", email)
    }


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white p-8 rounded-lg shadow-md border border-teal-300 max-w-md w-full">
          {currentStep === "register" ? (
            // Registration Form
            <>
              <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
              <form className="space-y-4" onSubmit={handleRegister}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Name"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                <input
                  type="text"
                  value={loginId}
                  onChange={handleLoginIdChange}
                  required
                  placeholder="Create Login ID"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                
                {/* Login ID Validation Indicator */}
                {loginId && loginIdValidation.message && (
                  <div className={`text-xs mt-1 flex items-center ${loginIdValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">{loginIdValidation.isValid ? '✓' : '✗'}</span>
                    {loginIdValidation.message}
                  </div>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="Email"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                
                {/* Email Validation Indicator */}
                {email && emailValidation.message && (
                  <div className={`text-xs mt-1 flex items-center ${emailValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">{emailValidation.isValid ? '✓' : '✗'}</span>
                    {emailValidation.message}
                  </div>
                )}
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Password"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                
                {/* Password Validation Indicators */}
                {password && (
                  <div className="text-xs space-y-1 mt-2">
                    <div className={`flex items-center ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.hasMinLength ? '✓' : '✗'}</span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.hasUppercase ? '✓' : '✗'}</span>
                      One uppercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.hasLowercase ? '✓' : '✗'}</span>
                      One lowercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                      One number
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                      One special character
                    </div>
                  </div>
                )}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  placeholder="confirm Password"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                
                {/* Password Match Validation Indicator */}
                {confirmPassword && passwordMatch.message && (
                  <div className={`text-xs mt-1 flex items-center ${passwordMatch.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">{passwordMatch.isValid ? '✓' : '✗'}</span>
                    {passwordMatch.message}
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
                {errors.loginId && (
                  <p className="text-red-500 text-sm">{errors.loginId}</p>
                )}
                <div className="flex items-center text-xs">
                  <input type="checkbox" className="mr-2" required />
                  <span>
                    Agree to our privacy policy and terms and condition
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className="w-full bg-[#017384] text-white py-2 rounded-full font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Registering..." : "Sign Up"}
                </button>
              </form>
              <p className="text-xs text-center mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-[#017384] hover:underline">
                  Log In
                </Link>
              </p>
            </>
          ) : (
            // OTP Verification Form
            <>
              <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                We've sent a verification code to <strong>{email}</strong>
              </p>
              <form className="space-y-4" onSubmit={handleOtpVerification}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="123456"
                    maxLength="6"
                    className="w-full border rounded-md px-3 py-2 text-center text-lg tracking-widest outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                  />
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm text-center">{otpError}</p>
                )}
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-[#017384] text-white py-2 rounded-full font-medium hover:bg-teal-700 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
              <div className="text-center mt-4">
                <p className="text-xs text-gray-600">
                  Didn't receive the code?{" "}
                  <button 
                    onClick={resendOtp}
                    className="text-[#017384] hover:underline"
                  >
                    Resend
                  </button>
                </p>
                <button 
                  onClick={() => setCurrentStep("register")}
                  className="text-xs text-gray-500 hover:underline mt-2"
                >
                  Back to registration
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#714B67] text-white py-8">
        <div className="container mx-auto grid grid-cols-5 gap-6 text-sm px-6">
          <div>
            <h4 className="font-semibold mb-2">Quick links</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">FAQs</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Social Media</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
