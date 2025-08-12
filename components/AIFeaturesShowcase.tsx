import { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, MessageSquare, Camera, X, CheckCircle, Package } from 'lucide-react';
import { cn } from '../utils';

interface AIFeaturesShowcaseProps {
  onClose: () => void;
}

export default function AIFeaturesShowcase({ onClose }: AIFeaturesShowcaseProps) {
  const [activeFeature, setActiveFeature] = useState<'overview' | 'materials' | 'forecasting' | 'optimization' | 'pricing' | 'vision' | 'assistant'>('overview');

  const features = [
    {
      id: 'overview',
      title: 'AI Overview',
      icon: Brain,
      description: 'Complete AI-powered business intelligence',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'materials',
      title: 'Smart Materials',
      icon: Package,
      description: 'Intelligent material recommendations',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'forecasting',
      title: 'Demand Forecasting',
      icon: TrendingUp,
      description: 'Predict future demand patterns',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'optimization',
      title: 'Job Optimization',
      icon: Zap,
      description: 'Optimize cutting operations',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'pricing',
      title: 'Pricing Intelligence',
      icon: Target,
      description: 'Smart pricing recommendations',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'vision',
      title: 'Computer Vision',
      icon: Camera,
      description: 'AI-powered quality inspection',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'assistant',
      title: 'AI Assistant',
      icon: MessageSquare,
      description: 'Natural language business help',
      color: 'from-teal-500 to-blue-600'
    }
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="w-20 h-20 text-blue-500 mx-auto mb-6" />
              <h3 className="solv-h1 text-solv-black mb-4">AI-Powered Business Intelligence</h3>
              <p className="solv-body text-solv-black/70 text-lg max-w-3xl mx-auto">
                Transform your cutting business with comprehensive AI solutions that provide intelligent insights, 
                optimize operations, and drive profitability through data-driven decision making.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="solv-card text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="solv-h3 text-solv-black mb-2">Smart Analytics</h4>
                <p className="solv-body text-solv-black/70">
                  Real-time business intelligence with predictive analytics and trend analysis
                </p>
              </div>
              
              <div className="solv-card text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="solv-h3 text-solv-black mb-2">Process Optimization</h4>
                <p className="solv-body text-solv-black/70">
                  AI-driven recommendations to streamline operations and reduce costs
                </p>
              </div>
              
              <div className="solv-card text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="solv-h3 text-solv-black mb-2">Strategic Insights</h4>
                <p className="solv-body text-solv-black/70">
                  Data-driven recommendations for pricing, inventory, and business growth
                </p>
              </div>
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Package className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="solv-h2 text-solv-black mb-4">AI Material Recommendations</h3>
              <p className="solv-body text-solv-black/70">
                Intelligent material selection based on cost, availability, and project requirements
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Smart Selection</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Cost-optimized material suggestions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Stock level analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Quality and compatibility matching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Supplier performance tracking</span>
                  </li>
                </ul>
              </div>
              
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Benefits</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="solv-body text-solv-black">Cost Savings</span>
                    <span className="solv-h4 text-green-600">15-25%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="solv-body text-solv-black">Time Savings</span>
                    <span className="solv-h4 text-blue-600">30-45%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="solv-body text-solv-black">Quality Improvement</span>
                    <span className="solv-h4 text-purple-600">20-35%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'forecasting':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="solv-h2 text-solv-black mb-4">AI Demand Forecasting</h3>
              <p className="solv-body text-solv-black/70">
                Predict future demand patterns using advanced machine learning algorithms 
                to optimize inventory and prevent stockouts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Forecasting Features</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    <span>Historical data analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    <span>Seasonal trend detection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    <span>Market demand prediction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    <span>Automated reorder suggestions</span>
                  </li>
                </ul>
              </div>
              
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Accuracy Metrics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="solv-body text-solv-black">Short-term (1-4 weeks)</span>
                    <span className="solv-h4 text-purple-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="solv-body text-solv-black">Medium-term (1-3 months)</span>
                    <span className="solv-h4 text-blue-600">87%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="solv-body text-solv-black">Long-term (3-6 months)</span>
                    <span className="solv-h4 text-green-600">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="solv-h2 text-solv-black mb-4">AI Job Optimization</h3>
              <p className="solv-body text-solv-black/70">
                Optimize cutting operations for maximum efficiency, reduced waste, and improved profitability
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Optimization Features</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span>Batch processing optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span>Material waste reduction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span>Cutting sequence optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span>Resource allocation</span>
                  </li>
                </ul>
              </div>
              
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Efficiency Gains</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="solv-body text-solv-black">Production Speed</span>
                    <span className="solv-h4 text-yellow-600">+40%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="solv-body text-solv-black">Material Usage</span>
                    <span className="solv-h4 text-green-600">+25%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="solv-body text-solv-black">Setup Time</span>
                    <span className="solv-h4 text-blue-600">-35%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="solv-h2 text-solv-black mb-4">AI Pricing Intelligence</h3>
              <p className="solv-body text-solv-black/70">
                Dynamic pricing recommendations based on market trends, competitor analysis, and demand patterns
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Pricing Features</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    <span>Real-time market analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    <span>Competitor price tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    <span>Demand-based pricing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    <span>Profit margin optimization</span>
                  </li>
                </ul>
              </div>
              
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Revenue Impact</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="solv-body text-solv-black">Revenue Increase</span>
                    <span className="solv-h4 text-red-600">+18%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="solv-body text-solv-black">Profit Margin</span>
                    <span className="solv-h4 text-green-600">+12%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="solv-body text-solv-black">Market Share</span>
                    <span className="solv-h4 text-blue-600">+8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <h3 className="solv-h2 text-solv-black mb-4">AI Computer Vision</h3>
              <p className="solv-body text-solv-black/70">
                Advanced computer vision for quality inspection, measurement, and process monitoring
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Vision Features</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                    <span>Automatic measurement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                    <span>Quality defect detection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                    <span>Process monitoring</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                    <span>Safety compliance</span>
                  </li>
                </ul>
              </div>
              
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Quality Metrics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <span className="solv-body text-solv-black">Defect Detection</span>
                    <span className="solv-h4 text-indigo-600">99.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="solv-body text-solv-black">Measurement Accuracy</span>
                    <span className="solv-h4 text-green-600">±0.1mm</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="solv-body text-solv-black">Processing Speed</span>
                    <span className="solv-h4 text-blue-600">0.5s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'assistant':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-teal-500 mx-auto mb-4" />
              <h3 className="solv-h2 text-solv-black mb-4">AI Business Assistant</h3>
              <p className="solv-body text-solv-black/70">
                Natural language AI assistant for business queries, reporting, and decision support
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Assistant Capabilities</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span>Natural language queries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span>Business intelligence reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span>Performance analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span>Decision support</span>
                  </li>
                </ul>
              </div>
              
              <div className="solv-card p-6">
                <h4 className="solv-h3 text-solv-black mb-4">Example Queries</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p className="solv-body text-solv-black/80">"What's my revenue this month?"</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p className="solv-body text-solv-black/80">"Which materials are low in stock?"</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p className="solv-body text-solv-black/80">"Show me pending jobs"</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p className="solv-body text-solv-black/80">"What's the best material for this job?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-solv-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="solv-h1 text-solv-black">AI Features Showcase</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-solv-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-solv-black" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 p-4 bg-solv-gray-50 border-b border-solv-gray-200 overflow-x-auto">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                activeFeature === feature.id
                  ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                  : "bg-white text-solv-black hover:bg-solv-gray-100 border border-solv-gray-200"
              )}
            >
              <feature.icon className="w-4 h-4" />
              {feature.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderFeatureContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-solv-gray-200 bg-solv-gray-50">
          <div className="text-center">
            <p className="solv-body text-solv-black/70 mb-3">
              Ready to transform your business with AI?
            </p>
            <button
              onClick={onClose}
              className="solv-button-primary"
            >
              Get Started with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
