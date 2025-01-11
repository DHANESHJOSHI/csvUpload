import { FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Header({ isSidebarOpen }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('authToken');
    router.push('/admin/login');
  };

  return (
    <div
      className={`fixed top-0 ${isSidebarOpen ? 'left-[250px]' : 'left-0'} right-0 bg-gray-800 text-white p-4 z-10 transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">Dashboard</div>
        <button onClick={handleLogout} className="flex items-center space-x-2">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
