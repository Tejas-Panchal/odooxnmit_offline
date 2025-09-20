import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Register } from "../features/Auth";

export default function RegisterPage() {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loginId, setLoginId] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [errors, setErrors] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(false)
    const navigate = useNavigate()


    const handleRegister = (event) => {
      event.preventDefault()
      setErrors({})
      setIsLoading(true)
      if (password !== confirmPassword) {
        setErrors({ password: "Passwords do not match" })
        setIsLoading(false)
        return
      }
      Register( name, email, password, loginId )
      .then((data) => {
        console.log(data)
        setIsLoading(false)
        navigate("/login")
      })
      .catch((error) => {
        console.log(error)
        setErrors(error.response)
        setIsLoading(false)
      })
    }


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-[#714B67] text-white">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-sm text-gray-200 cursor-pointer">
            {/* Logo */}
          </div>
          <nav className="flex space-x-8">
            <a href="#" className="hover:text-gray-300">Home</a>
            <a href="#" className="hover:text-gray-300">About</a>
            <a href="#" className="hover:text-gray-300">Services</a>
            <button className="bg-white text-[#714B67] px-4 py-1 rounded-full font-medium">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white p-8 rounded-lg shadow-md border border-teal-300 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <form className="space-y-4">
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
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="confirm Password"
              className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#714B67] focus:bg-[#BFA9C3]"
            />
            <div className="flex items-center text-xs">
              <input type="checkbox" className="mr-2" />
              <span>
                Agree to our privacy policy and terms and condition
              </span>
            </div>
            <button
              type="submit"
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-[#017384] text-white py-2 rounded-full font-medium hover:bg-teal-700"
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
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#714B67] text-white py-8">
        <div className="container mx-auto grid grid-cols-5 gap-6 text-sm px-6">
          <div>
            <h4 className="font-semibold mb-2">Quick links</h4>
            <ul>
              {Array(5)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">FAQs</h4>
            <ul>
              {Array(5)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul>
              {Array(5)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul>
              {Array(5)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">{link}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Social Media</h4>
            <ul>
              {Array(5)
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
