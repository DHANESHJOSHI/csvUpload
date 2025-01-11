import { Card } from '@/components/ui/card';
import { FaTachometerAlt, FaUser, FaCog } from 'react-icons/fa';

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`fixed top-0 left-0 z-20 w-[250px] bg-gray-800 text-white h-full ${isOpen ? 'block' : 'hidden'}`}>
      <Card className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Admin Panel</h3>
          <button onClick={toggleSidebar} className="text-white">
            {isOpen ? 'Hide' : 'Show'}
          </button>
        </div>
        <ul className="mt-6 space-y-4">
          <li>
            <a href="/admin/dashboard" className="flex items-center space-x-2">
              <FaTachometerAlt />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/admin/users" className="flex items-center space-x-2">
              <FaUser />
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="/admin/settings" className="flex items-center space-x-2">
              <FaCog />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </Card>
    </div>
  );
}
