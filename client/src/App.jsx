import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
// import StudentDashboard from './pages/StudentDashboard';
import Carousel from './components/carousel';
import Footer from './components/footer';
import Herossection from './components/herossection';
import Navbar from './components/navbar';
import FloatingDockDemo from './components/navbar';
import AnimatedTestimonialsDemo from './components/testimonials';
import Admin from './pages/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Herossection />
        <Carousel />
        <BackgroundGradientDemo />
        <AnimatedTestimonialsDemo />
        <Footer />
        {/* <StudentDashboard /> */}
      </div>
    </>
  );
}

export default App;
