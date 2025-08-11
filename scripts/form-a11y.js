/**
 * Form Accessibility - Handles form accessibility enhancements
 */

class FormA11y {
  constructor() {
    this.enhancedForms = new Set();
    
    this.init = this.init.bind(this);
  }

  /**
   * Initialize form accessibility
   */
  init() {
    this.enhanceAllForms();
    this.setupFormObserver();
    this.setupValidationHandlers();
  }

  /**
   * Enhance all existing forms
   */
  enhanceAllForms() {
    const forms = qsa('form');
    forms.forEach(form => this.enhanceForm(form));
  }

  /**
   * Setup observer for dynamically added forms
   */
  setupFormObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Check if added node is a form
            if (node.tagName === 'FORM') {
              this.enhanceForm(node);
            }
            
            // Check for forms within added node
            const forms = node.querySelectorAll ? node.querySelectorAll('form') : [];
            forms.forEach(form => this.enhanceForm(form));
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Enhance a single form for accessibility
   */
  enhanceForm(form) {
    if (this.enhancedForms.has(form)) return;
    
    this.enhancedForms.add(form);
    
    // Add form landmarks
    this.addFormLandmarks(form);
    
    // Enhance form fields
    this.enhanceFormFields(form);
    
    // Add validation enhancements
    this.addValidationEnhancements(form);
    
    // Add submission feedback
    this.addSubmissionFeedback(form);
    
    // Add keyboard navigation
    this.addFormKeyboardNavigation(form);
  }

  /**
   * Add proper form landmarks and labels
   */
  addFormLandmarks(form) {
    // Add form role if not present
    if (!form.hasAttribute('role')) {
      form.setAttribute('role', 'form');
    }
    
    // Add form name if not present
    const formTitle = form.querySelector('h1, h2, h3, .form-title');
    if (formTitle && !form.hasAttribute('aria-labelledby')) {
      const titleId = formTitle.id || `form-title-${Date.now()}`;
      formTitle.id = titleId;
      form.setAttribute('aria-labelledby', titleId);
    }
    
    // Add fieldsets for logical groups
    this.addFieldsets(form);
  }

  /**
   * Add fieldsets for form sections
   */
  addFieldsets(form) {
    const sections = form.querySelectorAll('.form-section, .field-group');
    
    sections.forEach(section => {
      const sectionTitle = section.querySelector('h2, h3, .section-title');
      
      if (sectionTitle && section.tagName !== 'FIELDSET') {
        // Create fieldset wrapper
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        
        legend.textContent = sectionTitle.textContent;
        legend.className = 'sr-only'; // Hide visually but keep for screen readers
        
        // Move section content to fieldset
        const parent = section.parentNode;
        parent.insertBefore(fieldset, section);
        fieldset.appendChild(legend);
        fieldset.appendChild(section);
      }
    });
  }

  /**
   * Enhance individual form fields
   */
  enhanceFormFields(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      this.enhanceField(field);
    });
  }

  /**
   * Enhance a single form field
   */
  enhanceField(field) {
    // Ensure proper labeling
    this.ensureFieldLabel(field);
    
    // Add required indicators
    this.addRequiredIndicators(field);
    
    // Add format hints
    this.addFormatHints(field);
    
    // Add error containers
    this.addErrorContainer(field);
    
    // Add autocomplete attributes
    this.addAutocomplete(field);
  }

  /**
   * Ensure field has proper label
   */
  ensureFieldLabel(field) {
    // Skip hidden fields
    if (field.type === 'hidden') return;
    
    const fieldContainer = field.closest('.field, .form-group');
    let label = fieldContainer ? fieldContainer.querySelector('label') : null;
    
    // Look for label by for attribute
    if (!label && field.id) {
      label = document.querySelector(`label[for="${field.id}"]`);
    }
    
    if (label) {
      // Ensure label is properly connected
      if (!label.hasAttribute('for') && field.id) {
        label.setAttribute('for', field.id);
      }
    } else {
      // Check for aria-label or aria-labelledby
      if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
        // Try to infer label from placeholder or nearby text
        const placeholder = field.getAttribute('placeholder');
        const nearbyText = this.findNearbyLabelText(field);
        
        if (nearbyText) {
          field.setAttribute('aria-label', nearbyText);
        } else if (placeholder) {
          field.setAttribute('aria-label', placeholder);
        } else {
          console.warn('Form field missing label:', field);
        }
      }
    }
  }

  /**
   * Find nearby text that could serve as a label
   */
  findNearbyLabelText(field) {
    const container = field.closest('.field, .form-group');
    if (!container) return null;
    
    // Look for text in various elements
    const labelElements = container.querySelectorAll('.field__label, .form-label, .label');
    if (labelElements.length > 0) {
      return labelElements[0].textContent.trim();
    }
    
    // Look for headings
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      return headings[0].textContent.trim();
    }
    
    return null;
  }

  /**
   * Add required field indicators
   */
  addRequiredIndicators(field) {
    if (!field.hasAttribute('required')) return;
    
    // Add aria-required
    field.setAttribute('aria-required', 'true');
    
    // Add visual indicator to label
    const label = field.closest('.field')?.querySelector('label, .field__label');
    if (label && !label.querySelector('.required-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'required-indicator';
      indicator.textContent = ' *';
      indicator.setAttribute('aria-label', 'required');
      label.appendChild(indicator);
    }
  }

  /**
   * Add format hints for fields
   */
  addFormatHints(field) {
    const type = field.type || field.tagName.toLowerCase();
    let hint = null;
    
    switch (type) {
      case 'email':
        hint = 'Format: user@example.com';
        break;
      case 'tel':
        hint = 'Format: (555) 123-4567';
        break;
      case 'url':
        hint = 'Format: https://example.com';
        break;
      case 'password':
        const minLength = field.getAttribute('minlength');
        if (minLength) {
          hint = `Minimum ${minLength} characters`;
        }
        break;
    }
    
    if (hint && !field.hasAttribute('aria-describedby')) {
      const hintId = `hint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const hintElement = document.createElement('div');
      hintElement.id = hintId;
      hintElement.className = 'field__hint';
      hintElement.textContent = hint;
      
      // Insert hint after field
      field.parentNode.insertBefore(hintElement, field.nextSibling);
      field.setAttribute('aria-describedby', hintId);
    }
  }

  /**
   * Add error container for field
   */
  addErrorContainer(field) {
    const container = field.closest('.field, .form-group');
    if (!container) return;
    
    let errorElement = container.querySelector('.field__error, .error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field__error';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'assertive');
      
      // Insert after field
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    // Connect error to field
    if (errorElement.id) {
      const describedBy = field.getAttribute('aria-describedby');
      if (!describedBy || !describedBy.includes(errorElement.id)) {
        const newDescribedBy = describedBy ? `${describedBy} ${errorElement.id}` : errorElement.id;
        field.setAttribute('aria-describedby', newDescribedBy);
      }
    }
  }

  /**
   * Add appropriate autocomplete attributes
   */
  addAutocomplete(field) {
    if (field.hasAttribute('autocomplete')) return;
    
    const name = field.name?.toLowerCase() || '';
    const id = field.id?.toLowerCase() || '';
    const type = field.type || '';
    
    // Map common field names to autocomplete values
    const autocompleteMap = {
      'email': 'email',
      'phone': 'tel',
      'telephone': 'tel',
      'fname': 'given-name',
      'firstname': 'given-name',
      'lname': 'family-name',
      'lastname': 'family-name',
      'address': 'street-address',
      'city': 'address-level2',
      'state': 'address-level1',
      'zip': 'postal-code',
      'zipcode': 'postal-code',
      'country': 'country',
      'organization': 'organization',
      'company': 'organization'
    };
    
    // Check field name/id against map
    for (const [key, value] of Object.entries(autocompleteMap)) {
      if (name.includes(key) || id.includes(key)) {
        field.setAttribute('autocomplete', value);
        break;
      }
    }
    
    // Type-based autocomplete
    if (!field.hasAttribute('autocomplete')) {
      switch (type) {
        case 'email':
          field.setAttribute('autocomplete', 'email');
          break;
        case 'tel':
          field.setAttribute('autocomplete', 'tel');
          break;
        case 'url':
          field.setAttribute('autocomplete', 'url');
          break;
      }
    }
  }

  /**
   * Add validation enhancements
   */
  addValidationEnhancements(form) {
    // Real-time validation
    form.addEventListener('input', (e) => {
      this.validateFieldRealtime(e.target);
    });
    
    // Validation on blur
    form.addEventListener('blur', (e) => {
      this.validateField(e.target);
    }, true);
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
        this.focusFirstError(form);
      }
    });
  }

  /**
   * Setup global validation handlers
   */
  setupValidationHandlers() {
    // Custom validation messages
    document.addEventListener('invalid', (e) => {
      this.showCustomValidationMessage(e.target);
    }, true);
  }

  /**
   * Validate field in real-time
   */
  validateFieldRealtime(field) {
    // Only validate after user has interacted with field
    if (!field.hasAttribute('data-touched')) {
      field.addEventListener('blur', () => {
        field.setAttribute('data-touched', 'true');
      }, { once: true });
      return;
    }
    
    this.validateField(field);
  }

  /**
   * Validate a single field
   */
  validateField(field) {
    const isValid = field.checkValidity();
    const errorElement = this.getErrorElement(field);
    
    if (isValid) {
      this.clearFieldError(field, errorElement);
    } else {
      this.showFieldError(field, errorElement, field.validationMessage);
    }
    
    return isValid;
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    const errors = [];
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
        errors.push(this.getFieldLabel(field) || field.name || 'Unknown field');
      }
    });
    
    // Announce errors to screen readers
    if (!isValid && window.CutOrderApp?.a11y?.ariaAnnouncer) {
      window.CutOrderApp.a11y.ariaAnnouncer.announceFormErrors(errors);
    }
    
    return isValid;
  }

  /**
   * Show custom validation message
   */
  showCustomValidationMessage(field) {
    const errorElement = this.getErrorElement(field);
    let message = field.validationMessage;
    
    // Customize common validation messages
    if (field.validity.valueMissing) {
      const label = this.getFieldLabel(field);
      message = label ? `${label} is required` : 'This field is required';
    } else if (field.validity.typeMismatch) {
      switch (field.type) {
        case 'email':
          message = 'Please enter a valid email address';
          break;
        case 'url':
          message = 'Please enter a valid URL';
          break;
        default:
          message = 'Please enter a valid value';
      }
    } else if (field.validity.patternMismatch) {
      const title = field.getAttribute('title');
      message = title || 'Please match the required format';
    }
    
    this.showFieldError(field, errorElement, message);
  }

  /**
   * Show field error
   */
  showFieldError(field, errorElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('field--error');
  }

  /**
   * Clear field error
   */
  clearFieldError(field, errorElement) {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    
    field.removeAttribute('aria-invalid');
    field.classList.remove('field--error');
  }

  /**
   * Get error element for field
   */
  getErrorElement(field) {
    const container = field.closest('.field, .form-group');
    return container ? container.querySelector('.field__error, .error-message') : null;
  }

  /**
   * Get field label text
   */
  getFieldLabel(field) {
    const label = field.labels?.[0] || document.querySelector(`label[for="${field.id}"]`);
    if (label) {
      return label.textContent.replace(/\s*\*\s*$/, '').trim(); // Remove required asterisk
    }
    
    const ariaLabel = field.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }
    
    const container = field.closest('.field, .form-group');
    const labelElement = container?.querySelector('.field__label, .form-label');
    if (labelElement) {
      return labelElement.textContent.replace(/\s*\*\s*$/, '').trim();
    }
    
    return null;
  }

  /**
   * Focus first error in form
   */
  focusFirstError(form) {
    const firstError = form.querySelector('[aria-invalid="true"], .field--error input, .field--error select, .field--error textarea');
    
    if (firstError && window.CutOrderApp?.a11y) {
      window.CutOrderApp.a11y.focusElement(firstError);
    }
  }

  /**
   * Add submission feedback
   */
  addSubmissionFeedback(form) {
    const submitButton = form.querySelector('[type="submit"], .submit-button');
    
    if (submitButton) {
      form.addEventListener('submit', () => {
        // Add loading state
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.disabled = true;
        
        // Announce submission
        if (window.CutOrderApp?.a11y?.ariaAnnouncer) {
          window.CutOrderApp.a11y.ariaAnnouncer.announce('Form submitted, processing...');
        }
      });
    }
  }

  /**
   * Add keyboard navigation to form
   */
  addFormKeyboardNavigation(form) {
    // Add data attribute for keyboard navigation
    form.setAttribute('data-keyboard-nav', 'form');
    
    // Handle Enter key on non-submit buttons
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'BUTTON' && e.target.type !== 'submit') {
        e.preventDefault();
        e.target.click();
      }
    });
  }
}

// Export for global use
window.FormA11y = FormA11y;