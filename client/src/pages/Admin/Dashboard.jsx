import React from 'react'

const Dashboard = () => {
  const HamburgerButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col justify-between w-8 h-6 cursor-pointer focus:outline-none"
  >

    <span className="block h-1 bg-gray-800 rounded"></span>
    <span className="block h-1 bg-gray-800 rounded"></span>
    <span className="block h-1 bg-gray-800 rounded"></span>
  </button>
);
  const Sidebar = ({ isOpen }) => (
  <div
    className={`bg-gray-800 text-white w-64 p-4 fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <h2 className="text-xl mb-4">Admin Panel</h2>
    <ul className="space-y-2">
      <li>📊 Dashboard</li>
      <li>🛍️ Merchandise</li>
      <li>🧑‍💼 Project Moderation</li>
    </ul>
  </div>
);
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className='flex w-screen h-screen'>
      <div
        className='flex flex-col bg-gray-100 w-64 p-4'
        style={{ position: 'fixed', top: 0, left: 0, height: '100vh' }}
      >
        <img src="https://img.freepik.com/premium-vector/letter-monogram-initial-elegant-logo_1172241-2648.jpg?w=2000" alt="Moringa Admin" className='mb-4' />
        <HamburgerButton onClick={() => setSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      
    </div>
  )
}

export default Dashboard
