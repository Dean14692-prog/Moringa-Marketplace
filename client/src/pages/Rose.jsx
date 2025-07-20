// const pins = [
//   {
//     id: 1,
//     image: "https://picsum.photos/300/500?random=1",
//     title: "Air Jordan 4 Retro",
//     description:
//       "The AJ4 Retro Reimagined Bred will release on Feb 17, 2024. Best chance is to enter raffles and stay updated with sneaker news.",
//     price: "$100",
//     height: 450,
//   },
//   {
//     id: 2,
//     image: "https://picsum.photos/300/500?random=2",
//     title: "Nike Dunk Low Panda",
//     description:
//       "Timeless black and white Dunk Low that pairs with any outfit. Regular restocks make these accessible.",
//     price: "$90",
//     height: 380,
//   },
//   {
//     id: 3,
//     image: "https://picsum.photos/300/500?random=3",
//     title: "Yeezy Slide Pure",
//     description:
//       "Minimalist Yeezy comfort. Lightweight, stylish, and iconic—perfect for everyday wear and relaxation.",
//     price: "$80",
//     height: 420,
//   },
//   {
//     id: 4,
//     image: "https://picsum.photos/300/500?random=4",
//     title: "Vintage Streetwear Hoodie",
//     description:
//       "Premium cotton blend hoodie with retro graphics. Limited edition design inspired by 90s street culture.",
//     price: "$85",
//     height: 500,
//   },
//   {
//     id: 5,
//     image: "https://picsum.photos/300/350?random=5",
//     title: "Designer Baseball Cap",
//     description:
//       "Minimalist cap with premium materials. Adjustable fit and timeless design for any season.",
//     price: "$45",
//     height: 350,
//   },
//   {
//     id: 6,
//     image: "https://picsum.photos/300/480?random=6",
//     title: "Tech Wear Jacket",
//     description:
//       "Futuristic design meets functionality. Water-resistant with multiple utility pockets.",
//     price: "$180",
//     height: 480,
//   },
//   {
//     id: 7,
//     image: "https://picsum.photos/300/400?random=7",
//     title: "Luxury Watch Collection",
//     description:
//       "Swiss movement timepiece with sapphire crystal. Investment piece for the modern professional.",
//     price: "$450",
//     height: 400,
//   },
//   {
//     id: 8,
//     image: "https://picsum.photos/300/520?random=8",
//     title: "Artisan Leather Bag",
//     description:
//       "Handcrafted Italian leather with brass hardware. Perfect blend of style and functionality.",
//     price: "$220",
//     height: 520,
//   },
//   {
//     id: 9,
//     image: "https://picsum.photos/300/360?random=9",
//     title: "Minimalist Sunglasses",
//     description:
//       "UV protection with style. Polarized lenses and lightweight titanium frames.",
//     price: "$95",
//     height: 360,
//   },
//   {
//     id: 10,
//     image: "https://picsum.photos/300/440?random=10",
//     title: "Premium Denim Jacket",
//     description:
//       "Selvedge denim with vintage wash. Timeless piece that improves with age and wear.",
//     price: "$120",
//     height: 440,
//   },
//   {
//     id: 11,
//     image: "https://picsum.photos/300/390?random=11",
//     title: "Wireless Earbuds",
//     description:
//       "Studio-quality sound with active noise cancellation. Long battery life and wireless charging case.",
//     price: "$199",
//     height: 390,
//   },
//   {
//     id: 12,
//     image: "https://picsum.photos/300/470?random=12",
//     title: "Skateboard Deck Art",
//     description:
//       "Limited edition artist collaboration. Functional art piece for collectors and skaters alike.",
//     price: "$75",
//     height: 470,
//   },
//   {
//     id: 13,
//     image: "https://picsum.photos/300/410?random=13",
//     title: "Athletic Performance Shorts",
//     description:
//       "Moisture-wicking fabric with four-way stretch. Perfect for workouts and casual wear.",
//     price: "$35",
//     height: 410,
//   },
//   {
//     id: 14,
//     image: "https://picsum.photos/300/380?random=14",
//     title: "Ceramic Coffee Mug Set",
//     description:
//       "Hand-glazed ceramic mugs with unique patterns. Microwave and dishwasher safe.",
//     price: "$28",
//     height: 380,
//   },
//   {
//     id: 15,
//     image: "https://picsum.photos/300/460?random=15",
//     title: "Smart Fitness Tracker",
//     description:
//       "Track your health metrics with style. Heart rate monitoring and sleep tracking included.",
//     price: "$149",
//     height: 460,
//   },
//   {
//     id: 16,
//     image: "https://picsum.photos/300/340?random=16",
//     title: "Organic Cotton T-Shirt",
//     description:
//       "Sustainable fashion meets comfort. Pre-shrunk and tagless for all-day wear.",
//     price: "$22",
//     height: 340,
//   },
//   {
//     id: 17,
//     image: "https://picsum.photos/300/490?random=17",
//     title: "Professional Camera Lens",
//     description:
//       "Prime lens with exceptional image quality. Perfect for portrait and street photography.",
//     price: "$320",
//     height: 490,
//   },
//   {
//     id: 18,
//     image: "https://picsum.photos/300/370?random=18",
//     title: "Bamboo Phone Stand",
//     description:
//       "Eco-friendly desk accessory with adjustable angles. Compatible with all device sizes.",
//     price: "$15",
//     height: 370,
//   },
//   {
//     id: 19,
//     image: "https://picsum.photos/300/430?random=19",
//     title: "Vintage Vinyl Records",
//     description:
//       "Rare collection from the golden age of music. Carefully preserved and authenticated.",
//     price: "$89",
//     height: 430,
//   },
//   {
//     id: 20,
//     image: "https://picsum.photos/300/395?random=20",
//     title: "Stainless Steel Water Bottle",
//     description:
//       "Double-walled insulation keeps drinks cold for 24 hours. BPA-free and leak-proof design.",
//     price: "$29",
//     height: 395,
//   },
//   {
//     id: 21,
//     image: "https://picsum.photos/300/455?random=21",
//     title: "Mechanical Keyboard",
//     description:
//       "Cherry MX switches with RGB backlighting. Built for gaming and productivity enthusiasts.",
//     price: "$165",
//     height: 455,
//   },
//   {
//     id: 22,
//     image: "https://picsum.photos/300/385?random=22",
//     title: "Silk Pocket Square",
//     description:
//       "Luxurious silk accessory with hand-rolled edges. Elevates any formal or casual outfit.",
//     price: "$38",
//     height: 385,
//   },
//   {
//     id: 23,
//     image: "https://picsum.photos/300/475?random=23",
//     title: "Wireless Charging Pad",
//     description:
//       "Fast charging technology with LED indicator. Compatible with all Qi-enabled devices.",
//     price: "$42",
//     height: 475,
//   },
//   {
//     id: 24,
//     image: "https://picsum.photos/300/365?random=24",
//     title: "Artisan Soap Collection",
//     description:
//       "Handmade soaps with natural ingredients. Moisturizing and gentle on sensitive skin.",
//     price: "$24",
//     height: 365,
//   },
//   {
//     id: 25,
//     image: "https://picsum.photos/300/445?random=25",
//     title: "Gaming Mouse Pad",
//     description:
//       "Extra-large surface with precision tracking. Non-slip base and water-resistant coating.",
//     price: "$19",
//     height: 445,
//   },
//   {
//     id: 26,
//     image: "https://picsum.photos/300/375?random=26",
//     title: "Leather Wallet",
//     description:
//       "Genuine leather bifold with RFID blocking. Classic design with modern security features.",
//     price: "$67",
//     height: 375,
//   },
//   {
//     id: 27,
//     image: "https://picsum.photos/300/465?random=27",
//     title: "Bluetooth Speaker",
//     description:
//       "Portable speaker with 360-degree sound. Waterproof design perfect for outdoor adventures.",
//     price: "$78",
//     height: 465,
//   },
//   {
//     id: 28,
//     image: "https://picsum.photos/300/355?random=28",
//     title: "Scented Candle Set",
//     description:
//       "Premium soy wax candles with essential oils. Long-lasting fragrance for home ambiance.",
//     price: "$31",
//     height: 355,
//   },
//   {
//     id: 29,
//     image: "https://picsum.photos/300/425?random=29",
//     title: "Tablet Stand",
//     description:
//       "Adjustable aluminum stand for tablets and e-readers. Foldable design for easy portability.",
//     price: "$26",
//     height: 425,
//   },
//   {
//     id: 30,
//     image: "https://picsum.photos/300/405?random=30",
//     title: "Minimalist Wall Art",
//     description:
//       "Abstract geometric prints on premium paper. Ready to frame and transform any space.",
//     price: "$55",
//     height: 405,
//   },
// ];
