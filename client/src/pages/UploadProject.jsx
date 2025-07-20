import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    githubLink: "",
    demoLink: "",
    forSale: false,
    price: "",
    file: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, file }));

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
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
    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          title: "",
          category: "",
          description: "",
          githubLink: "",
          demoLink: "",
          forSale: false,
          price: "",
          file: null,
        });
        setPreviewUrl(null);
        setSuccess(false);
        setLoading(false);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4 py-8 text-sm">
      <Link
        to="/"
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
          <Label
            htmlFor="title"
            className="text-sm text-white text-left m-0 p-0"
          >
            Project Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor="category"
            className="text-sm text-white text-left m-0 p-0"
          >
            Category
          </Label>
          <Input
            id="category"
            name="category"
            placeholder="Project category"
            value={formData.category}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor="description"
            className="text-sm text-white text-left m-0 p-0"
          >
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            placeholder="Project description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            className="bg-zinc-900 text-white border-none rounded-md shadow-inner px-3 py-2"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor="githubLink"
            className="text-sm text-white text-left m-0 p-0"
          >
            GitHub Link
          </Label>
          <Input
            id="githubLink"
            name="githubLink"
            type="url"
            placeholder="https://github.com/..."
            value={formData.githubLink}
            onChange={handleChange}
            required
            className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor="demoLink"
            className="text-sm text-white text-left m-0 p-0"
          >
            Demo Link
          </Label>
          <Input
            id="demoLink"
            name="demoLink"
            type="url"
            placeholder="https://demo-link.com"
            value={formData.demoLink}
            onChange={handleChange}
            className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="forSale"
              checked={formData.forSale}
              onChange={handleChange}
            />
            <span>Mark as for sale</span>
          </label>
        </LabelInputContainer>

        {formData.forSale && (
          <LabelInputContainer>
            <Label
              htmlFor="price"
              className="text-sm text-white text-left m-0 p-0"
            >
              Price (Ksh)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="e.g. 500"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
            />
          </LabelInputContainer>
        )}

        <LabelInputContainer>
          <Label
            htmlFor="file"
            className="text-sm text-white text-left m-0 p-0"
          >
            Screenshot / File
          </Label>
          <Input
            id="file"
            type="file"
            name="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
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
          disabled={loading}
          className={`relative flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow font-semibold transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          whileHover={!loading && { scale: 1.05 }}
          whileTap={!loading && { scale: 0.95 }}
          animate={
            !loading &&
            !success && {
              boxShadow: [
                "0 0 0px #f59e0b",
                "0 0 10px #f59e0b",
                "0 0 0px #f59e0b",
              ],
            }
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-4 w-4 text-white" />
              Uploaded!
            </>
          ) : (
            "Upload Project"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default UploadProject;

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>{children}</div>
  );
};
