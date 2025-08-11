/**
 * Accessibility (A11y) Manager - Main Coordinator
 * Handles initialization and coordination of all accessibility features
 */

class A11y {
  constructor() {
    this.focusManager = null;
    this.keyboardNav = null;
    this.ariaAnnouncer = null;
    this.formA11y = null;
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize all accessibility features
   */
  init() {
    // Initialize sub-modules
    if (typeof FocusManager !== 'undefined') {
      this.focusManager = new FocusManager();
      this.focusManager.init();
    }
    
    if (typeof KeyboardNav !== 'undefined') {
      this.keyboardNav = new KeyboardNav();
      this.keyboardNav.init();
    }
    
    if (typeof AriaAnnouncer !== 'undefined') {
      this.ariaAnnouncer = new AriaAnnouncer();
      this.ariaAnnouncer.init();
    }
    
    if (typeof FormA11y !== 'undefined') {
      this.formA11y = new FormA11y();
      this.formA11y.init();
    }
    
    // Setup global accessibility features
    this.setupSkipLinks();
    this.setupReducedMotion();
    this.performInitialAudit();
  }

  /**
   * Setup skip links for keyboard navigation
   */
  setupSkipLinks() {
    const skipLink = qs('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = qs(skipLink.getAttribute('href'));
        if (target && this.focusManager) {
          this.focusManager.focusElement(target);
        }
      });
    }
  }

  /**
   * Setup reduced motion preferences
   */
  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updateMotionPreference = (mediaQuery) => {
      document.body.classList.toggle('reduce-motion', mediaQuery.matches);
    };
    
    updateMotionPreference(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', updateMotionPreference);
  }

  /**
   * Perform initial accessibility audit
   */
  performInitialAudit() {
    // Check for missing alt text
    const images = qsa('img:not([alt])');
    if (images.length > 0) {
      console.warn(`Accessibility: ${images.length} images missing alt text`);
    }
    
    // Check for missing form labels
    const inputs = qsa('input:not([aria-label]):not([aria-labelledby])');
    const inputsWithoutLabels = Array.from(inputs).filter(input => {
      const label = qs(`label[for="${input.id}"]`);
      return !label && input.type !== 'hidden';
    });
    
    if (inputsWithoutLabels.length > 0) {
      console.warn(`Accessibility: ${inputsWithoutLabels.length} form inputs missing labels`);
    }
    
    // Check for missing heading hierarchy
    const headings = qsa('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      let previousLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > previousLevel + 1) {
          console.warn(`Accessibility: Heading hierarchy skip detected (${heading.tagName})`);
        }
        previousLevel = level;
      });
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    if (this.ariaAnnouncer) {
      this.ariaAnnouncer.announce(message, priority);
    }
  }

  /**
   * Focus an element safely
   */
  focusElement(element) {
    if (this.focusManager) {
      this.focusManager.focusElement(element);
    }
  }

  /**
   * Trap focus within an element (for modals)
   */
  trapFocus(element) {
    if (this.focusManager) {
      this.focusManager.trapFocus(element);
    }
  }

  /**
   * Restore focus after modal closes
   */
  restoreFocus(modalElement) {
    if (this.focusManager) {
      this.focusManager.restoreFocus(modalElement);
    }
  }

  /**
   * Add keyboard navigation to element
   */
  addKeyboardNav(element, options = {}) {
    if (this.keyboardNav) {
      this.keyboardNav.addNavigation(element, options);
    }
  }

  /**
   * Enhance form accessibility
   */
  enhanceForm(form) {
    if (this.formA11y) {
      this.formA11y.enhanceForm(form);
    }
  }
}

// Export for global use
window.A11y = A11y;