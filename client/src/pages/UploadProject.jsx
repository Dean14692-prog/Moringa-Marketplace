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
    isForSale: false, // Corresponds to isForSale in backend
    price: "", // Corresponds to price in backend
    zipFile: null, // Corresponds to zipFile in backend for the actual file upload
    category: "web", // New field
    techStack: "", // New field
    // Removed 'file' and 'demoLink' from state to align with backend keys more directly
    // and to avoid confusion. 'zipFile' will hold the actual file object.
  });

  const [previewUrl, setPreviewUrl] = useState(null); // For image preview
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({
    name: "",
    email: "",
  });

  // Redirect to login if token is missing
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.warning("You must log in to upload a project.");
      navigate("/login");
    }
  }, [navigate]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file })); // Use [name] here for 'zipFile'
      // If you want to show a preview only for image files within the zip, you can
      // refine this logic. For now, this is for a general file preview if applicable.
      if (file?.type?.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null); // Clear preview if not an image
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddCollaborator = () => {
    if (
      newCollaborator.name.trim() !== "" &&
      newCollaborator.email.trim() !== ""
    ) {
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator({ name: "", email: "" });
    } else {
      toast.error("Please enter both name and email for the collaborator.");
    }
  };

  const handleRemoveCollaborator = (index) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  // Handle submit click (initial validation and confirmation)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.githubLink) {
      toast.error(
        "Please fill in all required fields (Title, Description, GitHub Link)."
      );
      return;
    }

    if (
      formData.isForSale &&
      (formData.price === "" || parseFloat(formData.price) <= 0)
    ) {
      toast.error(
        "Please set a valid price for your project if it's for sale."
      );
      return;
    }

    setShowConfirm(true);
  };

  // Confirm and upload project (final submission)
  const handleConfirmUpload = async () => {
    setIsLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Missing authentication. Please log in.");
      navigate("/login");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("githubLink", formData.githubLink); // Correct: Matches backend 'githubLink'
    data.append("livePreviewUrl", formData.livePreviewUrl || ""); // Correct: Matches backend 'livePreviewUrl'
    data.append("isForSale", formData.isForSale.toString()); // Correct: Matches backend 'isForSale'
    data.append("price", formData.price || "0");
    data.append("category", formData.category);
    data.append("techStack", formData.techStack); // Correct: Matches backend 'techStack'
    data.append("collaborators", JSON.stringify(collaborators)); // Send collaborators as JSON string

    if (formData.zipFile) {
      // Using 'zipFile' for the actual file input
      data.append("zipFile", formData.zipFile); // Correct: Matches backend 'zipFile' for the file itself
    }

    try {
      const res = await fetch("http://127.0.0.1:5555/api/projects/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Important: Do NOT set Content-Type header when sending FormData,
          // the browser sets it automatically with the correct boundary.
        },
        body: data,
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          toast.error("Session expired or unauthorized. Please log in again.");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }
        const errData = await res.json();
        throw new Error(errData.msg || "Upload failed");
      }

      const result = await res.json();
      toast.success("Project uploaded successfully!");
      setFormData({
        // Reset form after successful upload
        title: "",
        description: "",
        githubLink: "",
        livePreviewUrl: "",
        isForSale: false,
        price: "",
        zipFile: null,
        category: "web",
        techStack: "",
      });
      setPreviewUrl(null);
      setCollaborators([]); // Clear collaborators
      setNewCollaborator({ name: "", email: "" });
      setShowConfirm(false);

      if (onProjectUpload) {
        onProjectUpload(result);
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error("Upload failed: " + error.message);
      console.error("UPLOAD ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4 py-8 text-sm relative">
      {/* Back to dashboard
      <div className="absolute top-4 left-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xs text-white px-2 py-1 rounded hover:bg-zinc-800 transition"
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
      </div> */}

      <h1 className="text-xl font-bold mb-4 text-white">Upload New Project</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md w-full text-white"
      >
        <LabelInputContainer>
          <Label htmlFor="title">Project Title *</Label>
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
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            name="description"
            placeholder="Project description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            className="bg-zinc-900 text-white rounded px-3 py-2"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="githubLink">GitHub Link *</Label>
          <Input
            id="githubLink"
            name="githubLink" // Name must match formData key and backend expected key
            type="url"
            placeholder="https://github.com/your-project"
            value={formData.githubLink}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="livePreviewUrl">Live Preview URL (Optional)</Label>
          <Input
            id="livePreviewUrl"
            name="livePreviewUrl" // Name must match formData key and backend expected key
            type="url"
            placeholder="https://your-live-demo.com"
            value={formData.livePreviewUrl}
            onChange={handleChange}
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
            className="bg-zinc-900 text-white rounded px-3 py-2 w-full"
          >
            <option value="web">Web Development</option>
            <option value="mobile">Mobile Development</option>
            <option value="data">Data Science/AI</option>
            <option value="design">UI/UX Design</option>
            <option value="other">Other</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="techStack">Tech Stack (Comma-separated)</Label>
          <Input
            id="techStack"
            name="techStack" // Name must match formData key and backend expected key
            type="text"
            placeholder="React, Flask, PostgreSQL"
            value={formData.techStack}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

        {/* Collaborators Section */}
        <div className="space-y-2">
          <Label>Collaborators (Optional)</Label>
          {collaborators.map((collab, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm bg-zinc-800 p-2 rounded"
            >
              <span className="flex-grow">
                {collab.name} ({collab.email})
              </span>
              <button
                type="button"
                onClick={() => handleRemoveCollaborator(index)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Name"
              value={newCollaborator.name}
              onChange={(e) =>
                setNewCollaborator({ ...newCollaborator, name: e.target.value })
              }
              className="flex-grow bg-zinc-900 text-white"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newCollaborator.email}
              onChange={(e) =>
                setNewCollaborator({
                  ...newCollaborator,
                  email: e.target.value,
                })
              }
              className="flex-grow bg-zinc-900 text-white"
            />
            <button
              type="button"
              onClick={handleAddCollaborator}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isForSale"
            name="isForSale" // Name must match formData key and backend expected key
            type="checkbox"
            checked={formData.isForSale}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out bg-zinc-800 border-zinc-700 rounded"
          />
          <Label htmlFor="isForSale">Mark as for sale?</Label>
        </div>

        {formData.isForSale && (
          <LabelInputContainer>
            <Label htmlFor="price">Price (KSH) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="e.g., 5000"
              value={formData.price}
              onChange={handleChange}
              required={formData.isForSale}
              className="bg-zinc-900 text-white"
            />
          </LabelInputContainer>
        )}

        <LabelInputContainer>
          <Label htmlFor="zipFile">Project File (ZIP only) *</Label>
          <Input
            id="zipFile"
            name="zipFile" // Name must match formData key and backend expected key for the file
            type="file"
            accept=".zip" // Suggest only zip files
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white cursor-pointer file:text-white file:bg-blue-600 file:border-none file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-blue-700"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="File preview"
              className="mt-2 max-w-full h-auto rounded"
            />
          )}
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Project"} &rarr;
          <BottomGradient />
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-zinc-900 p-6 rounded-lg shadow-xl max-w-sm w-full text-white space-y-4"
          >
            <h2 className="text-xl font-bold">Confirm Upload</h2>
            <p>Are you sure you want to upload this project?</p>
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

export default UploadProject;
