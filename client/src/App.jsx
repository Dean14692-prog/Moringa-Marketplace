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
<<<<<<<<< Temporary merge branch 1
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Herossection />
              <AnimatedTestimonialsDemo />
              <Footer />
            </>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router>
=========
    <>
      <div>
        <Navbar />
        <Herossection />
        <Carousel />
        <BackgroundGradientDemo />
        <AnimatedTestimonialsDemo />
        <Footer />
      </div>
    </>
>>>>>>>>> Temporary merge branch 2
  );
}

export default App;
