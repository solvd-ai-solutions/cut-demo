import { useState, useEffect } from 'react';
import { AlertTriangle, Package, Scissors, Clock, TrendingUp, Warehouse, Brain, Sparkles, MessageSquare, Zap, Target, BarChart3 } from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { CutJob, ReorderAlert } from '../types';
import { aiService } from '../services/aiService';
import { cn } from '../utils';

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
  const [materials, setMaterials] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(true);

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

    // Load AI insights
    setTimeout(() => {
      const forecasts = aiService.getDemandForecast(allMaterials, allJobs);
      const pricing = aiService.getPricingRecommendations(allMaterials);
      const optimizations = aiService.getJobOptimizations(allJobs);
      
      setAiInsights({ forecasts, pricing, optimizations });
      setIsLoadingAI(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-8">
      {/* AI-Powered Header - Mint to Lavender gradient */}
      <div className="bg-gradient-to-r from-mint-50 via-lavender-50 to-mint-100 border border-mint-200 rounded-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-mint-400 to-lavender-500 rounded-full mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-mint-900 mb-4">
            AI-Powered Cut & Order Manager
          </h1>
          <p className="text-xl text-mint-800 max-w-3xl mx-auto">
            Transform your cutting business with intelligent AI solutions that provide real-time insights, 
            optimize operations, and drive profitability through data-driven decision making.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 text-lavender-500" />
              <span className="text-mint-900 font-medium">Smart Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
              <Zap className="w-5 h-5 text-coral-500" />
              <span className="text-mint-900 font-medium">Process Optimization</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
              <Target className="w-5 h-5 text-mint-600" />
              <span className="text-mint-900 font-medium">Strategic Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Business Intelligence Grid - Mint, Lavender, Coral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Demand Forecasting - Mint */}
        <div className="solv-card bg-gradient-to-br from-mint-50 to-mint-100 border-mint-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-mint-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-mint-600" />
            </div>
            <div>
              <h3 className="solv-h3 text-mint-900">AI Demand Forecasting</h3>
              <p className="solv-small text-mint-700">Predict future demand patterns</p>
            </div>
          </div>
          
          {isLoadingAI ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600 mx-auto mb-2"></div>
              <p className="text-sm text-mint-600">AI analyzing...</p>
            </div>
          ) : aiInsights?.forecasts?.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.forecasts.slice(0, 2).map((forecast: any) => (
                <div key={forecast.data.materialId} className="bg-white/60 rounded-lg p-3 border border-mint-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-mint-900">{forecast.data.materialName}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      forecast.impact === 'high' ? 'bg-coral-100 text-coral-800' : 'bg-lavender-100 text-lavender-800'
                    )}>
                      {forecast.impact} priority
                    </span>
                  </div>
                  <p className="text-sm text-mint-700">
                    Predicted: {forecast.data.predictedDemand.toFixed(1)} {forecast.data.timeframe === 'month' ? 'per month' : 'per week'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-mint-600">No demand data available yet</div>
          )}
        </div>

        {/* AI Pricing Intelligence - Lavender */}
        <div className="solv-card bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-lavender-100 rounded-lg">
              <Target className="h-6 w-6 text-lavender-600" />
            </div>
            <div>
              <h3 className="solv-h3 text-lavender-900">AI Pricing Intelligence</h3>
              <p className="solv-small text-lavender-700">Smart pricing recommendations</p>
            </div>
          </div>
          
          {isLoadingAI ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600 mx-auto mb-2"></div>
              <p className="text-sm text-lavender-600">AI analyzing...</p>
            </div>
          ) : aiInsights?.pricing?.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.pricing.slice(0, 2).map((pricing: any) => (
                <div key={pricing.data.materialId} className="bg-white/60 rounded-lg p-3 border border-lavender-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-lavender-900">{pricing.data.materialName}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      pricing.data.marketTrend === 'rising' ? 'bg-coral-100 text-coral-800' :
                      pricing.data.marketTrend === 'falling' ? 'bg-mint-100 text-mint-800' :
                      'bg-lavender-100 text-lavender-800'
                    )}>
                      {pricing.data.marketTrend} market
                    </span>
                  </div>
                  <p className="text-sm text-lavender-700">
                    ${pricing.data.currentPrice.toFixed(2)} → ${pricing.data.recommendedPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-lavender-600">No pricing data available yet</div>
          )}
        </div>

        {/* AI Job Optimization - Coral */}
        <div className="solv-card bg-gradient-to-br from-coral-50 to-coral-100 border-coral-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-coral-100 rounded-lg">
              <Zap className="h-6 w-6 text-coral-600" />
            </div>
            <div>
              <h3 className="solv-h3 text-coral-900">AI Job Optimization</h3>
              <p className="solv-small text-coral-700">Optimize cutting operations</p>
            </div>
          </div>
          
          {isLoadingAI ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-600 mx-auto mb-2"></div>
              <p className="text-sm text-coral-600">AI analyzing...</p>
            </div>
          ) : aiInsights?.optimizations?.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.optimizations.slice(0, 2).map((optimization: any) => (
                <div key={optimization.data.jobId} className="bg-white/60 rounded-lg p-3 border border-coral-200">
                  <div className="mb-2">
                    <span className="font-medium text-coral-900">{optimization.title}</span>
                  </div>
                  <p className="text-sm text-coral-700 mb-2">{optimization.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-coral-600">Save ${optimization.data.costSavings.toFixed(2)}</span>
                    <span className="text-coral-600">{optimization.data.estimatedTimeSavings}h saved</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-coral-600">No optimization data available yet</div>
          )}
        </div>
      </div>

      {/* Quick Actions with AI Enhancement - Mint, Lavender, Coral */}
      <div className="solv-card">
        <h2 className="solv-h2 text-solv-black mb-6 flex items-center gap-3">
          <Brain className="h-6 w-6 text-mint-600" />
          AI-Enhanced Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={onNewJob}
            className="group relative overflow-hidden bg-gradient-to-r from-mint-400 to-mint-500 text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            <div className="relative">
              <Scissors className="h-8 w-8 mb-3" />
              <h3 className="solv-h3 mb-2">Create New Job</h3>
              <p className="solv-body text-white/90">AI-powered material recommendations and cost optimization</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                <Sparkles className="h-4 w-4" />
                <span>Smart material selection</span>
              </div>
            </div>
          </button>

          <button
            onClick={onManageInventory}
            className="group relative overflow-hidden bg-gradient-to-r from-lavender-400 to-lavender-500 text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            <div className="relative">
              <Warehouse className="h-8 w-8 mb-3" />
              <h3 className="solv-h3 mb-2">Manage Inventory</h3>
              <p className="solv-body text-white/90">AI demand forecasting and smart reorder alerts</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                <TrendingUp className="h-4 w-4" />
                <span>Predictive analytics</span>
              </div>
            </div>
          </button>

          <button
            onClick={onViewJobs}
            className="group relative overflow-hidden bg-gradient-to-r from-coral-400 to-coral-500 text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            <div className="relative">
              <BarChart3 className="h-8 w-8 mb-3" />
              <h3 className="solv-h3 mb-2">View Jobs</h3>
              <p className="solv-body text-white/90">AI job optimization and efficiency insights</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                <Zap className="h-4 w-4" />
                <span>Process optimization</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* AI Business Metrics - Mint, Lavender, Coral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="solv-card bg-gradient-to-br from-mint-50 to-mint-100 border-mint-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-mint-500 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-mint-700 mb-1">
              ${totalRevenue.toFixed(0)}
            </div>
            <p className="solv-body text-mint-700">Total Revenue</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-mint-600">
              <Brain className="h-4 w-4" />
              <span>AI-tracked</span>
            </div>
          </div>
        </div>

        <div className="solv-card bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-lavender-500 rounded-full flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-lavender-700 mb-1">
              {materials.length}
            </div>
            <p className="solv-body text-lavender-700">Materials</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-lavender-600">
              <Target className="h-4 w-4" />
              <span>AI-optimized</span>
            </div>
          </div>
        </div>

        <div className="solv-card bg-gradient-to-br from-coral-50 to-coral-100 border-coral-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-coral-700 mb-1">
              {pendingJobs.length}
            </div>
            <p className="solv-body text-coral-700">Pending Jobs</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-coral-600">
              <Zap className="h-4 w-4" />
              <span>AI-optimized</span>
            </div>
          </div>
        </div>

        <div className="solv-card bg-gradient-to-br from-coral-50 to-coral-100 border-coral-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-coral-700 mb-1">
              {reorderAlerts.length}
            </div>
            <p className="solv-body text-coral-700">Low Stock Items</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-coral-600">
              <TrendingUp className="h-4 w-4" />
              <span>AI-predicted</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Integration - Lavender */}
      <div className="solv-card bg-gradient-to-r from-lavender-50 to-lavender-100 border-lavender-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-lavender-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-lavender-600" />
            </div>
            <div>
              <h3 className="solv-h2 text-lavender-900">AI Business Assistant</h3>
              <p className="solv-body text-lavender-700">
                Get instant answers about your business with natural language queries
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="solv-badge bg-lavender-100 text-lavender-800 border-lavender-300">
              Powered by AI
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white/60 rounded-lg border border-lavender-200">
          <p className="text-sm text-lavender-700 mb-3">
            <strong>Try asking:</strong> "What's my revenue this month?", "Which materials are low in stock?", 
            "How can I optimize my cutting operations?"
          </p>
          <div className="flex items-center gap-2 text-xs text-lavender-600">
            <Brain className="h-4 w-4" />
            <span>AI processes natural language and provides intelligent business insights</span>
          </div>
        </div>
      </div>

      {/* Recent Activity with AI Insights */}
      <div className="solv-card">
        <h2 className="solv-h2 text-solv-black mb-6 flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-mint-600" />
          Recent Activity & AI Insights
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div>
            <h3 className="solv-h3 text-solv-black mb-4">Recent Jobs</h3>
            {completedJobs.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {completedJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-solv-gray-50 rounded-lg">
                    <div>
                      <p className="solv-body font-medium text-solv-black">{job.customerName}</p>
                      <p className="solv-small text-solv-black/60">{job.material.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="solv-body font-semibold text-solv-black">${job.totalCost.toFixed(2)}</p>
                      <p className="solv-small text-solv-black/60">{job.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-solv-black/60">No completed jobs yet</p>
            )}
          </div>

          {/* AI Recommendations */}
          <div>
            <h3 className="solv-h3 text-solv-black mb-4">AI Recommendations</h3>
            {isLoadingAI ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-600 mx-auto mb-3"></div>
                <p className="text-sm text-solv-black/60">AI analyzing your business...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiInsights?.forecasts?.slice(0, 2).map((forecast: any) => (
                  <div key={forecast.data.materialId} className="p-3 bg-mint-50 border border-mint-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-mint-600" />
                      <span className="solv-body font-medium text-mint-900">Demand Forecast</span>
                    </div>
                    <p className="solv-small text-mint-700">
                      {forecast.data.materialName}: {forecast.data.predictedDemand.toFixed(1)} units needed
                    </p>
                  </div>
                ))}
                
                {aiInsights?.optimizations?.slice(0, 1).map((optimization: any) => (
                  <div key={optimization.data.jobId} className="p-3 bg-coral-50 border border-coral-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-coral-600" />
                      <span className="solv-body font-medium text-coral-900">Optimization</span>
                    </div>
                    <p className="solv-small text-coral-700">
                      {optimization.description} - Save ${optimization.data.costSavings.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}