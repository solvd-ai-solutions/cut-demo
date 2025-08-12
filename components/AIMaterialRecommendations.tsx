import React, { useState, useEffect } from 'react';
import { Brain, Package, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { aiService, AIMaterialRecommendation } from '../services/aiService';
import { Material } from '../types';
import { cn, formatCurrency } from '../utils';

interface AIMaterialRecommendationsProps {
  jobRequirements: {
    length: number;
    quantity: number;
    type: 'wood' | 'metal' | 'other';
  };
  availableMaterials: Material[];
  onMaterialSelect: (material: Material) => void;
}

export default function AIMaterialRecommendations({ 
  jobRequirements, 
  availableMaterials, 
  onMaterialSelect 
}: AIMaterialRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIMaterialRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jobRequirements.length > 0 && jobRequirements.quantity > 0) {
      setIsLoading(true);
      // Simulate AI processing time
      setTimeout(() => {
        const aiRecommendations = aiService.getMaterialRecommendations(jobRequirements, availableMaterials);
        setRecommendations(aiRecommendations);
        setIsLoading(false);
      }, 800);
    }
  }, [jobRequirements, availableMaterials]);

  if (isLoading) {
    return (
      <div className="solv-card border-solv-teal/20 bg-gradient-to-r from-solv-teal/5 to-blue-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-solv-teal"></div>
          <h3 className="solv-h3 text-solv-teal">AI Analyzing Materials...</h3>
        </div>
        <p className="solv-body text-solv-black/70">
          Our AI is analyzing your requirements and finding the best material options
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="solv-card border-solv-teal/20 bg-gradient-to-r from-solv-teal/5 to-blue-50/50">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="h-5 w-5 text-solv-teal" />
        <h3 className="solv-h3 text-solv-teal">AI Material Recommendations</h3>
        <span className="solv-badge bg-solv-teal/20 text-solv-teal border-solv-teal">
          Powered by AI
        </span>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={rec.data.recommendedMaterial.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              rec.impact === 'high' ? 'border-orange-300 bg-orange-50' :
              rec.impact === 'medium' ? 'border-blue-300 bg-blue-50' :
              'border-green-300 bg-green-50'
            )}
            onClick={() => onMaterialSelect(rec.data.recommendedMaterial)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-solv-teal" />
                  <h4 className="solv-h4 font-semibold text-solv-black">
                    {rec.title}
                  </h4>
                  {rec.impact === 'high' && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                
                <p className="solv-body text-solv-black/70 mb-3">
                  {rec.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">
                      Save ${rec.data.costSavings.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className={cn(
                      rec.data.stockLevel === 'critical' ? 'text-red-700' :
                      rec.data.stockLevel === 'low' ? 'text-orange-700' :
                      'text-green-700'
                    )}>
                      Stock: {rec.data.stockLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-solv-teal">
                  ${rec.data.recommendedMaterial.unitCost.toFixed(2)}
                </div>
                <div className="text-sm text-solv-black/60">
                  per {rec.data.recommendedMaterial.measurementUnit === 'imperial' ? 'ft' : 'm'}
                </div>
                <div className="mt-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    rec.confidence >= 0.9 ? 'bg-green-100 text-green-800' :
                    rec.confidence >= 0.8 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  )}>
                    {Math.round(rec.confidence * 100)}% confident
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-solv-black/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMaterialSelect(rec.data.recommendedMaterial);
                }}
                className="solv-button-primary w-full text-sm"
              >
                Use This Material
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-solv-teal/10 rounded-lg border border-solv-teal/20">
        <p className="solv-small text-solv-teal/80 text-center">
          💡 AI recommendations are based on cost efficiency, stock levels, and material suitability
        </p>
      </div>
    </div>
  );
}
