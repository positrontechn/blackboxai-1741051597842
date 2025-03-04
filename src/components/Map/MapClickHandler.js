import React, { useCallback, useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import LocationMarker from './LocationMarker';
import geocodingService from '../../services/location/geocodingService';

const MapClickHandler = ({
  onMapClick,
  selectionMode = false,
  showMarker = true,
  debounceTime = 300,
  className = ''
}) => {
  // State
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  // Handle map click
  const handleClick = useCallback(async (e) => {
    // Clear previous timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    // Get click coordinates
    const location = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };

    // Update marker position immediately
    if (showMarker) {
      setSelectedLocation(location);
    }

    // Debounce geocoding request
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        // Get address for location if in selection mode
        if (selectionMode) {
          const address = await geocodingService.reverseGeocode(
            location.lat,
            location.lng
          );
          location.address = address;
        }

        // Call click handler
        onMapClick?.(location);
      } catch (error) {
        console.error('Error handling map click:', error);
        // Still call click handler with coordinates only
        onMapClick?.(location);
      } finally {
        setLoading(false);
      }
    }, debounceTime);

    setClickTimeout(timeout);
  }, [onMapClick, selectionMode, showMarker, debounceTime, clickTimeout]);

  // Handle map events
  const map = useMapEvents({
    click: handleClick,
    mouseover: () => {
      if (selectionMode) {
        map.getContainer().style.cursor = 'crosshair';
      }
    },
    mouseout: () => {
      map.getContainer().style.cursor = '';
    }
  });

  // Clear selection when selection mode changes
  useEffect(() => {
    if (!selectionMode) {
      setSelectedLocation(null);
    }
  }, [selectionMode]);

  // Don't render anything if not showing marker
  if (!showMarker || !selectedLocation) {
    return null;
  }

  return (
    <>
      {/* Selected Location Marker */}
      <LocationMarker
        position={selectedLocation}
        className={"transition-opacity duration-200 " + 
          (loading ? "opacity-50" : "opacity-100") + " " + 
          className}
      />

      {/* Shadow Marker */}
      <LocationMarker.Shadow
        position={selectedLocation}
      />
    </>
  );
};

// Variants
MapClickHandler.Selection = (props) => (
  <MapClickHandler
    selectionMode
    showMarker
    {...props}
  />
);

MapClickHandler.Simple = (props) => (
  <MapClickHandler
    selectionMode={false}
    showMarker={false}
    {...props}
  />
);

MapClickHandler.WithMarker = (props) => (
  <MapClickHandler
    selectionMode={false}
    showMarker
    {...props}
  />
);

// Animation styles
const styles = `
  .map-click-crosshair {
    cursor: crosshair !important;
  }

  .map-click-marker {
    transition: opacity 0.2s ease-in-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .map-click-marker {
      transition: none;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default MapClickHandler;
