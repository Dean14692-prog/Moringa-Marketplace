// import FloatingDockDemo from "./navbar";

const Footer = () => {
  return (
    <footer className="bg-[#0D1B2A] text-white px-4 sm:px-6 lg:px-8 py-10 md:py-12 w-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: School Info */}
        <div>
          <div>
            <h2 className="text-3xl font-extrabold mb-4 tracking-wide">
              MORINGA
            </h2>
            <p className="text-sm mb-1 text-gray-300">
              Ngong Lane Plaza, 1st Floor
            </p>
            <p className="text-sm mb-1 text-gray-300">Nairobi, Kenya</p>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-300">+254711 222 999</p>
            <p className="text-sm text-gray-300">+254711 222 999 (WhatsApp)</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-300">g1@moringaschool.com</p>
            <p className="text-sm text-gray-300">info@moringaschool.com</p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="text-gray-300 hover:underline">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Find Us with Map */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Find Us</h3>
          <div className="mb-4">
            <iframe
              title="Moringa Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.790933742468!2d36.78771457497177!3d-1.297495535623098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10b75a109a93%3A0xc3f8b0e87b7a7c81!2sMoringa%20School!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
              width="100%"
              height="200"
              className="rounded-lg border-none"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      {/* <div>
        <FloatingDockDemo />
      </div> */}
      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © 2025 Moringa School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
