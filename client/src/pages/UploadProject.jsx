// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { Label } from "../components/ui/label"; // Assuming these components exist
// import { Input } from "../components/ui/input"; // Assuming these components exist
// import { cn } from "@/lib/utils"; // Assuming this utility function exists
// import { toast } from "sonner"; // Assuming sonner for toasts

// function UploadProject({ onProjectUpload }) {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     githubLink: "",
//     livePreviewUrl: "", // Corresponds to live_preview_url in backend
//     isForSale: false, // Corresponds to isForSale in backend
//     price: "", // Corresponds to price in backend
//     zipFile: null, // Corresponds to zipFile in backend for the actual file upload
//     category: "web", // New field
//     techStack: "", // New field
//     // Removed 'file' and 'demoLink' from state to align with backend keys more directly
//     // and to avoid confusion. 'zipFile' will hold the actual file object.
//   });

//   const [previewUrl, setPreviewUrl] = useState(null); // For image preview
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [collaborators, setCollaborators] = useState([]);
//   const [newCollaborator, setNewCollaborator] = useState({
//     name: "",
//     email: "",
//   });

//   // Redirect to login if token is not present
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       navigate("/login");
//       toast.error("Please log in to upload a project.");
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Basic validation for file type (e.g., zip, rar, tar.gz)
//       const allowedTypes = [
//         "application/zip",
//         "application/x-zip-compressed",
//         "application/vnd.rar",
//         "application/x-tar",
//         "application/x-gzip",
//         "application/octet-stream", // Often used for various binary files, including zips
//       ];
//       if (
//         !allowedTypes.includes(file.type) &&
//         !file.name.endsWith(".zip") &&
//         !file.name.endsWith(".rar") &&
//         !file.name.endsWith(".tar.gz")
//       ) {
//         toast.error(
//           "Invalid file type. Please upload a zip, rar, or tar.gz file."
//         );
//         setFormData((prev) => ({ ...prev, zipFile: null }));
//         e.target.value = ""; // Clear the input
//         return;
//       }
//       setFormData((prev) => ({ ...prev, zipFile: file }));
//     } else {
//       setFormData((prev) => ({ ...prev, zipFile: null }));
//     }
//   };

//   const handleAddCollaborator = () => {
//     if (newCollaborator.name && newCollaborator.email) {
//       setCollaborators((prev) => [...prev, newCollaborator]);
//       setNewCollaborator({ name: "", email: "" });
//     } else {
//       toast.error("Please enter both name and email for the collaborator.");
//     }
//   };

//   const handleRemoveCollaborator = (index) => {
//     setCollaborators((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.category ||
//       !formData.techStack
//     ) {
//       toast.error("Please fill in all required project details.");
//       return;
//     }
//     if (
//       formData.isForSale &&
//       (isNaN(formData.price) || parseFloat(formData.price) <= 0)
//     ) {
//       toast.error(
//         "Price must be a positive number if the project is for sale."
//       );
//       return;
//     }
//     setShowConfirm(true);
//   };

//   const handleConfirmUpload = async () => {
//     setIsLoading(true);
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       toast.error("Authentication token not found. Please log in.");
//       navigate("/login");
//       setIsLoading(false);
//       return;
//     }

//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("github_link", formData.githubLink);
//     data.append("live_preview_url", formData.livePreviewUrl);
//     data.append("is_for_sale", formData.isForSale);
//     data.append("price", formData.isForSale ? parseFloat(formData.price) : 0);
//     data.append("category", formData.category);
//     data.append("tech_stack", formData.techStack);

//     if (formData.zipFile) {
//       // Changed the key from "zip_file" to "file" to align with AdminDashboard's expectation
//       data.append("file", formData.zipFile);
//     }

//     data.append("collaborators", JSON.stringify(collaborators)); // Send collaborators as JSON string

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:5555/api/projects/upload",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: data,
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         toast.success("Project uploaded successfully!");
//         setFormData({
//           title: "",
//           description: "",
//           githubLink: "",
//           livePreviewUrl: "",
//           isForSale: false,
//           price: "",
//           zipFile: null,
//           category: "web",
//           techStack: "",
//         });
//         setCollaborators([]);
//         setPreviewUrl(null);
//         setShowConfirm(false);
//         if (onProjectUpload) {
//           onProjectUpload(result);
//         }
//         navigate("/my-projects"); // Navigate to user's projects page
//       } else {
//         const errorData = await response.json();
//         const errorMessage =
//           errorData.message || errorData.msg || "Failed to upload project.";
//         toast.error(`Upload failed: ${errorMessage}`);
//         console.error("Upload error:", errorData);
//       }
//     } catch (error) {
//       toast.error("An error occurred during upload.");
//       console.error("Network or unexpected error:", error);
//     } finally {
//       setIsLoading(false);
//       setShowConfirm(false); // Close confirmation modal on completion
//     }
//   };

//   const categories = [
//     { value: "web", label: "Web Development" },
//     { value: "mobile", label: "Mobile Development" },
//     { value: "data", label: "Data Science" },
//     { value: "ui/ux", label: "UI/UX Design" },
//     { value: "ai/ml", label: "AI/ML" },
//     { value: "other", label: "Other" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <header className="flex justify-between items-center mb-10">
//         <Link to="/" className="text-blue-400 hover:text-blue-300">
//           &larr; Back to Home
//         </Link>
//         <h1 className="text-3xl font-bold">Upload Your Project</h1>
//         <div></div> {/* For spacing */}
//       </header>

//       <form
//         onSubmit={handleSubmit}
//         className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700"
//       >
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Project Details
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <LabelInputContainer>
//             <Label htmlFor="title">Project Title</Label>
//             <Input
//               id="title"
//               name="title"
//               placeholder="e.g., E-commerce Platform"
//               type="text"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </LabelInputContainer>

//           <LabelInputContainer>
//             <Label htmlFor="category">Category</Label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="mt-1 block w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               {categories.map((cat) => (
//                 <option key={cat.value} value={cat.value}>
//                   {cat.label}
//                 </option>
//               ))}
//             </select>
//           </LabelInputContainer>
//         </div>

//         <LabelInputContainer className="mb-6">
//           <Label htmlFor="description">Project Description</Label>
//           <textarea
//             id="description"
//             name="description"
//             placeholder="A brief overview of your project, its features, and purpose..."
//             rows="5"
//             value={formData.description}
//             onChange={handleChange}
//             className="mt-1 block w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
//             required
//           ></textarea>
//         </LabelInputContainer>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <LabelInputContainer>
//             <Label htmlFor="githubLink">GitHub Repository URL (Optional)</Label>
//             <Input
//               id="githubLink"
//               name="githubLink"
//               placeholder="https://github.com/your-project"
//               type="url"
//               value={formData.githubLink}
//               onChange={handleChange}
//             />
//           </LabelInputContainer>

//           <LabelInputContainer>
//             <Label htmlFor="livePreviewUrl">Live Preview URL (Optional)</Label>
//             <Input
//               id="livePreviewUrl"
//               name="livePreviewUrl"
//               placeholder="https://your-project-live.com"
//               type="url"
//               value={formData.livePreviewUrl}
//               onChange={handleChange}
//             />
//           </LabelInputContainer>
//         </div>

//         <LabelInputContainer className="mb-6">
//           <Label htmlFor="techStack">
//             Tech Stack (e.g., React, Node.js, Python, Flask, SQL)
//           </Label>
//           <Input
//             id="techStack"
//             name="techStack"
//             placeholder="Comma-separated technologies used"
//             type="text"
//             value={formData.techStack}
//             onChange={handleChange}
//             required
//           />
//         </LabelInputContainer>

//         <LabelInputContainer className="mb-6">
//           <Label htmlFor="zipFile">Upload Project Zip File</Label>
//           <p className="text-sm text-zinc-400 mb-2">
//             Please compress your project files into a .zip, .rar, or .tar.gz
//             archive.
//           </p>
//           <Input
//             id="zipFile"
//             name="zipFile"
//             type="file"
//             accept=".zip,.rar,.tar.gz,application/zip,application/x-rar-compressed,application/gzip,application/x-tar"
//             onChange={handleFileChange}
//             className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
//           />
//           {formData.zipFile && (
//             <p className="text-sm text-zinc-300 mt-2">
//               Selected file: {formData.zipFile.name}
//             </p>
//           )}
//         </LabelInputContainer>

//         {/* Collaborators Section */}
//         <div className="mb-6 p-4 border border-zinc-700 rounded-md">
//           <h3 className="text-lg font-semibold mb-3">
//             Collaborators (Optional)
//           </h3>
//           <div className="space-y-3">
//             {collaborators.map((collab, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between items-center bg-zinc-700 p-3 rounded-md"
//               >
//                 <span>
//                   {collab.name} ({collab.email})
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveCollaborator(index)}
//                   className="text-red-400 hover:text-red-300 text-sm"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-3 mt-4">
//             <Input
//               placeholder="Collaborator Name"
//               type="text"
//               value={newCollaborator.name}
//               onChange={(e) =>
//                 setNewCollaborator((prev) => ({
//                   ...prev,
//                   name: e.target.value,
//                 }))
//               }
//               className="flex-1"
//             />
//             <Input
//               placeholder="Collaborator Email"
//               type="email"
//               value={newCollaborator.email}
//               onChange={(e) =>
//                 setNewCollaborator((prev) => ({
//                   ...prev,
//                   email: e.target.value,
//                 }))
//               }
//               className="flex-1"
//             />
//             <button
//               type="button"
//               onClick={handleAddCollaborator}
//               className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* For Sale Section */}
//         <div className="mb-8 flex items-center space-x-3">
//           <input
//             id="isForSale"
//             name="isForSale"
//             type="checkbox"
//             checked={formData.isForSale}
//             onChange={handleChange}
//             className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//           />
//           <Label htmlFor="isForSale" className="text-lg">
//             Mark project for sale?
//           </Label>
//         </div>

//         {formData.isForSale && (
//           <LabelInputContainer className="mb-8">
//             <Label htmlFor="price">Price (KES)</Label>
//             <Input
//               id="price"
//               name="price"
//               placeholder="e.g., 5000"
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={handleChange}
//               required={formData.isForSale}
//             />
//           </LabelInputContainer>
//         )}

//         <button
//           type="submit"
//           className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
//           disabled={isLoading}
//         >
//           <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
//           <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-slate-800 transition-colors duration-200">
//             {isLoading ? "Uploading..." : "Upload Project"}
//           </span>
//         </button>
//       </form>

//       {showConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="bg-zinc-800 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center border border-zinc-700"
//           >
//             <h2 className="text-xl font-bold">Confirm Upload</h2>
//             <p className="mt-4 mb-6 text-zinc-300">
//               Are you sure you want to upload this project?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600 transition"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmUpload}
//                 className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Uploading..." : "Confirm"}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }

// const BottomGradient = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </>
//   );
// };

// const LabelInputContainer = ({ children, className }) => {
//   return (
//     <div className={cn("flex flex-col space-y-2 w-full", className)}>
//       {children}
//     </div>
//   );
// };

// export default UploadProject;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label"; // Assuming these components exist
import { Input } from "../components/ui/input"; // Assuming these components exist
import { cn } from "@/lib/utils"; // Assuming this utility function exists
import { toast } from "sonner"; // Assuming sonner for toasts

function UploadProject({ onProjectUpload }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    livePreviewUrl: "", // Corresponds to live_preview_url in backend
    imageUrl: "", // NEW: Corresponds to image_url in backend
    isForSale: false, // Corresponds to isForSale in backend
    price: "", // Corresponds to price in backend
    zipFile: null, // Corresponds to zipFile in backend for the actual file upload
    category: "web", // New field
    techStack: "", // New field
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({
    name: "",
    email: "",
  });

  // Redirect to login if token is not present
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      toast.error("Please log in to upload a project.");
    }
  }, [navigate]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for file type (e.g., zip, rar, tar.gz)
      const allowedTypes = [
        "application/zip",
        "application/x-zip-compressed",
        "application/vnd.rar",
        "application/x-tar",
        "application/x-gzip",
        "application/octet-stream", // Often used for various binary files, including zips
      ];
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.endsWith(".zip") &&
        !file.name.endsWith(".rar") &&
        !file.name.endsWith(".tar.gz")
      ) {
        toast.error(
          "Invalid file type. Please upload a zip, rar, or tar.gz file."
        );
        setFormData((prev) => ({ ...prev, zipFile: null }));
        e.target.value = ""; // Clear the input
        return;
      }
      setFormData((prev) => ({ ...prev, zipFile: file }));
    } else {
      setFormData((prev) => ({ ...prev, zipFile: null }));
    }
  };

  const handleAddCollaborator = () => {
    if (newCollaborator.name && newCollaborator.email) {
      setCollaborators((prev) => [...prev, newCollaborator]);
      setNewCollaborator({ name: "", email: "" });
    } else {
      toast.error("Please enter both name and email for the collaborator.");
    }
  };

  const handleRemoveCollaborator = (index) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, file }));

      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.techStack
    ) {
      toast.error("Please fill in all required project details.");
      return;
    }
    if (
      formData.isForSale &&
      (isNaN(formData.price) || parseFloat(formData.price) <= 0)
    ) {
      toast.error(
        "Price must be a positive number if the project is for sale."
      );
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmUpload = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("github_link", formData.githubLink);
    data.append("live_preview_url", formData.livePreviewUrl);
    data.append("image_url", formData.imageUrl); // NEW: Append image_url
    data.append("is_for_sale", formData.isForSale);
    data.append("price", formData.isForSale ? parseFloat(formData.price) : 0);
    data.append("category", formData.category);
    data.append("tech_stack", formData.techStack);

    if (formData.zipFile) {
      data.append("file", formData.zipFile);
    }

    data.append("collaborators", JSON.stringify(collaborators)); // Send collaborators as JSON string

    try {
      const response = await fetch(
        "http://127.0.0.1:5555/api/projects/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Project uploaded successfully!");
        setFormData({
          title: "",
          description: "",
          githubLink: "",
          livePreviewUrl: "",
          imageUrl: "", // Reset image URL
          isForSale: false,
          price: "",
          zipFile: null,
          category: "web",
          techStack: "",
        });
        setCollaborators([]);
        setShowConfirm(false);
        if (onProjectUpload) {
          onProjectUpload(result);
        }
        navigate("/my-projects"); // Navigate to user's projects page
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || errorData.msg || "Failed to upload project.";
        toast.error(`Upload failed: ${errorMessage}`);
        console.error("Upload error:", errorData);
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
      console.error("Network or unexpected error:", error);
    } finally {
      setIsLoading(false);
      setShowConfirm(false); // Close confirmation modal on completion
    }
  };

  const categories = [
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile Development" },
    { value: "data", label: "Data Science" },
    { value: "ui/ux", label: "UI/UX Design" },
    { value: "ai/ml", label: "AI/ML" },
    { value: "other", label: "Other" },
  ];
    setShowConfirm(true);
  };

  const handleConfirmUpload = async () => {
    try {
      const newProject = {
        ...formData,
        previewUrl,
        status: "pending",
      };

      const res = await fetch("http://localhost:3001/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setProjects((prev) => [...prev, data]);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);

      // Reset form
      setFormData({
        title: "",
        description: "",
        githubLink: "",
        demoLink: "",
        forSale: false,
        price: "",
        file: null,
      });
      setPreviewUrl(null);
      setShowConfirm(false);
    } catch (error) {
      alert("Upload failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold">Upload Your Project</h1>
        <div></div> {/* For spacing */}
      </header>
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4 py-8 text-sm relative">
      {/* Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
        >
          Project uploaded successfully!
        </motion.div>
      )}

      <Link
        to="/dashboard"
        className="absolute top-4 left-4 flex items-center gap-2 text-xs text-white px-2 py-1 rounded hover:bg-zinc-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
          className="h-4 w-4"
        >
          <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h5v-5h2v5h5a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z" />
        </svg>
        <span>Home</span>
      </Link>

      <h1 className="text-xl font-bold mb-4 text-white">Upload New Project</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Project Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LabelInputContainer>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., E-commerce Platform"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="description">Project Description</Label>
        <LabelInputContainer>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            placeholder="A brief overview of your project, its features, and purpose..."
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
            className="bg-zinc-900 text-white rounded px-3 py-2"
          />
        </LabelInputContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LabelInputContainer>
            <Label htmlFor="githubLink">GitHub Repository URL (Optional)</Label>
            <Input
              id="githubLink"
              name="githubLink"
              placeholder="https://github.com/your-project"
              type="url"
              value={formData.githubLink}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="livePreviewUrl">Live Preview URL (Optional)</Label>
            <Input
              id="livePreviewUrl"
              name="livePreviewUrl"
              placeholder="https://your-project-live.com"
              type="url"
              value={formData.livePreviewUrl}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        {/* NEW: Image URL Input */}
        <LabelInputContainer className="mb-6">
          <Label htmlFor="imageUrl">Project Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/project-image.jpg"
        <LabelInputContainer>
          <Label htmlFor="githubLink">GitHub Link</Label>
          <Input
            id="githubLink"
            name="githubLink"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-zinc-300 mb-1">Image Preview:</p>
              <img
                src={formData.imageUrl}
                alt="Project Preview"
                className="w-full max-h-48 object-contain rounded-md border border-zinc-600"
              />
            </div>
          )}
            required
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="techStack">
            Tech Stack (e.g., React, Node.js, Python, Flask, SQL)
          </Label>
        <LabelInputContainer>
          <Label htmlFor="demoLink">Demo Link</Label>
          <Input
            id="techStack"
            name="techStack"
            placeholder="Comma-separated technologies used"
            type="text"
            value={formData.techStack}
            id="demoLink"
            name="demoLink"
            type="url"
            placeholder="https://demo.com"
            value={formData.demoLink}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="zipFile">Upload Project Zip File</Label>
          <p className="text-sm text-zinc-400 mb-2">
            Please compress your project files into a .zip, .rar, or .tar.gz
            archive.
          </p>
          <Input
            id="zipFile"
            name="zipFile"
            type="file"
            accept=".zip,.rar,.tar.gz,application/zip,application/x-rar-compressed,application/gzip,application/x-tar"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          {formData.zipFile && (
            <p className="text-sm text-zinc-300 mt-2">
              Selected file: {formData.zipFile.name}
            </p>
          )}
        </LabelInputContainer>

        {/* Collaborators Section */}
        <div className="mb-6 p-4 border border-zinc-700 rounded-md">
          <h3 className="text-lg font-semibold mb-3">
            Collaborators (Optional)
          </h3>
          <div className="space-y-3">
            {collaborators.map((collab, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-zinc-700 p-3 rounded-md"
              >
                <span>
                  {collab.name} ({collab.email})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCollaborator(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <Input
              placeholder="Collaborator Name"
              type="text"
              value={newCollaborator.name}
              onChange={(e) =>
                setNewCollaborator((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="flex-1"
            />
            <Input
              placeholder="Collaborator Email"
              type="email"
              value={newCollaborator.email}
              onChange={(e) =>
                setNewCollaborator((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddCollaborator}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* For Sale Section */}
        <div className="mb-8 flex items-center space-x-3">
          <input
            id="isForSale"
            name="isForSale"
            type="checkbox"
            checked={formData.isForSale}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <Label htmlFor="isForSale" className="text-lg">
            Mark project for sale?
          </Label>
        </div>

        {formData.isForSale && (
          <LabelInputContainer className="mb-8">
            <Label htmlFor="price">Price (KES)</Label>
        {formData.forSale && (
          <LabelInputContainer>
            <Label htmlFor="price">Price (Ksh)</Label>
            <Input
              id="price"
              name="price"
              placeholder="e.g., 5000"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required={formData.isForSale}
              className="bg-zinc-900 text-white"
            />
          </LabelInputContainer>
        )}

        <button
        <LabelInputContainer>
          <Label htmlFor="file">Screenshot / File</Label>
          <Input
            id="file"
            type="file"
            name="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="bg-zinc-900 text-white"
          />
          {previewUrl && (
            <div className="mt-2">
              <p className="text-xs text-blue-300 mb-1">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-40 object-contain rounded border"
              />
            </div>
          )}
        </LabelInputContainer>

        <motion.button
          type="submit"
          className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          disabled={isLoading}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-slate-800 transition-colors duration-200">
            {isLoading ? "Uploading..." : "Upload Project"}
          </span>
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-zinc-800 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center border border-zinc-700"
          >
            <h2 className="text-xl font-bold">Confirm Upload</h2>
            <p className="mt-4 mb-6 text-zinc-300">
              Are you sure you want to upload this project?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
          className="relative flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow font-semibold transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Upload Project
        </motion.button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full text-white space-y-4">
            <h2 className="text-lg font-bold">Confirm Upload</h2>
            <div>
              <p>
                <strong>Title:</strong> {formData.title}
              </p>
              <p>
                <strong>Description:</strong> {formData.description}
              </p>
              <p>
                <strong>GitHub:</strong> {formData.githubLink}
              </p>
              {formData.demoLink && (
                <p>
                  <strong>Demo:</strong> {formData.demoLink}
                </p>
              )}
              {formData.forSale && (
                <p>
                  <strong>Price:</strong> Ksh {formData.price}
                </p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-600"
              >
                Confirm & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col w-full", className)}>{children}</div>
);

export default UploadProject;