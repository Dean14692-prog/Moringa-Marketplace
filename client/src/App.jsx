import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/projects" element={<ProjectLayout />} />
        <Route path="/shop" element={<EcommerceLayout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/upload" element={<UploadProject />} />
        <Route path="/dashboard" element={<StudentDashBoard />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/contact-me" element={<ContactMe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
