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

  // Check authentication on component mount
//   useEffect(() => {
//     const authToken = heade
//     console.log('authToken:', authToken); // Debugging line
//     if (!authToken) {
//       router.push('/admin/login'); // Redirect to login if token is missing
//     }
//   }, [router]);

  // Responsive sidebar toggle
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
    // Remove the authToken cookie manually
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin', // Ensure cookies are sent with the request
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
    <div className="relative min-h-screen bg-[#191c36] text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-[250px] bg-[#04250c]`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
          <div className="font-semibold">Admin Panel</div>
          <button onClick={toggleSidebar} className="text-white hover:text-gray-300">
            <RxCross1 className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 ${
                router.pathname === item.href ? 'bg-gray-700' : ''
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
        className={`fixed top-0 right-0 z-10 w-full h-14 bg-[#0f1233] px-4 flex items-center justify-between transition-all duration-300 ${
          isSidebarOpen && !isMobile ? 'md:pl-[250px]' : 'pl-4'
        }`}
      >
        {!isSidebarOpen && (
          <button onClick={toggleSidebar} className="text-white">
            <FaBars className="h-5 w-5" />
          </button>
        )}
        <div className="capitalize text-lg font-semibold">
          {router.pathname.split('/').pop().replace('-', ' ')}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white hover:text-gray-300">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 mt-14 ${
          isSidebarOpen && !isMobile ? 'md:ml-[250px]' : ''
        } p-6`}
      >
        {children}
      </div>
    </div>
  );
}
