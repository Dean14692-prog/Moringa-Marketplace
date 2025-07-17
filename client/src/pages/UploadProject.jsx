import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submission = new FormData();
    submission.append("title", formData.title);
    submission.append("category", formData.category);
    submission.append("description", formData.description);
    submission.append("githubLink", formData.githubLink);
    submission.append("demoLink", formData.demoLink);
    submission.append("forSale", formData.forSale);
    if (formData.forSale) submission.append("price", formData.price);
    if (formData.file) submission.append("file", formData.file);
    submission.append("status", "Pending");

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        body: submission,
      });

      if (!res.ok) throw new Error("Upload failed");

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
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Upload New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category (e.g. FinTech)"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows="4"
          required
        />

        <input
          type="url"
          name="githubLink"
          placeholder="GitHub Repository URL"
          value={formData.githubLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="url"
          name="demoLink"
          placeholder="Live Demo / Video Link"
          value={formData.demoLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="forSale"
            checked={formData.forSale}
            onChange={handleChange}
          />
          Mark as for sale
        </label>

        {formData.forSale && (
          <input
            type="number"
            name="price"
            placeholder="Project Price (Ksh)"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min="0"
          />
        )}

        <div>
          <label className="block mb-1 font-medium">Upload Screenshot or File:</label>
          <input
            type="file"
            name="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-blue-300 mb-1">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded border"
              />
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`relative flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded shadow font-semibold transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          whileHover={!loading && { scale: 1.05 }}
          whileTap={!loading && { scale: 0.95 }}
          animate={
            !loading &&
            !success && {
              boxShadow: ["0 0 0px #f59e0b", "0 0 10px #f59e0b", "0 0 0px #f59e0b"],
            }
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <CheckCircle className="h-5 w-5 text-white" />
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
