export type MeasurementUnit = 'imperial' | 'metric';

export interface Material {
  id: string;
  name: string;
  type: 'wood' | 'metal' | 'other';
  unitCost: number; // cost per foot (imperial) or per meter (metric)
  currentStock: number; // feet (imperial) or meters (metric) available
  reorderThreshold: number; // minimum feet (imperial) or meters (metric) before reorder
  supplier: string;
  measurementUnit: MeasurementUnit; // default measurement unit for this material
}

export interface CutJob {
  id: string;
  orderCode?: string; // 4-digit alphanumeric code
  customerName: string;
  material: Material;
  length: number; // feet (imperial) or meters (metric)
  quantity: number;
  totalCost: number;
  laborCost: number;
  wasteCost: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
  measurementUnit: MeasurementUnit; // measurement unit used for this job
}

export interface PricingConfig {
  laborRatePerCut: number;
  wasteAllowancePercent: number;
  markupPercent: number;
}

export interface ReorderAlert {
  materialId: string;
  materialName: string;
  currentStock: number;
  reorderThreshold: number;
  supplier: string;
}