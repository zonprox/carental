import React from 'react';

/**
 * Performance Utilities
 * Collection of utilities for optimizing application performance
 */

/**
 * Debounce function - delays execution until after delay has passed since last call
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function - limits execution to once per delay period
 */
export const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(null, args);
    }
  };
};

/**
 * Memoization utility for expensive calculations
 */
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
};

/**
 * Lazy loading utility for dynamic imports
 */
export const lazyLoad = (importFunc, fallback = null) => {
  return React.lazy(() => 
    importFunc().catch(() => ({
      default: fallback || (() => <div>Failed to load component</div>)
    }))
  );
};

/**
 * Virtual scrolling utility for large lists
 */
export class VirtualScroller {
  constructor(options = {}) {
    this.itemHeight = options.itemHeight || 50;
    this.containerHeight = options.containerHeight || 400;
    this.overscan = options.overscan || 5;
    this.scrollTop = 0;
  }

  getVisibleRange(itemCount) {
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, itemCount - 1);

    return {
      startIndex: Math.max(0, startIndex - this.overscan),
      endIndex: Math.min(itemCount - 1, endIndex + this.overscan),
      visibleStartIndex: startIndex,
      visibleEndIndex: endIndex,
    };
  }

  getItemStyle(index) {
    return {
      position: 'absolute',
      top: index * this.itemHeight,
      height: this.itemHeight,
      width: '100%',
    };
  }

  getTotalHeight(itemCount) {
    return itemCount * this.itemHeight;
  }

  updateScrollTop(scrollTop) {
    this.scrollTop = scrollTop;
  }
}

/**
 * Image preloader utility
 */
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => 
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      })
    )
  );
};

/**
 * Intersection Observer utility for lazy loading
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  // Mark the start of a performance measurement
  mark: (name) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },

  // Mark the end and measure performance
  measure: (name) => {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : 0;
    }
    return 0;
  },

  // Get all performance measurements
  getAll: () => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      return performance.getEntriesByType('measure');
    }
    return [];
  },

  // Clear all performance measurements
  clear: () => {
    if (typeof performance !== 'undefined' && performance.clearMeasures) {
      performance.clearMeasures();
      performance.clearMarks();
    }
  },
};

/**
 * Bundle size analyzer utility
 */
export const bundleAnalyzer = {
  // Log bundle information
  logBundleInfo: () => {
    if (typeof __APP_VERSION__ !== 'undefined') {
      console.log(`App Version: ${__APP_VERSION__}`);
    }
    if (typeof __BUILD_TIME__ !== 'undefined') {
      console.log(`Build Time: ${__BUILD_TIME__}`);
    }
  },

  // Analyze chunk loading
  analyzeChunks: () => {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    
    console.group('Bundle Analysis');
    console.log(`Scripts loaded: ${scripts.length}`);
    console.log(`Stylesheets loaded: ${styles.length}`);
    
    scripts.forEach((script, index) => {
      console.log(`Script ${index + 1}: ${script.src}`);
    });
    
    styles.forEach((style, index) => {
      console.log(`Stylesheet ${index + 1}: ${style.href}`);
    });
    
    console.groupEnd();
  },
};

/**
 * Memory usage monitoring
 */
export const memoryMonitor = {
  // Get current memory usage (if available)
  getUsage: () => {
    if (typeof performance !== 'undefined' && performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  },

  // Log memory usage
  log: () => {
    const usage = memoryMonitor.getUsage();
    if (usage) {
      console.log(`Memory Usage: ${usage.used}MB / ${usage.total}MB (Limit: ${usage.limit}MB)`);
    }
  },
};

/**
 * Network performance utilities
 */
export const networkMonitor = {
  // Get connection information
  getConnectionInfo: () => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
      };
    }
    return null;
  },

  // Check if connection is slow
  isSlowConnection: () => {
    const connection = networkMonitor.getConnectionInfo();
    if (connection) {
      return connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' || 
             connection.saveData;
    }
    return false;
  },
};

/**
 * React performance utilities
 */
export const reactPerformance = {
  // HOC for measuring component render time
  withPerformanceTracking: (WrappedComponent, componentName) => {
    return function PerformanceTrackedComponent(props) {
      React.useEffect(() => {
        performanceMonitor.mark(`${componentName}-render`);
        return () => {
          performanceMonitor.measure(`${componentName}-render`);
        };
      });

      return React.createElement(WrappedComponent, props);
    };
  },

  // Hook for tracking component updates
  useRenderCount: (componentName) => {
    const renderCount = React.useRef(0);
    
    React.useEffect(() => {
      renderCount.current += 1;
      console.log(`${componentName} rendered ${renderCount.current} times`);
    });

    return renderCount.current;
  },

  // Hook for tracking prop changes
  useWhyDidYouUpdate: (name, props) => {
    const previous = React.useRef();
    
    React.useEffect(() => {
      if (previous.current) {
        const allKeys = Object.keys({ ...previous.current, ...props });
        const changedProps = {};
        
        allKeys.forEach(key => {
          if (previous.current[key] !== props[key]) {
            changedProps[key] = {
              from: previous.current[key],
              to: props[key],
            };
          }
        });
        
        if (Object.keys(changedProps).length) {
          console.log('[why-did-you-update]', name, changedProps);
        }
      }
      
      previous.current = props;
    });
  },
};

export default {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  VirtualScroller,
  preloadImages,
  createIntersectionObserver,
  performanceMonitor,
  bundleAnalyzer,
  memoryMonitor,
  networkMonitor,
  reactPerformance,
};