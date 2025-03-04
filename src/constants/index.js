// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: {
    lat: 51.505,
    lng: -0.09
  },
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 19,
  clusterRadius: 50,
  clusterOptions: {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 19
  },
  locationOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
    highAccuracyThreshold: 20 // meters
  },
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

// Report Types
export const REPORT_TYPES = [
  {
    id: 'pollution',
    label: 'Pollution',
    description: 'Air, water, or soil pollution incidents',
    icon: 'AlertTriangle',
    color: 'bg-red-500',
    requiresPhoto: true
  },
  {
    id: 'waste',
    label: 'Illegal Waste',
    description: 'Illegal dumping or waste management issues',
    icon: 'Trash2',
    color: 'bg-orange-500',
    requiresPhoto: true
  },
  {
    id: 'wildlife',
    label: 'Wildlife',
    description: 'Wildlife endangerment or habitat destruction',
    icon: 'Bird',
    color: 'bg-yellow-500',
    requiresPhoto: false
  },
  {
    id: 'deforestation',
    label: 'Deforestation',
    description: 'Illegal logging or forest destruction',
    icon: 'Tree',
    color: 'bg-green-500',
    requiresPhoto: true
  },
  {
    id: 'water',
    label: 'Water Issues',
    description: 'Water contamination or misuse',
    icon: 'Droplet',
    color: 'bg-blue-500',
    requiresPhoto: true
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other environmental issues',
    icon: 'AlertCircle',
    color: 'bg-purple-500',
    requiresPhoto: false
  }
];

// Media Configuration
export const MEDIA_CONFIG = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxCount: 5,
    quality: 0.8,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  video: {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxDuration: 60, // seconds
    quality: 0.8,
    allowedTypes: ['video/mp4', 'video/webm']
  }
};

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  userAgent: 'GreenSentinel/1.0.0',
  endpoints: {
    reports: '/api/reports',
    media: '/api/media',
    geocoding: '/api/geocoding'
  }
};

// Validation Rules
export const VALIDATION_RULES = {
  report: {
    description: {
      minLength: 10,
      maxLength: 1000
    },
    photos: {
      maxCount: MEDIA_CONFIG.image.maxCount,
      maxSize: MEDIA_CONFIG.image.maxSize
    }
  },
  user: {
    name: {
      minLength: 2,
      maxLength: 50
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    }
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  api: {
    network: 'Network error. Please check your internet connection.',
    server: 'Server error. Please try again later.',
    auth: 'Authentication error. Please log in again.',
    timeout: 'Request timed out. Please try again.'
  },
  location: {
    denied: 'Location access denied. Please enable location services.',
    unavailable: 'Location service unavailable.',
    timeout: 'Location request timed out.'
  },
  media: {
    denied: 'Camera access denied. Please enable camera access.',
    unavailable: 'Camera unavailable.',
    type: 'Invalid file type.',
    size: 'File size exceeds limit.',
    count: 'Maximum number of files reached.'
  },
  offline: {
    sync: 'Error syncing data. Please try again when online.',
    quota: 'Storage quota exceeded. Please clear some space.'
  },
  validation: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.',
    match: 'Passwords do not match.'
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  auth: 'auth_token',
  theme: 'theme_preference',
  location: 'preferred_location',
  camera: 'preferred_camera',
  offline: 'offline_data'
};
