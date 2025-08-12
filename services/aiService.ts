import { Material, CutJob, MeasurementUnit } from '../types';

// AI Service Interface
export interface AIRecommendation {
  type: 'material' | 'pricing' | 'optimization' | 'forecast';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  data: any;
  action?: string;
}

export interface AIMaterialRecommendation extends AIRecommendation {
  type: 'material';
  data: {
    recommendedMaterial: Material;
    reason: string;
    costSavings: number;
    stockLevel: 'optimal' | 'low' | 'critical';
  };
}

export interface AIDemandForecast extends AIRecommendation {
  type: 'forecast';
  data: {
    materialId: string;
    materialName: string;
    predictedDemand: number;
    confidence: number;
    recommendedStock: number;
    timeframe: 'week' | 'month' | 'quarter';
  };
}

export interface AIPricingRecommendation extends AIRecommendation {
  type: 'pricing';
  data: {
    materialId: string;
    currentPrice: number;
    recommendedPrice: number;
    marketTrend: 'rising' | 'falling' | 'stable';
    competitorAnalysis: {
      average: number;
      range: [number, number];
    };
  };
}

export interface AIJobOptimization extends AIRecommendation {
  type: 'optimization';
  data: {
    jobId: string;
    currentEfficiency: number;
    recommendedChanges: string[];
    estimatedTimeSavings: number;
    costSavings: number;
  };
}

// AI Service Class
class AIService {
  // Material Recommendations
  getMaterialRecommendations(
    jobRequirements: { length: number; quantity: number; type: 'wood' | 'metal' | 'other' },
    availableMaterials: Material[]
  ): AIMaterialRecommendation[] {
    const recommendations: AIMaterialRecommendation[] = [];
    
    // Filter materials by type
    const typeMaterials = availableMaterials.filter(m => m.type === jobRequirements.type);
    
    // Sort by cost efficiency
    const sortedMaterials = typeMaterials.sort((a, b) => {
      const aEfficiency = a.unitCost / a.currentStock;
      const bEfficiency = b.unitCost / b.currentStock;
      return aEfficiency - bEfficiency;
    });
    
    // Generate recommendations
    sortedMaterials.slice(0, 3).forEach((material, index) => {
      const stockLevel = this.getStockLevel(material);
      const costSavings = this.calculateCostSavings(material, jobRequirements);
      
      recommendations.push({
        type: 'material',
        title: `Best ${index + 1}: ${material.name}`,
        description: this.generateRecommendationReason(material, jobRequirements),
        confidence: Math.max(0.7, 1 - (index * 0.1)),
        impact: stockLevel === 'critical' ? 'high' : 'medium',
        data: {
          recommendedMaterial: material,
          reason: this.generateRecommendationReason(material, jobRequirements),
          costSavings,
          stockLevel
        }
      });
    });
    
    return recommendations;
  }
  
  // Demand Forecasting
  getDemandForecast(materials: Material[], jobs: CutJob[]): AIDemandForecast[] {
    const forecasts: AIDemandForecast[] = [];
    
    materials.forEach(material => {
      // Analyze job history for this material
      const materialJobs = jobs.filter(job => job.material.id === material.id);
      const recentJobs = materialJobs.filter(job => {
        const daysAgo = (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 30; // Last 30 days
      });
      
      if (recentJobs.length > 0) {
        const totalLength = recentJobs.reduce((sum, job) => sum + job.length, 0);
        const avgLength = totalLength / recentJobs.length;
        const predictedDemand = avgLength * 1.2; // 20% growth assumption
        
        forecasts.push({
          type: 'forecast',
          title: `Demand Forecast: ${material.name}`,
          description: `Predicted demand: ${predictedDemand.toFixed(1)} ${material.measurementUnit === 'imperial' ? 'ft' : 'm'} per month`,
          confidence: 0.75,
          impact: predictedDemand > material.currentStock ? 'high' : 'medium',
          data: {
            materialId: material.id,
            materialName: material.name,
            predictedDemand,
            confidence: 0.75,
            recommendedStock: Math.max(predictedDemand * 1.5, material.reorderThreshold),
            timeframe: 'month'
          }
        });
      }
    });
    
    return forecasts;
  }
  
  // Pricing Intelligence
  getPricingRecommendations(materials: Material[]): AIPricingRecommendation[] {
    const recommendations: AIPricingRecommendation[] = [];
    
    materials.forEach(material => {
      // Simulate market analysis
      const marketTrend = this.analyzeMarketTrend(material);
      const competitorAnalysis = this.simulateCompetitorAnalysis(material);
      
      let recommendedPrice = material.unitCost;
      
      if (marketTrend === 'rising') {
        recommendedPrice *= 1.1; // 10% increase
      } else if (marketTrend === 'falling') {
        recommendedPrice *= 0.95; // 5% decrease
      }
      
      recommendations.push({
        type: 'pricing',
        title: `Pricing Update: ${material.name}`,
        description: `Market trend: ${marketTrend}. Recommended: $${recommendedPrice.toFixed(2)}`,
        confidence: 0.8,
        impact: Math.abs(recommendedPrice - material.unitCost) > 1 ? 'high' : 'low',
        data: {
          materialId: material.id,
          currentPrice: material.unitCost,
          recommendedPrice,
          marketTrend,
          competitorAnalysis
        }
      });
    });
    
    return recommendations;
  }
  
  // Job Optimization
  getJobOptimizations(jobs: CutJob[]): AIJobOptimization[] {
    const optimizations: AIJobOptimization[] = [];
    
    // Find jobs that could be optimized
    const pendingJobs = jobs.filter(job => job.status === 'pending');
    
    if (pendingJobs.length > 1) {
      // Suggest batch processing
      const similarJobs = this.findSimilarJobs(pendingJobs);
      
      if (similarJobs.length > 1) {
        optimizations.push({
          type: 'optimization',
          title: 'Batch Processing Opportunity',
          description: `Group ${similarJobs.length} similar jobs for efficiency`,
          confidence: 0.9,
          impact: 'high',
          data: {
            jobId: 'batch',
            currentEfficiency: 0.6,
            recommendedChanges: ['Group similar materials', 'Optimize cutting sequence', 'Reduce setup time'],
            estimatedTimeSavings: 2.5,
            costSavings: 15.75
          }
        });
      }
    }
    
    return optimizations;
  }
  
  // Natural Language Processing
  processNaturalLanguageQuery(query: string, materials: Material[], jobs: CutJob[]): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('stock') || lowerQuery.includes('inventory')) {
      const lowStock = materials.filter(m => m.currentStock <= m.reorderThreshold);
      if (lowStock.length > 0) {
        return `You have ${lowStock.length} materials with low stock: ${lowStock.map(m => m.name).join(', ')}`;
      }
      return 'All materials are well stocked!';
    }
    
    if (lowerQuery.includes('revenue') || lowerQuery.includes('profit')) {
      const completedJobs = jobs.filter(j => j.status === 'completed');
      const revenue = completedJobs.reduce((sum, job) => sum + job.totalCost, 0);
      return `Total revenue from completed jobs: $${revenue.toFixed(2)}`;
    }
    
    if (lowerQuery.includes('pending') || lowerQuery.includes('jobs')) {
      const pending = jobs.filter(j => j.status === 'pending');
      return `You have ${pending.length} pending jobs`;
    }
    
    return 'I can help with inventory, revenue, jobs, and more. Try asking about stock levels, revenue, or pending jobs.';
  }
  
  // Helper Methods
  private getStockLevel(material: Material): 'optimal' | 'low' | 'critical' {
    const ratio = material.currentStock / material.reorderThreshold;
    if (ratio <= 1) return 'critical';
    if (ratio <= 1.5) return 'low';
    return 'optimal';
  }
  
  private calculateCostSavings(material: Material, requirements: any): number {
    // Simulate cost savings calculation
    return Math.random() * 20 + 5; // $5-$25 savings
  }
  
  private generateRecommendationReason(material: Material, requirements: any): string {
    const reasons = [
      'Best cost-to-stock ratio for your needs',
      'Optimal material type for this application',
      'Excellent availability and pricing',
      'High quality with competitive pricing'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
  
  private analyzeMarketTrend(material: Material): 'rising' | 'falling' | 'stable' {
    // Simulate market trend analysis
    const trends: ('rising' | 'falling' | 'stable')[] = ['rising', 'falling', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  }
  
  private simulateCompetitorAnalysis(material: Material): { average: number; range: [number, number] } {
    // Simulate competitor pricing data
    const basePrice = material.unitCost;
    const variance = basePrice * 0.15; // 15% variance
    const min = basePrice - variance;
    const max = basePrice + variance;
    return { average: basePrice, range: [min, max] };
  }
  
  private findSimilarJobs(jobs: CutJob[]): CutJob[] {
    // Find jobs with similar materials and specifications
    const similarJobs: CutJob[] = [];
    
    for (let i = 0; i < jobs.length; i++) {
      for (let j = i + 1; j < jobs.length; j++) {
        const job1 = jobs[i];
        const job2 = jobs[j];
        
        if (job1.material.type === job2.material.type && 
            Math.abs(job1.length - job2.length) < 2) {
          similarJobs.push(job1, job2);
        }
      }
    }
    
    return [...new Set(similarJobs)]; // Remove duplicates
  }
}

// Export singleton instance
export const aiService = new AIService();
