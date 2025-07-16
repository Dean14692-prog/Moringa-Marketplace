import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Footer from './components/footer';
import Herossection from './components/herossection';
import Navbar from './components/navbar';
import AnimatedTestimonialsDemo from './components/testimonials';
import Signup from './pages/signup';
import Login from "./pages/login";
import Home from "./pages/home";

function App() {
  return (
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
  );
}

export default App;

