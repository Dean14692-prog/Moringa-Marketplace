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
      image: "https://picsum.photos/300/500?random=1",
      title: "Air Jordan 4 Retro",
      description:
        "The AJ4 Retro Reimagined Bred will release on Feb 17, 2024.",
      price: 100,
      height: 450,
    },
    {
      id: 2,
      image: "https://picsum.photos/300/500?random=2",
      title: "Nike Dunk Low Panda",
      description: "Timeless black and white Dunk Low.",
      price: 90,
      height: 380,
    },
    {
      id: 3,
      image: "https://picsum.photos/300/500?random=3",
      title: "Yeezy Slide Pure",
      description: "Minimalist Yeezy comfort.",
      price: 80,
      height: 420,
    },
    {
      id: 4,
      image: "https://picsum.photos/300/500?random=4",
      title: "Vintage Hoodie",
      description: "Retro graphics inspired by 90s street culture.",
      price: 85,
      height: 500,
    },
    {
      id: 5,
      image: "https://picsum.photos/300/350?random=5",
      title: "Designer Cap",
      description: "Minimalist cap with premium materials.",
      price: 45,
      height: 350,
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
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div
        className="break-inside-avoid mb-6 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="rounded-xl bg-zinc-900 overflow-hidden">
          <div className="relative overflow-hidden">
            {!imageLoaded && (
              <div
                className="bg-zinc-800 animate-pulse"
                style={{ height: merch.height * 0.7 }}
              />
            )}
            <img
              src={merch.image}
              alt={merch.title}
              className={`w-full object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ height: isHovered ? merch.height * 0.7 : merch.height }}
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
    <div className="min-h-screen bg-black relative">
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