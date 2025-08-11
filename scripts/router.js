/**
 * Hash-based Router for Cut & Order Manager
 * Handles client-side navigation between views
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.defaultRoute = 'dashboard';
    
    // Bind methods
    this.navigate = this.navigate.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }

  /**
   * Initialize the router
   */
  init() {
    // Register routes
    this.registerRoutes();
    
    // Set up event listeners
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('popstate', this.handlePopState);
    
    // Handle initial route
    this.handleInitialRoute();
  }

  /**
   * Register all application routes
   */
  registerRoutes() {
    this.routes.set('dashboard', {
      path: '#/dashboard',
      title: 'Dashboard - Cut & Order Manager',
      component: 'dashboard',
      template: '#dashboard-template',
      handler: this.renderDashboard.bind(this)
    });

    this.routes.set('new-job', {
      path: '#/new-job',
      title: 'Create Cut Job - Cut & Order Manager',
      component: 'cut-job-form',
      template: '#cut-job-form-template',
      handler: this.renderCutJobForm.bind(this)
    });

    this.routes.set('job-manager', {
      path: '#/job-manager',
      title: 'Job Manager - Cut & Order Manager',
      component: 'job-manager',
      template: '#job-manager-template',
      handler: this.renderJobManager.bind(this)
    });

    this.routes.set('inventory', {
      path: '#/inventory',
      title: 'Inventory Manager - Cut & Order Manager',
      component: 'inventory-manager',
      template: '#inventory-manager-template',
      handler: this.renderInventoryManager.bind(this)
    });
  }

  /**
   * Navigate to a route
   */
  navigate(routeName, params = {}) {
    const route = this.routes.get(routeName);
    
    if (!route) {
      console.warn(`Route '${routeName}' not found`);
      this.navigate(this.defaultRoute);
      return;
    }

    // Update URL
    if (window.location.hash !== route.path) {
      window.location.hash = route.path;
    }

    // Update document title
    document.title = route.title;

    // Track navigation
    if (window.CutOrderApp) {
      window.CutOrderApp.trackEvent('navigation', { 
        from: this.currentRoute?.component,
        to: route.component 
      });
    }

    // Update app state
    if (window.CutOrderApp) {
      window.CutOrderApp.setState({ currentView: routeName });
    }

    // Render the route
    this.renderRoute(route, params);
    
    this.currentRoute = route;
  }

  /**
   * Handle hash change events
   */
  handleHashChange() {
    const hash = window.location.hash;
    const routeName = this.getRouteNameFromHash(hash);
    
    if (routeName && routeName !== this.currentRoute?.component) {
      this.navigate(routeName);
    }
  }

  /**
   * Handle browser back/forward
   */
  handlePopState(event) {
    this.handleHashChange();
  }

  /**
   * Handle initial route on page load
   */
  handleInitialRoute() {
    const hash = window.location.hash;
    const routeName = this.getRouteNameFromHash(hash) || this.defaultRoute;
    this.navigate(routeName);
  }

  /**
   * Extract route name from hash
   */
  getRouteNameFromHash(hash) {
    if (!hash || hash === '#' || hash === '#/') {
      return this.defaultRoute;
    }
    
    // Remove '#/' prefix
    const path = hash.replace(/^#\//, '');
    
    // Find matching route
    for (const [routeName, route] of this.routes) {
      if (route.path === hash) {
        return routeName;
      }
    }
    
    // Direct path match
    if (this.routes.has(path)) {
      return path;
    }
    
    return null;
  }

  /**
   * Render a route
   */
  renderRoute(route, params = {}) {
    const appContent = qs('#app-content');
    
    if (!appContent) {
      console.error('App content container not found');
      return;
    }

    try {
      // Call route handler
      route.handler(appContent, params);
      
      // Announce route change for screen readers
      this.announceRouteChange(route);
      
      // Focus management
      this.manageFocus(route);
      
    } catch (error) {
      console.error('Error rendering route:', error);
      this.renderError(appContent, 'Failed to load page');
    }
  }

  /**
   * Render dashboard view
   */
  renderDashboard(container, params) {
    const template = qs('#dashboard-template');
    if (!template) {
      throw new Error('Dashboard template not found');
    }

    container.innerHTML = template.innerHTML;
    
    // Initialize dashboard interactions
    this.initDashboardInteractions(container);
    
    // Update status with real data
    this.updateDashboardStatus(container);
  }

  /**
   * Render cut job form view
   */
  renderCutJobForm(container, params) {
    const template = qs('#cut-job-form-template');
    if (!template) {
      throw new Error('Cut job form template not found');
    }

    container.innerHTML = template.innerHTML;
    
    // Initialize form interactions
    this.initCutJobFormInteractions(container);
    
    // Populate materials dropdown
    this.populateMaterialsDropdown(container);
  }

  /**
   * Render job manager view (placeholder)
   */
  renderJobManager(container, params) {
    container.innerHTML = `
      <div class="page-view">
        <header class="page-header">
          <div class="page-header__content">
            <div class="page-header__nav">
              <button class="button button--secondary back-button" data-action="back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12,19 5,12 12,5"></polyline>
                </svg>
                Back
              </button>
              <div class="page-header__info">
                <h1 class="page-header__title">Job Manager</h1>
                <p class="page-header__subtitle">Manage and track all cutting jobs</p>
              </div>
            </div>
          </div>
        </header>
        <div style="padding: var(--space-6); text-align: center;">
          <p>Job Manager view is under construction.</p>
          <p style="margin-top: var(--space-4); color: var(--color-text-muted);">This would show a list of all jobs with search, filtering, and status management.</p>
        </div>
      </div>
    `;
    
    this.initBackButton(container);
  }

  /**
   * Render inventory manager view (placeholder)
   */
  renderInventoryManager(container, params) {
    container.innerHTML = `
      <div class="page-view">
        <header class="page-header">
          <div class="page-header__content">
            <div class="page-header__nav">
              <button class="button button--secondary back-button" data-action="back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12,19 5,12 12,5"></polyline>
                </svg>
                Back
              </button>
              <div class="page-header__info">
                <h1 class="page-header__title">Inventory Manager</h1>
                <p class="page-header__subtitle">Track stock levels and manage materials</p>
              </div>
            </div>
          </div>
        </header>
        <div style="padding: var(--space-6); text-align: center;">
          <p>Inventory Manager view is under construction.</p>
          <p style="margin-top: var(--space-4); color: var(--color-text-muted);">This would show material inventory with stock levels, reorder alerts, and supplier management.</p>
        </div>
      </div>
    `;
    
    this.initBackButton(container);
  }

  /**
   * Initialize dashboard interactions
   */
  initDashboardInteractions(container) {
    // Action card navigation
    const actionCards = qsa('[data-route]', container);
    actionCards.forEach(card => {
      const route = card.dataset.route;
      
      // Click handler
      card.addEventListener('click', () => {
        this.navigate(route);
      });
      
      // Keyboard handler
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigate(route);
        }
      });
    });
  }

  /**
   * Initialize cut job form interactions
   */
  initCutJobFormInteractions(container) {
    this.initBackButton(container);
    
    const form = qs('#cut-job-form', container);
    if (!form) return;

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleJobFormSubmission(form);
    });

    // Real-time cost calculation
    const inputs = qsa('input, select', form);
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateCostCalculation(container);
      });
    });
  }

  /**
   * Initialize back button functionality
   */
  initBackButton(container) {
    const backButton = qs('.back-button', container);
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.navigate('dashboard');
      });
    }
  }

  /**
   * Update dashboard status with real data
   */
  updateDashboardStatus(container) {
    if (!window.CutOrderApp) return;
    
    const state = window.CutOrderApp.getState();
    const jobs = state.jobs || [];
    const materials = state.materials || [];
    
    // Calculate metrics
    const completedToday = jobs.filter(job => {
      if (job.status !== 'completed' || !job.completedAt) return false;
      const today = new Date().toDateString();
      const completedDate = new Date(job.completedAt).toDateString();
      return today === completedDate;
    }).length;
    
    const pendingJobs = jobs.filter(job => job.status === 'pending').length;
    
    const lowStockItems = materials.filter(material => 
      material.currentStock <= material.reorderThreshold
    ).length;
    
    const todaysRevenue = jobs
      .filter(job => {
        if (job.status !== 'completed' || !job.completedAt) return false;
        const today = new Date().toDateString();
        const completedDate = new Date(job.completedAt).toDateString();
        return today === completedDate;
      })
      .reduce((total, job) => total + (job.totalCost || 0), 0);

    // Update status cards
    const statusCards = qsa('.status-card__value', container);
    if (statusCards.length >= 4) {
      statusCards[0].textContent = completedToday.toString();
      statusCards[1].textContent = pendingJobs.toString();
      statusCards[2].textContent = lowStockItems.toString();
      statusCards[3].textContent = `$${todaysRevenue.toLocaleString()}`;
    }
  }

  /**
   * Populate materials dropdown
   */
  populateMaterialsDropdown(container) {
    if (!window.CutOrderApp) return;
    
    const state = window.CutOrderApp.getState();
    const materials = state.materials || [];
    const select = qs('#material', container);
    
    if (!select) return;
    
    // Clear existing options
    select.innerHTML = '<option value="">Select a material</option>';
    
    // Add material options
    materials.forEach(material => {
      const option = document.createElement('option');
      option.value = material.id;
      option.textContent = `${material.name} - $${material.unitCost.toFixed(2)}/ft (Stock: ${material.currentStock}ft)`;
      select.appendChild(option);
    });
  }

  /**
   * Handle job form submission
   */
  handleJobFormSubmission(form) {
    if (!window.CutOrderApp) return;
    
    const formData = new FormData(form);
    const state = window.CutOrderApp.getState();
    const materials = state.materials || [];
    
    // Get form values
    const customerName = formData.get('customerName');
    const materialId = formData.get('material');
    const length = parseFloat(formData.get('length'));
    const quantity = parseInt(formData.get('quantity'));
    
    // Find selected material
    const material = materials.find(m => m.id === materialId);
    
    if (!material) {
      this.showFormError(form, 'material', 'Please select a material');
      return;
    }
    
    // Check stock availability
    const totalNeeded = length * quantity;
    if (totalNeeded > material.currentStock) {
      this.showFormError(form, 'length', `Insufficient stock. Available: ${material.currentStock}ft, Needed: ${totalNeeded}ft`);
      return;
    }
    
    // Calculate cost
    const totalCost = window.CutOrderApp.calculateJobCost(material, length, quantity);
    
    // Create job
    const orderCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    const jobData = {
      customerName,
      material,
      length,
      quantity,
      totalCost,
      orderCode
    };
    
    const newJob = window.CutOrderApp.addJob(jobData);
    
    // Generate ticket
    window.CutOrderApp.generateJobTicket(newJob);
    
    // Navigate back to dashboard
    this.navigate('dashboard');
  }

  /**
   * Show form validation error
   */
  showFormError(form, fieldName, message) {
    const errorElement = qs(`#${fieldName}-error`, form);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute('aria-live', 'polite');
    }
    
    const field = qs(`[name="${fieldName}"]`, form);
    if (field) {
      field.focus();
      field.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Update cost calculation in real-time
   */
  updateCostCalculation(container) {
    if (!window.CutOrderApp) return;
    
    const form = qs('#cut-job-form', container);
    if (!form) return;
    
    const formData = new FormData(form);
    const state = window.CutOrderApp.getState();
    const materials = state.materials || [];
    
    const materialId = formData.get('material');
    const length = formData.get('length');
    const quantity = formData.get('quantity');
    
    const material = materials.find(m => m.id === materialId);
    
    if (material && length && quantity) {
      const cost = window.CutOrderApp.calculateJobCost(material, parseFloat(length), parseInt(quantity));
      
      // Update button text
      const submitBtn = qs('#create-job-btn', container);
      if (submitBtn) {
        submitBtn.textContent = `Create Job - $${cost.toFixed(2)}`;
        submitBtn.disabled = false;
      }
      
      // Update cost breakdown
      this.updateCostBreakdown(container, material, parseFloat(length), parseInt(quantity), cost);
      
      // Update job summary
      this.updateJobSummary(container, formData.get('customerName'), material, parseFloat(length), parseInt(quantity));
      
      // Update stock warning
      this.updateStockWarning(container, material, parseFloat(length) * parseInt(quantity));
      
    } else {
      // Reset button
      const submitBtn = qs('#create-job-btn', container);
      if (submitBtn) {
        submitBtn.textContent = 'Create Job - $0.00';
        submitBtn.disabled = true;
      }
      
      // Clear previews
      this.clearPreviews(container);
    }
  }

  /**
   * Update cost breakdown display
   */
  updateCostBreakdown(container, material, length, quantity, totalCost) {
    const costBreakdown = qs('#cost-breakdown', container);
    if (!costBreakdown) return;
    
    const materialCost = material.unitCost * length * quantity;
    const laborCost = length * quantity * 2.50;
    const wasteAllowance = materialCost * 0.15;
    const markup = totalCost * 0.2;
    
    costBreakdown.innerHTML = `
      <div class="cost-breakdown__item">
        <span>Material Cost:</span>
        <span>$${materialCost.toFixed(2)}</span>
      </div>
      <div class="cost-breakdown__item">
        <span>Labor ($2.50/ft):</span>
        <span>$${laborCost.toFixed(2)}</span>
      </div>
      <div class="cost-breakdown__item">
        <span>Waste Allowance (15%):</span>
        <span>$${wasteAllowance.toFixed(2)}</span>
      </div>
      <div class="cost-breakdown__item">
        <span>Markup (25%):</span>
        <span>$${markup.toFixed(2)}</span>
      </div>
      <div class="cost-breakdown__item">
        <span>TOTAL:</span>
        <span>$${totalCost.toFixed(2)}</span>
      </div>
    `;
  }

  /**
   * Update job summary display
   */
  updateJobSummary(container, customerName, material, length, quantity) {
    const jobSummary = qs('#job-summary', container);
    if (!jobSummary) return;
    
    const totalLength = length * quantity;
    const stockAfterCut = material.currentStock - totalLength;
    
    jobSummary.innerHTML = `
      <div class="job-summary__item">
        <span class="job-summary__label">Customer:</span>
        <span class="job-summary__value">${customerName || 'Not specified'}</span>
      </div>
      <div class="job-summary__item">
        <span class="job-summary__label">Material:</span>
        <span class="job-summary__value">${material.name}</span>
      </div>
      <div class="job-summary__item">
        <span class="job-summary__label">Specifications:</span>
        <span class="job-summary__value">${length}ft × ${quantity} pieces</span>
      </div>
      <div class="job-summary__item">
        <span class="job-summary__label">Total Length:</span>
        <span class="job-summary__value">${totalLength.toFixed(1)}ft</span>
      </div>
      <div class="job-summary__item">
        <span class="job-summary__label">Stock After Cut:</span>
        <span class="job-summary__value">${stockAfterCut.toFixed(1)}ft</span>
      </div>
    `;
  }

  /**
   * Update stock warning display
   */
  updateStockWarning(container, material, totalNeeded) {
    const stockWarning = qs('#stock-warning', container);
    if (!stockWarning) return;
    
    let warningClass, warningTitle, warningDetails;
    
    if (totalNeeded > material.currentStock) {
      warningClass = 'stock-warning--insufficient';
      warningTitle = '⚠️ Insufficient Stock';
      warningDetails = `Current stock: ${material.currentStock}ft | Needed: ${totalNeeded.toFixed(1)}ft`;
    } else if (material.currentStock - totalNeeded < material.reorderThreshold) {
      warningClass = 'stock-warning--low';
      warningTitle = '⚠️ Low Stock Warning';
      warningDetails = `Current stock: ${material.currentStock}ft | Needed: ${totalNeeded.toFixed(1)}ft`;
    } else {
      warningClass = 'stock-warning--available';
      warningTitle = '✅ Stock Available';
      warningDetails = `Current stock: ${material.currentStock}ft | Needed: ${totalNeeded.toFixed(1)}ft`;
    }
    
    stockWarning.className = `stock-warning ${warningClass}`;
    stockWarning.style.display = 'block';
    
    const title = qs('.stock-warning__title', stockWarning);
    const details = qs('.stock-warning__details', stockWarning);
    
    if (title) title.textContent = warningTitle;
    if (details) details.textContent = warningDetails;
  }

  /**
   * Clear preview sections
   */
  clearPreviews(container) {
    const costBreakdown = qs('#cost-breakdown', container);
    const jobSummary = qs('#job-summary', container);
    const stockWarning = qs('#stock-warning', container);
    
    if (costBreakdown) {
      costBreakdown.innerHTML = '<p class="cost-breakdown__empty">Fill in the form to see cost breakdown</p>';
    }
    
    if (jobSummary) {
      jobSummary.innerHTML = '<p class="job-summary__empty">Job details will appear here</p>';
    }
    
    if (stockWarning) {
      stockWarning.style.display = 'none';
    }
  }

  /**
   * Render error state
   */
  renderError(container, message) {
    container.innerHTML = `
      <div class="error-message">
        <svg class="error-message__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span class="error-message__text">${message}</span>
      </div>
    `;
  }

  /**
   * Announce route change for screen readers
   */
  announceRouteChange(route) {
    const announcement = `Navigated to ${route.title}`;
    
    // Create or update announcement element
    let announcer = qs('#route-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'route-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = announcement;
  }

  /**
   * Manage focus after route change
   */
  manageFocus(route) {
    // Focus the main heading of the new view
    const mainHeading = qs('h1');
    if (mainHeading) {
      mainHeading.setAttribute('tabindex', '-1');
      mainHeading.focus();
      
      // Remove tabindex after focus
      setTimeout(() => {
        mainHeading.removeAttribute('tabindex');
      }, 100);
    }
  }
}

// Export for global use
window.Router = Router;