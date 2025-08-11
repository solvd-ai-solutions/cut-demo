/**
 * Focus Manager - Handles focus management, trapping, and restoration
 */

class FocusManager {
  constructor() {
    this.focusHistory = [];
    this.modalStack = [];
    this.isKeyboardNavigation = false;
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize focus management
   */
  init() {
    this.setupFocusTracking();
    this.setupFocusVisible();
    this.setupModalFocusEvents();
  }

  /**
   * Setup focus tracking for restoration
   */
  setupFocusTracking() {
    document.addEventListener('focusin', (e) => {
      this.focusHistory.push(e.target);
      // Keep history limited to last 10 elements
      if (this.focusHistory.length > 10) {
        this.focusHistory.shift();
      }
    });
  }

  /**
   * Setup focus-visible behavior
   */
  setupFocusVisible() {
    // Track keyboard vs mouse navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
        this.isKeyboardNavigation = true;
      }
    });
    
    document.addEventListener('mousedown', () => {
      this.isKeyboardNavigation = false;
    });
    
    // Apply focus-visible classes
    document.addEventListener('focusin', (e) => {
      if (this.isKeyboardNavigation) {
        e.target.classList.add('focus-visible');
      }
    });
    
    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-visible');
    });
  }

  /**
   * Setup modal focus event listeners
   */
  setupModalFocusEvents() {
    document.addEventListener('modalOpened', (e) => {
      this.trapFocus(e.detail.modal);
    });
    
    document.addEventListener('modalClosed', (e) => {
      this.restoreFocus(e.detail.modal);
    });
  }

  /**
   * Focus an element safely
   */
  focusElement(element) {
    if (!element || !this.isElementVisible(element)) return;
    
    // Make element focusable if needed
    if (!element.hasAttribute('tabindex') && !this.isNaturallyFocusable(element)) {
      element.setAttribute('tabindex', '-1');
    }
    
    element.focus();
    
    // Remove temporary tabindex after a short delay
    if (element.getAttribute('tabindex') === '-1' && !this.isNaturallyFocusable(element)) {
      setTimeout(() => {
        element.removeAttribute('tabindex');
      }, 100);
    }
  }

  /**
   * Trap focus within an element (for modals)
   */
  trapFocus(element) {
    const focusableElements = this.getFocusableElements(element);
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    this.focusElement(firstElement);
    
    // Create trap handler
    const trapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            this.focusElement(lastElement);
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            this.focusElement(firstElement);
          }
        }
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal(element);
      }
    };
    
    // Store modal info for restoration
    this.modalStack.push({
      element: element,
      previousFocus: this.focusHistory[this.focusHistory.length - 2],
      trapHandler: trapHandler
    });
    
    // Add trap handler
    document.addEventListener('keydown', trapHandler);
  }

  /**
   * Restore focus after modal closes
   */
  restoreFocus(modalElement) {
    const modalIndex = this.modalStack.findIndex(m => m.element === modalElement);
    
    if (modalIndex === -1) return;
    
    const modal = this.modalStack[modalIndex];
    
    // Remove trap handler
    document.removeEventListener('keydown', modal.trapHandler);
    
    // Restore focus to previous element
    if (modal.previousFocus && document.contains(modal.previousFocus)) {
      this.focusElement(modal.previousFocus);
    }
    
    // Remove from stack
    this.modalStack.splice(modalIndex, 1);
  }

  /**
   * Close modal (triggers modal close event)
   */
  closeModal(modalElement) {
    modalElement.dispatchEvent(new CustomEvent('closeModal', {
      bubbles: true,
      detail: { modal: modalElement }
    }));
  }

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];
    
    const focusableElements = container.querySelectorAll(focusableSelectors.join(', '));
    
    return Array.from(focusableElements).filter(element => {
      return this.isElementVisible(element) && !element.hasAttribute('disabled');
    });
  }

  /**
   * Check if element is visible and can be focused
   */
  isElementVisible(element) {
    if (!element || !document.contains(element)) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  }

  /**
   * Check if element is naturally focusable
   */
  isNaturallyFocusable(element) {
    const naturallyFocusable = ['a', 'button', 'input', 'select', 'textarea'];
    return naturallyFocusable.includes(element.tagName.toLowerCase()) ||
           element.hasAttribute('contenteditable') ||
           element.hasAttribute('tabindex');
  }

  /**
   * Get the last focused element
   */
  getLastFocusedElement() {
    return this.focusHistory[this.focusHistory.length - 1];
  }

  /**
   * Clear focus history
   */
  clearFocusHistory() {
    this.focusHistory = [];
  }
}

// Export for global use
window.FocusManager = FocusManager;