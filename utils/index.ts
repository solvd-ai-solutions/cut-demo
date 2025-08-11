import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values consistently
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date values consistently
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format date for display (date only)
 */
export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Generate a random order code
 */
export function generateOrderCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Measurement unit conversion utilities
 */
export const measurementUtils = {
  // Convert feet to meters
  feetToMeters: (feet: number): number => feet * 0.3048,
  
  // Convert meters to feet
  metersToFeet: (meters: number): number => meters * 3.28084,
  
  // Convert inches to centimeters
  inchesToCm: (inches: number): number => inches * 2.54,
  
  // Convert centimeters to inches
  cmToInches: (cm: number): number => cm / 2.54,
  
  // Convert feet and inches to total inches
  feetInchesToInches: (feet: number, inches: number): number => (feet * 12) + inches,
  
  // Convert total inches to feet and inches
  inchesToFeetInches: (totalInches: number): { feet: number, inches: number } => {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
  },
  
  // Convert meters and centimeters to total centimeters
  metersCmToCm: (meters: number, cm: number): number => (meters * 100) + cm,
  
  // Convert total centimeters to meters and centimeters
  cmToMetersCm: (totalCm: number): { meters: number, cm: number } => {
    const meters = Math.floor(totalCm / 100);
    const cm = totalCm % 100;
    return { meters, cm };
  },
  
  // Format measurement with appropriate units
  formatMeasurement: (value: number, unit: 'imperial' | 'metric'): string => {
    if (unit === 'metric') {
      if (value >= 1) {
        const meters = Math.floor(value);
        const cm = Math.round((value - meters) * 100);
        if (cm === 0) {
          return `${meters}m`;
        } else {
          return `${meters}m ${cm}cm`;
        }
      } else {
        return `${Math.round(value * 100)}cm`;
      }
    } else {
      // Imperial: feet and inches
      const totalInches = value * 12; // Convert feet to inches
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      
      if (feet === 0) {
        return `${inches}"`;
      } else if (inches === 0) {
        return `${feet}'`;
      } else {
        return `${feet}' ${inches}"`;
      }
    }
  },
  
  // Convert measurement between units
  convertMeasurement: (value: number, fromUnit: 'imperial' | 'metric', toUnit: 'imperial' | 'metric'): number => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'imperial' && toUnit === 'metric') {
      return measurementUtils.feetToMeters(value);
    } else {
      return measurementUtils.metersToFeet(value);
    }
  },
  
  // Parse feet and inches input (e.g., "5' 3"", "5'", "3"", "5.5'")
  parseFeetInches: (input: string): number => {
    const trimmed = input.trim();
    let feet = 0;
    let inches = 0;
    
    // Match patterns like "5' 3"", "5'", "3"", "5.5'"
    const feetMatch = trimmed.match(/(\d+(?:\.\d+)?)'/);
    const inchesMatch = trimmed.match(/(\d+(?:\.\d+)?)"/);
    
    if (feetMatch) {
      feet = parseFloat(feetMatch[1]);
    }
    
    if (inchesMatch) {
      inches = parseFloat(inchesMatch[1]);
    }
    
    // If no feet specified but inches are, assume it's just inches
    if (feet === 0 && inches > 0) {
      return inches / 12; // Convert inches to feet
    }
    
    // If no units specified, assume it's feet (e.g., "5.5" → 5.5 feet)
    if (feet === 0 && inches === 0) {
      const plainNumber = parseFloat(trimmed);
      if (!isNaN(plainNumber)) {
        return plainNumber;
      }
    }
    
    return feet + (inches / 12);
  },
  
  // Parse meters and centimeters input (e.g., "2.5m", "150cm", "2m 50cm", "2.5")
  parseMetersCm: (input: string): number => {
    const trimmed = input.trim();
    let meters = 0;
    let cm = 0;
    
    // Match patterns like "2.5m", "150cm", "2m 50cm"
    const metersMatch = trimmed.match(/(\d+(?:\.\d+)?)m/);
    const cmMatch = trimmed.match(/(\d+(?:\.\d+)?)cm/);
    
    if (metersMatch) {
      meters = parseFloat(metersMatch[1]);
    }
    
    if (cmMatch) {
      cm = parseFloat(cmMatch[1]);
    }
    
    // If no meters specified but cm are, assume it's just cm
    if (meters === 0 && cm > 0) {
      return cm / 100; // Convert cm to meters
    }
    
    // If no units specified, assume it's meters (e.g., "2.5" → 2.5 meters)
    if (meters === 0 && cm === 0) {
      const plainNumber = parseFloat(trimmed);
      if (!isNaN(plainNumber)) {
        return plainNumber;
      }
    }
    
    return meters + (cm / 100);
  },
  
  // Format input placeholder based on unit
  getInputPlaceholder: (unit: 'imperial' | 'metric'): string => {
    if (unit === 'imperial') {
      return "e.g., 5' 3\" or 5.25' or 5.5";
    } else {
      return "e.g., 2.5m or 250cm or 2.5";
    }
  }
};

/**
 * Calculate job cost with pricing configuration
 */
export function calculateJobCost(
  materialCost: number,
  _length: number, // Keep for backward compatibility but mark as unused
  quantity: number,
  laborRate: number = 0.25,
  wastePercent: number = 15,
  markupPercent: number = 25
): {
  materialCost: number
  laborCost: number
  wasteCost: number
  markup: number
  totalCost: number
} {
  const laborCost = quantity * laborRate // $0.25 per cut, not per foot
  const wasteCost = materialCost * (wastePercent / 100)
  const subtotal = materialCost + laborCost + wasteCost
  const markup = subtotal * (markupPercent / 100)
  const totalCost = subtotal + markup

  return {
    materialCost,
    laborCost,
    wasteCost,
    markup,
    totalCost,
  }
}

/**
 * Check if stock is low based on threshold
 */
export function isStockLow(currentStock: number, threshold: number): boolean {
  return currentStock <= threshold
}

/**
 * Check if there's sufficient stock for a job
 */
export function hasSufficientStock(
  currentStock: number,
  requiredLength: number,
  quantity: number
): boolean {
  return currentStock >= requiredLength * quantity
}

/**
 * Get stock status for display
 */
export function getStockStatus(
  currentStock: number,
  threshold: number,
  requiredLength?: number,
  quantity?: number
): {
  status: 'sufficient' | 'low' | 'insufficient'
  message: string
  color: string
} {
  if (requiredLength && quantity) {
    const needed = requiredLength * quantity
    if (currentStock < needed) {
      return {
        status: 'insufficient',
        message: 'Insufficient Stock',
        color: 'text-red-600'
      }
    }
  }

  if (currentStock <= threshold) {
    return {
      status: 'low',
      message: 'Low Stock Warning',
      color: 'text-orange-600'
    }
  }

  return {
    status: 'sufficient',
    message: 'Stock Available',
    color: 'text-green-600'
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Error clearing localStorage:', error)
    }
  }
}

/**
 * Validation utilities
 */
export const validation = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  },

  isRequired: (value: any): boolean => {
    return value !== null && value !== undefined && value !== ''
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  isNumber: (value: any): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(value)
  },

  isPositive: (value: number): boolean => {
    return value > 0
  }
}

/**
 * Accessibility utilities
 */
export const a11y = {
  generateId: (prefix: string = 'id'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  announceToScreenReader: (message: string): void => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

/**
 * Performance utilities
 */
export const perfUtils = {
  measureTime: <T>(fn: () => T, label: string): T => {
    const start = window.performance.now()
    const result = fn()
    const end = window.performance.now()
    console.log(`${label}: ${(end - start).toFixed(2)}ms`)
    return result
  },

  measureTimeAsync: async <T>(fn: () => Promise<T>, label: string): Promise<T> => {
    const start = window.performance.now()
    const result = await fn()
    const end = window.performance.now()
    console.log(`${label}: ${(end - start).toFixed(2)}ms`)
    return result
  }
}
