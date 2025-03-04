import L from 'leaflet';
import { REPORT_TYPES } from '../../constants';

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object|null} RGB color object or null if invalid
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Create SVG marker icon
 * @param {Object} options - Icon options
 * @returns {L.DivIcon} Leaflet div icon
 */
const createSvgIcon = ({ color, icon, selected = false }) => {
  // Convert color to RGB for shadow
  const rgb = hexToRgb(color);
  const shadowColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)` : 'rgba(0, 0, 0, 0.4)';

  // Create SVG string
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path 
        d="M16 0c8.837 0 16 7.163 16 16 0 8-8 20-16 26C8 36 0 24 0 16 0 7.163 7.163 0 16 0z"
        fill="${color}"
        filter="url(#shadow)"
        ${selected ? 'stroke="white" stroke-width="2"' : ''}
      />
      <path 
        d="${icon}"
        fill="white"
        transform="translate(8, 8) scale(0.625)"
      />
    </svg>
  `;

  // Create icon
  return L.divIcon({
    html: svg,
    className: 'marker-icon',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
};

/**
 * Location marker icons
 */
const locationMarkers = {
  // Current location marker
  current: L.divIcon({
    html: `
      <div class="current-location-marker">
        <div class="current-location-marker__dot"></div>
        <div class="current-location-marker__pulse"></div>
      </div>
    `,
    className: 'current-location-marker-container',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  }),

  // Target marker
  target: L.divIcon({
    html: `
      <div class="target-marker">
        <div class="target-marker__inner"></div>
        <div class="target-marker__pulse"></div>
      </div>
    `,
    className: 'target-marker-container',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  }),

  // Temporary marker
  temporary: L.divIcon({
    html: `
      <div class="temporary-marker">
        <div class="temporary-marker__inner"></div>
        <div class="temporary-marker__pulse"></div>
      </div>
    `,
    className: 'temporary-marker-container',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
};

/**
 * Create report marker icons
 * @returns {Object} Report marker icons
 */
const createReportMarkers = () => {
  const markers = {};

  REPORT_TYPES.forEach(type => {
    markers[type.id] = {
      default: createSvgIcon({
        color: type.color.replace('bg-', '#').replace('-500', ''),
        icon: type.icon.toString(),
        selected: false
      }),
      selected: createSvgIcon({
        color: type.color.replace('bg-', '#').replace('-500', ''),
        icon: type.icon.toString(),
        selected: true
      })
    };
  });

  return markers;
};

/**
 * Create cluster icon styles
 * @returns {Array} Cluster icon styles
 */
const createClusterStyles = () => {
  const styles = [];

  [
    { count: 10, size: 30 },
    { count: 100, size: 35 },
    { count: 1000, size: 40 }
  ].forEach(({ count, size }) => {
    styles.push({
      html: `
        <div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
          <div class="cluster-marker__inner">
            <span>${count}+</span>
          </div>
        </div>
      `,
      className: 'cluster-marker-container',
      iconSize: L.point(size, size),
      iconAnchor: L.point(size / 2, size / 2)
    });
  });

  return styles;
};

/**
 * Create shadow icon
 * @returns {L.DivIcon} Shadow icon
 */
const createShadowIcon = () => {
  return L.divIcon({
    html: `
      <div class="marker-shadow"></div>
    `,
    className: 'marker-shadow-container',
    iconSize: [40, 10],
    iconAnchor: [20, 5]
  });
};

// Marker styles
const styles = `
  /* Current Location Marker */
  .current-location-marker {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .current-location-marker__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #3b82f6;
    border: 2px solid white;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .current-location-marker__pulse {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.1);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s ease-out infinite;
  }

  /* Target Marker */
  .target-marker {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .target-marker__inner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ef4444;
    border: 2px solid white;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .target-marker__pulse {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.1);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s ease-out infinite;
  }

  /* Temporary Marker */
  .temporary-marker {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .temporary-marker__inner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6b7280;
    border: 2px solid white;
    box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.3);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .temporary-marker__pulse {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(107, 114, 128, 0.1);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s ease-out infinite;
  }

  /* Cluster Marker */
  .cluster-marker {
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.1);
    border: 2px solid #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .cluster-marker:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: scale(1.1);
  }

  .cluster-marker__inner {
    color: #3b82f6;
    font-weight: 600;
    font-size: 12px;
  }

  /* Shadow */
  .marker-shadow {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    filter: blur(2px);
  }

  /* Animations */
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .current-location-marker__pulse,
    .target-marker__pulse,
    .temporary-marker__pulse {
      animation: none;
    }

    .cluster-marker:hover {
      transform: none;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default {
  locationMarkers,
  createReportMarkers,
  createClusterStyles,
  createShadowIcon
};
