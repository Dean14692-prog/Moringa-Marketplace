import './App.css'
import Carousel from './components/carousel';
import Footer from './components/footer';
import Herossection from './components/herossection';
import Navbar from './components/navbar';
import BackgroundGradientDemo from './components/projectpreview';
import AnimatedTestimonialsDemo from './components/testimonials'


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
      </div>
    </>

  );
}

export default App;

