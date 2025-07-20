// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Herossection from './components/Herossection';
import StudentDashboard from './pages/StudentDashboard';
// --- CHANGE STARTS HERE ---
import MyProjects from './pages/MyProjects'; // Import the renamed component
// If you still have a separate component for Profile, ensure it's imported:
import Profile from './pages/Profile'; // This is for the actual student profile page
// --- CHANGE ENDS HERE ---
import UploadProject from './pages/UploadProject';
import StudentSignIn from './pages/StudentSignIn';
import StudentSignUp from './pages/signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-900">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Herossection />} />

            {/* Route for the Student Sign-in page */}
            <Route path="/student-signin" element={<StudentSignIn />} />

            {/* NEW: Add a route for your Student Sign-up page */}
            <Route path="/signup" element={<StudentSignUp />} />

            <Route path="/dashboard" element={<StudentDashboard />}>
              {/* --- CHANGE STARTS HERE --- */}
              {/* Use the new MyProjects component for the dashboard projects route */}
              <Route path="projects" element={<MyProjects />} />
              {/* --- CHANGE ENDS HERE --- */}
              <Route path="profile" element={<Profile />} /> {/* This should be your actual profile page */}
              <Route path="upload" element={<UploadProject />} />
              <Route
                index
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome, Student 👋</h1>
                    <p>This is your dashboard content area.</p>
                  </div>
                }
              />
            </Route>

            {/*
               You also have these pages in src/pages:
               about.jsx, checkout.jsx, contact.jsx, hirerequest.jsx, login.jsx,
               nopage.jsx, orderlist.jsx, projectcart.jsx, projectlist.jsx,
               shoppingpage.jsx, studentprofile.jsx

               If you want these to be accessible via URL, you need to import them
               and add <Route> components for them within your <Routes>.

               Example:
               import About from './pages/about';
               import Login from './pages/login';
               <Route path="/about" element={<About />} />
               <Route path="/login" element={<Login />} />
               <Route path="*" element={<NoPage />} /> // For your nopage.jsx (404)
            */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;