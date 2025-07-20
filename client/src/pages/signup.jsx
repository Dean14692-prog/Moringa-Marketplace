// src/pages/signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentSignUp = () => { // <--- The component is named StudentSignUp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, github, linkedin, skills: skillsArray }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration Successful:', data);
        setSuccess('Registration successful! You can now sign in.');
        setName('');
        setEmail('');
        setPassword('');
        setGithub('');
        setLinkedin('');
        setSkills('');
        setTimeout(() => {
          navigate('/student-signin');
        }, 2000);
      } else {
        console.error('Registration Failed:', data.msg || 'Unknown error');
        setError(data.msg || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          {/* Optional fields based on your Student model */}
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile URL (Optional)
            </label>
            <input
              type="url"
              id="github"
              name="github"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/your-username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile URL (Optional)
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Skills (Comma-separated, e.g., React,Python,SQL)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="JavaScript,React,Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/student-signin" className="font-medium text-blue-600 hover:text-blue-500">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default StudentSignUp; // <--- THIS LINE IS CRUCIAL!d6b6b9a4ec5e0758e2f47717436b45845c73a470ef2113dd2397cd95013d71fc