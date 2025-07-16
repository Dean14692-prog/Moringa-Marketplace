import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Footer from './components/footer';
import Herossection from './components/herossection';
import Navbar from './components/navbar';

import AnimatedTestimonialsDemo from './components/testimonials'

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="/"
          element={
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
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
