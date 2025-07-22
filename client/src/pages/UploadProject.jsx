import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const UploadProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    demoLink: "",
    forSale: false,
    price: "",
    file: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
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

  const handleConfirmUpload = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to upload projects");
        navigate("/login");
        return;
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("category", "web");
      form.append("description", formData.description);
      form.append("github_link", formData.githubLink);
      form.append("live_preview_url", formData.demoLink || "");
      form.append("isForSale", formData.forSale.toString());
      form.append("price", formData.price || "0");
      form.append("tech_stack", "React, Flask"); // Default or make dynamic

      if (formData.file) {
        form.append("file", formData.file);
      }

      const res = await fetch("http://127.0.0.1:5000/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Upload failed");
      }

      const data = await res.json();
      toast.success("Project uploaded successfully! Awaiting admin approval.");

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

      navigate("/dashboard");
    } catch (error) {
      toast.error("Upload failed: " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4 py-8 text-sm relative">
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
          <Label htmlFor="demoLink">Demo Link</Label>
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
              required={formData.forSale}
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
                  <strong>Demo:</strong> {formData.demoLink}
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
};

export default UploadProject;

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col w-full gap-1", className)}>{children}</div>
);

