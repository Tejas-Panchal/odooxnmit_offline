import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateUser as CreateUserAPI } from '../features/Auth';
import Logo from '../assests/logo_1.png';


// You can replace these with your actual image paths
const logoUrl = 'https://i.imgur.com/sC44oMA.png'; // Placeholder for Shiv Accounts Cloud logo
const profileImageUrl = 'https://i.imgur.com/random-avatar.png'; // Placeholder for profile picture

// A simple arrow SVG for the back button
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);


const CreateUser = () => {
  
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [loginId, setLoginId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState('');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    // Call the create user API
    CreateUserAPI(name, role, loginId, password, email)
      .then((data) => {
        console.log("User created successfully:", data);
        navigate("/Contacts_Master"); // Navigate to Contacts Master page after successful creation
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        setErrorMessage("Failed to create user");
      });
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans">
      {/* Sub Header */}
      <div className="bg-white shadow-sm">
         <div className="container mx-auto px-8 py-3">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon /><span>Back</span>
            </button>
         </div>
      </div>


      {/* Main Content Area */}
      <main className="flex justify-center items-center py-10 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-[3px] border-[#a0e0d4] w-full max-w-5xl">
          <h2 style={{ color: '#008080' }} className="text-4xl mb-8">
            Create New User
          </h2>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
              {/* Name Field */}
              <div className="flex items-center space-x-4">
                <label htmlFor="name" className="w-24 text-right font-medium text-gray-700">Name :</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Role Field */}
              <div className="flex items-center space-x-4">
                <label htmlFor="role" className="w-24 text-right font-medium text-gray-700">Role :</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white bg-no-repeat bg-right pr-8"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="" disabled>select user role</option>
                  <option value="Admin">Admin</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Contact">Contact</option>
                </select>
              </div>

              {/* Login ID Field */}
              <div className="flex items-center space-x-4">
                <label htmlFor="loginId" className="w-24 text-right font-medium text-gray-700">Login ID :</label>
                <div className="flex-1">
                    <input
                        type="text"
                        id="loginId"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                        placeholder="Login ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Login ID should be 6-12 characters</p>
                </div>
              </div>

               {/* Empty placeholder for grid alignment */}
               <div></div>


              {/* Email Field */}
              <div className="flex items-center space-x-4">
                <label htmlFor="email" className="w-24 text-right font-medium text-gray-700">Email :</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Empty placeholder for grid alignment */}
              <div></div>


              {/* Password Field */}
              <div className="flex items-center space-x-4">
                 <label htmlFor="password" className="w-24 text-right font-medium text-gray-700">Password :</label>
                 <div className="flex-1">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Password must contain an uppercase letter, a lowercase letter, a special character, a number and have at least 8 characters
                    </p>
                 </div>
              </div>

              {/* Confirm Password Field */}
              <div className="flex items-center space-x-4">
                 <div className="w-24"></div> {/* Spacer to align with labels */}
                 <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                 />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex justify-start space-x-4 ml-28">
              <button
                type="button"
                onClick={handleBack}
                className="bg-[#6b7280] text-white font-semibold py-2 px-8 rounded-full hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#14b8a6] text-white font-semibold py-2 px-8 rounded-full hover:bg-teal-700 transition duration-300"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </main>

       {/* Footer */}
       <footer className="bg-[#5a2d5d] h-16 mt-10">
            {/* Footer content can go here */}
       </footer>

    </div>
  );
};

export default CreateUser;