
import './App.css'
import Footer from './components/footer';
import Herossection from './components/herossection';
import Navbar from './components/navbar';
import FloatingDockDemo  from './components/navbar';
import AnimatedTestimonialsDemo from './components/testimonials'

function App() {
  

  return (
    <>
      <div>
        <Navbar />
        <Herossection />
        <AnimatedTestimonialsDemo />
        <Footer />
      </div>
    </>
  );
}

export default App
