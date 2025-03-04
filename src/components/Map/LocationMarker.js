import React from 'react';
import { Marker, Circle, Popup } from 'react-leaflet';
import markerIcons from './markerIcons';
import { REPORT_TYPES } from '../../constants';
import { formatDate, formatDistance } from '../../utils/helpers';

const LocationMarker = ({
  position,
  accuracy,
  heading,
  type,
  onClick,
  selected,
  children,
  className = ''
}) => {
  // Get marker icon based on type
  const getIcon = () => {
    if (type) {
      const reportType = REPORT_TYPES.find(t => t.id === type);
      if (reportType) {
        return markerIcons.createReportMarkers()[type][selected ? 'selected' : 'default'];
      }
    }
    return markerIcons.locationMarkers.temporary;
  };

  return (
    <>
      {/* Main Marker */}
      <Marker
        position={[position.lat, position.lng]}
        icon={getIcon()}
        eventHandlers={{
          click: onClick
        }}
        className={"transition-transform duration-300 " + 
          (heading ? "rotate-" + Math.round(heading) : "") + " " + 
          className}
      >
        {children}
      </Marker>

      {/* Accuracy Circle */}
      {accuracy && (
        <Circle
          center={[position.lat, position.lng]}
          radius={accuracy}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1
          }}
        />
      )}
    </>
  );
};

// Current location marker
LocationMarker.Current = ({ position, accuracy, heading }) => (
  <LocationMarker
    position={position}
    accuracy={accuracy}
    heading={heading}
    icon={markerIcons.locationMarkers.current}
  />
);

// Report marker
const ReportMarker = ({ report, selected, onClick }) => {
  const [showPopup, setShowPopup] = React.useState(false);
  const type = REPORT_TYPES.find(t => t.id === report.type);

  if (!type) return null;

  return (
    <LocationMarker
      position={report.location}
      type={report.type}
      selected={selected}
      onClick={(e) => {
        setShowPopup(true);
        onClick?.(e);
      }}
    >
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          className="report-popup"
        >
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className={"p-2 rounded-lg " + type.color}>
                <type.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {type.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatDate(report.timestamp)}</span>
                  {report.distance && (
                    <>
                      <span>•</span>
                      <span>{formatDistance(report.distance)} away</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </LocationMarker>
  );
};

LocationMarker.Report = ReportMarker;

// Target marker
LocationMarker.Target = ({ position }) => (
  <LocationMarker
    position={position}
    icon={markerIcons.locationMarkers.target}
  />
);

// Cluster marker
LocationMarker.Cluster = (count) => {
  const styles = markerIcons.createClusterStyles();
  const size = count < 10 ? 0 : count < 100 ? 1 : count < 1000 ? 2 : 3;
  return styles[size];
};

// Shadow marker
LocationMarker.Shadow = ({ position }) => (
  <Marker
    position={[position.lat, position.lng]}
    icon={markerIcons.createShadowIcon()}
    zIndexOffset={-1000}
  />
);

// Animation styles
const styles = `
  .marker-bounce {
    animation: marker-bounce 0.5s ease-in-out;
  }

  @keyframes marker-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marker-bounce {
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

export default LocationMarker;
