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
    demoLink: "", // Corresponds to livePreviewUrl
    forSale: false, // Corresponds to isForSale
    price: "", // Corresponds to price
    file: null, // Corresponds to file
    category: "web", // New field
    techStack: "", // New field
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if token is missing
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Using access_token as per original
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
      setFormData((prev) => ({ ...prev, file }));
      if (file?.type?.startsWith("image/")) {
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

  // Handle submit click
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.githubLink) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.forSale && !formData.price) {
      toast.error("Please set a price for your project");
      return;
    }

    setShowConfirm(true);
  };

  // Confirm and upload project
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
    data.append("github_link", formData.githubLink);
    data.append("live_preview_url", formData.demoLink || "");
    data.append("isForSale", formData.forSale.toString());
    data.append("price", formData.price || "0");
    data.append("category", formData.category); // Appending new field
    data.append("tech_stack", formData.techStack); // Appending new field

    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const res = await fetch("http://127.0.0.1:5555/api/projects/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
        title: "",
        description: "",
        githubLink: "",
        demoLink: "",
        forSale: false,
        price: "",
        file: null,
        category: "web",
        techStack: "",
      });
      setPreviewUrl(null);
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
      {/* Back to dashboard */}
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
      </div>

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
            name="githubLink"
            type="url"
            placeholder="https://github.com/..."
            value={formData.githubLink}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="demoLink">Live Preview URL (Optional)</Label>
          <Input
            id="demoLink"
            name="demoLink"
            type="url"
            placeholder="https://demo.com"
            value={formData.demoLink}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          >
            <option value="web">Web Development</option>
            <option value="mobile">Mobile Development</option>
            <option value="data_science">Data Science</option>
            <option value="ai_ml">AI/ML</option>
            <option value="other">Other</option>
          </select>
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
          <Input
            id="techStack"
            name="techStack"
            type="text"
            placeholder="React, Flask, PostgreSQL"
            value={formData.techStack}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="forSale"
              checked={formData.forSale}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Mark as for sale</span>
          </label>
        </LabelInputContainer>

        {formData.forSale && (
          <LabelInputContainer>
            <Label htmlFor="price">Price (Ksh) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="e.g. 500"
              value={formData.price}
              onChange={handleChange}
              required
              className="bg-zinc-900 text-white"
              min="0"
            />
          </LabelInputContainer>
        )}

        <LabelInputContainer>
          <Label htmlFor="file">Screenshot / File</Label>
          <Input
            id="file"
            type="file"
            name="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="bg-zinc-900 text-white file:text-white file:bg-amber-500 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
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
          className="relative flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow font-semibold transition w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upload Project
        </motion.button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full text-white space-y-4">
            <h2 className="text-lg font-bold">Confirm Upload</h2>
            <div className="space-y-2">
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
                  <strong>Live Preview:</strong> {formData.demoLink}
                </p>
              )}
              {formData.category && (
                <p>
                  <strong>Category:</strong> {formData.category}
                </p>
              )}
              {formData.techStack && (
                <p>
                  <strong>Tech Stack:</strong> {formData.techStack}
                </p>
              )}
              {formData.forSale && (
                <p>
                  <strong>Price:</strong> Ksh {formData.price}
                </p>
              )}
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
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 transition flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Confirm & Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadProject;

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col w-full gap-1", className)}>{children}</div>
);