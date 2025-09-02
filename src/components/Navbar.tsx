import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  sidebarWidth: number;
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarWidth, onMobileMenuToggle, showMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    if (location.pathname.includes('/property/')) return 'Property Details';
    if (location.pathname.includes('/add-property')) return 'Add Property';
    return 'Manage Properties';
  };

  const showBackButton = location.pathname !== '/';

  return (
    <div
      className="fixed top-0 right-0 bg-white border-b border-gray-200 z-30"
      style={{ left: sidebarWidth }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Back button for mobile */}
            {showBackButton && (
              <button
                onClick={() => navigate('/')}
                className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <h1 className="text-xl font-semibold text-text-primary">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93-3.93 3.93-3.93-3.93 3.93-3.93z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JA</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-text-primary">John Anderson</span>
              </div>
              <button className="p-1 rounded hover:bg-gray-100">
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Welcome message */}
        <div className="mt-2">
          <p className="text-sm text-text-muted">Welcome back, John Anderson</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;