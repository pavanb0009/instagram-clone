'use client';

import { usePathname } from 'next/navigation';
import SideBar from './SideBar';

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const routesWithoutSidebar = ['/signin', '/signup', "/forgotpassword"]; // Add more routes as needed

  const showSidebar = !routesWithoutSidebar.includes(pathname);

  return (
    <div className="flex min-h-screen">
      {showSidebar && <SideBar />}
      <main className="flex-1  md:pl-20 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}