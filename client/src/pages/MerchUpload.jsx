// import React, { useState } from "react";
// import {
//   PlusCircle,
//   Image,
//   DollarSign,
//   Package,
//   FileText,
//   Tag,
// } from "lucide-react";

// const MerchUpload = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image_url: "",
//     stock_quantity: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you would typically send this data to your backend API
//     // For now, we'll just log it to the console.
//     console.log("Form data submitted:", formData);

//     // You can add your API call here, for example:
    
//     fetch("http://localhost:5555/api/admin/merchandise", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`, // If authentication is needed
//       },
//       body: JSON.stringify({
//         name: formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price), // Ensure price is a number
//         image_url: formData.image_url,
//         stock_quantity: parseInt(formData.stock_quantity, 10), // Ensure stock_quantity is an integer
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         alert("Merchandise added successfully!");
//         // Optionally reset form
//         setFormData({
//           name: "",
//           description: "",
//           price: "",
//           image_url: "",
//           stock_quantity: "",
//         });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert("Failed to add merchandise. See console for details.");
//       });
    
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex justify-center items-center">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center flex items-center justify-center gap-3">
//           <PlusCircle size={28} /> Add New Merchandise
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <Tag size={18} /> Product Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., Quantum Headphones"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <FileText size={18} /> Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Detailed description of the product"
//               rows="4"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//             ></textarea>
//           </div>

//           <div>
//             <label
//               htmlFor="price"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <DollarSign size={18} /> Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="0.00"
//               step="0.01"
//               min="0"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="image_url"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <Image size={18} /> Image URL
//             </label>
//             <input
//               type="url"
//               id="image_url"
//               name="image_url"
//               value={formData.image_url}
//               onChange={handleChange}
//               placeholder="https://example.com/product.jpg"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="stock_quantity"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <Package size={18} /> Stock Quantity
//             </label>
//             <input
//               type="number"
//               id="stock_quantity"
//               name="stock_quantity"
//               value={formData.stock_quantity}
//               onChange={handleChange}
//               placeholder="0"
//               min="0"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg"
//           >
//             Add Merchandise
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MerchUpload;

import React, { useState } from "react";
import {
  PlusCircle,
  Image,
  DollarSign,
  Package,
  FileText,
  Tag,
  ListFilter,
} from "lucide-react";

const MerchUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock_quantity: "",
    category: "",
  });

  const categories = [
    "electronics",
    "accessories",
    "footwear",
    "clothing",
    "home",
    "health",
    "defense",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    fetch("http://localhost:5555/api/admin/merchandise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        stock_quantity: parseInt(formData.stock_quantity, 10),
        category: formData.category.toLowerCase(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        alert("Merchandise added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          image_url: "",
          stock_quantity: "",
          category: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add merchandise. See console for details.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center flex items-center justify-center gap-3">
          <PlusCircle size={28} /> Add New Merchandise
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
            >
              <Tag size={18} /> Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Quantum Headphones"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
            >
              <FileText size={18} /> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the product"
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
            >
              <DollarSign size={18} /> Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
            >
              <Image size={18} /> Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
            >
              <ListFilter size={18} /> Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="stock_quantity"
              className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
            >
              <Package size={18} /> Stock Quantity
            </label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg"
          >
            Add Merchandise
          </button>
        </form>
      </div>
    </div>
  );
};

export default MerchUpload;