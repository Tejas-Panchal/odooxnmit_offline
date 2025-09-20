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

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        validatePassword(newPassword)
    }

    const isPasswordValid = () => {
        return Object.values(passwordValidation).every(Boolean)
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
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  placeholder="Create Login ID"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="confirm Password"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
                <div className="flex items-center text-xs">
                  <input type="checkbox" className="mr-2" required />
                  <span>
                    Agree to our privacy policy and terms and condition
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !isPasswordValid()}
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
