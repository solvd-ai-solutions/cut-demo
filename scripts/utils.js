/**
 * Utility Functions for Cut & Order Manager
 * Common helper functions used throughout the application
 */

/**
 * Query selector helper - returns first matching element
 */
function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query selector all helper - returns array of matching elements
 */
function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Debounce function - limits how often a function can be called
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function - ensures function is called at most once per interval
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Local storage helper with error handling
 */
const store = {
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Generate random ID
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format date
 */
function formatDate(date, options = {}) {
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
  } catch (error) {
    return new Date(date).toLocaleDateString();
  }
}

/**
 * Format time
 */
function formatTime(date, options = {}) {
  try {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
  } catch (error) {
    return new Date(date).toLocaleTimeString();
  }
}

/**
 * Clamp number between min and max
 */
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

/**
 * Check if element is visible in viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function scrollToElement(element, options = {}) {
  if (!element) return;
  
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  };
  
  element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Get CSS custom property value
 */
function getCSSVariable(property, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * Set CSS custom property value
 */
function setCSSVariable(property, value, element = document.documentElement) {
  element.style.setProperty(property, value);
}

/**
 * Check if device is mobile
 */
function isMobile() {
  return window.innerWidth < 768;
}

/**
 * Check if device is tablet
 */
function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is desktop
 */
function isDesktop() {
  return window.innerWidth >= 1024;
}

/**
 * Get viewport size
 */
function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Wait for element to exist in DOM
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = qs(selector);
    
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver((mutations) => {
      const element = qs(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Timeout after specified time
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Create element with attributes and content
 */
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Set content
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof Node) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Remove element from DOM
 */
function removeElement(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('Failed to copy text to clipboard:', err);
      return false;
    }
  }
}

/**
 * Validate email address
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (US format)
 */
function isValidPhone(phone) {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Parse URL parameters
 */
function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
}

/**
 * Set URL parameter without reload
 */
function setURLParam(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url);
}

/**
 * Remove URL parameter without reload
 */
function removeURLParam(key) {
  const url = new URL(window.location);
  url.searchParams.delete(key);
  window.history.replaceState({}, '', url);
}

// Export utilities for global use
window.utils = {
  qs,
  qsa,
  debounce,
  throttle,
  store,
  generateId,
  formatCurrency,
  formatDate,
  formatTime,
  clamp,
  isElementInViewport,
  scrollToElement,
  getCSSVariable,
  setCSSVariable,
  isMobile,
  isTablet,
  isDesktop,
  getViewportSize,
  waitForElement,
  createElement,
  removeElement,
  copyToClipboard,
  isValidEmail,
  isValidPhone,
  formatPhone,
  escapeHTML,
  getURLParams,
  setURLParam,
  removeURLParam
};

// Make individual functions available globally
Object.assign(window, {
  qs,
  qsa,
  debounce,
  throttle,
  store,
  generateId,
  formatCurrency,
  formatDate,
  formatTime,
  clamp,
  isElementInViewport,
  scrollToElement,
  getCSSVariable,
  setCSSVariable,
  isMobile,
  isTablet,
  isDesktop,
  getViewportSize,
  waitForElement,
  createElement,
  removeElement,
  copyToClipboard,
  isValidEmail,
  isValidPhone,
  formatPhone,
  escapeHTML,
  getURLParams,
  setURLParam,
  removeURLParam
});