import { useState } from 'react';
import { CutJobForm } from './components/CutJobForm';
import { JobManager } from './components/JobManager';
import { InventoryManager } from './components/InventoryManager';
import { CutJob } from './types';
import { Scissors, Package, Eye, Zap } from 'lucide-react';

type AppView = 'dashboard' | 'new-job' | 'job-manager' | 'inventory';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const handleJobCreated = (_job: CutJob) => {
    setCurrentView('dashboard');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'new-job':
        return <CutJobForm onBack={handleBack} onJobCreated={handleJobCreated} />;
      case 'job-manager':
        return <JobManager onBack={handleBack} />;
      case 'inventory':
        return <InventoryManager onBack={handleBack} />;
      default:
        return null;
    }
  };

  if (currentView !== 'dashboard') {
    return (
      <div className="h-screen bg-white text-black overflow-hidden">
        {/* Demo Banner */}
        <div className="bg-solv-lavender border-b-2 border-black px-6 py-2 flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 text-black" />
          <span className="solv-small font-semibold text-black">DEMO VERSION</span>
          <span className="solv-small text-black">• Limited functionality • Sample data only</span>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-48px)] overflow-auto">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white text-black overflow-hidden">
      {/* Demo Banner */}
      <div className="bg-solv-lavender border-b-2 border-black px-6 py-2 flex items-center justify-center gap-2">
        <Zap className="h-4 w-4 text-black" />
        <span className="solv-small font-semibold text-black">DEMO VERSION</span>
        <span className="solv-small text-black">• Limited functionality • Sample data only</span>
      </div>

      {/* Main Dashboard - Single Viewport */}
      <div className="h-[calc(100vh-48px)] p-6 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Header Section - Much Narrower */}
          <div className="lg:col-span-3 mb-2">
            <div 
              className="bg-white border-2 border-black rounded-lg px-6 py-3 flex items-center justify-between"
              style={{ padding: '12px 24px' }}
            >
              <div>
                <h1 className="solv-h1 mb-1">Cut & Order Manager</h1>
                <p className="solv-body text-black opacity-70">Hardware Store Management System</p>
              </div>
              <div className="text-right solv-small text-black opacity-60">
                781-363-6080 Solv Solutions
              </div>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="solv-card cursor-pointer hover:bg-solv-teal hover:bg-opacity-5 transition-colors" onClick={() => setCurrentView('new-job')}>
            <div className="text-center h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-solv-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-8 w-8 text-white stroke-2" />
              </div>
              <h2 className="solv-h2 mb-2 text-black">Create Cut Job</h2>
              <p className="solv-body text-black opacity-70 mb-4">Start a new cutting job for customers</p>
              <button className="solv-button-primary w-full">
                New Job
              </button>
            </div>
          </div>

          <div className="solv-card cursor-pointer hover:bg-solv-coral hover:bg-opacity-5 transition-colors" onClick={() => setCurrentView('inventory')}>
            <div className="text-center h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-solv-coral rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-white stroke-2" />
              </div>
              <h2 className="solv-h2 mb-2 text-black">Inventory Manager</h2>
              <p className="solv-body text-black opacity-70 mb-4">Manage stock levels and suppliers</p>
              <button className="solv-button-secondary w-full">
                Manage Inventory
              </button>
            </div>
          </div>

          <div className="solv-card cursor-pointer hover:bg-solv-lavender hover:bg-opacity-10 transition-colors" onClick={() => setCurrentView('job-manager')}>
            <div className="text-center h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-solv-lavender rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-black stroke-2" />
              </div>
              <h2 className="solv-h2 mb-2 text-black">Job Manager</h2>
              <p className="solv-body text-black opacity-70 mb-4">View and manage cutting jobs</p>
              <button className="solv-button-secondary border-solv-lavender w-full">
                View Jobs
              </button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full min-h-[120px]">
              <div className="solv-status-success flex flex-col items-center justify-center text-center h-full py-6">
                <div className="text-4xl font-bold leading-none mb-2 text-black" style={{ fontSize: '2.5rem', lineHeight: '1' }}>8</div>
                <p className="solv-body font-medium text-black" style={{ fontSize: '16px', lineHeight: '20px' }}>Completed Today</p>
              </div>
              
              <div className="solv-status-info flex flex-col items-center justify-center text-center h-full py-6">
                <div className="text-4xl font-bold leading-none mb-2 text-black" style={{ fontSize: '2.5rem', lineHeight: '1' }}>3</div>
                <p className="solv-body font-medium text-black" style={{ fontSize: '16px', lineHeight: '20px' }}>Pending Jobs</p>
              </div>
              
              <div className="solv-status-warning flex flex-col items-center justify-center text-center h-full py-6">
                <div className="text-4xl font-bold leading-none mb-2 text-black" style={{ fontSize: '2.5rem', lineHeight: '1' }}>2</div>
                <p className="solv-body font-medium text-black" style={{ fontSize: '16px', lineHeight: '20px' }}>Low Stock Items</p>
              </div>
              
              <div className="solv-status-success flex flex-col items-center justify-center text-center h-full py-6">
                <div className="text-4xl font-bold leading-none mb-2 text-black" style={{ fontSize: '2.5rem', lineHeight: '1' }}>$1,247</div>
                <p className="solv-body font-medium text-black" style={{ fontSize: '16px', lineHeight: '20px' }}>Today's Revenue</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-3">
            <div className="solv-card">
              <h2 className="solv-h2 mb-4 text-black">Recent Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black rounded-lg p-4 bg-white">
                  <h3 className="solv-body font-semibold mb-2 text-black">Latest Cut Job</h3>
                  <p className="solv-small text-black opacity-70 mb-1">Customer: John Smith</p>
                  <p className="solv-small text-black opacity-70 mb-1">Material: Oak 2x4 - 8ft × 3 pieces</p>
                  <p className="solv-small text-black opacity-70">Total: $45.60</p>
                </div>
                
                <div className="border-2 border-black rounded-lg p-4 bg-white">
                  <h3 className="solv-body font-semibold mb-2 text-black">Inventory Alert</h3>
                  <p className="solv-small text-black opacity-70 mb-1">Pine 2x4 - Stock: 12ft</p>
                  <p className="solv-small text-black opacity-70 mb-1">Threshold: 20ft</p>
                  <p className="solv-small text-solv-coral font-semibold">Reorder needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}