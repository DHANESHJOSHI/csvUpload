import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`${isSidebarOpen ? 'ml-[250px]' : 'ml-0'}`}>
        <Header isSidebarOpen={isSidebarOpen} />
        <main className="mt-16 p-6">{children}</main>
      </div>
    </div>
  );
}
