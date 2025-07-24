
// import { useState } from "react";
// import { Search, Home, User, ShoppingCart, Plus, Minus, X } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// const EcommerceLayout = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const navigate = useNavigate();

//   const isAuthenticated = false;

//   const pins = [
//     {
//       id: 1,
//       image: "https://picsum.photos/115/149?random=1",
//       title: "Air Jordan 4 Retro",
//       description:
//         "The AJ4 Retro Reimagined Bred will release on Feb 17, 2024.",
//       price: 100,
//       height: 149,
//     },
//     {
//       id: 2,
//       image: "https://picsum.photos/115/239?random=2",
//       title: "Nike Dunk Low Panda",
//       description: "Timeless black and white Dunk Low.",
//       price: 90,
//       height: 239,
//     },
//     {
//       id: 3,
//       image: "https://picsum.photos/115/121?random=3",
//       title: "Yeezy Slide Pure",
//       description: "Minimalist Yeezy comfort.",
//       price: 80,
//       height: 121,
//     },
//     {
//       id: 4,
//       image: "https://picsum.photos/115/182?random=4",
//       title: "Vintage Hoodie",
//       description: "Retro graphics inspired by 90s street culture.",
//       price: 85,
//       height: 182,
//     },
//     {
//       id: 5,
//       image: "https://picsum.photos/115/205?random=5",
//       title: "Designer Cap",
//       description: "Minimalist cap with premium materials.",
//       price: 45,
//       height: 205,
//     },
//     {
//       id: 6,
//       image: "https://picsum.photos/115/176?random=6",
//       title: "Techwear Jacket",
//       description: "Waterproof and futuristic techwear aesthetic.",
//       price: 150,
//       height: 176,
//     },
//     {
//       id: 7,
//       image: "https://picsum.photos/115/212?random=7",
//       title: "Canvas Tote Bag",
//       description: "Eco-friendly canvas tote bag for everyday use.",
//       price: 35,
//       height: 212,
//     },
//     {
//       id: 8,
//       image: "https://picsum.photos/115/199?random=8",
//       title: "Luxury Watch",
//       description: "Stainless steel automatic wristwatch.",
//       price: 400,
//       height: 199,
//     },
//     {
//       id: 9,
//       image: "https://picsum.photos/115/132?random=9",
//       title: "Running Shorts",
//       description: "Lightweight shorts for optimal performance.",
//       price: 40,
//       height: 132,
//     },
//     {
//       id: 10,
//       image: "https://picsum.photos/115/246?random=10",
//       title: "Oversized T-Shirt",
//       description: "Relaxed fit t-shirt with bold print.",
//       price: 60,
//       height: 246,
//     },
//     {
//       id: 11,
//       image: "https://picsum.photos/115/102?random=11",
//       title: "Snapback Hat",
//       description: "Adjustable snapback with embroidered logo.",
//       price: 30,
//       height: 102,
//     },
//     {
//       id: 12,
//       image: "https://picsum.photos/115/138?random=12",
//       title: "Leather Wallet",
//       description: "Premium leather wallet with RFID protection.",
//       price: 70,
//       height: 138,
//     },
//     {
//       id: 13,
//       image: "https://picsum.photos/115/157?random=13",
//       title: "Sports Bra",
//       description: "Supportive and breathable fabric design.",
//       price: 55,
//       height: 157,
//     },
//     {
//       id: 14,
//       image: "https://picsum.photos/115/144?random=14",
//       title: "Retro Sunglasses",
//       description: "Classic design with UV protection.",
//       price: 50,
//       height: 144,
//     },
//     {
//       id: 15,
//       image: "https://picsum.photos/115/210?random=15",
//       title: "Corduroy Pants",
//       description: "Vintage vibe with a modern fit.",
//       price: 75,
//       height: 210,
//     },
//     {
//       id: 16,
//       image: "https://picsum.photos/115/217?random=16",
//       title: "Bomber Jacket",
//       description: "Military-inspired bomber in bold colors.",
//       price: 120,
//       height: 217,
//     },
//     {
//       id: 17,
//       image: "https://picsum.photos/115/153?random=17",
//       title: "Chunky Sneakers",
//       description: "Maximum comfort and bold silhouette.",
//       price: 110,
//       height: 153,
//     },
//     {
//       id: 18,
//       image: "https://picsum.photos/115/162?random=18",
//       title: "Mesh Cap",
//       description: "Breathable summer-ready cap.",
//       price: 25,
//       height: 162,
//     },
//     {
//       id: 19,
//       image: "https://picsum.photos/115/125?random=19",
//       title: "Fleece Joggers",
//       description: "Soft fleece fabric for cozy loungewear.",
//       price: 65,
//       height: 125,
//     },
//     {
//       id: 20,
//       image: "https://picsum.photos/115/250?random=20",
//       title: "Graphic Hoodie",
//       description: "Eye-catching designs with comfy interior.",
//       price: 95,
//       height: 250,
//     },
//     {
//       id: 21,
//       image: "https://picsum.photos/115/111?random=21",
//       title: "Ribbed Tank Top",
//       description: "Basic essential for everyday styling.",
//       price: 35,
//       height: 111,
//     },
//     {
//       id: 22,
//       image: "https://picsum.photos/115/222?random=22",
//       title: "Slim Fit Jeans",
//       description: "Stretchy denim for active days.",
//       price: 88,
//       height: 222,
//     },
//     {
//       id: 23,
//       image: "https://picsum.photos/115/136?random=23",
//       title: "Striped Scarf",
//       description: "Soft and stylish winter scarf.",
//       price: 48,
//       height: 136,
//     },
//     {
//       id: 24,
//       image: "https://picsum.photos/115/190?random=24",
//       title: "Denim Vest",
//       description: "Layered fashion done right.",
//       price: 72,
//       height: 190,
//     },
//     {
//       id: 25,
//       image: "https://picsum.photos/115/172?random=25",
//       title: "Combat Boots",
//       description: "Durable boots with a rugged sole.",
//       price: 130,
//       height: 172,
//     },
//     {
//       id: 26,
//       image: "https://picsum.photos/115/224?random=26",
//       title: "Fanny Pack",
//       description: "Hands-free convenience with street flair.",
//       price: 55,
//       height: 224,
//     },
//     {
//       id: 27,
//       image: "https://picsum.photos/115/203?random=27",
//       title: "Zebra Print Dress",
//       description: "Wild and stylish for nights out.",
//       price: 115,
//       height: 203,
//     },
//     {
//       id: 28,
//       image: "https://picsum.photos/115/167?random=28",
//       title: "Wool Beanie",
//       description: "Stay warm in minimalist style.",
//       price: 28,
//       height: 167,
//     },
//     {
//       id: 29,
//       image: "https://picsum.photos/115/135?random=29",
//       title: "Plaid Shirt",
//       description: "Timeless layering piece.",
//       price: 64,
//       height: 135,
//     },
//     {
//       id: 30,
//       image: "https://picsum.photos/115/228?random=30",
//       title: "Leather Belt",
//       description: "Smooth buckle with polished leather.",
//       price: 38,
//       height: 228,
//     },
//   ];
  
  
//   const filteredPins = pins.filter(
//     (pin) =>
//       pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       pin.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const addToCart = (item) => {
//     setCartItems((prev) => {
//       const existing = prev.find((i) => i.id === item.id);
//       if (existing) {
//         return prev.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id, amount) => {
//     setCartItems((prev) =>
//       prev
//         .map((item) =>
//           item.id === id ? { ...item, quantity: item.quantity + amount } : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

//   const handleCheckout = () => {
//     if (isAuthenticated) {
//       navigate("/checkout");
//     } else {
//       navigate("/signup");
//     }
//   };

//   const MerchCard = ({ merch }) => {
//     const [imageLoaded, setImageLoaded] = useState(false);

//     return (
//       <div className="break-inside-avoid mb-6 group cursor-pointer">
//         <div className="rounded-xl bg-zinc-900 overflow-hidden">
//           <div className="relative overflow-hidden">
//             {!imageLoaded && (
//               <div
//                 className="bg-zinc-800 animate-pulse"
//                 style={{ height: merch.height }}
//               />
//             )}
//             <img
//               src={merch.image}
//               alt={merch.title}
//               className={`w-full object-cover transition-opacity duration-500 ${
//                 imageLoaded ? "opacity-100" : "opacity-0"
//               }`}
//               style={{ height: merch.height }}
//               onLoad={() => setImageLoaded(true)}
//             />
//           </div>
//           <div className="p-4">
//             <h3 className="text-white font-semibold text-lg">{merch.title}</h3>
//             <p className="text-sm text-zinc-400 line-clamp-2">
//               {merch.description}
//             </p>
//             <div className="pt-4 border-t border-zinc-700 mt-4">
//               <div className="mt-4">
//                 <button
//                   onClick={() => addToCart(merch)}
//                   className="cursor-pointer rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black text-xs font-bold dark:bg-zinc-800 hover:bg-zinc-700 transition"
//                 >
//                   <span>Buy now</span>
//                   <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
//                     KSh.{merch.price}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white relative">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-800 px-4 py-3">
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center gap-6">
//             <nav className="hidden md:flex items-center gap-4">
//               <Link to="/">
//                 <button className="p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors">
//                   <Home size={20} />
//                 </button>
//               </Link>
//             </nav>
//           </div>
//           <div className="flex-1 max-w-2xl mx-8">
//             <div className="relative">
//               <Search
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Search merchandise..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-zinc-900 hover:bg-zinc-800 focus:bg-zinc-800 focus:ring-2 focus:ring-purple-500 rounded-full border-none outline-none text-white placeholder-zinc-400"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setIsCartOpen(!isCartOpen)}
//               className="relative p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
//             >
//               <ShoppingCart size={20} />
//               {totalQuantity > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full px-1.5">
//                   {totalQuantity}
//                 </span>
//               )}
//             </button>
//             <Link to="/signup">
//               <User size={20} className="text-white" />
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Main Grid */}
//       <main className="max-w-7xl mx-auto px-4 pb-10 mt-5">
//         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
//           {filteredPins.map((merch) => (
//             <MerchCard key={merch.id} merch={merch} />
//           ))}
//         </div>
//       </main>

//       {/* Cart Sidebar */}
//       {isCartOpen && (
//         <div className="fixed top-0 right-0 w-80 h-full bg-zinc-900 text-white shadow-lg z-50 p-4 flex flex-col">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Cart</h2>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="text-zinc-400 hover:text-white"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {cartItems.length === 0 ? (
//             <p className="flex-grow">Your cart is empty.</p>
//           ) : (
//             <>
//               <div className="flex-grow space-y-4 overflow-y-auto">
//                 {cartItems.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex gap-3 border-b border-zinc-700 pb-2"
//                   >
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="w-16 h-16 object-cover rounded"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-sm">{item.title}</h3>
//                       <p className="text-xs text-zinc-400 line-clamp-2">
//                         {item.description}
//                       </p>
//                       <div className="flex items-center gap-2 mt-2">
//                         <button onClick={() => updateQuantity(item.id, -1)}>
//                           <Minus size={14} />
//                         </button>
//                         <span>{item.quantity}</span>
//                         <button onClick={() => updateQuantity(item.id, 1)}>
//                           <Plus size={14} />
//                         </button>
//                       </div>
//                       <p className="text-sm font-bold mt-1">
//                         KSh.{item.price * item.quantity}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="pt-4 border-t border-zinc-700 mt-4">
//                 <p className="text-lg font-semibold mb-2">
//                   Total: KSh.{totalPrice.toFixed(2)}
//                 </p>
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-blue-400 hover:bg-blue-500 text-black font-semibold py-2 rounded"
//                 >
//                   Checkout
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EcommerceLayout;



// import { useState } from "react";
// import {
//   Search,
//   ShoppingCart,
//   Plus,
//   Minus,
//   X,
//   CheckCircle,
//   ArrowLeft,
//   Filter,
//   CreditCard,
//   DollarSign,
//   Smartphone,
// } from "lucide-react";

// const EcommerceLayout = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(true);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [priceRange, setPriceRange] = useState([0, 5000]);
//   const [sortOption, setSortOption] = useState("name-asc");
//   const [checkoutStep, setCheckoutStep] = useState("cart"); // 'cart', 'payment', 'summary', 'complete'
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   // Generate random heights for products between 200-400px
//   const generateRandomHeight = () => Math.floor(Math.random() * 200) + 200;

//   // Standardized product data with consistent properties
//   const allProducts = [
//     {
//       id: 1,
//       title: "Wireless Headphones",
//       description: "Noise cancelling with 30hr battery life",
//       category: "electronics",
//       price: 3990,
//       image_url:
//         "https://i.pinimg.com/736x/b6/d2/fb/b6d2fb1c59f75e411725da3ae033a6cd.jpg",
//     },
//     {
//       id: 2,
//       title: "Smart Watch",
//       description: "Fitness tracking and notifications",
//       category: "accessories",
//       price: 2500,
//       image_url:
//         "https://i.pinimg.com/1200x/fd/4f/18/fd4f1898d045b7852113a7dcfd4984d7.jpg",
//       height: generateRandomHeight(),
//     },

//     {
//       id: 3,
//       title: "Yeezy Slide Pure",
//       description: "Minimalist Yeezy comfort.",
//       category: "footwear",
//       price: 8000,
//       image_url:
//         "https://i.pinimg.com/1200x/81/11/c9/8111c934881d025e7ced8feaa41d994b.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 4,
//       title: "Vintage Hoodie",
//       description: "Retro graphics inspired by 90s street culture.",
//       category: "clothing",
//       price: 8500,
//       image_url:
//         "https://i.pinimg.com/736x/1f/80/5c/1f805c546535ee7c5caec833ccfff657.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 5,
//       title: "Designer Cap",
//       description: "Minimalist cap with premium materials.",
//       category: "accessories",
//       price: 1500,
//       image_url:
//         "https://i.pinimg.com/1200x/2f/a7/cb/2fa7cb9f04b439f009908c4f9dabbe33.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 6,
//       title: "Techwear Jacket",
//       description: "Waterproof and futuristic techwear aesthetic.",
//       category: " clothing",
//       price: 1500,
//       image_url:
//         "https://i.pinimg.com/736x/f3/e2/ba/f3e2ba6c63ae2554924657008f37120f.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 7,
//       title: "Canvas Tote Bag",
//       description: "Eco-friendly canvas tote bag for everyday use.",
//       category: "accessories",
//       price: 3500,
//       image_url:
//         "https://i.pinimg.com/736x/b0/86/6b/b0866bc077690c58b9200739bd1efe99.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 8,
//       title: "Luxury Watch",
//       description: "Stainless steel automatic wristwatch.",
//       category: "accesspries",
//       price: 4000,
//       image_url:
//         "https://i.pinimg.com/736x/ac/01/f5/ac01f5bdfd60ab7c95df411d6cc88e43.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 9,
//       title: "Running Shorts",
//       description: "Lightweight shorts for optimal performance.",
//       category: "clothing",
//       price: 4000,
//       image_url:
//         "https://i.pinimg.com/1200x/19/58/ab/1958abec07a89080122e49b3444f5b94.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 10,
//       title: "Oversized T-Shirt",
//       description: "Relaxed fit t-shirt with bold print.",
//       category: "clothing",
//       price: 6000,
//       image_url:
//         "https://i.pinimg.com/1200x/14/7b/d8/147bd86b5f10cd6fd9b97f1d4e2f3c37.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 11,
//       title: "Snapback Hat",
//       description: "Adjustable snapback with embroidered logo.",
//       category: "accessories",
//       price: 3000,
//       image_url:
//         "https://i.pinimg.com/1200x/f4/fa/ae/f4faae12caefc928d4cf406eeab27576.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 12,
//       title: "Leather Wallet",
//       description: "Premium leather wallet with RFID protection.",
//       category: "accessories",
//       price: 7000,
//       image_url:
//         "https://i.pinimg.com/1200x/5b/6f/75/5b6f75ff2fa3d6645357c91db8a5b996.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 13,
//       title: "Sports Bra",
//       description: "Supportive and breathable fabric design.",
//       category: "clothing",
//       price: 5500,
//       image_url:
//         "https://i.pinimg.com/1200x/72/9f/a5/729fa53a890623ea78f9e903c5e3cb26.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 14,
//       title: "Retro Sunglasses",
//       description: "Classic design with UV protection.",
//       category: "accessories",
//       price: 5000,
//       image_url:
//         "https://i.pinimg.com/1200x/b3/87/b2/b387b225e37c1738b4162f926140e482.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 15,
//       title: "Corduroy Pants",
//       category: "clothing",
//       description: "Vintage vibe with a modern fit.",
//       price: 7500,
//       image:
//         "https://i.pinimg.com/736x/d8/af/81/d8af81a0e2bc205219c89588f0e5807b.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 16,
//       title: "Bomber Jacket",
//       description: "Military-inspired bomber in bold colors.",
//       category: "clothing",
//       price: 12000,
//       image_url:
//         "https://i.pinimg.com/1200x/dd/a6/5e/dda65e68d22ed6f0e0f884841af4b3fa.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 17,
//       title: "Chuhttpnky Sneakers",
//       description: "Maximum comfort and bold silhouette.",
//       category: "footwear",
//       price: 11000,
//       image_url:
//         "https://i.pinimg.com/736x/94/55/37/945537dd3fa9a8f4723616fdb0068639.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 18,
//       title: "Mesh Cap",
//       category: "clothing",
//       description: "Breathable summer-ready cap.",
//       price: 2500,
//       image_url:
//         "https://i.pinimg.com/1200x/8f/8f/3c/8f8f3cd24ba8b67275dcebe78ae1825c.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 19,
//       title: "Fleece Joggers",
//       description: "Soft fleece fabric for cozy loungewear.",
//       category: "clothing",
//       price: 6500,
//       image_url:
//         "https://i.pinimg.com/736x/4b/d8/ee/4bd8eec1fbf7cf59a4586b1975d9bf9c.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 20,
//       title: "Pen",
//       category: "Stationery",
//       price: 500,
//       description: "Smooth black ink ballpoint pen.",
//       image_url:
//         "https://i.pinimg.com/1200x/49/a4/f8/49a4f8b169e18bb8bad716d643052a26.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 21,
//       title: "Notebook",
//       category: "Stationery",
//       price: 3000,
//       description: "A5 hardcover ruled notebook.",
//       image_url:
//         "https://i.pinimg.com/1200x/94/3c/d8/943cd865b8d2c3134c9e7b189fd800b3.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 22,
//       title: "Umbrella",
//       category: "Accessories",
//       price: 2300,
//       description: "Compact foldable Moringa umbrella.",
//       image_url:
//         "https://i.pinimg.com/1200x/18/12/a9/1812a9ab1883f056c008b1ca04859930.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 23,
//       title: "White T-shirt",
//       category: "Apparel",
//       price: 1000,
//       description: "White branded cotton T-shirt.",
//       image_url:
//         "https://i.pinimg.com/1200x/67/42/ec/6742ec0b86ab308ad81425d23783b446.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 24,
//       title: "Navy Blue T-shirt",
//       category: "Apparel",
//       price: 1000,
//       description: "Navy blue branded cotton T-shirt.",
//       image_url:
//         "https://i.pinimg.com/1200x/5a/4c/55/5a4c551c032038d8d230801b799aa2ff.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 25,
//       title: "Backpack",
//       category: "Accessories",
//       price: 4500,
//       description: "Spacious branded laptop backpack.",
//       image_url:
//         "https://i.pinimg.com/736x/5d/44/c8/5d44c88b587504470377ed2982fadfba.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 26,
//       title: "Diary",
//       category: "Stationery",
//       price: 800,
//       description: "A5 dated weekly planner diary.",
//       image_url:
//         "https://i.pinimg.com/736x/f5/54/03/f55403a75b78019e4e517e60fd27f868.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 27,
//       title: "Shawl",
//       category: "Apparel",
//       price: 1500,
//       description: "Soft fleece branded shawl.",
//       image_url:
//         "https://i.pinimg.com/1200x/d5/c7/31/d5c7319fc4f49b7079b6025c7b916da4.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 28,
//       title: "Wristband",
//       category: "Accessories",
//       price: 250,
//       description: "Elastic rubber wristband with logo.",
//       image_url:
//         "https://i.pinimg.com/1200x/be/ee/9a/beee9a1961b926d6501f48a65c4fd037.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 29,
//       title: "Water Bottle",
//       category: "Accessories",
//       price: 890,
//       description: "Reusable BPA-free bottle with logo.",
//       image_url:
//         "https://i.pinimg.com/736x/af/93/96/af939674143befce000dda3dc0c81be7.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 30,
//       title: "Mug",
//       category: "Kitchen",
//       price: 400,
//       description: "Ceramic Moringa coffee mug.",
//       image_url:
//         "https://i.pinimg.com/736x/ec/38/da/ec38da6adee71f54bf67552bb139b713.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 31,
//       title: "Hoodie",
//       category: "Apparel",
//       price: 2500,
//       description: "Comfortable cotton pullover hoodie.",
//       image_url:
//         "https://i.pinimg.com/1200x/87/34/12/873412b2c2400a166001a7b9d31a4374.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 32,
//       title: "Smart Watch",
//       category: "Accessories",
//       price: 9000,
//       description: "Bluetooth enabled fitness smartwatch.",
//       image_url:
//         "https://i.pinimg.com/736x/9f/51/64/9f516438c6bf29035748506e00ac9098.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 33,
//       title: "Wireless Earbuds",
//       category: "Electronics",
//       price: 4500,
//       description: "Noise-canceling wireless earbuds.",
//       image_url:
//         "https://i.pinimg.com/1200x/80/c0/e9/80c0e9e780e68ced6dd6c91270ae5a0e.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 34,
//       title: "Laptop Sticker Pack",
//       category: "Accessories",
//       price: 700,
//       description: "Set of 5 branded laptop stickers.",
//       image_url:
//         "https://i.pinimg.com/1200x/77/fa/b4/77fab4183bf923f9cbe8e4762f005bc6.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 35,
//       title: "Ladies Tech tote Bag",
//       category: "Accessories",
//       price: 4500,
//       description: "Stylish canvas tote bag with Moringa logo.",
//       image_url:
//         "https://i.pinimg.com/736x/ad/8c/89/ad8c89ffcb703e2b128096f7fecd2cd7.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 36,
//       title: "Key Holder",
//       category: "Accessories",
//       price: 1000,
//       description: "Branded key holder with hook.",
//       image_url:
//         "https://i.pinimg.com/1200x/41/09/17/410917b404bef28aca34807128a4c8bf.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 37,
//       title: "Moringa Brooch",
//       category: "Accessories",
//       price: 2000,
//       description: "Elegant metal Moringa leaf brooch.",
//       image_url:
//         "https://i.pinimg.com/736x/2e/b0/d7/2eb0d71cd6422d9396150c6e4243254c.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 38,
//       title: "Moringa Cap",
//       category: "Apparel",
//       price: 1200,
//       description: "Black branded baseball cap.",
//       image_url:
//         "https://i.pinimg.com/1200x/1b/61/a0/1b61a0293facfacd60d9719d1e16c39f.jpg",
//       height: generateRandomHeight(),
//     },
//     {
//       id: 39,
//       title: "Drawstring Bag",
//       category: "Accessories",
//       price: 2500,
//       description: "Lightweight drawstring gym bag with logo.",
//       image_url:
//         "https://i.pinimg.com/1200x/45/ee/ed/45eeeda740ac05da997ae5832be8daf3.jpg",
//       height: generateRandomHeight(),
//     },
//   ].map((product) => ({
//     ...product,
//     height: generateRandomHeight(),
//     image_url: product.image_url || product.image,
//   }));

//   // Get all unique categories
//   const categories = [
//     ...new Set(allProducts.map((product) => product.category)),
//   ];

//   // Cart functions
//   const addToCart = (product) => {
//     setCartItems((prev) => {
//       const existing = prev.find((item) => item.id === product.id);
//       return existing
//         ? prev.map((item) =>
//             item.id === product.id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           )
//         : [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id, amount) => {
//     setCartItems((prev) => {
//       const updated = prev
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max(0, item.quantity + amount) }
//             : item
//         )
//         .filter((item) => item.quantity > 0);

//       if (updated.length === 0) {
//         setIsCartOpen(false);
//       }

//       return updated;
//     });
//   };

//   const removeItem = (id) => {
//     setCartItems((prev) => {
//       const updated = prev.filter((item) => item.id !== id);

//       if (updated.length === 0) {
//         setIsCartOpen(false);
//       }

//       return updated;
//     });
//   };

//   const totalPrice = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   // Checkout flow functions
//   const handleCheckout = () => {
//     setCheckoutStep("payment");
//   };

//   const handlePayment = () => {
//     const newOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
//     setOrderNumber(newOrderNumber);
//     setCheckoutStep("summary");
//   };

//   const completeOrder = () => {
//     setShowSuccess(true);
//     setCheckoutStep("complete");
//   };

//   const backToShop = () => {
//     setCartItems([]);
//     setIsCartOpen(false);
//     setCheckoutStep("cart");
//     setSelectedPayment(null);
//   };

//   // Filter functions
//   const toggleCategory = (category) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category)
//         ? prev.filter((c) => c !== category)
//         : [...prev, category]
//     );
//   };

//   const filteredProducts = allProducts
//     .filter((product) => {
//       const matchesSearch =
//         product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesCategory =
//         selectedCategories.length === 0 ||
//         selectedCategories.includes(product.category);

//       const matchesPrice =
//         product.price >= priceRange[0] && product.price <= priceRange[1];

//       return matchesSearch && matchesCategory && matchesPrice;
//     })
//     .sort((a, b) => {
//       switch (sortOption) {
//         case "name-asc":
//           return a.title.localeCompare(b.title);
//         case "name-desc":
//           return b.title.localeCompare(a.title);
//         case "price-asc":
//           return a.price - b.price;
//         case "price-desc":
//           return b.price - a.price;
//         default:
//           return 0;
//       }
//     });

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
//         <div className="container mx-auto flex items-center justify-between p-4">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="mr-4 flex items-center text-gray-700"
//           >
//             <Filter className="mr-2 h-5 w-5" />
//             <span>Filters</span>
//           </button>

//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <button
//             onClick={() => setIsCartOpen(!isCartOpen)}
//             className="relative ml-4 p-2"
//           >
//             <ShoppingCart size={24} />
//             {cartItems.length > 0 && (
//               <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//                 {totalItems}
//               </span>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="container mx-auto flex">
//         {/* Filter Sidebar */}
//         {isFilterOpen && (
//           <div className="w-64 shrink-0 border-r p-4">
//             <div className="mb-6 flex items-center justify-between">
//               <h2 className="text-lg font-semibold">Filters</h2>
//               <button
//                 onClick={() => setIsFilterOpen(false)}
//                 className="rounded-full p-1 hover:bg-gray-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Categories */}
//             <div className="mb-6">
//               <h3 className="mb-3 font-medium">Categories</h3>
//               <div className="space-y-2">
//                 {categories.map((category) => (
//                   <label key={category} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedCategories.includes(category)}
//                       onChange={() => toggleCategory(category)}
//                       className="mr-2 rounded border-gray-300 text-blue-500"
//                     />
//                     <span className="capitalize">{category.toLowerCase()}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div className="mb-6">
//               <h3 className="mb-3 font-medium">Price Range</h3>
//               <div className="mb-2 flex justify-between">
//                 <span>KSh {priceRange[0]}</span>
//                 <span>KSh {priceRange[1]}</span>
//               </div>
//               <div className="flex space-x-4">
//                 <input
//                   type="number"
//                   min="0"
//                   max="20000"
//                   value={priceRange[0]}
//                   onChange={(e) =>
//                     setPriceRange([parseInt(e.target.value), priceRange[1]])
//                   }
//                   className="w-1/2 rounded border p-2"
//                 />
//                 <input
//                   type="number"
//                   min="0"
//                   max="5000"
//                   value={priceRange[1]}
//                   onChange={(e) =>
//                     setPriceRange([priceRange[0], parseInt(e.target.value)])
//                   }
//                   className="w-1/2 rounded border p-2"
//                 />
//               </div>
//             </div>

//             {/* Sort Options */}
//             <div className="mb-6">
//               <h3 className="mb-3 font-medium">Sort By</h3>
//               <select
//                 value={sortOption}
//                 onChange={(e) => setSortOption(e.target.value)}
//                 className="w-full rounded border p-2"
//               >
//                 <option value="name-asc">Name (A-Z)</option>
//                 <option value="name-desc">Name (Z-A)</option>
//                 <option value="price-asc">Price (Low to High)</option>
//                 <option value="price-desc">Price (High to Low)</option>
//               </select>
//             </div>

//             {/* Reset Filters */}
//             <button
//               onClick={() => {
//                 setSelectedCategories([]);
//                 setPriceRange([0, 5000]);
//                 setSortOption("name-asc");
//               }}
//               className="mb-4 w-full rounded-lg bg-gray-200 py-2 px-4 font-medium text-gray-800 hover:bg-gray-300"
//             >
//               Reset Filters
//             </button>

//             {/* Back to Dashboard */}
//             <button className="flex w-full items-center justify-center rounded-lg bg-gray-800 py-2 px-4 text-white">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Shop Dashboard
//             </button>
//           </div>
//         )}

//         {/* Product Grid */}
//         <main className={`flex-1 p-4 ${isFilterOpen ? "ml-64" : ""}`}>
//           {filteredProducts.length === 0 ? (
//             <div className="flex h-64 items-center justify-center">
//               <p className="text-gray-500">No products match your filters</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//               {filteredProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-transform hover:scale-105"
//                 >
//                   <div className="h-48 overflow-hidden">
//                     <img
//                       src={product.image_url}
//                       alt={product.title}
//                       className="h-full w-full object-cover"
//                       onError={(e) => {
//                         e.target.src =
//                           "https://via.placeholder.com/400x400?text=Product+Image";
//                       }}
//                     />
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-lg font-medium">{product.title}</h3>
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {product.description}
//                     </p>
//                     <div className="mt-3 flex items-center justify-between">
//                       <span className="font-bold">KSh {product.price}</span>
//                       <button
//                         onClick={() => addToCart(product)}
//                         className="rounded bg-blue-900 px-3 py-1 text-sm text-white hover:bg-blue-600"
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>

//       {/* Cart Drawer */}
//       {isCartOpen && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div
//             className="absolute inset-0 bg-black/30"
//             onClick={() => {
//               setIsCartOpen(false);
//               setCheckoutStep("cart");
//             }}
//           />

//           <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b p-4">
//               <h2 className="text-xl font-semibold">
//                 {checkoutStep === "cart" &&
//                   `Your Cart (${totalItems} ${
//                     totalItems === 1 ? "item" : "items"
//                   })`}
//                 {checkoutStep === "payment" && "Order Confirmation"}
//                 {checkoutStep === "summary" && "Order Summary"}
//                 {checkoutStep === "complete" && "Order Complete"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setIsCartOpen(false);
//                   setCheckoutStep("cart");
//                 }}
//                 className="rounded-full p-1 hover:bg-gray-100"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="h-[calc(100%-180px)] overflow-y-auto p-4">
//               {checkoutStep === "cart" && (
//                 <>
//                   {cartItems.length === 0 ? (
//                     <div className="flex h-full flex-col items-center justify-center text-gray-500">
//                       <ShoppingCart size={48} className="mb-4 text-gray-300" />
//                       <p className="mb-2 text-lg">Your cart is empty</p>
//                       <p className="text-sm">Start shopping to add items</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {cartItems.map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex gap-4 rounded-lg border p-3"
//                         >
//                           <div className="relative">
//                             <img
//                               src={item.image_url}
//                               alt={item.title}
//                               className="h-20 w-20 rounded object-cover"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://via.placeholder.com/400x400?text=Product+Image";
//                               }}
//                             />
//                             <button
//                               onClick={() => removeItem(item.id)}
//                               className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
//                             >
//                               <X size={14} />
//                             </button>
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex justify-between">
//                               <h3 className="font-medium">{item.title}</h3>
//                               <p className="font-bold">
//                                 KSh {item.price.toFixed(2)}
//                               </p>
//                             </div>
//                             <p className="text-sm text-gray-600">
//                               {item.category}
//                             </p>
//                             <div className="mt-2 flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   onClick={() => updateQuantity(item.id, -1)}
//                                   className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100"
//                                 >
//                                   <Minus size={16} />
//                                 </button>
//                                 <span className="w-8 text-center">
//                                   {item.quantity}
//                                 </span>
//                                 <button
//                                   onClick={() => updateQuantity(item.id, 1)}
//                                   className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100"
//                                 >
//                                   <Plus size={16} />
//                                 </button>
//                               </div>
//                               <p className="font-bold">
//                                 KSh {(item.price * item.quantity).toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               )}

//               {checkoutStep === "payment" && (
//                 <div className="space-y-6">
//                   <div className="rounded-lg border p-4">
//                     <h3 className="mb-4 font-medium">Order Summary</h3>
//                     <div className="space-y-3">
//                       {cartItems.map((item) => (
//                         <div key={item.id} className="flex justify-between">
//                           <span>
//                             {item.title} × {item.quantity}
//                           </span>
//                           <span>
//                             KSh {(item.price * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                       <div className="border-t pt-2">
//                         <div className="flex justify-between">
//                           <span>Subtotal:</span>
//                           <span>KSh {totalPrice.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Shipping:</span>
//                           <span>
//                             KSh {totalPrice > 10000 ? "0.00" : "500.00"}
//                           </span>
//                         </div>
//                         <div className="flex justify-between font-bold">
//                           <span>Total:</span>
//                           <span>
//                             KSh{" "}
//                             {(
//                               totalPrice + (totalPrice > 10000 ? 0 : 500)
//                             ).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {checkoutStep === "summary" && (
//                 <div className="space-y-6">
//                   <div className="rounded-lg border p-4">
//                     <div className="mb-4 flex items-center justify-center">
//                       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
//                         <CheckCircle className="h-10 w-10 text-green-600" />
//                       </div>
//                     </div>
//                     <h3 className="mb-2 text-center text-lg font-medium">
//                       Order #{orderNumber}
//                     </h3>
//                     <p className="mb-4 text-center text-gray-600">
//                       Your order has been placed successfully
//                     </p>

//                     <div className="space-y-3">
//                       {cartItems.map((item) => (
//                         <div key={item.id} className="flex justify-between">
//                           <span>
//                             {item.title} × {item.quantity}
//                           </span>
//                           <span>
//                             KSh {(item.price * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                       <div className="border-t pt-2">
//                         <div className="flex justify-between">
//                           <span>Subtotal:</span>
//                           <span>KSh {totalPrice.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Shipping:</span>
//                           <span>
//                             KSh {totalPrice > 10000 ? "0.00" : "500.00"}
//                           </span>
//                         </div>
//                         <div className="flex justify-between font-bold">
//                           <span>Total:</span>
//                           <span>
//                             KSh{" "}
//                             {(
//                               totalPrice + (totalPrice > 10000 ? 0 : 500)
//                             ).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="rounded-lg border p-4">
//                     <h3 className="mb-4 font-medium">Select Payment Method</h3>
//                     <div className="space-y-3">
//                       <button
//                         onClick={() => setSelectedPayment("card")}
//                         className={`flex w-full items-center justify-between rounded-lg border p-4 ${
//                           selectedPayment === "card"
//                             ? "border-blue-500 bg-blue-50"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <CreditCard className="mr-3 h-5 w-5 text-blue-500" />
//                           <span>Credit/Debit Card</span>
//                         </div>
//                         {selectedPayment === "card" && (
//                           <span className="text-blue-500">✓</span>
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setSelectedPayment("mobile")}
//                         className={`flex w-full items-center justify-between rounded-lg border p-4 ${
//                           selectedPayment === "mobile"
//                             ? "border-green-500 bg-green-50"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <Smartphone className="mr-3 h-5 w-5 text-green-500" />
//                           <span>Mobile Money</span>
//                         </div>
//                         {selectedPayment === "mobile" && (
//                           <span className="text-green-500">✓</span>
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setSelectedPayment("cash")}
//                         className={`flex w-full items-center justify-between rounded-lg border p-4 ${
//                           selectedPayment === "cash"
//                             ? "border-yellow-500 bg-yellow-50"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <DollarSign className="mr-3 h-5 w-5 text-yellow-500" />
//                           <span>Cash on Delivery</span>
//                         </div>
//                         {selectedPayment === "cash" && (
//                           <span className="text-yellow-500">✓</span>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {checkoutStep === "complete" && (
//                 <div className="flex h-full flex-col items-center justify-center text-center">
//                   <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
//                     <CheckCircle className="h-10 w-10 text-green-600" />
//                   </div>
//                   <h3 className="mb-2 text-xl font-semibold">
//                     Payment Successful!
//                   </h3>
//                   <p className="mb-6 text-gray-600">
//                     Your order{" "}
//                     <span className="font-semibold">#{orderNumber}</span> is
//                     complete.
//                   </p>
//                 </div>
//               )}
//             </div>

//             {checkoutStep === "cart" && cartItems.length > 0 && (
//               <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
//                 <div className="mb-2 flex justify-between">
//                   <span>Subtotal:</span>
//                   <span>KSh {totalPrice.toFixed(2)}</span>
//                 </div>
//                 <div className="mb-2 flex justify-between">
//                   <span>Shipping:</span>
//                   <span>KSh {totalPrice > 10000 ? "0.00" : "500.00"}</span>
//                 </div>
//                 <div className="mb-4 flex justify-between font-semibold">
//                   <span>Total:</span>
//                   <span className="font-bold">
//                     KSh{" "}
//                     {(totalPrice + (totalPrice > 10000 ? 0 : 500)).toFixed(2)}
//                   </span>
//                 </div>
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-700"
//                 >
//                   Proceed to Payment
//                 </button>
//               </div>
//             )}

//             {checkoutStep === "payment" && (
//               <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
//                 <button
//                   onClick={handlePayment}
//                   className="w-full rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-700"
//                 >
//                   Place Order
//                 </button>
//                 <button
//                   onClick={() => setCheckoutStep("cart")}
//                   className="mt-2 w-full rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-800 hover:bg-gray-50"
//                 >
//                   Back to Cart
//                 </button>
//               </div>
//             )}

//             {checkoutStep === "summary" && (
//               <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
//                 <button
//                   onClick={completeOrder}
//                   disabled={!selectedPayment}
//                   className={`w-full rounded-lg py-3 font-medium text-white ${
//                     selectedPayment
//                       ? "bg-green-800 hover:bg-green-700"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   Complete Payment
//                 </button>
//                 <button
//                   onClick={() => setCheckoutStep("payment")}
//                   className="mt-2 w-full rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-800 hover:bg-gray-50"
//                 >
//                   Back to Order
//                 </button>
//               </div>
//             )}

//             {checkoutStep === "complete" && (
//               <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
//                 <button
//                   onClick={backToShop}
//                   className="w-full rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-700"
//                 >
//                   Back to Shop
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EcommerceLayout;


import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  CheckCircle,
  ArrowLeft,
  Filter,
  CreditCard,
  DollarSign,
  Smartphone,
} from "lucide-react";

const EcommerceLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [checkoutStep, setCheckoutStep] = useState("cart"); // 'cart', 'payment', 'summary', 'complete'
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Generate random heights for products between 200-400px
  const generateRandomHeight = () => Math.floor(Math.random() * 200) + 200;

  // Standardized product data with consistent properties
  const allProducts = [
    {
      id: 1,
      title: "Wireless Headphones",
      description: "Noise cancelling with 30hr battery life",
      category: "electronics",
      price: 3990,
      image_url:
        "https://i.pinimg.com/736x/b6/d2/fb/b6d2fb1c59f75e411725da3ae033a6cd.jpg",
    },
    {
      id: 2,
      title: "Smart Watch",
      description: "Fitness tracking and notifications",
      category: "accessories",
      price: 2500,
      image_url:
        "https://i.pinimg.com/1200x/fd/4f/18/fd4f1898d045b7852113a7dcfd4984d7.jpg",
      height: generateRandomHeight(),
    },

    {
      id: 3,
      title: "Yeezy Slide Pure",
      description: "Minimalist Yeezy comfort.",
      category: "footwear",
      price: 8000,
      image_url:
        "https://i.pinimg.com/1200x/81/11/c9/8111c934881d025e7ced8feaa41d994b.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 4,
      title: "Vintage Hoodie",
      description: "Retro graphics inspired by 90s street culture.",
      category: "clothing",
      price: 8500,
      image_url:
        "https://i.pinimg.com/736x/1f/80/5c/1f805c546535ee7c5caec833ccfff657.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 5,
      title: "Designer Cap",
      description: "Minimalist cap with premium materials.",
      category: "accessories",
      price: 1500,
      image_url:
        "https://i.pinimg.com/1200x/2f/a7/cb/2fa7cb9f04b439f009908c4f9dabbe33.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 6,
      title: "Techwear Jacket",
      description: "Waterproof and futuristic techwear aesthetic.",
      category: " clothing",
      price: 1500,
      image_url:
        "https://i.pinimg.com/736x/f3/e2/ba/f3e2ba6c63ae2554924657008f37120f.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 7,
      title: "Canvas Tote Bag",
      description: "Eco-friendly canvas tote bag for everyday use.",
      category: "accessories",
      price: 3500,
      image_url:
        "https://i.pinimg.com/736x/b0/86/6b/b0866bc077690c58b9200739bd1efe99.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 8,
      title: "Luxury Watch",
      description: "Stainless steel automatic wristwatch.",
      category: "accesspries",
      price: 4000,
      image_url:
        "https://i.pinimg.com/736x/ac/01/f5/ac01f5bdfd60ab7c95df411d6cc88e43.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 9,
      title: "Running Shorts",
      description: "Lightweight shorts for optimal performance.",
      category: "clothing",
      price: 4000,
      image_url:
        "https://i.pinimg.com/1200x/19/58/ab/1958abec07a89080122e49b3444f5b94.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 10,
      title: "Oversized T-Shirt",
      description: "Relaxed fit t-shirt with bold print.",
      category: "clothing",
      price: 6000,
      image_url:
        "https://i.pinimg.com/1200x/14/7b/d8/147bd86b5f10cd6fd9b97f1d4e2f3c37.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 11,
      title: "Snapback Hat",
      description: "Adjustable snapback with embroidered logo.",
      category: "accessories",
      price: 3000,
      image_url:
        "https://i.pinimg.com/1200x/f4/fa/ae/f4faae12caefc928d4cf406eeab27576.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 12,
      title: "Leather Wallet",
      description: "Premium leather wallet with RFID protection.",
      category: "accessories",
      price: 7000,
      image_url:
        "https://i.pinimg.com/1200x/5b/6f/75/5b6f75ff2fa3d6645357c91db8a5b996.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 13,
      title: "Sports Bra",
      description: "Supportive and breathable fabric design.",
      category: "clothing",
      price: 5500,
      image_url:
        "https://i.pinimg.com/1200x/72/9f/a5/729fa53a890623ea78f9e903c5e3cb26.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 14,
      title: "Retro Sunglasses",
      description: "Classic design with UV protection.",
      category: "accessories",
      price: 5000,
      image_url:
        "https://i.pinimg.com/1200x/b3/87/b2/b387b225e37c1738b4162f926140e482.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 15,
      title: "Corduroy Pants",
      category: "clothing",
      description: "Vintage vibe with a modern fit.",
      price: 7500,
      image:
        "https://i.pinimg.com/736x/d8/af/81/d8af81a0e2bc205219c89588f0e5807b.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 16,
      title: "Bomber Jacket",
      description: "Military-inspired bomber in bold colors.",
      category: "clothing",
      price: 12000,
      image_url:
        "https://i.pinimg.com/1200x/dd/a6/5e/dda65e68d22ed6f0e0f884841af4b3fa.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 17,
      title: "Chuhttpnky Sneakers",
      description: "Maximum comfort and bold silhouette.",
      category: "footwear",
      price: 11000,
      image_url:
        "https://i.pinimg.com/736x/94/55/37/945537dd3fa9a8f4723616fdb0068639.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 18,
      title: "Mesh Cap",
      category: "clothing",
      description: "Breathable summer-ready cap.",
      price: 2500,
      image_url:
        "https://i.pinimg.com/1200x/8f/8f/3c/8f8f3cd24ba8b67275dcebe78ae1825c.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 19,
      title: "Fleece Joggers",
      description: "Soft fleece fabric for cozy loungewear.",
      category: "clothing",
      price: 6500,
      image_url:
        "https://i.pinimg.com/736x/4b/d8/ee/4bd8eec1fbf7cf59a4586b1975d9bf9c.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 20,
      title: "Pen",
      category: "Stationery",
      price: 500,
      description: "Smooth black ink ballpoint pen.",
      image_url:
        "https://i.pinimg.com/1200x/49/a4/f8/49a4f8b169e18bb8bad716d643052a26.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 21,
      title: "Notebook",
      category: "Stationery",
      price: 3000,
      description: "A5 hardcover ruled notebook.",
      image_url:
        "https://i.pinimg.com/1200x/94/3c/d8/943cd865b8d2c3134c9e7b189fd800b3.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 22,
      title: "Umbrella",
      category: "Accessories",
      price: 2300,
      description: "Compact foldable Moringa umbrella.",
      image_url:
        "https://i.pinimg.com/1200x/18/12/a9/1812a9ab1883f056c008b1ca04859930.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 23,
      title: "White T-shirt",
      category: "Apparel",
      price: 1000,
      description: "White branded cotton T-shirt.",
      image_url:
        "https://i.pinimg.com/1200x/67/42/ec/6742ec0b86ab308ad81425d23783b446.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 24,
      title: "Navy Blue T-shirt",
      category: "Apparel",
      price: 1000,
      description: "Navy blue branded cotton T-shirt.",
      image_url:
        "https://i.pinimg.com/1200x/5a/4c/55/5a4c551c032038d8d230801b799aa2ff.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 25,
      title: "Backpack",
      category: "Accessories",
      price: 4500,
      description: "Spacious branded laptop backpack.",
      image_url:
        "https://i.pinimg.com/736x/5d/44/c8/5d44c88b587504470377ed2982fadfba.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 26,
      title: "Diary",
      category: "Stationery",
      price: 800,
      description: "A5 dated weekly planner diary.",
      image_url:
        "https://i.pinimg.com/736x/f5/54/03/f55403a75b78019e4e517e60fd27f868.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 27,
      title: "Shawl",
      category: "Apparel",
      price: 1500,
      description: "Soft fleece branded shawl.",
      image_url:
        "https://i.pinimg.com/1200x/d5/c7/31/d5c7319fc4f49b7079b6025c7b916da4.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 28,
      title: "Wristband",
      category: "Accessories",
      price: 250,
      description: "Elastic rubber wristband with logo.",
      image_url:
        "https://i.pinimg.com/1200x/be/ee/9a/beee9a1961b926d6501f48a65c4fd037.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 29,
      title: "Water Bottle",
      category: "Accessories",
      price: 890,
      description: "Reusable BPA-free bottle with logo.",
      image_url:
        "https://i.pinimg.com/736x/af/93/96/af939674143befce000dda3dc0c81be7.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 30,
      title: "Mug",
      category: "Kitchen",
      price: 400,
      description: "Ceramic Moringa coffee mug.",
      image_url:
        "https://i.pinimg.com/736x/ec/38/da/ec38da6adee71f54bf67552bb139b713.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 31,
      title: "Hoodie",
      category: "Apparel",
      price: 2500,
      description: "Comfortable cotton pullover hoodie.",
      image_url:
        "https://i.pinimg.com/1200x/87/34/12/873412b2c2400a166001a7b9d31a4374.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 32,
      title: "Smart Watch",
      category: "Accessories",
      price: 9000,
      description: "Bluetooth enabled fitness smartwatch.",
      image_url:
        "https://i.pinimg.com/736x/9f/51/64/9f516438c6bf29035748506e00ac9098.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 33,
      title: "Wireless Earbuds",
      category: "Electronics",
      price: 4500,
      description: "Noise-canceling wireless earbuds.",
      image_url:
        "https://i.pinimg.com/1200x/80/c0/e9/80c0e9e780e68ced6dd6c91270ae5a0e.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 34,
      title: "Laptop Sticker Pack",
      category: "Accessories",
      price: 700,
      description: "Set of 5 branded laptop stickers.",
      image_url:
        "https://i.pinimg.com/1200x/77/fa/b4/77fab4183bf923f9cbe8e4762f005bc6.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 35,
      title: "Ladies Tech tote Bag",
      category: "Accessories",
      price: 4500,
      description: "Stylish canvas tote bag with Moringa logo.",
      image_url:
        "https://i.pinimg.com/736x/ad/8c/89/ad8c89ffcb703e2b128096f7fecd2cd7.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 36,
      title: "Key Holder",
      category: "Accessories",
      price: 1000,
      description: "Branded key holder with hook.",
      image_url:
        "https://i.pinimg.com/1200x/41/09/17/410917b404bef28aca34807128a4c8bf.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 37,
      title: "Moringa Brooch",
      category: "Accessories",
      price: 2000,
      description: "Elegant metal Moringa leaf brooch.",
      image_url:
        "https://i.pinimg.com/736x/2e/b0/d7/2eb0d71cd6422d9396150c6e4243254c.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 38,
      title: "Moringa Cap",
      category: "Apparel",
      price: 1200,
      description: "Black branded baseball cap.",
      image_url:
        "https://i.pinimg.com/1200x/1b/61/a0/1b61a0293facfacd60d9719d1e16c39f.jpg",
      height: generateRandomHeight(),
    },
    {
      id: 39,
      title: "Drawstring Bag",
      category: "Accessories",
      price: 2500,
      description: "Lightweight drawstring gym bag with logo.",
      image_url:
        "https://i.pinimg.com/1200x/45/ee/ed/45eeeda740ac05da997ae5832be8daf3.jpg",
      height: generateRandomHeight(),
    },
  ].map((product) => ({
    ...product,
    height: generateRandomHeight(),
    image_url: product.image_url || product.image,
  }));

  // Get all unique categories
  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ];

  // Cart functions
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0);

      if (updated.length === 0) {
        setIsCartOpen(false);
      }

      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      if (updated.length === 0) {
        setIsCartOpen(false);
      }

      return updated;
    });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout flow functions
  const handleCheckout = () => {
    setCheckoutStep("payment");
  };

  const handlePayment = () => {
    const newOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderNumber);
    setCheckoutStep("summary");
  };

  const completeOrder = () => {
    setShowSuccess(true);
    setCheckoutStep("complete");
  };

  const backToShop = () => {
    setCartItems([]);
    setIsCartOpen(false);
    setCheckoutStep("cart");
    setSelectedPayment(null);
  };

  // Filter functions
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = allProducts
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mr-4 flex items-center text-gray-700"
          >
            <Filter className="mr-2 h-5 w-5" />
            <span>Filters</span>
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative ml-4 p-2"
          >
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex">
        {/* Filter Sidebar */}
        {isFilterOpen && (
          <div className="w-64 shrink-0 border-r p-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="mr-2 rounded border-gray-300 text-blue-500"
                    />
                    <span className="capitalize">{category.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="mb-2 flex justify-between">
                <span>KSh {priceRange[0]}</span>
                <span>KSh {priceRange[1]}</span>
              </div>
              <div className="flex space-x-4">
                <input
                  type="number"
                  min="0"
                  max="20000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-1/2 rounded border p-2"
                />
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-1/2 rounded border p-2"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium">Sort By</h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange([0, 5000]);
                setSortOption("name-asc");
              }}
              className="mb-4 w-full rounded-lg bg-gray-200 py-2 px-4 font-medium text-gray-800 hover:bg-gray-300"
            >
              Reset Filters
            </button>

            {/* Back to Dashboard */}
            <button className="flex w-full items-center justify-center rounded-lg bg-gray-800 py-2 px-4 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop Dashboard
            </button>
          </div>
        )}

        {/* Product Grid */}
        <main className={`flex-1 p-4 ${isFilterOpen ? "ml-64" : ""}`}>
          {filteredProducts.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">No products match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-transform hover:scale-105"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=Product+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium">{product.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold">KSh {product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="rounded bg-blue-900 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep("cart");
            }}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold">
                {checkoutStep === "cart" &&
                  `Your Cart (${totalItems} ${
                    totalItems === 1 ? "item" : "items"
                  })`}
                {checkoutStep === "payment" && "Order Confirmation"}
                {checkoutStep === "summary" && "Order Summary"}
                {checkoutStep === "complete" && "Order Complete"}
              </h2>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep("cart");
                }}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="h-[calc(100%-180px)] overflow-y-auto p-4">
              {checkoutStep === "cart" && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-gray-500">
                      <ShoppingCart size={48} className="mb-4 text-gray-300" />
                      <p className="mb-2 text-lg">Your cart is empty</p>
                      <p className="text-sm">Start shopping to add items</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 rounded-lg border p-3"
                        >
                          <div className="relative">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-20 w-20 rounded object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x400?text=Product+Image";
                              }}
                            />
                            <button
                              onClick={() => removeItem(item.id)}
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="font-bold">
                                KSh {item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.category}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-100"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <p className="font-bold">
                                KSh {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === "payment" && (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 font-medium">Order Summary</h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span>
                            KSh {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>KSh {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>
                            KSh {totalPrice > 10000 ? "0.00" : "500.00"}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>
                            KSh{" "}
                            {(
                              totalPrice + (totalPrice > 10000 ? 0 : 500)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === "summary" && (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-center text-lg font-medium">
                      Order #{orderNumber}
                    </h3>
                    <p className="mb-4 text-center text-gray-600">
                      Your order has been placed successfully
                    </p>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span>
                            KSh {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>KSh {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>
                            KSh {totalPrice > 10000 ? "0.00" : "500.00"}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>
                            KSh{" "}
                            {(
                              totalPrice + (totalPrice > 10000 ? 0 : 500)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 font-medium">Select Payment Method</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setSelectedPayment("card")}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 ${
                          selectedPayment === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <CreditCard className="mr-3 h-5 w-5 text-blue-500" />
                          <span>Credit/Debit Card</span>
                        </div>
                        {selectedPayment === "card" && (
                          <span className="text-blue-500">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedPayment("mobile")}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 ${
                          selectedPayment === "mobile"
                            ? "border-green-500 bg-green-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <Smartphone className="mr-3 h-5 w-5 text-green-500" />
                          <span>Mobile Money</span>
                        </div>
                        {selectedPayment === "mobile" && (
                          <span className="text-green-500">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedPayment("cash")}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 ${
                          selectedPayment === "cash"
                            ? "border-yellow-500 bg-yellow-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <DollarSign className="mr-3 h-5 w-5 text-yellow-500" />
                          <span>Cash on Delivery</span>
                        </div>
                        {selectedPayment === "cash" && (
                          <span className="text-yellow-500">✓</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === "complete" && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Payment Successful!
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Your order{" "}
                    <span className="font-semibold">#{orderNumber}</span> is
                    complete.
                  </p>
                </div>
              )}
            </div>

            {checkoutStep === "cart" && cartItems.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
                <div className="mb-2 flex justify-between">
                  <span>Subtotal:</span>
                  <span>KSh {totalPrice.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span>Shipping:</span>
                  <span>KSh {totalPrice > 10000 ? "0.00" : "500.00"}</span>
                </div>
                <div className="mb-4 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="font-bold">
                    KSh{" "}
                    {(totalPrice + (totalPrice > 10000 ? 0 : 500)).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-700"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
                <button
                  onClick={handlePayment}
                  className="w-full rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-700"
                >
                  Place Order
                </button>
                <button
                  onClick={() => setCheckoutStep("cart")}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-800 hover:bg-gray-50"
                >
                  Back to Cart
                </button>
              </div>
            )}

            {checkoutStep === "summary" && (
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
                <button
                  onClick={completeOrder}
                  disabled={!selectedPayment}
                  className={`w-full rounded-lg py-3 font-medium text-white ${
                    selectedPayment
                      ? "bg-green-800 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete Payment
                </button>
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-800 hover:bg-gray-50"
                >
                  Back to Order
                </button>
              </div>
            )}

            {checkoutStep === "complete" && (
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
                <button
                  onClick={backToShop}
                  className="w-full rounded-lg bg-green-800 py-3 font-medium text-white hover:bg-green-700"
                >
                  Back to Shop
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceLayout;