import { useState, useEffect } from 'react';
import { FaBars, FaSignOutAlt, FaTachometerAlt, FaUser, FaFile } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function Navigation({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateMobileView = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    updateMobileView();
    window.addEventListener('resize', updateMobileView);

    return () => window.removeEventListener('resize', updateMobileView);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async() => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Logged Out Successfully',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.href = '/admin/login';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Logout failed. Please try again!'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while logging out!'
      });
    }
  };

  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: <FaTachometerAlt className="h-4 w-4" />,
    },
    {
      href: '/admin/scholarship',
      label: 'Scholarships Data',
      icon: <FaUser className="h-4 w-4" />,
    },
    {
      href: '/admin/upload',
      label: 'CSV Upload',
      icon: <FaFile className="h-4 w-4" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-gray-200">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full transition-all duration-500 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-[250px] bg-gradient-to-b from-[#1b263b] to-[#0d1b2a] backdrop-blur-lg shadow-xl`}
      >
        <div className="flex h-16 items-center justify-between border-b border-cyan-800/30 px-8">
          <div className="font-bold text-xl tracking-wider text-cyan-100 animate-pulse">Admin Panel</div>
          <button onClick={toggleSidebar} className="text-cyan-100 hover:text-cyan-400 transition-colors duration-300">
            <RxCross1 className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-6 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3 rounded-md hover:bg-cyan-900/30 mb-2 transition-all duration-300 text-cyan-100 hover:scale-105 ${
                router.pathname === item.href ? 'bg-cyan-800/40 shadow-lg' : ''
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Header */}
      <div
        className={`fixed top-0 right-0 z-10 w-full h-16 bg-gradient-to-r from-[#1b263b] to-[#415a77] shadow-lg px-6 flex items-center justify-between transition-all duration-300 backdrop-blur-md ${
          isSidebarOpen && !isMobile ? 'md:pl-[250px]' : 'pl-4'
        }`}
      >
        {!isSidebarOpen && (
          <button onClick={toggleSidebar} className="text-cyan-100 hover:text-cyan-400 p-2 transition-colors duration-300">
            <FaBars className="h-5 w-5" />
          </button>
        )}
        <div className="capitalize text-xl font-bold tracking-wider text-cyan-100 ml-4">
          {router.pathname.split('/').pop().replace('-', ' ')}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 text-cyan-100 hover:text-cyan-400 px-4 py-2 rounded-md transition-all duration-300 hover:bg-cyan-900/30 hover:scale-105">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 mt-16 ${
          isSidebarOpen && !isMobile ? 'md:ml-[250px]' : ''
        } p-6 bg-gradient-to-br from-[#1b263b]/50 via-[#415a77]/30 to-[#0d1b2a]/50`}
      >
        {children}
      </div>
    </div>
  );
}