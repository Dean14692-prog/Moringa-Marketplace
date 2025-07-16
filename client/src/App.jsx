
import './App.css';
import Footer from './components/footer';
import Herossection from './components/herossection';
import Navbar from './components/navbar';
import FloatingDockDemo from './components/navbar';
import AnimatedTestimonialsDemo from './components/testimonials';
import Admin from './pages/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
            <>
              <div>
                <Navbar />
                <Herossection />
                <AnimatedTestimonialsDemo />
                <Footer />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
