// src/pages/StudentSignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [error, setError] = useState(null);     // New state for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // Made the function async
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null);   // Clear previous errors

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // Check if the response status is 200-299
        console.log('Login Successful:', data);
        // Store the JWT token in localStorage
        localStorage.setItem('jwt_token', data.access_token);
        // Optionally, store basic student data if needed for initial dashboard load
        // (though dashboard will fetch its own /api/me anyway)
        // localStorage.setItem('student_info', JSON.stringify(data.student));

        alert('Sign-in Successful!');
        navigate('/dashboard'); // Navigate to the Student Dashboard
      } else {
        // Handle login errors (e.g., invalid credentials)
        console.error('Login Failed:', data.msg || 'Unknown error');
        setError(data.msg || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && ( // Display error message if present
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'} {/* Change button text during loading */}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default StudentSignIn;