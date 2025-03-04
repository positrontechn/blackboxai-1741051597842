import React, { useState, useCallback } from 'react';
import { 
  Search,
  MapPin,
  Navigation,
  X,
  Loader,
  ChevronRight
} from 'lucide-react';
import { formatDistance } from '../../utils/helpers';
import Map from '../Map/Map';
import Header from '../Navigation/Header';
import LoadingScreen from '../common/LoadingScreen';
import ErrorScreen from '../common/ErrorScreen';
import LocationPermission from '../Map/LocationPermission';
import useLocation from '../../hooks/useLocation';
import useDebounce from '../../hooks/useDebounce';

const LocationPicker = ({
  onSelect,
  onClose,
  initialLocation = null,
  className = ''
}) => {
  const { 
    currentLocation,
    permissionStatus,
    getCoordinates,
    getSuggestions,
    error: locationError
  } = useLocation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // Debounce search query
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  // Load suggestions when search query changes
  React.useEffect(() => {
    const loadSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await getSuggestions(debouncedQuery);
        setSuggestions(results);
      } catch (err) {
        setError('Error getting suggestions');
        console.error('Error getting suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [debouncedQuery, getSuggestions]);

  // Handle map click
  const handleMapClick = useCallback(async (location) => {
    try {
      setSelectedLocation(location);
    } catch (err) {
      setError('Error selecting location');
      console.error('Error selecting location:', err);
    }
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion) => {
    setSelectedLocation(suggestion.value);
    setSuggestions([]);
    setSearchQuery('');
  }, []);

  // Handle current location selection
  const handleCurrentLocation = useCallback(() => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
    }
  }, [currentLocation]);

  // Show loading screen
  if (loading && !selectedLocation) {
    return <LoadingScreen />;
  }

  // Show error screen
  if (error || locationError) {
    return (
      <ErrorScreen
        error={error || locationError}
        action={{
          label: 'Try Again',
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  // Show location permission screen
  if (permissionStatus === 'prompt') {
    return (
      <LocationPermission
        onGranted={() => {}}
        onDenied={() => {}}
      />
    );
  }

  return (
    <div className={"fixed inset-0 bg-white dark:bg-gray-900 z-50 " + className}>
      {/* Header */}
      <Header
        title="Select Location"
        showBack
        onBack={onClose}
        rightElement={
          <button
            onClick={() => selectedLocation && onSelect(selectedLocation)}
            disabled={!selectedLocation}
            className="p-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50"
          >
            Done
          </button>
        }
      />

      {/* Search Bar */}
      <div className="absolute top-16 inset-x-0 p-4 z-10">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {loading && (
            <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-32">
        <Map
          center={selectedLocation || currentLocation}
          zoom={15}
          onClick={handleMapClick}
          showCurrentLocation
          showLocationButton
          selectionMode
          showMarker
        />
      </div>

      {/* Search Results */}
      {suggestions.length > 0 && (
        <div className="absolute top-32 inset-x-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 max-h-64 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">
                  {suggestion.label}
                </p>
                {currentLocation && suggestion.value && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistance(currentLocation, suggestion.value)} away
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* Current Location Button */}
      <div className="absolute right-4 bottom-4 z-10">
        <button
          onClick={handleCurrentLocation}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-emerald-500"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
