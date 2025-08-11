/**
 * Keyboard Navigation Manager - Handles keyboard navigation patterns
 */

class KeyboardNav {
  constructor() {
    this.navigationGroups = new Map();
    this.globalShortcuts = new Map();
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize keyboard navigation
   */
  init() {
    this.setupGlobalKeyboardHandlers();
    this.setupArrowKeyNavigation();
    this.setupActivationKeys();
    this.registerGlobalShortcuts();
  }

  /**
   * Setup global keyboard event handlers
   */
  setupGlobalKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      // Handle global shortcuts first
      if (this.handleGlobalShortcuts(e)) {
        return;
      }
      
      // Handle navigation patterns
      this.handleNavigationPatterns(e);
    });
  }

  /**
   * Register global keyboard shortcuts
   */
  registerGlobalShortcuts() {
    // Alt + 1-3: Quick navigation to main sections
    this.globalShortcuts.set('Alt+1', () => {
      if (window.CutOrderApp?.router) {
        window.CutOrderApp.router.navigate('new-job');
      }
    });
    
    this.globalShortcuts.set('Alt+2', () => {
      if (window.CutOrderApp?.router) {
        window.CutOrderApp.router.navigate('inventory');
      }
    });
    
    this.globalShortcuts.set('Alt+3', () => {
      if (window.CutOrderApp?.router) {
        window.CutOrderApp.router.navigate('job-manager');
      }
    });
    
    // Escape: Go back or close modals
    this.globalShortcuts.set('Escape', () => {
      // Close open modals first
      const openModal = qs('.modal[aria-hidden="false"], [data-modal="open"]');
      if (openModal) {
        this.closeModal(openModal);
        return true;
      }
      
      // Navigate back if not on dashboard
      if (window.CutOrderApp?.getState()?.currentView !== 'dashboard') {
        if (window.CutOrderApp?.router) {
          window.CutOrderApp.router.navigate('dashboard');
        }
        return true;
      }
      
      return false;
    });
    
    // Ctrl/Cmd + K: Focus search (if available)
    this.globalShortcuts.set('Control+k', () => {
      const searchInput = qs('[type="search"], [placeholder*="search" i]');
      if (searchInput && window.CutOrderApp?.a11y) {
        window.CutOrderApp.a11y.focusElement(searchInput);
        return true;
      }
      return false;
    });
    
    this.globalShortcuts.set('Meta+k', () => {
      return this.globalShortcuts.get('Control+k')();
    });
  }

  /**
   * Handle global keyboard shortcuts
   */
  handleGlobalShortcuts(e) {
    const shortcutKey = this.getShortcutKey(e);
    const handler = this.globalShortcuts.get(shortcutKey);
    
    if (handler) {
      const handled = handler();
      if (handled !== false) {
        e.preventDefault();
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get shortcut key string from event
   */
  getShortcutKey(e) {
    const parts = [];
    
    if (e.ctrlKey) parts.push('Control');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Meta');
    
    parts.push(e.key);
    
    return parts.join('+');
  }

  /**
   * Handle navigation patterns (arrow keys, etc.)
   */
  handleNavigationPatterns(e) {
    const target = e.target;
    
    // Skip if user is typing in an input
    if (this.isTypingContext(target)) {
      return;
    }
    
    // Handle arrow key navigation
    if (e.key.startsWith('Arrow')) {
      this.handleArrowKeyNavigation(e);
    }
    
    // Handle Enter/Space activation
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleActivationKeys(e);
    }
  }

  /**
   * Check if user is in a typing context
   */
  isTypingContext(element) {
    if (!element) return false;
    
    const typingElements = ['input', 'textarea', 'select'];
    if (typingElements.includes(element.tagName.toLowerCase())) {
      return true;
    }
    
    if (element.hasAttribute('contenteditable')) {
      return true;
    }
    
    return false;
  }

  /**
   * Setup arrow key navigation for grids and lists
   */
  setupArrowKeyNavigation() {
    // This will be enhanced as needed for specific navigation patterns
  }

  /**
   * Handle arrow key navigation
   */
  handleArrowKeyNavigation(e) {
    const target = e.target;
    const parent = target.closest('[data-keyboard-nav]');
    
    if (!parent) return;
    
    const navType = parent.getAttribute('data-keyboard-nav');
    
    switch (navType) {
      case 'grid':
        this.handleGridNavigation(e, parent);
        break;
      case 'list':
        this.handleListNavigation(e, parent);
        break;
      case 'toolbar':
        this.handleToolbarNavigation(e, parent);
        break;
    }
  }

  /**
   * Handle grid navigation (2D arrow key movement)
   */
  handleGridNavigation(e, container) {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    const columns = parseInt(container.getAttribute('data-columns')) || 3;
    let targetIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        targetIndex = Math.min(currentIndex + 1, focusableElements.length - 1);
        break;
      case 'ArrowLeft':
        targetIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        targetIndex = Math.min(currentIndex + columns, focusableElements.length - 1);
        break;
      case 'ArrowUp':
        targetIndex = Math.max(currentIndex - columns, 0);
        break;
    }
    
    if (targetIndex !== currentIndex) {
      e.preventDefault();
      focusableElements[targetIndex].focus();
    }
  }

  /**
   * Handle list navigation (1D vertical movement)
   */
  handleListNavigation(e, container) {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let targetIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        targetIndex = Math.min(currentIndex + 1, focusableElements.length - 1);
        break;
      case 'ArrowUp':
        targetIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = focusableElements.length - 1;
        break;
    }
    
    if (targetIndex !== currentIndex) {
      e.preventDefault();
      focusableElements[targetIndex].focus();
    }
  }

  /**
   * Handle toolbar navigation (1D horizontal movement)
   */
  handleToolbarNavigation(e, container) {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let targetIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        targetIndex = Math.min(currentIndex + 1, focusableElements.length - 1);
        break;
      case 'ArrowLeft':
        targetIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = focusableElements.length - 1;
        break;
    }
    
    if (targetIndex !== currentIndex) {
      e.preventDefault();
      focusableElements[targetIndex].focus();
    }
  }

  /**
   * Setup Enter/Space activation for non-button elements
   */
  setupActivationKeys() {
    // Handled in handleActivationKeys
  }

  /**
   * Handle Enter/Space activation
   */
  handleActivationKeys(e) {
    const target = e.target;
    
    // Skip if already a button or link
    if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a') {
      return;
    }
    
    // Check if element has role="button" or is clickable
    const role = target.getAttribute('role');
    const isClickable = target.hasAttribute('data-clickable') || 
                       target.classList.contains('clickable') ||
                       role === 'button';
    
    if (isClickable) {
      e.preventDefault();
      target.click();
    }
  }

  /**
   * Get focusable elements within container
   */
  getFocusableElements(container) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[data-clickable]',
      '.clickable'
    ];
    
    const elements = container.querySelectorAll(focusableSelectors.join(', '));
    
    return Array.from(elements).filter(element => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             element.offsetWidth > 0 && 
             element.offsetHeight > 0;
    });
  }

  /**
   * Add keyboard navigation to a specific element
   */
  addNavigation(element, options = {}) {
    const navType = options.type || 'list';
    const columns = options.columns || 3;
    
    element.setAttribute('data-keyboard-nav', navType);
    if (navType === 'grid') {
      element.setAttribute('data-columns', columns.toString());
    }
    
    // Make container focusable if needed
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Close modal helper
   */
  closeModal(modalElement) {
    // Try common modal close methods
    const closeButton = modalElement.querySelector('[data-close], .close, .modal-close');
    if (closeButton) {
      closeButton.click();
      return;
    }
    
    // Dispatch close event
    modalElement.dispatchEvent(new CustomEvent('closeModal', {
      bubbles: true,
      detail: { modal: modalElement }
    }));
  }
}

// Export for global use
window.KeyboardNav = KeyboardNav;