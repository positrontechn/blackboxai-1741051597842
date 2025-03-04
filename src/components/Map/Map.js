import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MAP_CONFIG } from '../../constants';
import LocationMarker from './LocationMarker';
import LocationButton from './LocationButton';
import MapClickHandler from './MapClickHandler';
import MapLoading from './MapLoading';
import './Map.css';

const Map = ({
  center = MAP_CONFIG.defaultCenter,
  zoom = MAP_CONFIG.defaultZoom,
  reports = [],
  selectedReport = null,
  onReportSelect,
  onClick,
  showCurrentLocation = false,
  showLocationButton = false,
  selectionMode = false,
  showMarker = false,
  clusterMarkers = false,
  loading = false,
  className = ''
}) => {
  // Map controller component
  const MapController = () => {
    const map = useMap();

    // Update map view when center changes
    useEffect(() => {
      if (center) {
        map.setView([center.lat, center.lng], map.getZoom(), {
          animate: true
        });
      }
    }, [map, center]);

    // Update map zoom when zoom changes
    useEffect(() => {
      if (zoom) {
        map.setZoom(zoom);
      }
    }, [map, zoom]);

    return null;
  };

  // Map events handler component
  const MapEvents = () => {
    const map = useMapEvents({
      // Prevent map click when clicking on markers
      click: (e) => {
        if (e.originalEvent.target.classList.contains('leaflet-marker-icon')) {
          return;
        }
        onClick?.(e);
      },
      // Update cursor in selection mode
      mouseover: () => {
        if (selectionMode) {
          map.getContainer().style.cursor = 'crosshair';
        }
      },
      mouseout: () => {
        map.getContainer().style.cursor = '';
      }
    });

    return null;
  };

  return (
    <div className={"relative h-full " + className}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        className="h-full"
      >
        {/* Map Controller */}
        <MapController />

        {/* Map Events */}
        <MapEvents />

        {/* Base Layer */}
        <TileLayer
          url={MAP_CONFIG.tileLayer.url}
          attribution={MAP_CONFIG.tileLayer.attribution}
        />

        {/* Reports Layer */}
        {clusterMarkers ? (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={MAP_CONFIG.clusterRadius}
            spiderfyOnMaxZoom={MAP_CONFIG.clusterOptions.spiderfyOnMaxZoom}
            showCoverageOnHover={MAP_CONFIG.clusterOptions.showCoverageOnHover}
            zoomToBoundsOnClick={MAP_CONFIG.clusterOptions.zoomToBoundsOnClick}
            disableClusteringAtZoom={MAP_CONFIG.clusterOptions.disableClusteringAtZoom}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              return LocationMarker.Cluster(count);
            }}
          >
            {reports.map(report => (
              <LocationMarker.Report
                key={report.id}
                report={report}
                selected={selectedReport?.id === report.id}
                onClick={() => onReportSelect?.(report)}
              />
            ))}
          </MarkerClusterGroup>
        ) : (
          reports.map(report => (
            <LocationMarker.Report
              key={report.id}
              report={report}
              selected={selectedReport?.id === report.id}
              onClick={() => onReportSelect?.(report)}
            />
          ))
        )}

        {/* Click Handler */}
        {onClick && (
          <MapClickHandler
            onMapClick={onClick}
            selectionMode={selectionMode}
            showMarker={showMarker}
          />
        )}

        {/* Current Location */}
        {showCurrentLocation && (
          <LocationMarker.Current />
        )}

        {/* Location Button */}
        {showLocationButton && (
          <div className="absolute right-4 bottom-4 z-[1000]">
            <LocationButton />
          </div>
        )}
      </MapContainer>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <MapLoading />
        </div>
      )}
    </div>
  );
};

export default Map;
