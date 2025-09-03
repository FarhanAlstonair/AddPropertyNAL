import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';

interface NavbarProps {
  sidebarWidth: number;
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarWidth, onMobileMenuToggle, showMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

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

          <div className="flex items-center space-x-2">
            {/* Mobile Quick Actions */}
            {isMobile && (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="p-2 rounded-lg hover:bg-gray-100 text-text-muted hover:text-text-primary"
                  title="Dashboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate('/add-property')}
                  className="p-2 rounded-lg hover:bg-gray-100 text-text-muted hover:text-primary"
                  title="Add Property"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </>
            )}

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JA</span>
              </div>
              {!isMobile && (
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-text-primary">John Anderson</span>
                </div>
              )}
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