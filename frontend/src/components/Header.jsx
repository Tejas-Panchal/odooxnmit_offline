import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getButtonClass = (path) => {
    return isActive(path) 
      ? "bg-white text-[#714B67] px-4 py-1 rounded-full font-medium" 
      : "hover:text-gray-300 px-4 py-1 rounded-full";
  };

  return (
    <div>
        <header className="bg-[#714B67] text-white">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-xl font-bold cursor-pointer" onClick={() => handleNavigation('/')}>
            {/* Logo */}
            Shiv Accounts Cloud
          </div>
          <nav className="flex space-x-8">
            <button 
              onClick={() => handleNavigation('/')} 
              className={getButtonClass('/')}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/create-user')} 
              className={getButtonClass('/services')}
            >
              Services
            </button>
            <button 
              onClick={() => handleNavigation('/login')} 
              className={getButtonClass('/login')}
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation('/register')}
              className={getButtonClass('/register')}
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>
    </div>
  )}

export default Header;
    