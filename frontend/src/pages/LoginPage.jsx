import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Login } from "../features/Auth";
import Header from "../components/Header";

const Notification = ({ notification, onClose }) => {
  const { id, type, title, message } = notification;

  useEffect(() => {
    // Set a timer to automatically close the notification
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000); // Notification disappears after 5 seconds

    // Cleanup function to clear the timer if the component is unmounted
    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose]);

  const icons = {
    error: "❌",
  };

  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">{icons[type] || "🔔"}</div>
      <div className="notification-content">
        <h4 className="notification-title">{title}</h4>
        <p className="notification-message">{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="close-button">
        &times;
      </button>
    </div>
  );
};

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const triggerNotification = useCallback((type, title, message) => {
    const id = new Date().getTime();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
  }, []);
  const handleClose = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        setErrors({});
        setIsLoading(true);
        Login(loginId, password)
        .then((data) => {
            console.log(data);
            localStorage.setItem('token', data.access_token);
            setIsLoading(false);
            if (data.role === 'Admin') {
                navigate("/Contacts_Master");
            } else if (data.role === 'Accountant') {
            navigate("/Contacts_Master");
            }else if(data.role === 'Contact'){
                navigate("/Customer_Invoice");
            }
        })
        .catch((error) => {
            console.log(error);
            setErrors(error);
            setIsLoading(false);
        });
    };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar - Kept the same for consistency */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white py-3 px-8 rounded-lg shadow-md border border-teal-300 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              placeholder="Login ID"
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#017384] text-white py-2 rounded-full font-medium hover:bg-teal-700 disabled:bg-teal-400"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-xs text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#017384] hover:underline">
              Sign Up
            </Link>
            <br />
            <span className="text-red-500 m-2 text-sm text-center mt-4">
              {errors && (typeof errors === "string" ? errors : errors.detail)}
            </span>
          </p>
        </div>
      </main>

      {/* Footer - Kept the same for consistency */}
      <footer className="bg-[#714B67] text-white py-8">
        <div className="container mx-auto grid grid-cols-5 gap-6 text-sm px-6">
          <div>
            <h4 className="font-semibold mb-2">Quick links</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">
                    {link}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">FAQs</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">
                    {link}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">
                    {link}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">
                    {link}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Social Media</h4>
            <ul>
              {Array(2)
                .fill("link 1")
                .map((link, idx) => (
                  <li key={idx} className="hover:underline cursor-pointer">
                    {link}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </footer>
      <div className="notification-container">
        {notifications.map(n => (
          <Notification key={n.id} notification={n} onClose={handleClose} />
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
