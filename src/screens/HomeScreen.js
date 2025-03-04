import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle,
  Map,
  Camera,
  Compass,
  Shield,
  Users,
  ChevronRight,
  Leaf,
  Globe
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import useReport from '../hooks/useReport';
import useLocation from '../hooks/useLocation';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { reports, metrics } = useReport({ includeMetrics: true });
  const { currentLocation } = useLocation();

  // Main actions
  const mainActions = [
    {
      icon: AlertTriangle,
      label: 'Report Incident',
      description: 'Submit a new environmental incident report',
      color: 'bg-red-500',
      onClick: () => navigate('/report')
    },
    {
      icon: Map,
      label: 'View Map',
      description: 'Explore reported incidents on the map',
      color: 'bg-blue-500',
      onClick: () => navigate('/map')
    }
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Camera,
      label: 'Quick Photo',
      description: 'Take a quick photo report',
      color: 'bg-purple-500',
      onClick: () => navigate('/report?mode=quick')
    },
    {
      icon: Compass,
      label: 'Near Me',
      description: 'View incidents in your area',
      color: 'bg-emerald-500',
      onClick: () => navigate('/map?nearby=true')
    }
  ];

  // Feature highlights
  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a network of environmental guardians'
    },
    {
      icon: Leaf,
      title: 'Environmental Impact',
      description: 'Help protect our natural resources'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Report incidents from anywhere'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 
        dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <Logo variant="dark" size="xl" animated className="mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white 
              mb-4">
              Environmental Incident Reporting
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl 
              mx-auto">
              Help protect our environment by reporting and tracking incidents in 
              your area. Together we can make a difference.
            </p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {mainActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border 
                border-gray-200 dark:border-gray-700 hover:border-emerald-500 
                dark:hover:border-emerald-500 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${action.color} 
                  group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 
                    dark:text-white mb-1">
                    {action.label}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 
                  group-hover:text-emerald-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 
                rounded-xl border border-gray-200 dark:border-gray-700 
                hover:border-emerald-500 dark:hover:border-emerald-500 
                transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color} 
                group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 
                group-hover:text-emerald-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Why Use GreenSentinel?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border 
                border-gray-200 dark:border-gray-700"
            >
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 
                rounded-lg w-fit mb-4">
                <feature.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
