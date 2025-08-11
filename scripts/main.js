/**
 * Cut & Order Manager - Main Application Bootstrap
 * Handles initialization, data loading, and global app state
 */

class CutOrderApp {
  constructor() {
    this.state = {
      materials: [],
      jobs: [],
      currentView: 'dashboard',
      formData: {},
      isLoading: false,
      error: null
    };
    
    this.router = null;
    this.interactions = null;
    this.a11y = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.loadDemoData = this.loadDemoData.bind(this);
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      this.showLoading();
      
      // Initialize utilities and services
      if (typeof Router !== 'undefined') {
        this.router = new Router();
      }
      
      if (typeof Interactions !== 'undefined') {
        this.interactions = new Interactions(this);
      }
      
      if (typeof A11y !== 'undefined') {
        this.a11y = new A11y();
      }

      // Load demo data
      await this.loadDemoData();
      
      // Initialize router
      if (this.router) {
        this.router.init();
      }
      
      // Initialize interactions
      if (this.interactions) {
        this.interactions.init();
      }
      
      // Initialize accessibility features
      if (this.a11y) {
        this.a11y.init();
      }
      
      // Setup global event listeners
      this.setupEventListeners();
      
      this.hideLoading();
      
      // Analytics hook for production
      this.trackEvent('app_initialized');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to initialize application. Please refresh the page.');
    }
  }

  /**
   * Load demo data from JSON file
   */
  async loadDemoData() {
    try {
      const response = await fetch('./data/demo.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.setState({
        materials: data.materials || [],
        jobs: data.jobs || []
      });
      
      // Store in localStorage for persistence during demo
      localStorage.setItem('cutOrderApp_materials', JSON.stringify(data.materials || []));
      localStorage.setItem('cutOrderApp_jobs', JSON.stringify(data.jobs || []));
      
    } catch (error) {
      console.warn('Failed to load demo data, using fallback:', error);
      this.loadFallbackData();
    }
  }

  /**
   * Load fallback data if demo.json fails
   */
  loadFallbackData() {
    // Try to load from localStorage first
    const storedMaterials = localStorage.getItem('cutOrderApp_materials');
    const storedJobs = localStorage.getItem('cutOrderApp_jobs');
    
    if (storedMaterials && storedJobs) {
      this.setState({
        materials: JSON.parse(storedMaterials),
        jobs: JSON.parse(storedJobs)
      });
      return;
    }
    
    // Default fallback data
    const fallbackData = {
      materials: [
        {
          id: '1',
          name: 'Oak 2x4',
          type: 'wood',
          unitCost: 8.50,
          currentStock: 45.5,
          reorderThreshold: 20.0,
          supplier: 'ABC Lumber Co.'
        },
        {
          id: '2',
          name: 'Pine 2x4',
          type: 'wood',
          unitCost: 6.25,
          currentStock: 12.0,
          reorderThreshold: 20.0,
          supplier: 'ABC Lumber Co.'
        },
        {
          id: '3',
          name: 'Steel Bar 1/2"',
          type: 'metal',
          unitCost: 12.75,
          currentStock: 8.5,
          reorderThreshold: 15.0,
          supplier: 'MetalWorks Inc.'
        }
      ],
      jobs: [
        {
          id: '1001',
          customerName: 'John Smith',
          material: { id: '1', name: 'Oak 2x4', type: 'wood' },
          length: 8.0,
          quantity: 3,
          totalCost: 45.60,
          status: 'completed',
          orderCode: 'J4X9',
          createdAt: new Date('2024-01-15T10:30:00'),
          completedAt: new Date('2024-01-15T11:15:00')
        },
        {
          id: '1002',
          customerName: 'Jane Doe',
          material: { id: '2', name: 'Pine 2x4', type: 'wood' },
          length: 6.0,
          quantity: 2,
          totalCost: 28.50,
          status: 'pending',
          orderCode: 'K7M2',
          createdAt: new Date('2024-01-15T14:20:00')
        }
      ]
    };
    
    this.setState(fallbackData);
    
    // Store fallback data
    localStorage.setItem('cutOrderApp_materials', JSON.stringify(fallbackData.materials));
    localStorage.setItem('cutOrderApp_jobs', JSON.stringify(fallbackData.jobs));
  }

  /**
   * Update application state
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    
    // Persist critical data
    if (newState.materials) {
      localStorage.setItem('cutOrderApp_materials', JSON.stringify(newState.materials));
    }
    if (newState.jobs) {
      localStorage.setItem('cutOrderApp_jobs', JSON.stringify(newState.jobs));
    }
    
    // Trigger state change event for components
    document.dispatchEvent(new CustomEvent('appStateChange', {
      detail: { newState: this.state, changedKeys: Object.keys(newState) }
    }));
  }

  /**
   * Get current application state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle window resize for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('app_backgrounded');
      } else {
        this.trackEvent('app_foregrounded');
      }
    });

    // Handle unload for cleanup
    window.addEventListener('beforeunload', () => {
      this.trackEvent('app_unload');
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Esc to go back/cancel
      if (e.key === 'Escape' && this.state.currentView !== 'dashboard') {
        e.preventDefault();
        this.router?.navigate('dashboard');
      }
      
      // Alt+1,2,3 for quick navigation
      if (e.altKey && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        const routes = ['new-job', 'inventory', 'job-manager'];
        const routeIndex = parseInt(e.key) - 1;
        if (routes[routeIndex]) {
          this.router?.navigate(routes[routeIndex]);
        }
      }
    });
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update responsive behavior
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    document.body.classList.toggle('desktop', isDesktop);
    
    // Dispatch resize event for components
    document.dispatchEvent(new CustomEvent('appResize', {
      detail: { width, isMobile, isTablet, isDesktop }
    }));
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.setState({ isLoading: true });
    const appContent = qs('#app-content');
    if (appContent) {
      const template = qs('#loading-template');
      if (template) {
        appContent.innerHTML = template.innerHTML;
      }
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.setState({ isLoading: false });
  }

  /**
   * Show error message
   */
  showError(message) {
    this.setState({ error: message });
    const appContent = qs('#app-content');
    if (appContent) {
      const template = qs('#error-template');
      if (template) {
        const errorElement = document.createElement('div');
        errorElement.innerHTML = template.innerHTML;
        const errorText = errorElement.querySelector('.error-message__text');
        if (errorText) {
          errorText.textContent = message;
        }
        appContent.innerHTML = errorElement.innerHTML;
      }
    }
  }

  /**
   * Clear error state
   */
  clearError() {
    this.setState({ error: null });
  }

  /**
   * Add a new material
   */
  addMaterial(materialData) {
    const newMaterial = {
      ...materialData,
      id: Date.now().toString()
    };
    
    const materials = [...this.state.materials, newMaterial];
    this.setState({ materials });
    
    this.trackEvent('material_added', { material_type: materialData.type });
    
    return newMaterial;
  }

  /**
   * Update an existing material
   */
  updateMaterial(materialId, updates) {
    const materials = this.state.materials.map(material =>
      material.id === materialId ? { ...material, ...updates } : material
    );
    
    this.setState({ materials });
    
    this.trackEvent('material_updated', { material_id: materialId });
  }

  /**
   * Update material stock
   */
  updateMaterialStock(materialId, newStock) {
    this.updateMaterial(materialId, { currentStock: newStock });
    this.trackEvent('material_stock_updated', { material_id: materialId, new_stock: newStock });
  }

  /**
   * Add a new job
   */
  addJob(jobData) {
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending'
    };
    
    const jobs = [...this.state.jobs, newJob];
    this.setState({ jobs });
    
    // Update material stock
    if (jobData.material && jobData.length && jobData.quantity) {
      const totalUsed = jobData.length * jobData.quantity;
      const material = this.state.materials.find(m => m.id === jobData.material.id);
      if (material) {
        this.updateMaterialStock(material.id, material.currentStock - totalUsed);
      }
    }
    
    this.trackEvent('job_created', { 
      customer: jobData.customerName,
      total_cost: jobData.totalCost,
      material_type: jobData.material?.type
    });
    
    return newJob;
  }

  /**
   * Update job status
   */
  updateJobStatus(jobId, status) {
    const jobs = this.state.jobs.map(job => {
      if (job.id === jobId) {
        const updates = { status };
        if (status === 'completed') {
          updates.completedAt = new Date();
        }
        return { ...job, ...updates };
      }
      return job;
    });
    
    this.setState({ jobs });
    
    this.trackEvent('job_status_updated', { job_id: jobId, status });
  }

  /**
   * Get materials that need reordering
   */
  getReorderAlerts() {
    return this.state.materials
      .filter(material => material.currentStock <= material.reorderThreshold)
      .map(material => ({
        materialId: material.id,
        materialName: material.name,
        currentStock: material.currentStock,
        reorderThreshold: material.reorderThreshold,
        supplier: material.supplier
      }));
  }

  /**
   * Track analytics events (hook for production analytics)
   */
  trackEvent(eventName, properties = {}) {
    // In production, this would send to your analytics service
    console.log('Analytics Event:', eventName, properties);
    
    // Example integration with Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Example integration with other analytics services
    if (typeof analytics !== 'undefined') {
      analytics.track(eventName, properties);
    }
  }

  /**
   * Generate and print job ticket
   */
  generateJobTicket(job) {
    const ticketContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cut Job Ticket - ${job.orderCode}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              max-width: 400px; 
              margin: 0 auto; 
              padding: 20px;
              background: white;
              color: black;
            }
            .header { 
              text-align: center; 
              border: 2px solid black; 
              padding: 10px; 
              margin-bottom: 20px;
            }
            .order-code {
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .section {
              border: 2px solid black;
              padding: 15px;
              margin: 10px 0;
            }
            .label { font-weight: bold; }
            .total {
              background: #f0f0f0;
              border: 2px solid black;
              padding: 15px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🛠️ HARDWARE STORE</h1>
            <div class="order-code">${job.orderCode}</div>
            <p>${job.createdAt.toLocaleDateString()} - ${job.createdAt.toLocaleTimeString()}</p>
          </div>

          <div class="section">
            <p><span class="label">Customer:</span> ${job.customerName}</p>
            <p><span class="label">Material:</span> ${job.material.name}</p>
            <p><span class="label">Type:</span> ${job.material.type}</p>
            <p><span class="label">Length:</span> ${job.length} ft</p>
            <p><span class="label">Quantity:</span> ${job.quantity} pieces</p>
          </div>

          <div class="total">
            TOTAL: $${job.totalCost.toFixed(2)}
          </div>

          <div class="section">
            <h3>📋 CUTTING INSTRUCTIONS</h3>
            <p>• Cut ${job.quantity} pieces of ${job.material.name}</p>
            <p>• Each piece: ${job.length} feet long</p>
            <p>• Material type: ${job.material.type}</p>
            <p>• Handle with care</p>
          </div>

          <div style="text-align: center; margin-top: 30px; font-size: 12px;">
            <p>Thank you for your business!</p>
            <p>Generated by Cut & Order Manager</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(ticketContent);
      printWindow.document.close();
      printWindow.print();
    }
    
    this.trackEvent('ticket_printed', { job_id: job.id, order_code: job.orderCode });
  }

  /**
   * Calculate job cost using pricing formula
   */
  calculateJobCost(material, length, quantity) {
    if (!material || !length || !quantity) return 0;
    
    const lengthNum = parseFloat(length);
    const quantityNum = parseInt(quantity);
    
    if (isNaN(lengthNum) || lengthNum <= 0 || quantityNum <= 0) {
      return 0;
    }

    // Pricing formula: (material cost + labor + waste allowance) * markup
    const materialCost = material.unitCost * lengthNum * quantityNum;
    const laborCost = quantityNum * 0.25; // $0.25 per cut
    const wasteAllowance = materialCost * 0.15; // 15% waste
    const subtotal = materialCost + laborCost + wasteAllowance;
    const markup = subtotal * 0.25; // 25% markup
    const total = subtotal + markup;

    return total;
  }
}

// Initialize app when DOM is ready
let app;

function initApp() {
  app = new CutOrderApp();
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for global access
window.CutOrderApp = app;