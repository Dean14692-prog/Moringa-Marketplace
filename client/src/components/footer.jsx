
// const Footer = () => {
//   return (
//     <footer className="bg-[#0D1B2A] text-white px-4 sm:px-6 lg:px-8 py-10 md:py-12 w-screen">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Column 1: School Info */}
//         <div>
//           <div>
//             <h2 className="text-3xl font-extrabold mb-4 tracking-wide">
//               MORINGA
//             </h2>
//             <p className="text-sm mb-1 text-gray-300">
//               Ngong Lane Plaza, 1st Floor
//             </p>
//             <p className="text-sm mb-1 text-gray-300">Nairobi, Kenya</p>
//           </div>

//           <div className="mt-6 space-y-2">
//             <p className="text-sm text-gray-300">+254711 222 999</p>
//             <p className="text-sm text-gray-300">+254711 222 999 (WhatsApp)</p>
//           </div>

//           <div className="mt-4 space-y-2">
//             <p className="text-sm text-gray-300">g1@moringaschool.com</p>
//             <p className="text-sm text-gray-300">info@moringaschool.com</p>
//           </div>
//         </div>

//         {/* Column 2: Quick Links */}
//         <div>
//           <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
//           <ul className="space-y-3 text-sm">
//             <li>
//               <a href="#" className="text-gray-300 hover:underline">
//                 Projects
//               </a>
//             </li>
//             <li>
//               <a href="#" className="text-gray-300 hover:underline">
//                 Careers
//               </a>
//             </li>
//             <li>
//               <a href="#" className="text-gray-300 hover:underline">
//                 FAQs
//               </a>
//             </li>
//             <li>
//               <a href="#" className="text-gray-300 hover:underline">
//                 Contact Us
//               </a>
//             </li>
//             <li>
//               <a href="#" className="text-gray-300 hover:underline">
//                 Privacy Policy
//               </a>
//             </li>
//           </ul>
//         </div>

//         {/* Column 3: Find Us with Map */}
//         <div>
//           <h3 className="text-xl font-semibold mb-5">Find Us</h3>
//           <div className="mb-4">
//             <iframe
//               title="Moringa Location"
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.790933742468!2d36.78771457497177!3d-1.297495535623098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10b75a109a93%3A0xc3f8b0e87b7a7c81!2sMoringa%20School!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
//               width="100%"
//               height="200"
//               className="rounded-lg border-none"
//               allowFullScreen=""
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
//         © 2025 Moringa School. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#101F3C] text-white font-bold px-4 sm:px-6 lg:px-8 py-12 [p]:text-white [p]:font-bold [a]:text-white [a]:font-bold [span]:text-white [span]:font-bold">
      <div className="max-w-7xl h-[460px] mx-auto">
        <div className="grid grid-cols-3 gap-12 mb-8">
          {/* Column 1: School Info with Logo */}
          <div className="space-y-6">
            <img
              src="/Moringa Logo.png"
              alt="Moringa Logo"
              className="ml-10 w-100 h-15 object-contain"
            />

            {/* Navigation Links */}
            <div className="mt-6 ml-30">
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Contact & Quick Links */}
          <div className="flex flex-col space-y-6">
            {/* Physical Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                Ngong Lane, Ngong Lane Plaza, 1st Floor,
                <br />
                Nairobi Kenya
              </p>
            </div>

            {/* Phone Numbers */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-sm">
                  +254711 082 146 (General Enquiries)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-orange-500" />
                <span className="text-sm">+254712 293 878 (Whatsapp)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-sm">
                  0738 368 319 (Corporate Inquiries)
                </span>
              </div>
            </div>

            {/* Email Addresses */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-sm">contact@moringaschool.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-sm">admissions@moringaschool.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-sm">corporate@moringaschool.com</span>
              </div>
            </div>

            {/* P.O Box */}
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span className="text-sm">P.O Box 28860 - 00100, Nairobi</span>
            </div>
          </div>

          {/* Column 3: Map */}
          <div className="space-y-6">
            <div>
              <iframe
                title="Moringa School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.790933742468!2d36.78771457497177!3d-1.297495535623098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10b75a109a93%3A0xc3f8b0e87b7a7c81!2sMoringa%20School!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="300"
                className="border-gray-600"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <p className="text-gray-400 text-sm text-center mt-20">
          © 2025 Moringa School. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
