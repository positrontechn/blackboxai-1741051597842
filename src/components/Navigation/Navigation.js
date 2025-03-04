import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home,
  Map,
  Users,
  AlertTriangle,
  User,
  Settings,
  Plus
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  // Navigation items
  const items = [
    {
      to: '/',
      icon: Home,
      label: 'Home',
      exact: true
    },
    {
      to: '/map',
      icon: Map,
      label: 'Map'
    },
    {
      to: '/community',
      icon: Users,
      label: 'Community'
    },
    {
      to: '/report',
      icon: Plus,
      label: 'Report',
      primary: true
    },
    {
      to: '/profile',
      icon: User,
      label: 'Profile'
    },
    {
      to: '/settings',
      icon: Settings,
      label: 'Settings'
    }
  ];

  // Hide navigation on certain routes
  const hideNavigation = [
    '/report/new',
    '/report/edit',
    '/camera',
    '/location-picker'
  ];

  if (hideNavigation.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => 
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative " + 
                (item.primary ? 
                  (isActive ?
                    "text-white bg-emerald-500 hover:bg-emerald-600" :
                    "text-white bg-emerald-500 hover:bg-emerald-600"
                  ) :
                  (isActive ?
                    "text-emerald-500 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" :
                    "text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400"
                  )
                )
              }
            >
              {item.primary && (
                <div className="absolute -top-6 inset-x-0 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              {!item.primary && (
                <item.icon className="w-6 h-6" />
              )}
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Animation styles
const styles = `
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .pb-safe {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  @media (display-mode: standalone) {
    .pb-safe {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-slide-up {
      animation: none;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Navigation;
