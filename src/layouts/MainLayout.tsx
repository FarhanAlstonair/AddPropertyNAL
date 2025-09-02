import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSidebar } from '../hooks/useSidebar';

const MainLayout: React.FC = () => {
  const { isExpanded, isMobile, toggle } = useSidebar();
  const sidebarWidth = isExpanded ? 256 : 64;

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar isExpanded={isExpanded} onToggle={toggle} />
      
      {/* Mobile Overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Navbar */}
        <Navbar
          sidebarWidth={isMobile ? 0 : sidebarWidth}
          onMobileMenuToggle={toggle}
          showMobileMenu={isExpanded}
        />

        {/* Page Content */}
        <main className="pt-20 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;