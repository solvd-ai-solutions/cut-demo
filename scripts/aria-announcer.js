/**
 * ARIA Announcer - Handles screen reader announcements and ARIA live regions
 */

class AriaAnnouncer {
  constructor() {
    this.announcer = null;
    this.assertiveAnnouncer = null;
    this.routeAnnouncer = null;
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize ARIA announcement system
   */
  init() {
    this.createAnnouncers();
    this.setupAriaLiveRegions();
    this.setupRouteAnnouncements();
  }

  /**
   * Create screen reader announcers
   */
  createAnnouncers() {
    // Polite announcer for general messages
    this.announcer = this.createAnnouncer('a11y-announcer', 'polite');
    
    // Assertive announcer for urgent messages
    this.assertiveAnnouncer = this.createAnnouncer('a11y-announcer-assertive', 'assertive');
    
    // Route announcer for navigation changes
    this.routeAnnouncer = this.createAnnouncer('route-announcer', 'polite');
  }

  /**
   * Create a single announcer element
   */
  createAnnouncer(id, ariaLive) {
    let announcer = qs(`#${id}`);
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = id;
      announcer.setAttribute('aria-live', ariaLive);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute !important;
        left: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
        clip: rect(1px, 1px, 1px, 1px) !important;
        clip-path: inset(50%) !important;
        white-space: nowrap !important;
      `;
      document.body.appendChild(announcer);
    }
    
    return announcer;
  }

  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    const targetAnnouncer = priority === 'assertive' ? this.assertiveAnnouncer : this.announcer;
    
    if (!targetAnnouncer) return;
    
    // Clear previous message
    targetAnnouncer.textContent = '';
    
    // Announce new message with small delay to ensure it's read
    setTimeout(() => {
      targetAnnouncer.textContent = message;
    }, 100);
    
    // Clear after announcement to prevent re-reading on DOM changes
    setTimeout(() => {
      targetAnnouncer.textContent = '';
    }, 1000);
  }

  /**
   * Announce route changes
   */
  announceRoute(routeTitle) {
    if (!this.routeAnnouncer) return;
    
    const announcement = `Navigated to ${routeTitle}`;
    
    // Clear previous message
    this.routeAnnouncer.textContent = '';
    
    // Announce with delay
    setTimeout(() => {
      this.routeAnnouncer.textContent = announcement;
    }, 500); // Longer delay for route changes
    
    // Clear after announcement
    setTimeout(() => {
      this.routeAnnouncer.textContent = '';
    }, 2000);
  }

  /**
   * Setup ARIA live regions for dynamic content
   */
  setupAriaLiveRegions() {
    // Add aria-live to status regions
    const statusRegions = qsa('.status-card, .activity-item, .error-message');
    statusRegions.forEach(region => {
      if (!region.hasAttribute('aria-live')) {
        region.setAttribute('aria-live', 'polite');
      }
    });
    
    // Add aria-live to form validation messages
    const errorElements = qsa('.field__error, [role="alert"]');
    errorElements.forEach(element => {
      element.setAttribute('aria-live', 'assertive');
      element.setAttribute('aria-atomic', 'true');
    });
    
    // Add aria-live to loading states
    const loadingElements = qsa('.loading, [aria-busy="true"]');
    loadingElements.forEach(element => {
      element.setAttribute('aria-live', 'polite');
    });
  }

  /**
   * Setup route change announcements
   */
  setupRouteAnnouncements() {
    // Listen for route changes
    window.addEventListener('hashchange', () => {
      const title = document.title;
      this.announceRoute(title);
    });
    
    // Listen for custom route events
    document.addEventListener('routeChanged', (e) => {
      if (e.detail && e.detail.title) {
        this.announceRoute(e.detail.title);
      }
    });
  }

  /**
   * Announce form validation errors
   */
  announceFormErrors(errors) {
    if (!errors || errors.length === 0) return;
    
    const errorCount = errors.length;
    const message = errorCount === 1 
      ? `1 error found in form: ${errors[0]}` 
      : `${errorCount} errors found in form. Please check your entries.`;
    
    this.announce(message, 'assertive');
  }

  /**
   * Announce successful actions
   */
  announceSuccess(message) {
    this.announce(`Success: ${message}`, 'polite');
  }

  /**
   * Announce loading states
   */
  announceLoading(message = 'Loading') {
    this.announce(message, 'polite');
  }

  /**
   * Announce completion of loading
   */
  announceLoaded(message = 'Content loaded') {
    this.announce(message, 'polite');
  }

  /**
   * Setup enhanced descriptions for complex elements
   */
  enhanceElementDescriptions() {
    // Add descriptions to dashboard cards
    const actionCards = qsa('.action-card');
    actionCards.forEach((card, index) => {
      const title = card.querySelector('.action-card__title')?.textContent;
      const description = card.querySelector('.action-card__description')?.textContent;
      
      if (title && !card.hasAttribute('aria-label')) {
        const ariaLabel = description 
          ? `${title}. ${description}. Click to navigate.`
          : `${title}. Click to navigate.`;
        card.setAttribute('aria-label', ariaLabel);
      }
    });
    
    // Add descriptions to status cards
    const statusCards = qsa('.status-card');
    statusCards.forEach(card => {
      const value = card.querySelector('.status-card__value')?.textContent;
      const label = card.querySelector('.status-card__label')?.textContent;
      
      if (value && label && !card.hasAttribute('aria-label')) {
        card.setAttribute('aria-label', `${label}: ${value}`);
      }
    });
    
    // Add descriptions to form fields
    const formFields = qsa('.field');
    formFields.forEach(field => {
      const input = field.querySelector('input, select, textarea');
      const label = field.querySelector('.field__label')?.textContent;
      const error = field.querySelector('.field__error');
      
      if (input && label) {
        // Ensure proper labeling
        if (!input.hasAttribute('aria-labelledby') && !input.hasAttribute('aria-label')) {
          const labelId = `label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const labelElement = field.querySelector('.field__label');
          if (labelElement) {
            labelElement.id = labelId;
            input.setAttribute('aria-labelledby', labelId);
          }
        }
        
        // Link error messages
        if (error && !input.hasAttribute('aria-describedby')) {
          const errorId = error.id || `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          error.id = errorId;
          input.setAttribute('aria-describedby', errorId);
        }
      }
    });
  }

  /**
   * Announce dynamic content changes
   */
  announceContentChange(element, message) {
    // Mark element as having changed content
    element.setAttribute('aria-live', 'polite');
    
    if (message) {
      this.announce(message);
    }
    
    // Remove aria-live after announcement to prevent interference
    setTimeout(() => {
      if (element.getAttribute('aria-live') === 'polite') {
        element.removeAttribute('aria-live');
      }
    }, 2000);
  }

  /**
   * Update announcer content for specific elements
   */
  updateElementAnnouncement(element, newContent) {
    const existingLive = element.getAttribute('aria-live');
    
    if (existingLive) {
      // Clear and update content for screen readers
      element.textContent = '';
      setTimeout(() => {
        element.textContent = newContent;
      }, 100);
    } else {
      // Just update content normally
      element.textContent = newContent;
    }
  }
}

// Export for global use
window.AriaAnnouncer = AriaAnnouncer;