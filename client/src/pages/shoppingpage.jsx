"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
  ChevronRight,
  ChevronLeft,
  Home,
  Settings,
  Star,
  Package,
  ListFilter,
  SlidersHorizontal,
} from "lucide-react";

const EcommerceLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Standardized product data with consistent properties
  const allProducts = [
    {
      id: 1,
      title: "Quantum Headphones",
      description: "Immersive audio with adaptive noise cancellation.",
      category: "electronics",
      price: 3990,
      image_url:
        "https://i.pinimg.com/736x/b6/d2/fb/b6d2fb1c59f75e411725da3ae033a6cd.jpg",
    },
    {
      id: 2,
      title: "Chrono-Watch X",
      description: "Biometric monitoring and holographic display.",
      category: "accessories",
      price: 2500,
      image_url:
        "https://i.pinimg.com/1200x/fd/4f/18/fd4f1898d045b7852113a7dcfd4984d7.jpg",
    },
    {
      id: 3,
      title: "Zenith Glide Sandals",
      description: "Zero-gravity comfort, bio-morphic design.",
      category: "footwear",
      price: 8000,
      image_url:
        "https://i.pinimg.com/1200x/81/11/c9/8111c934881d025e7ced8feaa41d994b.jpg",
    },
    {
      id: 4,
      title: "Astro-Weave Hoodie",
      description: "Temperature-regulating smart fabric.",
      category: "clothing",
      price: 8500,
      image_url:
        "https://i.pinimg.com/736x/1f/80/5c/1f805c546535ee7c5caec833ccfff657.jpg",
    },
    {
      id: 5,
      title: "Cypher Cap",
      description: "Integrated comms and data display.",
      category: "accessories",
      price: 1500,
      image_url:
        "https://i.pinimg.com/1200x/2f/a7/cb/2fa7cb9f04b439f009908c4f9dabbe33.jpg",
    },
    {
      id: 6,
      title: "Nexus Jacket",
      description: "Self-cleaning, adaptable weather shielding.",
      category: "clothing",
      price: 1500,
      image_url:
        "https://i.pinimg.com/736x/f3/e2/ba/f3e2ba6c63ae2554924657008f37120f.jpg",
    },
    {
      id: 7,
      title: "Cortex Carryall",
      description: "Anti-grav technology for effortless transport.",
      category: "accessories",
      price: 3500,
      image_url:
        "https://i.pinimg.com/736x/b0/86/6b/b0866bc077690c58b9200739bd1efe99.jpg",
    },
    {
      id: 8,
      title: "Orion Timepiece",
      description: "Chronometer with predictive analytics.",
      category: "accessories",
      price: 4000,
      image_url:
        "https://i.pinimg.com/736x/ac/01/f5/ac01f5bdfd60ab7c95df411d6cc88e43.jpg",
    },
    {
      id: 9,
      title: "Velocity Shorts",
      description: "Aerodynamic fabric for enhanced motion.",
      category: "clothing",
      price: 4000,
      image_url:
        "https://i.pinimg.com/1200x/19/58/ab/1958abec07a89080122e49b3444f5b94.jpg",
    },
    {
      id: 10,
      title: "Synth-Fabric Tee",
      description: "Dynamic fit with projected graphics.",
      category: "clothing",
      price: 6000,
      image_url:
        "https://i.pinimg.com/1200x/14/7b/d8/147bd86b5f10cd6fd9b97f1d4e2f3c37.jpg",
    },
    {
      id: 11,
      title: "Neural Snapback",
      description: "Brainwave interface for smart device control.",
      category: "accessories",
      price: 3000,
      image_url:
        "https://i.pinimg.com/1200x/f4/fa/ae/f4faae12caefc928d4cf406eeab27576.jpg",
    },
    {
      id: 12,
      title: "Data Vault Wallet",
      description: "Encrypted storage with biometric lock.",
      category: "accessories",
      price: 7000,
      image_url:
        "https://i.pinimg.com/1200x/5b/6f/75/5b6f75ff2fa3d6645357c91db8a5b996.jpg",
    },
    {
      id: 13,
      title: "Aura Sports Bra",
      description: "Energy-returning kinetic support.",
      category: "clothing",
      price: 5500,
      image_url:
        "https://i.pinimg.com/1200x/72/9f/a5/729fa53a890623ea78f9e903c5e3cb26.jpg",
    },
    {
      id: 14,
      title: "Visionary Shades",
      description: "Augmented reality display, dynamic tint.",
      category: "accessories",
      price: 5000,
      image_url:
        "https://i.pinimg.com/1200x/b3/87/b2/b387b225e37c1738b4162f926140e482.jpg",
    },
    {
      id: 15,
      title: "Bio-Adaptive Trousers",
      category: "clothing",
      description: "Form-fitting, climate-responsive material.",
      price: 7500,
      image_url:
        "https://i.pinimg.com/736x/d8/af/81/d8af81a0e2bc205219c89588f0e5807b.jpg",
    },
    {
      id: 16,
      title: "Stealth Bomber",
      description: "Thermal camouflage, integrated defense.",
      category: "clothing",
      price: 12000,
      image_url:
        "https://i.pinimg.com/1200x/dd/a6/5e/dda65e68d22ed6f0e0f884841af4b3fa.jpg",
    },
    {
      id: 17,
      title: "Grav-Stride Sneakers",
      description: "Anti-gravity soles for enhanced agility.",
      category: "footwear",
      price: 11000,
      image_url:
        "https://i.pinimg.com/736x/94/55/37/945537dd3fa9a8f4723616fdb0068639.jpg",
    },
    {
      id: 18,
      title: "Comms Mesh Cap",
      category: "clothing",
      description: "Integrated comms, breathable nanoweave.",
      price: 2500,
      image_url:
        "https://i.pinimg.com/1200x/8f/8f/3c/8f8f3cd24ba8b67275dcebe78ae1825c.jpg",
    },
    {
      id: 19,
      title: "Zero-G Joggers",
      description: "Lightweight kinetic-responsive fabric.",
      category: "clothing",
      price: 6500,
      image_url:
        "https://i.pinimg.com/736x/4b/d8/ee/4bd8eec1fbf7cf59a4586b1975d9bf9c.jpg",
    },
    {
      id: 20,
      title: "Digital Quill",
      category: "Stationery",
      price: 500,
      description: "Haptic feedback, infinite ink capacity.",
      image_url:
        "https://i.pinimg.com/1200x/49/a4/f8/49a4f8b169e18bb8bad716d643052a26.jpg",
    },
    {
      id: 21,
      title: "Chrono-Log",
      category: "Stationery",
      price: 3000,
      description: "Self-updating, holographic planner.",
      image_url:
        "https://i.pinimg.com/1200x/94/3c/d8/943cd865b8d2c3134c9e7b189fd800b3.jpg",
    },
    {
      id: 22,
      title: "Weather-Shield Umbrella",
      category: "Accessories",
      price: 2300,
      description: "Programmable force-field protection.",
      image_url:
        "https://i.pinimg.com/1200x/18/12/a9/1812a9ab1883f056c008b1ca04859930.jpg",
    },
    {
      id: 23,
      title: "Optic-White Tee",
      category: "Apparel",
      price: 1000,
      description: "Luminescent, self-cleaning fabric.",
      image_url:
        "https://i.pinimg.com/1200x/67/42/ec/6742ec0b86ab308ad81425d23783b446.jpg",
    },
    {
      id: 24,
      title: "Deep-Space Blue Tee",
      category: "Apparel",
      price: 1000,
      description: "Color-shifting, adaptable climate control.",
      image_url:
        "https://i.pinimg.com/1200x/5a/4c/55/5a4c551c032038d8d230801b799aa2ff.jpg",
    },
    {
      id: 25,
      title: "Data Pack Backpack",
      category: "Accessories",
      price: 4500,
      description: "Integrated power core, secure data ports.",
      image_url:
        "https://i.pinimg.com/736x/5d/44/c8/5d44c88b587504470377ed2982fadfba.jpg",
    },
    {
      id: 26,
      title: "Zenith Journal",
      category: "Stationery",
      price: 800,
      description: "Mind-linked entry, encrypted memory.",
      image_url:
        "https://i.pinimg.com/736x/f5/54/03/f55403a75b78019e4e517e60fd27f868.jpg",
    },
    {
      id: 27,
      title: "Aether Shawl",
      category: "Apparel",
      price: 1500,
      description: "Personalized climate shielding.",
      image_url:
        "https://i.pinimg.com/1200x/d5/c7/31/d5c7319fc4f49b7079b6025c7b916da4.jpg",
    },
    {
      id: 28,
      title: "Bio-Sync Wristband",
      category: "Accessories",
      price: 250,
      description: "Vital sign monitoring, real-time alerts.",
      image_url:
        "https://i.pinimg.com/1200x/be/ee/9a/beee9a1961b926d6501f48a65c4fd037.jpg",
    },
    {
      id: 29,
      title: "Hydra-Flow Bottle",
      category: "Accessories",
      price: 890,
      description: "Self-purifying, nutrient-infused water.",
      image_url:
        "https://i.pinimg.com/736x/af/93/96/af939674143befce000dda3dc0c81be7.jpg",
    },
    {
      id: 30,
      title: "Thermo-Mug",
      category: "Kitchen",
      price: 400,
      description: "Temperature-regulating, self-stirring.",
      image_url:
        "https://i.pinimg.com/736x/ec/38/da/ec38da6adee71f54bf67552bb139b713.jpg",
    },
    {
      id: 31,
      title: "Adaptive Hoodie",
      category: "Apparel",
      price: 2500,
      description: "Responsive fabric, personalized fit.",
      image_url:
        "https://i.pinimg.com/1200x/87/34/12/873412b2c2400a166001a7b9d31a4374.jpg",
    },
    {
      id: 32,
      title: "Smart Watch Elite",
      category: "Accessories",
      price: 9000,
      description: "AI assistant, holographic interface.",
      image_url:
        "https://i.pinimg.com/736x/9f/51/64/9f516438c6bf29035748506e00ac9098.jpg",
    },
    {
      id: 33,
      title: "Aura Earbuds",
      category: "Electronics",
      price: 4500,
      description: "Neural interface, sound customization.",
      image_url:
        "https://i.pinimg.com/1200x/80/c0/e9/80c0e9e780e68ced6dd6c91270ae5a0e.jpg",
    },
    {
      id: 34,
      title: "Circuit Decals Pack",
      category: "Accessories",
      price: 700,
      description: "Luminescent circuit board designs.",
      image_url:
        "https://i.pinimg.com/1200x/77/fa/b4/77fab4183bf923f9cbe8e4762f005bc6.jpg",
    },
    {
      id: 35,
      title: "Dataweave Tote",
      category: "Accessories",
      price: 4500,
      description: "Secure data transfer, expandable capacity.",
      image_url:
        "https://i.pinimg.com/736x/ad/8c/89/ad8c89ffcb703e2b128096f7fecd2cd7.jpg",
    },
    {
      id: 36,
      title: "Nano-Key Holder",
      category: "Accessories",
      price: 1000,
      description: "Biometric access, multi-tool integration.",
      image_url:
        "https://i.pinimg.com/1200x/41/09/17/410917b404bef28aca34807128a4c8bf.jpg",
    },
    {
      id: 37,
      title: "Crystalline Brooch",
      category: "Accessories",
      price: 2000,
      description: "Illuminated, mood-reactive display.",
      image_url:
        "https://i.pinimg.com/736x/2e/b0/d7/2eb0d71cd6422d9396150c6e4243254c.jpg",
    },
    {
      id: 38,
      title: "Neural Interface Cap",
      category: "Apparel",
      price: 1200,
      description: "Direct thought-to-device connection.",
      image_url:
        "https://i.pinimg.com/1200x/1b/61/a0/1b61a0293facfacd60d9719d1e16c39f.jpg",
    },
    {
      id: 39,
      title: "Kinetic Drawstring Bag",
      category: "Accessories",
      price: 2500,
      description: "Energy-harvesting, lightweight material.",
      image_url:
        "https://i.pinimg.com/1200x/45/ee/ed/45eeeda740ac05da997ae5832be8daf3.jpg",
    },
  ].map((product) => ({
    ...product,
    image_url: product.image_url || product.image,
  }));

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

  const sidebarLinks = [
    {
      label: "Home",
      href: "#",
      icon: <Home className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Categories",
      href: "#",
      icon: <ListFilter className="h-5 w-5 shrink-0" />,
      children: (
        <div className="space-y-3 mt-2 pl-8">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="mr-3 h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 outline-none transition-colors duration-200"
              />
              <span className="capitalize hover:text-teal-400 transition-colors duration-200">
                {category.toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      ),
    },
    {
      label: "Price Range",
      href: "#",
      icon: <SlidersHorizontal className="h-5 w-5 shrink-0" />,
      children: (
        <div className="mt-2 pl-8">
          <div className="mb-3 flex justify-between text-sm text-gray-400">
            <span>KSh {priceRange[0].toLocaleString()}</span>
            <span>KSh {priceRange[1].toLocaleString()}</span>
          </div>
          <div className="flex space-x-4">
            <input
              type="range"
              min="0"
              max="20000"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value), priceRange[1]])
              }
              className="w-1/2 appearance-none rounded-lg h-2 bg-gray-700 accent-purple-500 outline-none transition-colors duration-200"
            />
            <input
              type="range"
              min="0"
              max="20000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-1/2 appearance-none rounded-lg h-2 bg-gray-700 accent-purple-500 outline-none transition-colors duration-200"
            />
          </div>
        </div>
      ),
    },
    {
      label: "Sort By",
      href: "#",
      icon: <Star className="h-5 w-5 shrink-0" />,
      children: (
        <div className="mt-2 pl-8">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-gray-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all duration-200"
          >
            <option value="name-asc">Designation (A-Z)</option>
            <option value="name-desc">Designation (Z-A)</option>
            <option value="price-asc">Cost (Low to High)</option>
            <option value="price-desc">Cost (High to Low)</option>
          </select>
        </div>
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-5 w-5 shrink-0" />,
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-900 to-black font-mono text-gray-200",
        "flex flex-col"
      )}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-700 bg-black/80 backdrop-blur-sm shadow-lg h-[60px]">
        <div className="container mx-auto flex items-center justify-between px-6 py-4 mt-5">
          <div className="text-2xl font-bold text-teal-400 drop-shadow-lg">
            <a
              href="#"
              className="ml-5 hover:text-teal-300 transition-colors duration-200"
            >
              MORINGA MART
            </a>
          </div>

          <div className="relative flex-1 px-8 max-w-lg">
            <Search className="absolute left-10 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-600 bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 text-gray-300 hover:text-teal-400 transition-colors duration-200"
          >
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs text-white animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className={cn("flex flex-1 overflow-hidden", "container mx-auto")}>
        {/* Sidebar */}
        <motion.div
          initial={{ width: sidebarOpen ? 240 : 72 }}
          animate={{ width: sidebarOpen ? 240 : 72 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed h-screen bg-gray-800 shadow-lg z-10",
            "flex flex-col border-r border-gray-700"
          )}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <div />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {sidebarLinks.map((link) => (
                <div key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      "text-gray-300 hover:bg-gray-700",
                      !sidebarOpen && "justify-center"
                    )}
                  >
                    <span className={cn(sidebarOpen ? "mr-3" : "mx-auto")}>
                      {React.cloneElement(link.icon, {
                        className: "h-5 w-5 text-gray-400",
                      })}
                    </span>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </a>
                  {sidebarOpen && link.children}
                </div>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange([0, 5000]);
                setSortOption("name-asc");
              }}
              className={cn(
                "w-full rounded-lg border border-gray-600 bg-gray-700 py-2 font-medium text-gray-300 hover:bg-gray-600 hover:text-teal-400 transition-colors duration-200",
                !sidebarOpen && "hidden"
              )}
            >
              RESET FILTERS
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            sidebarOpen ? "ml-[240px]" : "ml-[72px]"
          )}
        >
          <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200 md:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                {sidebarOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
                <p className="text-lg text-gray-500">
                  No matching schematics found. Adjust scan parameters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-purple-500 flex flex-col"
                  >
                    <div className="relative h-60 w-full overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x400?text=DATA+CORRUPT";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <ChevronRight
                          className="text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1"
                          size={32}
                        />
                      </div>
                    </div>
                    {/* <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-teal-400">
                          {product.title}
                        </h3>
                        <p className="mb-3 text-sm text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-purple-400">
                          KSh {product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className=" bg-teal-600 px-1 text-sm font-medium text-white shadow-md transition-colors hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                          ADD CART
                        </button>
                      </div>
                    </div> */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-teal-400">
                          {product.title}
                        </h3>
                        <p className="mb-3 text-sm text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        {/* Price Display */}
                        <span className="text-xl font-bold text-purple-400">
                          KSh {product.price.toLocaleString()}
                        </span>

                        {/* Buy Now Button */}
                        <button
                          onClick={() => {
                            addToCart(product);
                            setIsCartOpen(true);
                          }}
                          className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800"
                        >
                          <span>Buy now</span>
                          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                            KSh {product.price.toLocaleString()}
                          </span>
                        </button>

                        {/* Add to Cart Button */}
                        {/* <button
                          onClick={() => addToCart(product)}
                          className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-teal-600 text-xs font-bold hover:bg-teal-700 transition-colors"
                        >
                          <span>Add to cart</span>
                          <span className="bg-teal-800 rounded-full text-[0.6rem] px-2 py-0 text-white">
                            +
                          </span>
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep("cart");
            }}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-md transform bg-gray-900 border-l border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between border-b border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-teal-400">
                {checkoutStep === "cart" &&
                  `DATA LOG (${totalItems} ${
                    totalItems === 1 ? "UNIT" : "UNITS"
                  })`}
                {checkoutStep === "payment" && "AUTHORIZE TRANSACTION"}
                {checkoutStep === "summary" && "TRANSACTION REVIEW"}
                {checkoutStep === "complete" && "TRANSACTION COMPLETE"}
              </h2>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep("cart");
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="h-[calc(100%-180px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {checkoutStep === "cart" && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-gray-500">
                      <ShoppingCart
                        size={64}
                        className="mb-4 text-gray-700 animate-pulse"
                      />
                      <p className="mb-2 text-xl font-medium">
                        Log empty. Initiate new data transfer.
                      </p>
                      <p className="text-md text-gray-600">
                        Acquire schematics from the product matrix.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md transition-all duration-200 hover:border-teal-500"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-24 w-24 rounded-md object-cover border border-gray-600"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x400?text=DATA+CORRUPT";
                              }}
                            />
                            <button
                              onClick={() => removeItem(item.id)}
                              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white shadow-md transition-colors hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-teal-400">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="w-8 text-center text-lg font-medium text-purple-400">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                              <p className="text-xl font-bold text-purple-400">
                                KSh{" "}
                                {(item.price * item.quantity).toLocaleString()}
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
                  <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-teal-400">
                      TRANSACTION SUMMARY
                    </h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-gray-400"
                        >
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span>
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-700 pt-4">
                        <div className="mb-2 flex justify-between text-lg font-medium text-gray-300">
                          <span>SUBTOTAL:</span>
                          <span>KSh {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="mb-2 flex justify-between text-lg font-medium text-gray-300">
                          <span>LOGISTICS FEE:</span>
                          <span>
                            KSh{" "}
                            {(totalPrice > 10000 ? 0 : 500).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-purple-400">
                          <span>TOTAL:</span>
                          <span>
                            KSh{" "}
                            {(
                              totalPrice + (totalPrice > 10000 ? 0 : 500)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-teal-400">
                      PAYMENT PROTOCOL
                    </h3>
                    <div className="space-y-4">
                      <label className="flex cursor-pointer items-center rounded-md border border-gray-600 bg-gray-900 p-4 transition-all hover:bg-gray-700 has-[input:checked]:border-purple-500 has-[input:checked]:ring-1 has-[input:checked]:ring-purple-500">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="creditCard"
                          checked={selectedPayment === "creditCard"}
                          onChange={() => setSelectedPayment("creditCard")}
                          className="peer mr-3 h-5 w-5 text-purple-500 focus:ring-purple-400 bg-gray-700 border-gray-600"
                        />
                        <CreditCard className="mr-3 h-6 w-6 text-gray-500 peer-checked:text-purple-500" />
                        <span className="text-lg font-medium text-gray-300">
                          CREDIT SYNC
                        </span>
                      </label>
                      <label className="flex cursor-pointer items-center rounded-md border border-gray-600 bg-gray-900 p-4 transition-all hover:bg-gray-700 has-[input:checked]:border-purple-500 has-[input:checked]:ring-1 has-[input:checked]:ring-purple-500">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mpesa"
                          checked={selectedPayment === "mpesa"}
                          onChange={() => setSelectedPayment("mpesa")}
                          className="peer mr-3 h-5 w-5 text-purple-500 focus:ring-purple-400 bg-gray-700 border-gray-600"
                        />
                        <Smartphone className="mr-3 h-6 w-6 text-gray-500 peer-checked:text-purple-500" />
                        <span className="text-lg font-medium text-gray-300">
                          QUANTUM TRANSFER
                        </span>
                      </label>
                      <label className="flex cursor-pointer items-center rounded-md border border-gray-600 bg-gray-900 p-4 transition-all hover:bg-gray-700 has-[input:checked]:border-purple-500 has-[input:checked]:ring-1 has-[input:checked]:ring-purple-500">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cashOnDelivery"
                          checked={selectedPayment === "cashOnDelivery"}
                          onChange={() => setSelectedPayment("cashOnDelivery")}
                          className="peer mr-3 h-5 w-5 text-purple-500 focus:ring-purple-400 bg-gray-700 border-gray-600"
                        />
                        <DollarSign className="mr-3 h-6 w-6 text-gray-500 peer-checked:text-purple-500" />
                        <span className="text-lg font-medium text-gray-300">
                          DEBIT ON DELIVERY
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === "summary" && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center shadow-md">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-900/50 border border-green-700">
                        <CheckCircle className="h-12 w-12 text-green-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-teal-400">
                      TRANSACTION INITIATED!
                    </h3>
                    <p className="mb-6 text-lg text-gray-400">
                      Confirmation ID:{" "}
                      <span className="font-semibold text-purple-400">
                        #{orderNumber}
                      </span>
                    </p>

                    <div className="border-t border-gray-700 pt-6">
                      <h4 className="mb-4 text-xl font-semibold text-gray-300">
                        UNIT DETAILS
                      </h4>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-gray-400"
                          >
                            <span>
                              {item.title} × {item.quantity}
                            </span>
                            <span>
                              KSh{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <div className="mb-2 flex justify-between text-lg font-medium text-gray-300">
                          <span>SUBTOTAL:</span>
                          <span>KSh {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="mb-2 flex justify-between text-lg font-medium text-gray-300">
                          <span>LOGISTICS FEE:</span>
                          <span>
                            KSh{" "}
                            {(totalPrice > 10000 ? 0 : 500).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-purple-400">
                          <span>TOTAL CHARGE:</span>
                          <span>
                            KSh{" "}
                            {(
                              totalPrice + (totalPrice > 10000 ? 0 : 500)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart / Checkout Footer */}
            <div className="absolute bottom-0 w-full border-t border-gray-700 bg-gray-900 p-6 shadow-2xl">
              {checkoutStep === "cart" && (
                <>
                  <div className="mb-4 flex justify-between text-xl font-bold text-teal-400">
                    <span>SUBTOTAL:</span>
                    <span>KSh {totalPrice.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className={`w-full rounded-lg py-3 font-semibold text-white transition-colors duration-200 shadow-lg ${
                      cartItems.length === 0
                        ? "cursor-not-allowed bg-gray-700 text-gray-500"
                        : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    }`}
                  >
                    PROCEED TO AUTHORIZATION
                  </button>
                </>
              )}

              {checkoutStep === "payment" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-gray-800 py-3 font-semibold text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    RETURN TO LOG
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!selectedPayment}
                    className={`w-full rounded-lg py-3 font-semibold text-white transition-colors duration-200 shadow-lg ${
                      !selectedPayment
                        ? "cursor-not-allowed bg-gray-700 text-gray-500"
                        : "bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    }`}
                  >
                    CONFIRM TRANSACTION
                  </button>
                </div>
              )}

              {checkoutStep === "summary" && (
                <div className="space-y-4">
                  <button
                    onClick={backToShop}
                    className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-teal-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    CONTINUE SCANNING CATALOG
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceLayout;