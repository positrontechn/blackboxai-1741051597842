import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Edit,
  LogOut,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Header from '../components/Navigation/Header';
import useReport from '../hooks/useReport';
import { REPORT_TYPES } from '../constants';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { reports, metrics } = useReport({ includeMetrics: true });
  const [editing, setEditing] = useState(false);

  // Mock user data - replace with actual user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    verified: true,
    points: 1250,
    joinedDate: '2023-01-01',
    avatar: null
  };

  // Stats sections
  const stats = [
    {
      label: 'Reports',
      value: reports.length,
      icon: AlertTriangle,
      color: 'text-blue-500'
    },
    {
      label: 'Verified',
      value: reports.filter(r => r.verified).length,
      icon: CheckCircle,
      color: 'text-emerald-500'
    },
    {
      label: 'Pending',
      value: reports.filter(r => !r.verified).length,
      icon: Clock,
      color: 'text-yellow-500'
    }
  ];

  // Profile sections
  const sections = [
    {
      title: 'Contact Information',
      items: [
        {
          icon: Mail,
          label: 'Email',
          value: user.email
        },
        {
          icon: Phone,
          label: 'Phone',
          value: user.phone
        },
        {
          icon: MapPin,
          label: 'Location',
          value: user.location
        }
      ]
    },
    {
      title: 'Account Security',
      items: [
        {
          icon: Shield,
          label: 'Account Status',
          value: user.verified ? 'Verified' : 'Unverified',
          badge: user.verified ? 'Verified' : 'Pending'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Profile"
        rightElement={
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 text-gray-500 hover:text-gray-700 
              dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Edit className="w-6 h-6" />
          </button>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 
          border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl 
                flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {editing && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 
                  text-white rounded-lg">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-gray-900 
                  dark:text-white">
                  {user.name}
                </h1>
                {user.verified && (
                  <Shield className="w-5 h-5 text-emerald-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 
                  dark:text-white">
                  {user.points} points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 
                border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-semibold text-gray-900 
                    dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border 
              border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 
              dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="px-6 py-4 flex items-center gap-4"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.value}
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${item.badge === 'Verified'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <button
          onClick={() => {
            localStorage.removeItem('auth_token');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 p-4 
            bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 
            dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
