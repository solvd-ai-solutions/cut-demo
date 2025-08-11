/**
 * Interactions Manager for Cut & Order Manager
 * Handles finite state machines for component interactions
 */

class Interactions {
  constructor(app) {
    this.app = app;
    this.machines = new Map();
    this.activeStates = new Map();
    
    // Interaction definitions
    this.INTERACTIONS = {
      // Dashboard interactions
      "Dashboard.ActionCard": { 
        on: "click", 
        do: ["navigateToRoute", "trackInteraction"] 
      },
      "Dashboard.ActionCard": { 
        on: "keydown", 
        do: ["handleKeyboardNavigation"] 
      },
      
      // Form interactions
      "CutJobForm.Submit": { 
        on: "submit", 
        do: ["validateForm", "createJob", "generateTicket", "navigateToDashboard"] 
      },
      "CutJobForm.Input": { 
        on: "input", 
        do: ["validateField", "updateCostCalculation", "updatePreview"] 
      },
      "CutJobForm.Back": { 
        on: "click", 
        do: ["confirmUnsavedChanges", "navigateToDashboard"] 
      },
      
      // Button interactions
      "Button.Primary": { 
        states: ["default", "loading", "disabled", "success", "error"],
        on: "click", 
        do: ["executeAction", "showFeedback"] 
      },
      "Button.Secondary": { 
        states: ["default", "loading", "disabled"],
        on: "click", 
        do: ["executeAction"] 
      },
      
      // Modal interactions
      "Modal.Open": { 
        on: "click", 
        do: ["openModal", "trapFocus"] 
      },
      "Modal.Close": { 
        on: "click", 
        do: ["closeModal", "restoreFocus"] 
      },
      "Modal.Backdrop": { 
        on: "click", 
        do: ["closeModal"] 
      },
      
      // Form validation
      "Field.Validate": { 
        on: "blur", 
        do: ["validateField", "showValidationMessage"] 
      },
      "Field.ClearError": { 
        on: "focus", 
        do: ["clearValidationMessage"] 
      }
    };
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize interactions system
   */
  init() {
    this.setupInteractionMachines();
    this.bindGlobalInteractions();
    
    // Listen for DOM updates to rebind interactions
    document.addEventListener('appStateChange', () => {
      this.rebindInteractions();
    });
  }

  /**
   * Setup finite state machines for interactions
   */
  setupInteractionMachines() {
    // Button state machine
    this.machines.set('button', {
      states: {
        default: {
          on: {
            CLICK: 'loading',
            DISABLE: 'disabled'
          }
        },
        loading: {
          on: {
            SUCCESS: 'success',
            ERROR: 'error',
            COMPLETE: 'default'
          }
        },
        disabled: {
          on: {
            ENABLE: 'default'
          }
        },
        success: {
          on: {
            RESET: 'default'
          }
        },
        error: {
          on: {
            RETRY: 'default',
            RESET: 'default'
          }
        }
      },
      initial: 'default'
    });

    // Form field state machine
    this.machines.set('field', {
      states: {
        pristine: {
          on: {
            FOCUS: 'focused',
            INPUT: 'dirty'
          }
        },
        focused: {
          on: {
            BLUR: 'blurred',
            INPUT: 'dirty'
          }
        },
        dirty: {
          on: {
            VALIDATE: 'validating',
            BLUR: 'blurred'
          }
        },
        validating: {
          on: {
            VALID: 'valid',
            INVALID: 'invalid'
          }
        },
        valid: {
          on: {
            INPUT: 'dirty',
            RESET: 'pristine'
          }
        },
        invalid: {
          on: {
            INPUT: 'dirty',
            FOCUS: 'focused',
            RESET: 'pristine'
          }
        },
        blurred: {
          on: {
            FOCUS: 'focused',
            VALIDATE: 'validating'
          }
        }
      },
      initial: 'pristine'
    });

    // Modal state machine
    this.machines.set('modal', {
      states: {
        closed: {
          on: {
            OPEN: 'opening'
          }
        },
        opening: {
          on: {
            OPENED: 'open'
          }
        },
        open: {
          on: {
            CLOSE: 'closing'
          }
        },
        closing: {
          on: {
            CLOSED: 'closed'
          }
        }
      },
      initial: 'closed'
    });
  }

  /**
   * Bind global interactions
   */
  bindGlobalInteractions() {
    // Delegate event listeners for better performance
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('input', this.handleInput.bind(this));
    document.addEventListener('focus', this.handleFocus.bind(this), true);
    document.addEventListener('blur', this.handleBlur.bind(this), true);
    document.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    const target = event.target;
    const actions = this.getElementActions(target, 'click');
    
    if (actions.length > 0) {
      this.executeActions(target, actions, event);
    }
  }

  /**
   * Handle keyboard events
   */
  handleKeydown(event) {
    const target = event.target;
    const actions = this.getElementActions(target, 'keydown');
    
    if (actions.length > 0) {
      this.executeActions(target, actions, event);
    }
    
    // Global keyboard shortcuts
    this.handleGlobalKeyboard(event);
  }

  /**
   * Handle input events
   */
  handleInput(event) {
    const target = event.target;
    const actions = this.getElementActions(target, 'input');
    
    if (actions.length > 0) {
      this.executeActions(target, actions, event);
    }
    
    // Auto-validation for form fields
    if (target.matches('input, select, textarea')) {
      this.transitionFieldState(target, 'INPUT');
    }
  }

  /**
   * Handle focus events
   */
  handleFocus(event) {
    const target = event.target;
    
    if (target.matches('input, select, textarea')) {
      this.transitionFieldState(target, 'FOCUS');
      this.clearFieldError(target);
    }
  }

  /**
   * Handle blur events
   */
  handleBlur(event) {
    const target = event.target;
    
    if (target.matches('input, select, textarea')) {
      this.transitionFieldState(target, 'BLUR');
      this.validateField(target);
    }
  }

  /**
   * Handle form submit events
   */
  handleSubmit(event) {
    const target = event.target;
    const actions = this.getElementActions(target, 'submit');
    
    if (actions.length > 0) {
      event.preventDefault();
      this.executeActions(target, actions, event);
    }
  }

  /**
   * Get actions for an element based on event type
   */
  getElementActions(element, eventType) {
    const actions = [];
    
    // Check for data attributes
    const actionAttr = element.getAttribute(`data-${eventType}-action`);
    if (actionAttr) {
      actions.push(...actionAttr.split(',').map(a => a.trim()));
    }
    
    // Check for component-specific interactions
    const componentType = this.getComponentType(element);
    if (componentType) {
      const interaction = this.INTERACTIONS[componentType];
      if (interaction && interaction.on === eventType) {
        actions.push(...interaction.do);
      }
    }
    
    return actions;
  }

  /**
   * Determine component type from element
   */
  getComponentType(element) {
    // Check class names for component types
    if (element.classList.contains('action-card')) {
      return 'Dashboard.ActionCard';
    }
    
    if (element.classList.contains('button--primary')) {
      return 'Button.Primary';
    }
    
    if (element.classList.contains('button--secondary')) {
      return 'Button.Secondary';
    }
    
    if (element.classList.contains('back-button')) {
      return 'CutJobForm.Back';
    }
    
    if (element.matches('form')) {
      return 'CutJobForm.Submit';
    }
    
    if (element.matches('input, select, textarea')) {
      return 'CutJobForm.Input';
    }
    
    return null;
  }

  /**
   * Execute a list of actions
   */
  async executeActions(element, actions, event) {
    for (const action of actions) {
      try {
        await this.executeAction(element, action, event);
      } catch (error) {
        console.error(`Error executing action '${action}':`, error);
      }
    }
  }

  /**
   * Execute a single action
   */
  async executeAction(element, action, event) {
    switch (action) {
      case 'navigateToRoute':
        this.navigateToRoute(element);
        break;
        
      case 'trackInteraction':
        this.trackInteraction(element, event);
        break;
        
      case 'handleKeyboardNavigation':
        this.handleKeyboardNavigation(element, event);
        break;
        
      case 'validateForm':
        return this.validateForm(element);
        
      case 'createJob':
        return this.createJob(element);
        
      case 'generateTicket':
        this.generateTicket(element);
        break;
        
      case 'navigateToDashboard':
        this.navigateToDashboard();
        break;
        
      case 'validateField':
        this.validateField(element);
        break;
        
      case 'updateCostCalculation':
        this.updateCostCalculation(element);
        break;
        
      case 'updatePreview':
        this.updatePreview(element);
        break;
        
      case 'confirmUnsavedChanges':
        return this.confirmUnsavedChanges(element);
        
      case 'executeAction':
        this.executeButtonAction(element);
        break;
        
      case 'showFeedback':
        this.showButtonFeedback(element);
        break;
        
      case 'back':
        this.navigateBack();
        break;
        
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  /**
   * Navigate to route from element data
   */
  navigateToRoute(element) {
    const route = element.getAttribute('data-route');
    if (route && this.app.router) {
      this.app.router.navigate(route);
    }
  }

  /**
   * Track interaction for analytics
   */
  trackInteraction(element, event) {
    const componentType = this.getComponentType(element);
    const route = element.getAttribute('data-route');
    
    this.app.trackEvent('interaction', {
      component: componentType,
      element: element.tagName.toLowerCase(),
      route: route,
      event_type: event.type
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(element, event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      element.click();
    }
  }

  /**
   * Handle global keyboard shortcuts
   */
  handleGlobalKeyboard(event) {
    // Escape key handling
    if (event.key === 'Escape') {
      this.handleEscapeKey(event);
    }
    
    // Alt + number shortcuts
    if (event.altKey && ['1', '2', '3'].includes(event.key)) {
      event.preventDefault();
      const routes = ['new-job', 'inventory', 'job-manager'];
      const routeIndex = parseInt(event.key) - 1;
      if (routes[routeIndex] && this.app.router) {
        this.app.router.navigate(routes[routeIndex]);
      }
    }
  }

  /**
   * Handle escape key
   */
  handleEscapeKey(event) {
    // Close modals first
    const openModal = qs('.modal[aria-hidden="false"]');
    if (openModal) {
      this.closeModal(openModal);
      return;
    }
    
    // Navigate back if not on dashboard
    if (this.app.getState().currentView !== 'dashboard' && this.app.router) {
      this.app.router.navigate('dashboard');
    }
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    const fields = qsa('input[required], select[required], textarea[required]', form);
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous error
    this.clearFieldError(field);
    
    // Required validation
    if (required && !value) {
      this.showFieldError(field, 'This field is required');
      this.transitionFieldState(field, 'INVALID');
      return false;
    }
    
    // Type-specific validation
    if (value) {
      switch (type) {
        case 'email':
          if (!this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            this.transitionFieldState(field, 'INVALID');
            return false;
          }
          break;
          
        case 'number':
          const num = parseFloat(value);
          if (isNaN(num)) {
            this.showFieldError(field, 'Please enter a valid number');
            this.transitionFieldState(field, 'INVALID');
            return false;
          }
          
          const min = parseFloat(field.getAttribute('min'));
          const max = parseFloat(field.getAttribute('max'));
          
          if (!isNaN(min) && num < min) {
            this.showFieldError(field, `Value must be at least ${min}`);
            this.transitionFieldState(field, 'INVALID');
            return false;
          }
          
          if (!isNaN(max) && num > max) {
            this.showFieldError(field, `Value must be no more than ${max}`);
            this.transitionFieldState(field, 'INVALID');
            return false;
          }
          break;
      }
    }
    
    this.transitionFieldState(field, 'VALID');
    return true;
  }

  /**
   * Show field validation error
   */
  showFieldError(field, message) {
    const errorId = field.getAttribute('aria-describedby');
    const errorElement = errorId ? qs(`#${errorId}`) : null;
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('field--error');
  }

  /**
   * Clear field validation error
   */
  clearFieldError(field) {
    const errorId = field.getAttribute('aria-describedby');
    const errorElement = errorId ? qs(`#${errorId}`) : null;
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    
    field.removeAttribute('aria-invalid');
    field.classList.remove('field--error');
  }

  /**
   * Transition field state
   */
  transitionFieldState(field, event) {
    const fieldId = field.id || field.name || 'anonymous';
    const machine = this.machines.get('field');
    
    if (!machine) return;
    
    const currentState = this.activeStates.get(`field-${fieldId}`) || machine.initial;
    const transition = machine.states[currentState]?.on?.[event];
    
    if (transition) {
      this.activeStates.set(`field-${fieldId}`, transition);
      this.updateFieldAppearance(field, transition);
    }
  }

  /**
   * Update field appearance based on state
   */
  updateFieldAppearance(field, state) {
    // Remove all state classes
    field.classList.remove('field--pristine', 'field--focused', 'field--dirty', 'field--valid', 'field--invalid');
    
    // Add current state class
    field.classList.add(`field--${state}`);
  }

  /**
   * Create job from form
   */
  createJob(form) {
    if (!this.validateForm(form)) {
      return false;
    }
    
    // This would be handled by the router in a real implementation
    // For now, we'll just mark it as successful
    return true;
  }

  /**
   * Navigate back
   */
  navigateBack() {
    if (this.app.router) {
      this.app.router.navigate('dashboard');
    }
  }

  /**
   * Navigate to dashboard
   */
  navigateToDashboard() {
    if (this.app.router) {
      this.app.router.navigate('dashboard');
    }
  }

  /**
   * Confirm unsaved changes
   */
  confirmUnsavedChanges(element) {
    const form = element.closest('form');
    if (!form) return true;
    
    const formData = new FormData(form);
    let hasData = false;
    
    for (const [key, value] of formData) {
      if (value.trim()) {
        hasData = true;
        break;
      }
    }
    
    if (hasData) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    
    return true;
  }

  /**
   * Execute button action
   */
  executeButtonAction(button) {
    const action = button.getAttribute('data-action');
    
    if (action) {
      this.transitionButtonState(button, 'CLICK');
      
      // Simulate async action
      setTimeout(() => {
        this.transitionButtonState(button, 'COMPLETE');
      }, 1000);
    }
  }

  /**
   * Show button feedback
   */
  showButtonFeedback(button) {
    // Add ripple effect or other visual feedback
    button.classList.add('button--active');
    
    setTimeout(() => {
      button.classList.remove('button--active');
    }, 150);
  }

  /**
   * Transition button state
   */
  transitionButtonState(button, event) {
    const buttonId = button.id || 'anonymous';
    const machine = this.machines.get('button');
    
    if (!machine) return;
    
    const currentState = this.activeStates.get(`button-${buttonId}`) || machine.initial;
    const transition = machine.states[currentState]?.on?.[event];
    
    if (transition) {
      this.activeStates.set(`button-${buttonId}`, transition);
      this.updateButtonAppearance(button, transition);
    }
  }

  /**
   * Update button appearance based on state
   */
  updateButtonAppearance(button, state) {
    // Remove all state classes
    button.classList.remove('button--loading', 'button--success', 'button--error');
    
    // Update based on state
    switch (state) {
      case 'loading':
        button.classList.add('button--loading');
        button.disabled = true;
        break;
        
      case 'success':
        button.classList.add('button--success');
        setTimeout(() => {
          this.transitionButtonState(button, 'RESET');
        }, 2000);
        break;
        
      case 'error':
        button.classList.add('button--error');
        setTimeout(() => {
          this.transitionButtonState(button, 'RESET');
        }, 3000);
        break;
        
      case 'default':
        button.disabled = false;
        break;
        
      case 'disabled':
        button.disabled = true;
        break;
    }
  }

  /**
   * Utility: Check if email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Rebind interactions after DOM updates
   */
  rebindInteractions() {
    // Clear active states for elements that no longer exist
    const elementsToCheck = Array.from(this.activeStates.keys());
    
    elementsToCheck.forEach(key => {
      const [type, id] = key.split('-');
      const element = qs(`#${id}`);
      
      if (!element) {
        this.activeStates.delete(key);
      }
    });
  }
}

// Export for global use
window.Interactions = Interactions;