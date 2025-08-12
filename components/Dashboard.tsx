import { useState, useEffect } from 'react';
import { AlertTriangle, Package, Scissors, CheckCircle2, Clock, TrendingUp, Warehouse, ShoppingCart, Eye, Brain, Sparkles, MessageSquare } from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { CutJob, ReorderAlert } from '../types';
import AIInsightsDashboard from './AIInsightsDashboard';
import AIFeaturesShowcase from './AIFeaturesShowcase';
import AIAssistant from './AIAssistant';

interface DashboardProps {
  onNewJob: () => void;
  onManageInventory: () => void;
  onViewJobs: () => void;
}

export function Dashboard({ onNewJob, onManageInventory, onViewJobs }: DashboardProps) {
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [pendingJobs, setPendingJobs] = useState<CutJob[]>([]);
  const [completedJobs, setCompletedJobs] = useState<CutJob[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [jobs, setJobs] = useState<CutJob[]>([]);

  useEffect(() => {
    // Load dashboard data
    const alerts = dataStore.getReorderAlerts();
    const allJobs = dataStore.getJobs();
    const pending = allJobs.filter(job => job.status === 'pending');
    const completed = allJobs.filter(job => job.status === 'completed');
    const revenue = completed.reduce((sum, job) => sum + job.totalCost, 0);
    const allMaterials = dataStore.getMaterials();

    setReorderAlerts(alerts);
    setPendingJobs(pending);
    setCompletedJobs(completed);
    setTotalRevenue(revenue);
    setMaterials(allMaterials);
    setJobs(allJobs);
  }, []);

  return (
    <div className="space-y-8">
      {/* AI-Powered Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                AI-Powered Cut & Order Manager
              </h1>
              <p className="text-lg text-blue-800">Transform your business with intelligent AI solutions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAIFeatures(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>View AI Features</span>
            </button>
            <button
              onClick={() => setShowAIAssistant(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                showAIInsights 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-solv-gray-200 hover:bg-solv-gray-300 text-solv-black'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>{showAIInsights ? 'Hide AI Insights' : 'Show AI Insights'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Dashboard */}
      {showAIInsights && (
        <AIInsightsDashboard materials={materials} jobs={jobs} />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="solv-h1 text-solv-black">
            Cut & Order Manager
          </h1>
          <p className="solv-body text-solv-black/70">Hardware Store Management System</p>
        </div>
        <button 
          onClick={onNewJob} 
          className="solv-button-primary text-lg px-6 py-3 hover-scale"
        >
          <Scissors className="mr-2 h-5 w-5" />
          New Cut Job
        </button>
      </div>

      {/* Critical Inventory Alerts */}
      {reorderAlerts.length > 0 && (
        <div className="solv-status-danger border-2 border-red-500 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="solv-h2 text-red-800">
                    🚨 URGENT: {reorderAlerts.length} material(s) need immediate reordering!
                  </span>
                  <p className="solv-body text-red-700 mt-1">
                    Critical stock levels detected. Order supplies now to avoid service interruptions.
                  </p>
                </div>
                <button
                  onClick={onManageInventory}
                  className="solv-button-primary bg-red-600 hover:bg-red-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Manage Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Cut Job Card */}
        <div className="solv-card bg-gradient-to-br from-solv-teal/10 to-solv-teal/20 border-solv-teal hover:shadow-solv-lg transition-all duration-300 cursor-pointer group hover-scale" onClick={onNewJob}>
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-solv-teal rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h3 className="solv-h2 text-solv-teal mb-2">Create Cut Job</h3>
            <p className="solv-body text-solv-teal/80 mb-4">Start a new cutting job for your customers</p>
            <span className="solv-badge bg-solv-teal/30 text-solv-teal border-solv-teal">Quick Start</span>
          </div>
        </div>

        {/* Inventory Management Card */}
        <div className={`solv-card hover:shadow-solv-lg transition-all duration-300 cursor-pointer group hover-scale ${reorderAlerts.length > 0 ? 'bg-gradient-to-br from-red-50 to-orange-100 border-red-300' : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300'}`} onClick={onManageInventory}>
          <div className="text-center p-6">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${reorderAlerts.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className={`solv-h2 mb-2 ${reorderAlerts.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
              {reorderAlerts.length > 0 ? 'Manage Inventory' : 'Inventory Status'}
            </h3>
            <p className={`solv-body mb-4 ${reorderAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {reorderAlerts.length > 0 
                ? `${reorderAlerts.length} items need reordering` 
                : 'All materials are well stocked'
              }
            </p>
            <span className={`solv-badge ${reorderAlerts.length > 0 ? 'bg-red-200 text-red-800 border-red-400' : 'bg-green-200 text-green-800 border-green-400'}`}>
              {reorderAlerts.length > 0 ? 'Action Required' : 'All Good'}
            </span>
          </div>
        </div>

        {/* Job Manager Card */}
        <div className="solv-card bg-gradient-to-br from-solv-lavender/10 to-solv-lavender/20 border-solv-lavender hover:shadow-solv-lg transition-all duration-300 cursor-pointer group hover-scale" onClick={onViewJobs}>
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-solv-lavender rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Eye className="h-8 w-8 text-solv-black" />
            </div>
            <h3 className="solv-h2 text-solv-lavender mb-2">Job Manager</h3>
            <p className="solv-body text-solv-lavender/80 mb-4">View and manage all cutting jobs</p>
            <span className="solv-badge bg-solv-lavender/30 text-solv-lavender border-solv-lavender">
              {pendingJobs.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Pending Jobs */}
        <div className="solv-card bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">{pendingJobs.length}</div>
            <p className="solv-body text-yellow-700">Pending Jobs</p>
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="solv-card bg-gradient-to-br from-green-50 to-emerald-100 border-green-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">{completedJobs.length}</div>
            <p className="solv-body text-green-700">Completed Today</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="solv-card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">${totalRevenue.toFixed(0)}</div>
            <p className="solv-body text-blue-700">Today's Revenue</p>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="solv-card bg-gradient-to-br from-purple-50 to-pink-100 border-purple-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
              <Warehouse className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{reorderAlerts.length}</div>
            <p className="solv-body text-purple-700">Low Stock Items</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="solv-card">
        <h3 className="solv-h2 text-solv-black mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {pendingJobs.slice(0, 3).map(job => (
            <div key={job.id} className="border-2 border-solv-black/20 rounded-solv p-4 bg-solv-teal/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="solv-body font-semibold text-solv-black">New Cut Job</p>
                  <p className="solv-small text-solv-black/70">Customer: {job.customerName}</p>
                  <p className="solv-small text-solv-black/70">
                    {job.material.name} - {job.length}ft × {job.quantity} pieces
                  </p>
                </div>
                <div className="text-right">
                  <p className="solv-body font-semibold text-solv-black">${job.totalCost.toFixed(2)}</p>
                  <p className="solv-small text-solv-black/70">Order: {job.orderCode}</p>
                </div>
              </div>
            </div>
          ))}
          
          {reorderAlerts.slice(0, 2).map(alert => (
            <div key={alert.materialId} className="border-2 border-solv-black/20 rounded-solv p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="solv-body font-semibold text-solv-black">Low Stock Alert</p>
                  <p className="solv-small text-solv-black/70">{alert.materialName}</p>
                  <p className="solv-small text-solv-black/70">
                    Current: {alert.currentStock}ft | Threshold: {alert.reorderThreshold}ft
                  </p>
                </div>
                <div className="text-right">
                  <span className="solv-badge-danger">Reorder Needed</span>
                  <p className="solv-small text-solv-black/70 mt-1">{alert.supplier}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features Showcase Modal */}
      {showAIFeatures && (
        <AIFeaturesShowcase onClose={() => setShowAIFeatures(false)} />
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant 
          materials={materials} 
          jobs={jobs} 
          onClose={() => setShowAIAssistant(false)} 
        />
      )}
    </div>
  );
}