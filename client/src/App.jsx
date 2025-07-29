import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleOAuthProvider as GoogleOAuthContextProvider } from "./context/GoogleOAuthContext";
import "./App.css";
import Landingpage from "./pages/landingpage";
import SignupForm from "./pages/signup";
import LoginForm from "./pages/login";
import ProjectLayout from "./pages/projectlist";
import EcommerceLayout from "./pages/shoppingpage";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import UploadProject from "./pages/UploadProject";
import { StudentDashBoard } from "./pages/StudentDashBoard";
import NotFound from "./pages/NotFoundpage";
import ContactUs from "./pages/ContactUs";
import ContactMe from "./pages/ContactMe";
import AdminDashboard from "./pages/AdminDashboard";
import MerchUpload from "./pages/MerchUpload";
import AnimatedStats from "./components/animatednumbers";
import App11 from "./pages/Home";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.error('Google Client ID is not set in environment variables');
  }
  if (!googleClientId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Configuration Error</h2>
          <p>Google OAuth is not properly configured. Please check your environment variables.</p>
          <p className="mt-2 text-sm text-gray-400">Missing: VITE_GOOGLE_CLIENT_ID</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider 
      clientId={googleClientId}
      onScriptLoadError={() => console.error('Failed to load Google OAuth script')}
      onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
      auto_select={false}
      useOneTap
      uxMode="popup"
      cookiePolicy="single_host_origin"
      isSignedIn={false}
      promptMomentNotification={() => {}}
      accessType="offline"
      scope="profile email"
    >
      <GoogleOAuthContextProvider>
        <Routes>
        <Route path="/" element={<Landingpage />} /> 
        <Route path="/home" element={< App11 /> } />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/projects" element={<ProjectLayout />} />
        <Route path="/shop" element={<EcommerceLayout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-projects" element={<MyProjects />} />

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/contact-me" element={<ContactMe />} />
        <Route path="/dashboard" element={<StudentDashBoard />}>
          <Route path="upload-project" element={<UploadProject />} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="upload-merch" element={<MerchUpload />} />
        
        

          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </GoogleOAuthContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
