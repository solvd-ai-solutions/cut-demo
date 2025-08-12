import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CutJobForm } from './components/CutJobForm';
import { JobManager } from './components/JobManager';
import { InventoryManager } from './components/InventoryManager';
import { CutJob } from './types';
import { Zap } from 'lucide-react';

type AppView = 'dashboard' | 'new-job' | 'job-manager' | 'inventory';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const handleJobCreated = (_job: CutJob) => {
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNewJob={() => setCurrentView('new-job')}
            onManageInventory={() => setCurrentView('inventory')}
            onViewJobs={() => setCurrentView('job-manager')}
          />
        );
      case 'new-job':
        return (
          <CutJobForm
            onBack={() => setCurrentView('dashboard')}
            onJobCreated={handleJobCreated}
          />
        );
      case 'job-manager':
        return (
          <JobManager
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'inventory':
        return (
          <InventoryManager
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <Dashboard
          onNewJob={() => setCurrentView('new-job')}
          onManageInventory={() => setCurrentView('inventory')}
          onViewJobs={() => setCurrentView('job-manager')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-solv-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-solv-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-solv-blue to-solv-teal rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-solv-black">Cut & Order Manager</h1>
                <p className="text-sm text-solv-black/60">AI-Powered Business Intelligence</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-solv-blue text-white'
                    : 'text-solv-black hover:bg-solv-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('new-job')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'new-job'
                    ? 'bg-solv-blue text-white'
                    : 'text-solv-black hover:bg-solv-gray-100'
                }`}
              >
                New Job
              </button>
              <button
                onClick={() => setCurrentView('job-manager')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'job-manager'
                    ? 'bg-solv-blue text-white'
                    : 'text-solv-black hover:bg-solv-gray-100'
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setCurrentView('inventory')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'inventory'
                    ? 'bg-solv-blue text-white'
                    : 'text-solv-black hover:bg-solv-gray-100'
                }`}
              >
                Inventory
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-solv-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-solv-black/60">
              © 2024 Solvd AI Solutions. AI-Powered Business Intelligence Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;