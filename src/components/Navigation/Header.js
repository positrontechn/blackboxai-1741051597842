import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Logo from '../Logo/Logo';

const Header = ({
  title,
  showBack = false,
  showSearch = false,
  showNotifications = false,
  showMenu = false,
  onBack,
  onSearch,
  rightElement,
  className = ''
}) => {
  const navigate = useNavigate();

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <header className={"fixed top-0 inset-x-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 " + className}>
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          {title ? (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          ) : (
            <Logo variant="dark" size="sm" />
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              onClick={() => {/* Handle search toggle */}}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Search className="w-6 h-6" />
            </button>
          )}

          {showNotifications && (
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
            >
              <Bell className="w-6 h-6" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}

          {showMenu && (
            <button
              onClick={() => {/* Handle menu toggle */}}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {rightElement}
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="h-0 overflow-hidden transition-all duration-200">
          <div className="px-4 py-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Menu (Expandable) */}
      {showMenu && (
        <div className="h-0 overflow-hidden transition-all duration-200">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-gray-700 dark:text-gray-300">Profile</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-gray-700 dark:text-gray-300">Settings</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                navigate('/login');
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600"
            >
              <span>Sign Out</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
