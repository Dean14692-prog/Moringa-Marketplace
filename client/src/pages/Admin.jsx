import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { HiMenuAlt2 } from "react-icons/hi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Modal from "../components/Modal";

function Admin() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
   
  const admin = { name: "Moringa School Admin" };

  return (
    <div className="min-h-screen bg-[#deeaee] flex font-sans">
      <AdminSidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        admin={admin}
      />
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        <header className="bg-[#0D1B2A] text-[#deeaee] px-6 py-4 flex items-center gap-4 shadow-md sticky top-0 z-20">
          <button
            className="md:hidden mr-2 p-2 rounded hover:bg-[#1C2541] focus:outline-none"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Open sidebar"
          >
            <HiMenuAlt2 size={28} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide flex-1">Moringa Admin Panel</h1>
          <div className="flex items-center gap-2">
            <span className="bg-[#1C2541] px-3 py-1 rounded-full text-xs font-semibold">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-10 bg-[#deeaee]">
          {active === "dashboard" && <DashboardPanel />}
          {active === "projects" && <ProjectModerationPanel />}
          {active === "merch" && <MerchandiseManagerPanel />}
          {active === "analytics" && <AnalyticsPanel />}
        </main>
        <footer className="text-center py-4 text-xs text-[#888] bg-transparent">Moringa Admin</footer>
      </div>
    </div>
  );
}

function DashboardSummaryCards() {
  const [summary, setSummary] = useState({ activeProjects: 0, pendingApprovals: 0, merchSales: 0 });
  useEffect(() => {
    fetch('/api/admin/summary')
      .then(res => res.ok ? res.json() : { activeProjects: 0, pendingApprovals: 0, merchSales: 0 })
      .then(data => setSummary(data))
      .catch(() => setSummary({ activeProjects: 0, pendingApprovals: 0, merchSales: 0 }));
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-400 flex flex-col items-center">
        <span className="text-2xl font-bold text-[#1C2541]">{summary.activeProjects}</span>
        <span className="text-xs text-[#888] mt-1">Active Projects</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-400 flex flex-col items-center">
        <span className="text-2xl font-bold text-[#1C2541]">{summary.pendingApprovals}</span>
        <span className="text-xs text-[#888] mt-1">Pending Approvals</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-400 flex flex-col items-center">
        <span className="text-2xl font-bold text-[#1C2541]">Ksh {summary.merchSales.toLocaleString()}</span>
        <span className="text-xs text-[#888] mt-1">Merch Sales</span>
      </div>
    </div>
  );
}

function DashboardPanel() {
  const [data, setData] = useState([
    { month: "Feb", submissions: 0 },
    { month: "Mar", submissions: 0 },
    { month: "Apr", submissions: 0 },
    { month: "May", submissions: 0 },
    { month: "Jun", submissions: 0 },
    { month: "Jul", submissions: 0 }
  ]);

  return (
    <section className="mt-2">
      <DashboardSummaryCards />
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-[#1C2541]">Project Submissions (last 6 months)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 12, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9100" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF9100" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#1C2541" fontSize={12}/>
            <YAxis stroke="#1C2541" fontSize={12}/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="submissions" stroke="#FF9100" fillOpacity={1} fill="url(#colorSubmissions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ProjectModerationPanel() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);  
  const [rejectionComment, setRejectionComment] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const handleApprove = (idx) => {
    setProjects(projects => projects.map((p, i) => i === idx ? { ...p, status: 'approved' } : p));
  };
  const handleReject = (idx) => {
    setProjects(projects => projects.map((p, i) => i === idx ? { ...p, status: 'rejected' } : p));
  };

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-[#1C2541] mb-4 flex items-center gap-2">
        <span role="img" aria-label="Moderation">✅</span> Project Moderation
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#f7fafc] rounded-lg">
          <thead>
            <tr className="text-[#1C2541] text-sm font-semibold">
              <th className="p-3">Title</th>
              <th className="p-3">Team</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Demo</th>
              <th className="p-3">Repo</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td className="p-3">{project.title}</td>
                <td className="p-3">{project.team}</td>
                <td className="p-3">{project.tags}</td>
                <td className="p-3">{project.demo}</td>
                <td className="p-3">{project.repo}</td>
                <td className="p-3">{project.status}</td>
                <td className="p-3 flex gap-2">
                  {project.status === 'pending' ? (
                    <>
                      <button
                        className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
                        onClick={() => handleApprove(index)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                        onClick={() => handleReject(index)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[#bbb]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {/* modal code for project details, approve/reject, etc */}
      </Modal>
    </section>
  );
}

function MerchandiseManagerPanel() {
  const [merchandise, setMerchandise] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetch('/api/admin/merchandise')
      .then(res => res.json())
      .then(data => setMerchandise(data));
  }, []);

  const [addModalOpen, setAddModalOpen] = useState(false);
const [newMerch, setNewMerch] = useState({ name: '', stock: '', price: '', image: null });
const [imagePreview, setImagePreview] = useState(null);

const handleAdd = () => {
  setAddModalOpen(true);
};

const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    setNewMerch({ ...newMerch, image: file });
    setImagePreview(URL.createObjectURL(file));
  }
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    setNewMerch({ ...newMerch, image: file });
    setImagePreview(URL.createObjectURL(file));
  }
};

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setNewMerch({ ...newMerch, [name]: value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  setMerchandise([
    ...merchandise,
    {
      id: Date.now(),
      name: newMerch.name,
      stock: newMerch.stock,
      price: Number(newMerch.price),
      image: imagePreview,
    },
  ]);
  setAddModalOpen(false);
  setNewMerch({ name: '', stock: '', price: '', image: null });
  setImagePreview(null);
};

const handleDelete = (id) => {
  // Delete merchandise logic
};

const handleModalClose = () => {
  setAddModalOpen(false);
  setNewMerch({ name: '', stock: '', price: '', image: null });
  setImagePreview(null);
};

return (
    <>
      <Modal open={addModalOpen} onClose={handleModalClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-bold mb-2">Add Merchandise</h3>
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={newMerch.name}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={newMerch.stock}
                onChange={handleFormChange}
                required
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Price (Ksh)</label>
              <input
                type="number"
                name="price"
                value={newMerch.price}
                onChange={handleFormChange}
                required
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Product Image</label>
            <div
              className="w-full h-28 border-2 border-dashed rounded flex items-center justify-center bg-[#f7fafc] cursor-pointer hover:border-orange-400 transition relative"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-24 object-contain" />
              ) : (
                <span className="text-[#888]">Drag & drop image here or click to select</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute opacity-0 w-full h-full cursor-pointer"
                style={{ left: 0, top: 0 }}
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleModalClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600">Add</button>
          </div>
        </form>
      </Modal>
      <section className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#1C2541] mb-4 flex items-center gap-2">
          <span role="img" aria-label="Merch">🛍️</span> Merchandise Manager
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow" onClick={handleAdd}>Add Merchandise</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#f7fafc] rounded-lg">
            <thead>
              <tr className="text-[#1C2541] text-sm font-semibold">
                <th className="p-3">Picture</th>
                <th className="p-3">Product</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchandise.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-[#888] py-8">No merchandise found</td>
                </tr>
              ) : (
                merchandise.map((item, idx) => (
                  <tr key={item.id || idx} className="text-[#1C2541]">
                    <td className="p-3"><img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="rounded" /></td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.stock}</td>
                    <td className="p-3">Ksh {item.price.toLocaleString()}</td>
                    <td className="p-3 flex gap-2">
                      <button className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AnalyticsPanel() {
  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-[#1C2541] mb-4 flex items-center gap-2">
        <span role="img" aria-label="Analytics">📈</span> Analytics
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#deeaee] rounded-lg p-4 flex flex-col items-start border-l-4 border-[#FF9100]">
          <span className="text-[#1C2541] font-bold text-lg mb-1">68</span>
          <span className="text-sm text-[#888]">Most Viewed Project</span>
        </div>
        <div className="bg-[#deeaee] rounded-lg p-4 flex flex-col items-start border-l-4 border-[#FF9100]">
          <span className="text-[#1C2541] font-bold text-lg mb-1">12</span>
          <span className="text-sm text-[#888]">Featured Projects</span>
        </div>
        <div className="bg-[#deeaee] rounded-lg p-4 flex flex-col items-start border-l-4 border-[#FF9100]">
          <span className="text-[#1C2541] font-bold text-lg mb-1">5d</span>
          <span className="text-sm text-[#888]">Avg Approval Time</span>
        </div>
      </div>
      <div className="bg-[#f7fafc] rounded-lg p-6 min-h-[180px] flex items-center justify-center border border-[#e0e1dd]">
        <span className="text-[#888]">[Analytics charts and breakdowns will go here]</span>
      </div>
    </section>
  );
}

export default Admin;
