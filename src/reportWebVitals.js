const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ 
      getCLS, 
      getFID, 
      getFCP, 
      getLCP, 
      getTTFB 
    }) => {
      // Cumulative Layout Shift
      getCLS(metric => {
        onPerfEntry({
          ...metric,
          category: 'Layout Stability',
          level: metric.value < 0.1 ? 'good' : metric.value < 0.25 ? 'needs-improvement' : 'poor'
        });
      });

      // First Input Delay
      getFID(metric => {
        onPerfEntry({
          ...metric,
          category: 'Interactivity',
          level: metric.value < 100 ? 'good' : metric.value < 300 ? 'needs-improvement' : 'poor'
        });
      });

      // First Contentful Paint
      getFCP(metric => {
        onPerfEntry({
          ...metric,
          category: 'Loading',
          level: metric.value < 1800 ? 'good' : metric.value < 3000 ? 'needs-improvement' : 'poor'
        });
      });

      // Largest Contentful Paint
      getLCP(metric => {
        onPerfEntry({
          ...metric,
          category: 'Loading',
          level: metric.value < 2500 ? 'good' : metric.value < 4000 ? 'needs-improvement' : 'poor'
        });
      });

      // Time to First Byte
      getTTFB(metric => {
        onPerfEntry({
          ...metric,
          category: 'Server Response',
          level: metric.value < 100 ? 'good' : metric.value < 200 ? 'needs-improvement' : 'poor'
        });
      });
    });
  }
};

/**
 * Format metric value for display
 * @param {number} value - Metric value
 * @param {string} unit - Metric unit
 * @returns {string} Formatted value
 */
export const formatMetricValue = (value, unit = 'ms') => {
  if (unit === 'ms') {
    return `${Math.round(value)}ms`;
  }
  if (unit === 's') {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return value.toFixed(3);
};

/**
 * Get metric description
 * @param {string} name - Metric name
 * @returns {string} Metric description
 */
export const getMetricDescription = (name) => {
  switch (name) {
    case 'CLS':
      return 'Cumulative Layout Shift measures visual stability. A low CLS helps ensure a good user experience.';
    case 'FID':
      return 'First Input Delay measures interactivity. A low FID ensures the page is usable.';
    case 'FCP':
      return 'First Contentful Paint marks when the first text or image is painted.';
    case 'LCP':
      return 'Largest Contentful Paint marks when the largest text or image is painted.';
    case 'TTFB':
      return 'Time to First Byte measures how long it takes for the server to respond.';
    default:
      return '';
  }
};

/**
 * Get metric threshold description
 * @param {string} name - Metric name
 * @returns {Object} Threshold descriptions
 */
export const getMetricThresholds = (name) => {
  switch (name) {
    case 'CLS':
      return {
        good: '< 0.1',
        needsImprovement: '0.1 - 0.25',
        poor: '> 0.25'
      };
    case 'FID':
      return {
        good: '< 100ms',
        needsImprovement: '100ms - 300ms',
        poor: '> 300ms'
      };
    case 'FCP':
      return {
        good: '< 1.8s',
        needsImprovement: '1.8s - 3s',
        poor: '> 3s'
      };
    case 'LCP':
      return {
        good: '< 2.5s',
        needsImprovement: '2.5s - 4s',
        poor: '> 4s'
      };
    case 'TTFB':
      return {
        good: '< 100ms',
        needsImprovement: '100ms - 200ms',
        poor: '> 200ms'
      };
    default:
      return {};
  }
};

/**
 * Get metric status color
 * @param {string} level - Metric level
 * @returns {string} Status color
 */
export const getMetricStatusColor = (level) => {
  switch (level) {
    case 'good':
      return 'text-emerald-500';
    case 'needs-improvement':
      return 'text-yellow-500';
    case 'poor':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export default reportWebVitals;
