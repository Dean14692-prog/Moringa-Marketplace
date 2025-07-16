import { useState } from "react";

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

    const submission = new FormData();
    submission.append("title", formData.title);
    submission.append("category", formData.category);
    submission.append("description", formData.description);
    submission.append("githubLink", formData.githubLink);
    submission.append("demoLink", formData.demoLink);
    submission.append("forSale", formData.forSale);
    if (formData.forSale) {
      submission.append("price", formData.price);
    }
    if (formData.file) {
      submission.append("file", formData.file);
    }

    // Add status so backend knows it's for review
    submission.append("status", "Pending");

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        body: submission,
      });

      if (!response.ok) throw new Error("Upload failed");

      alert(" Project submitted for admin approval.");
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
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
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
              <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow"
        >
          Upload Project
        </button>
      </form>
    </div>
  );
};

export default UploadProject;
