import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Home,
  Map,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import Logo from '../components/Logo/Logo';

const NotFoundScreen = () => {
  const navigate = useNavigate();

  // Quick actions for navigation
  const quickActions = [
    {
      icon: Home,
      label: 'Go to Home',
      description: 'Return to the main page',
      onClick: () => navigate('/')
    },
    {
      icon: Map,
      label: 'View Map',
      description: 'Explore incidents on the map',
      onClick: () => navigate('/map')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <Logo variant="dark" size="lg" className="mb-8" />

        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl 
            flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -right-2 -top-2">
            <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center 
              justify-center">
              <span className="text-sm font-bold text-white">404</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center max-w-sm mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved. 
            Please check the URL or try one of the options below.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 w-full max-w-lg">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 
                rounded-xl border border-gray-200 dark:border-gray-700 
                hover:border-emerald-500 dark:hover:border-emerald-500 
                transition-colors group text-left"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg 
                group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 
                transition-colors">
                <action.icon className="w-5 h-5 text-gray-500 
                  group-hover:text-emerald-500 transition-colors" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {action.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Help Link */}
        <button
          onClick={() => navigate('/help')}
          className="mt-8 flex items-center gap-2 text-sm text-gray-500 
            dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Need help? Contact support</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundScreen;
