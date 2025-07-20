import { useState } from "react";
import { Search, Home, User, ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EcommerceLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = false;

  const pins = [
    {
      id: 1,
      image: "https://picsum.photos/115/149?random=1",
      title: "Air Jordan 4 Retro",
      description:
        "The AJ4 Retro Reimagined Bred will release on Feb 17, 2024.",
      price: 100,
      height: 149,
    },
    {
      id: 2,
      image: "https://picsum.photos/115/239?random=2",
      title: "Nike Dunk Low Panda",
      description: "Timeless black and white Dunk Low.",
      price: 90,
      height: 239,
    },
    {
      id: 3,
      image: "https://picsum.photos/115/121?random=3",
      title: "Yeezy Slide Pure",
      description: "Minimalist Yeezy comfort.",
      price: 80,
      height: 121,
    },
    {
      id: 4,
      image: "https://picsum.photos/115/182?random=4",
      title: "Vintage Hoodie",
      description: "Retro graphics inspired by 90s street culture.",
      price: 85,
      height: 182,
    },
    {
      id: 5,
      image: "https://picsum.photos/115/205?random=5",
      title: "Designer Cap",
      description: "Minimalist cap with premium materials.",
      price: 45,
      height: 205,
    },
    {
      id: 6,
      image: "https://picsum.photos/115/176?random=6",
      title: "Techwear Jacket",
      description: "Waterproof and futuristic techwear aesthetic.",
      price: 150,
      height: 176,
    },
    {
      id: 7,
      image: "https://picsum.photos/115/212?random=7",
      title: "Canvas Tote Bag",
      description: "Eco-friendly canvas tote bag for everyday use.",
      price: 35,
      height: 212,
    },
    {
      id: 8,
      image: "https://picsum.photos/115/199?random=8",
      title: "Luxury Watch",
      description: "Stainless steel automatic wristwatch.",
      price: 400,
      height: 199,
    },
    {
      id: 9,
      image: "https://picsum.photos/115/132?random=9",
      title: "Running Shorts",
      description: "Lightweight shorts for optimal performance.",
      price: 40,
      height: 132,
    },
    {
      id: 10,
      image: "https://picsum.photos/115/246?random=10",
      title: "Oversized T-Shirt",
      description: "Relaxed fit t-shirt with bold print.",
      price: 60,
      height: 246,
    },
    {
      id: 11,
      image: "https://picsum.photos/115/102?random=11",
      title: "Snapback Hat",
      description: "Adjustable snapback with embroidered logo.",
      price: 30,
      height: 102,
    },
    {
      id: 12,
      image: "https://picsum.photos/115/138?random=12",
      title: "Leather Wallet",
      description: "Premium leather wallet with RFID protection.",
      price: 70,
      height: 138,
    },
    {
      id: 13,
      image: "https://picsum.photos/115/157?random=13",
      title: "Sports Bra",
      description: "Supportive and breathable fabric design.",
      price: 55,
      height: 157,
    },
    {
      id: 14,
      image: "https://picsum.photos/115/144?random=14",
      title: "Retro Sunglasses",
      description: "Classic design with UV protection.",
      price: 50,
      height: 144,
    },
    {
      id: 15,
      image: "https://picsum.photos/115/210?random=15",
      title: "Corduroy Pants",
      description: "Vintage vibe with a modern fit.",
      price: 75,
      height: 210,
    },
    {
      id: 16,
      image: "https://picsum.photos/115/217?random=16",
      title: "Bomber Jacket",
      description: "Military-inspired bomber in bold colors.",
      price: 120,
      height: 217,
    },
    {
      id: 17,
      image: "https://picsum.photos/115/153?random=17",
      title: "Chunky Sneakers",
      description: "Maximum comfort and bold silhouette.",
      price: 110,
      height: 153,
    },
    {
      id: 18,
      image: "https://picsum.photos/115/162?random=18",
      title: "Mesh Cap",
      description: "Breathable summer-ready cap.",
      price: 25,
      height: 162,
    },
    {
      id: 19,
      image: "https://picsum.photos/115/125?random=19",
      title: "Fleece Joggers",
      description: "Soft fleece fabric for cozy loungewear.",
      price: 65,
      height: 125,
    },
    {
      id: 20,
      image: "https://picsum.photos/115/250?random=20",
      title: "Graphic Hoodie",
      description: "Eye-catching designs with comfy interior.",
      price: 95,
      height: 250,
    },
    {
      id: 21,
      image: "https://picsum.photos/115/111?random=21",
      title: "Ribbed Tank Top",
      description: "Basic essential for everyday styling.",
      price: 35,
      height: 111,
    },
    {
      id: 22,
      image: "https://picsum.photos/115/222?random=22",
      title: "Slim Fit Jeans",
      description: "Stretchy denim for active days.",
      price: 88,
      height: 222,
    },
    {
      id: 23,
      image: "https://picsum.photos/115/136?random=23",
      title: "Striped Scarf",
      description: "Soft and stylish winter scarf.",
      price: 48,
      height: 136,
    },
    {
      id: 24,
      image: "https://picsum.photos/115/190?random=24",
      title: "Denim Vest",
      description: "Layered fashion done right.",
      price: 72,
      height: 190,
    },
    {
      id: 25,
      image: "https://picsum.photos/115/172?random=25",
      title: "Combat Boots",
      description: "Durable boots with a rugged sole.",
      price: 130,
      height: 172,
    },
    {
      id: 26,
      image: "https://picsum.photos/115/224?random=26",
      title: "Fanny Pack",
      description: "Hands-free convenience with street flair.",
      price: 55,
      height: 224,
    },
    {
      id: 27,
      image: "https://picsum.photos/115/203?random=27",
      title: "Zebra Print Dress",
      description: "Wild and stylish for nights out.",
      price: 115,
      height: 203,
    },
    {
      id: 28,
      image: "https://picsum.photos/115/167?random=28",
      title: "Wool Beanie",
      description: "Stay warm in minimalist style.",
      price: 28,
      height: 167,
    },
    {
      id: 29,
      image: "https://picsum.photos/115/135?random=29",
      title: "Plaid Shirt",
      description: "Timeless layering piece.",
      price: 64,
      height: 135,
    },
    {
      id: 30,
      image: "https://picsum.photos/115/228?random=30",
      title: "Leather Belt",
      description: "Smooth buckle with polished leather.",
      price: 38,
      height: 228,
    },
  ];
  
  
  const filteredPins = pins.filter(
    (pin) =>
      pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/signup");
    }
  };

  const MerchCard = ({ merch }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="break-inside-avoid mb-6 group cursor-pointer">
        <div className="rounded-xl bg-zinc-900 overflow-hidden">
          <div className="relative overflow-hidden">
            {!imageLoaded && (
              <div
                className="bg-zinc-800 animate-pulse"
                style={{ height: merch.height }}
              />
            )}
            <img
              src={merch.image}
              alt={merch.title}
              className={`w-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ height: merch.height }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg">{merch.title}</h3>
            <p className="text-sm text-zinc-400 line-clamp-2">
              {merch.description}
            </p>
            <div className="pt-4 border-t border-zinc-700 mt-4">
              <div className="mt-4">
                <button
                  onClick={() => addToCart(merch)}
                  className="cursor-pointer rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black text-xs font-bold dark:bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  <span>Buy now</span>
                  <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                    KSh.{merch.price}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/">
                <button className="p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors">
                  <Home size={20} />
                </button>
              </Link>
            </nav>
          </div>
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search merchandise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 hover:bg-zinc-800 focus:bg-zinc-800 focus:ring-2 focus:ring-purple-500 rounded-full border-none outline-none text-white placeholder-zinc-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
            >
              <ShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full px-1.5">
                  {totalQuantity}
                </span>
              )}
            </button>
            <Link to="/signup">
              <User size={20} className="text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-10 mt-5">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
          {filteredPins.map((merch) => (
            <MerchCard key={merch.id} merch={merch} />
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 w-80 h-full bg-zinc-900 text-white shadow-lg z-50 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="flex-grow">Your cart is empty.</p>
          ) : (
            <>
              <div className="flex-grow space-y-4 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-zinc-700 pb-2"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-bold mt-1">
                        KSh.{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-700 mt-4">
                <p className="text-lg font-semibold mb-2">
                  Total: KSh.{totalPrice.toFixed(2)}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-black font-semibold py-2 rounded"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EcommerceLayout;