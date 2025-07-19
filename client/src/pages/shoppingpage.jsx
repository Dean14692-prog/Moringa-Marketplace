import { useState, useEffect } from "react";
import { Search, Home, Bell, MessageCircle, User } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const EcommerceLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);

  const pins = [
    {
      id: 1,
      image: "https://picsum.photos/300/500?random=1",
      title: "Air Jordan 4 Retro",
      description:
        "The AJ4 Retro Reimagined Bred will release on Feb 17, 2024. Best chance is to enter raffles and stay updated with sneaker news.",
      price: "$100",
      height: 450,
    },
    {
      id: 2,
      image: "https://picsum.photos/300/500?random=2",
      title: "Nike Dunk Low Panda",
      description:
        "Timeless black and white Dunk Low that pairs with any outfit. Regular restocks make these accessible.",
      price: "$90",
      height: 380,
    },
    {
      id: 3,
      image: "https://picsum.photos/300/500?random=3",
      title: "Yeezy Slide Pure",
      description:
        "Minimalist Yeezy comfort. Lightweight, stylish, and iconic—perfect for everyday wear and relaxation.",
      price: "$80",
      height: 420,
    },
    {
      id: 4,
      image: "https://picsum.photos/300/500?random=4",
      title: "Vintage Streetwear Hoodie",
      description:
        "Premium cotton blend hoodie with retro graphics. Limited edition design inspired by 90s street culture.",
      price: "$85",
      height: 500,
    },
    {
      id: 5,
      image: "https://picsum.photos/300/350?random=5",
      title: "Designer Baseball Cap",
      description:
        "Minimalist cap with premium materials. Adjustable fit and timeless design for any season.",
      price: "$45",
      height: 350,
    },
    {
      id: 6,
      image: "https://picsum.photos/300/480?random=6",
      title: "Tech Wear Jacket",
      description:
        "Futuristic design meets functionality. Water-resistant with multiple utility pockets.",
      price: "$180",
      height: 480,
    },
    {
      id: 7,
      image: "https://picsum.photos/300/400?random=7",
      title: "Luxury Watch Collection",
      description:
        "Swiss movement timepiece with sapphire crystal. Investment piece for the modern professional.",
      price: "$450",
      height: 400,
    },
    {
      id: 8,
      image: "https://picsum.photos/300/520?random=8",
      title: "Artisan Leather Bag",
      description:
        "Handcrafted Italian leather with brass hardware. Perfect blend of style and functionality.",
      price: "$220",
      height: 520,
    },
    {
      id: 9,
      image: "https://picsum.photos/300/360?random=9",
      title: "Minimalist Sunglasses",
      description:
        "UV protection with style. Polarized lenses and lightweight titanium frames.",
      price: "$95",
      height: 360,
    },
    {
      id: 10,
      image: "https://picsum.photos/300/440?random=10",
      title: "Premium Denim Jacket",
      description:
        "Selvedge denim with vintage wash. Timeless piece that improves with age and wear.",
      price: "$120",
      height: 440,
    },
    {
      id: 11,
      image: "https://picsum.photos/300/390?random=11",
      title: "Wireless Earbuds",
      description:
        "Studio-quality sound with active noise cancellation. Long battery life and wireless charging case.",
      price: "$199",
      height: 390,
    },
    {
      id: 12,
      image: "https://picsum.photos/300/470?random=12",
      title: "Skateboard Deck Art",
      description:
        "Limited edition artist collaboration. Functional art piece for collectors and skaters alike.",
      price: "$75",
      height: 470,
    },
    {
      id: 13,
      image: "https://picsum.photos/300/410?random=13",
      title: "Athletic Performance Shorts",
      description:
        "Moisture-wicking fabric with four-way stretch. Perfect for workouts and casual wear.",
      price: "$35",
      height: 410,
    },
    {
      id: 14,
      image: "https://picsum.photos/300/380?random=14",
      title: "Ceramic Coffee Mug Set",
      description:
        "Hand-glazed ceramic mugs with unique patterns. Microwave and dishwasher safe.",
      price: "$28",
      height: 380,
    },
    {
      id: 15,
      image: "https://picsum.photos/300/460?random=15",
      title: "Smart Fitness Tracker",
      description:
        "Track your health metrics with style. Heart rate monitoring and sleep tracking included.",
      price: "$149",
      height: 460,
    },
    {
      id: 16,
      image: "https://picsum.photos/300/340?random=16",
      title: "Organic Cotton T-Shirt",
      description:
        "Sustainable fashion meets comfort. Pre-shrunk and tagless for all-day wear.",
      price: "$22",
      height: 340,
    },
    {
      id: 17,
      image: "https://picsum.photos/300/490?random=17",
      title: "Professional Camera Lens",
      description:
        "Prime lens with exceptional image quality. Perfect for portrait and street photography.",
      price: "$320",
      height: 490,
    },
    {
      id: 18,
      image: "https://picsum.photos/300/370?random=18",
      title: "Bamboo Phone Stand",
      description:
        "Eco-friendly desk accessory with adjustable angles. Compatible with all device sizes.",
      price: "$15",
      height: 370,
    },
    {
      id: 19,
      image: "https://picsum.photos/300/430?random=19",
      title: "Vintage Vinyl Records",
      description:
        "Rare collection from the golden age of music. Carefully preserved and authenticated.",
      price: "$89",
      height: 430,
    },
    {
      id: 20,
      image: "https://picsum.photos/300/395?random=20",
      title: "Stainless Steel Water Bottle",
      description:
        "Double-walled insulation keeps drinks cold for 24 hours. BPA-free and leak-proof design.",
      price: "$29",
      height: 395,
    },
    {
      id: 21,
      image: "https://picsum.photos/300/455?random=21",
      title: "Mechanical Keyboard",
      description:
        "Cherry MX switches with RGB backlighting. Built for gaming and productivity enthusiasts.",
      price: "$165",
      height: 455,
    },
    {
      id: 22,
      image: "https://picsum.photos/300/385?random=22",
      title: "Silk Pocket Square",
      description:
        "Luxurious silk accessory with hand-rolled edges. Elevates any formal or casual outfit.",
      price: "$38",
      height: 385,
    },
    {
      id: 23,
      image: "https://picsum.photos/300/475?random=23",
      title: "Wireless Charging Pad",
      description:
        "Fast charging technology with LED indicator. Compatible with all Qi-enabled devices.",
      price: "$42",
      height: 475,
    },
    {
      id: 24,
      image: "https://picsum.photos/300/365?random=24",
      title: "Artisan Soap Collection",
      description:
        "Handmade soaps with natural ingredients. Moisturizing and gentle on sensitive skin.",
      price: "$24",
      height: 365,
    },
    {
      id: 25,
      image: "https://picsum.photos/300/445?random=25",
      title: "Gaming Mouse Pad",
      description:
        "Extra-large surface with precision tracking. Non-slip base and water-resistant coating.",
      price: "$19",
      height: 445,
    },
    {
      id: 26,
      image: "https://picsum.photos/300/375?random=26",
      title: "Leather Wallet",
      description:
        "Genuine leather bifold with RFID blocking. Classic design with modern security features.",
      price: "$67",
      height: 375,
    },
    {
      id: 27,
      image: "https://picsum.photos/300/465?random=27",
      title: "Bluetooth Speaker",
      description:
        "Portable speaker with 360-degree sound. Waterproof design perfect for outdoor adventures.",
      price: "$78",
      height: 465,
    },
    {
      id: 28,
      image: "https://picsum.photos/300/355?random=28",
      title: "Scented Candle Set",
      description:
        "Premium soy wax candles with essential oils. Long-lasting fragrance for home ambiance.",
      price: "$31",
      height: 355,
    },
    {
      id: 29,
      image: "https://picsum.photos/300/425?random=29",
      title: "Tablet Stand",
      description:
        "Adjustable aluminum stand for tablets and e-readers. Foldable design for easy portability.",
      price: "$26",
      height: 425,
    },
    {
      id: 30,
      image: "https://picsum.photos/300/405?random=30",
      title: "Minimalist Wall Art",
      description:
        "Abstract geometric prints on premium paper. Ready to frame and transform any space.",
      price: "$55",
      height: 405,
    },
  ];

  // Background Gradient Component
  const BackgroundGradient = ({
    children,
    className,
    containerClassName,
    animate = true,
  }) => {
    const [gradientPosition, setGradientPosition] = useState("0% 50%");

    useEffect(() => {
      if (!animate) return;

      const interval = setInterval(() => {
        setGradientPosition((prev) => {
          if (prev === "0% 50%") return "100% 50%";
          return "0% 50%";
        });
      }, 3000);

      return () => clearInterval(interval);
    }, [animate]);

    return (
      <div
        className={cn("relative group rounded-3xl p-[2px]", containerClassName)}
      >
        <div
          style={{
            backgroundSize: "400% 400%",
            backgroundPosition: gradientPosition,
            transition: "background-position 6s ease-in-out",
          }}
          className={cn(
            "absolute inset-0 z-0 rounded-3xl",
            "bg-[conic-gradient(from_0deg,#00ccb1,#7b61ff,#ffc414,#1ca0fb,#00ccb1)]",
            "transition duration-500 group-hover:blur-sm opacity-80 group-hover:opacity-100"
          )}
        />
        <div className="relative z-10 rounded-[22px] bg-black p-[2px] h-full">
          <div className={cn("rounded-[20px] h-full", className)}>
            {children}
          </div>
        </div>
      </div>
    );
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
        <BackgroundGradient
          className="text-white h-full"
          containerClassName="w-full"
          animate={isHovered}
        >
          <div className="rounded-[20px] bg-zinc-900 overflow-hidden h-full transition-all duration-500">
            {/* Image container */}
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
                } ${isHovered ? "scale-95 brightness-110" : ""}`}
                style={{ height: isHovered ? merch.height * 0.7 : merch.height }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Content section - appears on hover */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isHovered ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight mb-1">
                    {merch.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                    {merch.description}
                  </p>
                </div>

                <div className="mt-4">
                  <button className="cursor-pointer rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-zinc-700 transition">
                    <span>Cost</span>
                    <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                      {merch.price}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </BackgroundGradient>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-4">
                <button className="p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors">
                  <Home size={20} />
                </button>
              </nav>
            </div>
          </div>

          {/* Center - Search bar */}
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
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 hover:bg-zinc-800 focus:bg-zinc-800 focus:ring-2 focus:ring-purple-500 rounded-full border-none outline-none transition-all duration-200 text-white placeholder-zinc-400"
              />
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-3">
            <button className="p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-3 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors">
              <MessageCircle size={20} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-purple-500/20 transition-all">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Title */}
      {/* <div className="text-center py-10">
        <h1 className="text-white text-4xl font-bold mb-2">Merchandise</h1>
        <p className="text-zinc-400 text-lg">
          Discover our exclusive collection
        </p>
      </div> */}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pb-10 mt-5">
        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-0">
          {pins.map((merch) => (
            <MerchCard key={merch.id} merch={merch} />
          ))}
        </div>

        {/* View More Button */}
        {/* <div className="flex justify-center mt-12">
          <button className="bg-white hover:bg-neutral-200 text-black font-semibold px-8 py-3 rounded-full transition-colors duration-200 text-lg">
            View More
          </button>
        </div> */}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EcommerceLayout;
