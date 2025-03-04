// Performance measurement utilities for accessibility testing
const performanceUtils = {
  // Measure time to first meaningful paint
  measureFirstMeaningfulPaint() {
    return new Promise(resolve => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const firstPaint = entries.find(entry => entry.name === 'first-contentful-paint');
        if (firstPaint) {
          resolve(firstPaint.startTime);
          observer.disconnect();
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    });
  },

  // Measure time to interactive
  measureTimeToInteractive() {
    return new Promise(resolve => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const tti = entries.find(entry => entry.name === 'TTI');
        if (tti) {
          resolve(tti.startTime);
          observer.disconnect();
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
    });
  },

  // Measure frame rate
  measureFrameRate() {
    return new Promise(resolve => {
      let frames = 0;
      let lastTime = performance.now();
      
      function countFrame(currentTime) {
        frames++;
        const elapsedTime = currentTime - lastTime;
        
        if (elapsedTime >= 1000) {
          const fps = Math.round((frames * 1000) / elapsedTime);
          resolve(fps);
          return;
        }
        
        requestAnimationFrame(countFrame);
      }
      
      requestAnimationFrame(countFrame);
    });
  },

  // Measure memory usage
  measureMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  },

  // Measure long tasks
  measureLongTasks() {
    return new Promise(resolve => {
      const longTasks = [];
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        longTasks.push(...entries);
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      
      setTimeout(() => {
        observer.disconnect();
        resolve(longTasks);
      }, 5000);
    });
  }
};

// Resource loading performance checkers
const resourceCheckers = {
  // Check if images are optimized
  checkImageOptimization(img) {
    const naturalSize = {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
    
    const displaySize = {
      width: img.offsetWidth,
      height: img.offsetHeight
    };
    
    return {
      isOptimized: Math.abs(naturalSize.width - displaySize.width) < 100,
      hasResponsiveSrcSet: !!img.srcset,
      hasAppropriateSize: naturalSize.width <= displaySize.width * 2,
      usesModernFormat: img.currentSrc?.includes('.webp') || img.currentSrc?.includes('.avif')
    };
  },

  // Check if resources are lazy loaded
  checkLazyLoading(element) {
    return {
      isLazyLoaded: element.loading === 'lazy',
      hasFallback: !!element.dataset.fallback,
      usesIntersectionObserver: !!element.dataset.observe
    };
  },

  // Check resource priorities
  checkResourcePriority(element) {
    return {
      hasPriority: element.fetchPriority || element.getAttribute('importance'),
      isPreloaded: !!document.querySelector(`link[rel="preload"][href="${element.src}"]`),
      isDeferrable: element.defer || element.async
    };
  }
};

// Animation performance checkers
const animationCheckers = {
  // Check if animations are performant
  checkAnimationPerformance(element) {
    const style = window.getComputedStyle(element);
    return {
      usesGPUAcceleration: style.transform.includes('translate3d') || style.willChange === 'transform',
      respectsReducedMotion: !!element.dataset.reducedMotion,
      usesRequestAnimationFrame: !!element.dataset.raf,
      hasOptimalProperties: this.checkOptimalProperties(style)
    };
  },

  // Check if animation properties are optimal
  checkOptimalProperties(style) {
    const optimalProperties = ['transform', 'opacity'];
    const usedProperties = style.animation.split(' ')[0];
    
    return {
      usesOptimalProperties: optimalProperties.some(prop => usedProperties.includes(prop)),
      avoidsLayoutThrashing: !usedProperties.includes('top') && !usedProperties.includes('left'),
      usesTiming: style.animationTimingFunction.includes('cubic-bezier')
    };
  }
};

// Rendering performance checkers
const renderingCheckers = {
  // Check if component implements virtualization
  checkVirtualization(container) {
    const items = container.querySelectorAll('[role="listitem"]');
    const totalItems = parseInt(container.getAttribute('aria-rowcount') || '0');
    
    return {
      isVirtualized: items.length < totalItems,
      hasAriaCounts: !!container.getAttribute('aria-rowcount'),
      maintainsAccessibility: items.every(item => item.getAttribute('aria-posinset'))
    };
  },

  // Check render optimization
  checkRenderOptimization(component) {
    return {
      usesMemo: !!component.type?.toString().includes('useMemo'),
      usesCallback: !!component.type?.toString().includes('useCallback'),
      implementsPureComponent: component.prototype?.isPureComponent,
      hasShouldComponentUpdate: !!component.prototype?.shouldComponentUpdate
    };
  }
};

// Event handling performance checkers
const eventCheckers = {
  // Check if events are debounced/throttled
  checkEventOptimization(element) {
    return {
      isDebounced: !!element.dataset.debounce,
      isThrottled: !!element.dataset.throttle,
      usesDelegation: !!element.closest('[data-delegate]'),
      hasPassiveListeners: this.checkPassiveListeners(element)
    };
  },

  // Check if passive listeners are used
  checkPassiveListeners(element) {
    const events = ['scroll', 'touchstart', 'wheel'];
    return events.every(event => {
      try {
        let isPassive = false;
        const options = {
          get passive() {
            isPassive = true;
            return true;
          }
        };
        element.addEventListener(event, null, options);
        element.removeEventListener(event, null, options);
        return isPassive;
      } catch (e) {
        return false;
      }
    });
  }
};

// Performance thresholds
const performanceThresholds = {
  firstContentfulPaint: 1000, // 1 second
  timeToInteractive: 3000, // 3 seconds
  frameRate: 60, // 60 fps
  longTask: 50, // 50ms
  memoryUsage: 0.9, // 90% of heap size
  renderTime: 16, // 16ms per frame
  networkRequests: 50 // Maximum concurrent requests
};

export {
  performanceUtils,
  resourceCheckers,
  animationCheckers,
  renderingCheckers,
  eventCheckers,
  performanceThresholds
};
