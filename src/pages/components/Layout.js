import { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Hamburger icon
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-[#191c36]">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar Toggle Button (when sidebar is hidden) */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-md shadow-md"
          aria-label="Open Sidebar"
        >
          <FaBars size={24} />
        </button>
      )}

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-[250px]' : 'ml-0'
        }`}
      >
        <Header isSidebarOpen={isSidebarOpen} />
        <main className="mt-16 p-6">{children}</main>
      </div>
    </div>
  );
}
