import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaFile, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-0 z-20 w-[250px] h-full transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <Card className="h-full border-none rounded-none bg-[#04250c] backdrop-blur-xl text-white">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Admin Panel</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <RxCross1 className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="py-4">
            <nav className="grid gap-1">
              <Button variant={pathname === '/admin/dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                <a href="/admin/dashboard">
                  <FaTachometerAlt className="h-4 w-4" />
                  Dashboard
                </a>
              </Button>
              <Button variant={pathname === '/admin/scholarship' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                <a href="/admin/scholarship">
                  <FaUser className="h-4 w-4" />
                  Scholarships Data
                </a>
              </Button>

              <Button variant={pathname === '/admin/upload' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" asChild>
                <a href="/admin/upload">
                  <FaFile className="h-4 w-4" />
                  CSV Upload
                </a>
              </Button>
            </nav>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}