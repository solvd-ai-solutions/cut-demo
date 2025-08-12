import React, { useState, useEffect, useMemo } from 'react';
import { Brain, TrendingUp, Package, DollarSign, AlertTriangle, CheckCircle, BarChart3, Zap, Target, Clock } from 'lucide-react';
import { aiService, AIRecommendation, AIDemandForecast, AIMaterialRecommendation, AIPricingRecommendation, AIJobOptimization } from '../services/aiService';
import { Material, CutJob } from '../types';
import { cn, formatCurrency } from '../utils';

interface AIInsightsDashboardProps {
  materials: Material[];
  jobs: CutJob[];
}

export default function AIInsightsDashboard({ materials, jobs }: AIInsightsDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<{
    forecasts: AIDemandForecast[];
    pricing: AIPricingRecommendation[];
    optimizations: AIJobOptimization[];
  }>({ forecasts: [], pricing: [], optimizations: [] });

  useEffect(() => {
    // Simulate AI analysis time
    setTimeout(() => {
      const forecasts = aiService.getDemandForecast(materials, jobs);
      const pricing = aiService.getPricingRecommendations(materials);
      const optimizations = aiService.getJobOptimizations(jobs);
      
      setInsights({ forecasts, pricing, optimizations });
      setIsLoading(false);
    }, 1200);
  }, [materials, jobs]);

  const totalRevenue = useMemo(() => {
    return jobs
      .filter(job => job.status === 'completed')
      .reduce((sum, job) => sum + job.totalCost, 0);
  }, [jobs]);

  const pendingJobs = useMemo(() => {
    return jobs.filter(job => job.status === 'pending');
  }, [jobs]);

  const lowStockMaterials = useMemo(() => {
    return materials.filter(material => material.currentStock <= material.reorderThreshold);
  }, [materials]);

  if (isLoading) {
    return (
      <div className="solv-card border-solv-teal/20 bg-gradient-to-r from-solv-teal/5 to-blue-50/50">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-solv-teal mx-auto mb-4"></div>
          <h3 className="solv-h2 text-solv-teal mb-2">AI Analysis in Progress</h3>
          <p className="solv-body text-solv-black/70">
            Our AI is analyzing your business data to provide intelligent insights...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="solv-card border-solv-teal/20 bg-gradient-to-r from-solv-teal/5 to-blue-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-solv-teal/20 rounded-full">
              <Brain className="h-8 w-8 text-solv-teal" />
            </div>
            <div>
              <h2 className="solv-h1 text-solv-teal">AI Business Intelligence</h2>
              <p className="solv-body text-solv-black/70">
                Intelligent insights powered by artificial intelligence
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="solv-badge bg-solv-teal/20 text-solv-teal border-solv-teal">
              Live AI Analysis
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="solv-card bg-gradient-to-br from-green-50 to-emerald-100 border-green-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">
              ${totalRevenue.toFixed(0)}
            </div>
            <p className="solv-body text-green-700">Total Revenue</p>
          </div>
        </div>

        <div className="solv-card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {materials.length}
            </div>
            <p className="solv-body text-blue-700">Materials</p>
          </div>
        </div>

        <div className="solv-card bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">
              {pendingJobs.length}
            </div>
            <p className="solv-body text-yellow-700">Pending Jobs</p>
          </div>
        </div>

        <div className="solv-card bg-gradient-to-br from-red-50 to-pink-100 border-red-300">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">
              {lowStockMaterials.length}
            </div>
            <p className="solv-body text-red-700">Low Stock Items</p>
          </div>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecasting */}
        <div className="solv-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="solv-h2 text-solv-black">Demand Forecasting</h3>
          </div>
          
          {insights.forecasts.length > 0 ? (
            <div className="space-y-4">
              {insights.forecasts.slice(0, 3).map((forecast) => (
                <div key={forecast.data.materialId} className="border border-solv-black/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="solv-h4 font-semibold text-solv-black">
                      {forecast.data.materialName}
                    </h4>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      forecast.impact === 'high' ? 'bg-red-100 text-red-800' :
                      forecast.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    )}>
                      {forecast.impact} priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-solv-black/60">Predicted Demand:</span>
                      <div className="font-semibold text-solv-black">
                        {forecast.data.predictedDemand.toFixed(1)} {forecast.data.timeframe === 'month' ? 'per month' : 'per week'}
                      </div>
                    </div>
                    <div>
                      <span className="text-solv-black/60">Recommended Stock:</span>
                      <div className="font-semibold text-solv-black">
                        {forecast.data.recommendedStock.toFixed(0)} units
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-solv-black/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-solv-black/60">
                        Confidence: {Math.round(forecast.data.confidence * 100)}%
                      </span>
                      <button className="solv-button-secondary text-xs">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-solv-black/60">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 text-solv-black/30" />
              <p>No demand data available yet</p>
            </div>
          )}
        </div>

        {/* Pricing Intelligence */}
        <div className="solv-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="solv-h2 text-solv-black">Pricing Intelligence</h3>
          </div>
          
          {insights.pricing.length > 0 ? (
            <div className="space-y-4">
              {insights.pricing.slice(0, 3).map((pricing) => (
                <div key={pricing.data.materialId} className="border border-solv-black/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="solv-h4 font-semibold text-solv-black">
                      {pricing.data.materialName}
                    </h4>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      pricing.data.marketTrend === 'rising' ? 'bg-red-100 text-red-800' :
                      pricing.data.marketTrend === 'falling' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    )}>
                      {pricing.data.marketTrend} market
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-solv-black/60">Current Price:</span>
                      <div className="font-semibold text-solv-black">
                        ${pricing.data.currentPrice.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-solv-black/60">Recommended:</span>
                      <div className="font-semibold text-solv-black">
                        ${pricing.data.recommendedPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-solv-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-solv-black/60">Market Range:</span>
                      <span className="font-semibold text-solv-black">
                        ${pricing.data.competitorAnalysis.range[0].toFixed(2)} - ${pricing.data.competitorAnalysis.range[1].toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-solv-black/60">
              <Target className="h-12 w-12 mx-auto mb-3 text-solv-black/30" />
              <p>No pricing recommendations available</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Optimizations */}
      {insights.optimizations.length > 0 && (
        <div className="solv-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="solv-h2 text-solv-black">Job Optimizations</h3>
          </div>
          
          <div className="space-y-4">
            {insights.optimizations.map((optimization) => (
              <div key={optimization.data.jobId} className="border border-solv-black/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="solv-h4 font-semibold text-solv-black">
                    {optimization.title}
                  </h4>
                  <span className="solv-badge bg-purple-100 text-purple-800 border-purple-300">
                    {Math.round(optimization.data.currentEfficiency * 100)}% efficiency
                  </span>
                </div>
                
                <p className="solv-body text-solv-black/70 mb-4">
                  {optimization.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-green-600 mb-1">Time Savings</div>
                    <div className="text-lg font-semibold text-green-700">
                      {optimization.data.estimatedTimeSavings} hours
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Cost Savings</div>
                    <div className="text-lg font-semibold text-blue-700">
                      ${optimization.data.costSavings.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-solv-gray-50 rounded-lg p-3">
                  <div className="text-sm text-solv-black/60 mb-2">Recommended Changes:</div>
                  <ul className="space-y-1">
                    {optimization.data.recommendedChanges.map((change, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Footer */}
      <div className="solv-card border-solv-teal/20 bg-gradient-to-r from-solv-teal/5 to-blue-50/50">
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-solv-teal" />
            <span className="solv-h4 text-solv-teal">AI Analysis Complete</span>
          </div>
          <p className="solv-body text-solv-black/70">
            These insights are updated in real-time based on your business data
          </p>
        </div>
      </div>
    </div>
  );
}
