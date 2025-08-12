import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ruler, Package, Calculator, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { dataStore, getUserMeasurementUnit, setUserMeasurementUnit } from '../services/dataStore';
import { Material, CutJob, MeasurementUnit } from '../types';
import { cn, formatCurrency, calculateJobCost, getStockStatus, a11y } from '../utils';
import { measurementUtils } from '../utils';
import AIMaterialRecommendations from './AIMaterialRecommendations';

interface CutJobFormProps {
  onBack: () => void;
  onJobCreated: (job: CutJob) => void;
}

export function CutJobForm({ onBack, onJobCreated }: CutJobFormProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [length, setLength] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>('imperial');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate unique IDs for accessibility
  const customerNameId = a11y.generateId('customer-name');
  const materialId = a11y.generateId('material');
  const lengthId = a11y.generateId('length');
  const quantityId = a11y.generateId('quantity');
  const notesId = a11y.generateId('notes');

  useEffect(() => {
    // Load materials and user preferences
    const allMaterials = dataStore.getMaterials();
    const userUnit = getUserMeasurementUnit();
    
    setMaterials(allMaterials);
    setMeasurementUnit(userUnit);
    setIsLoading(false);
  }, []);

  const selectedMaterial = useMemo(() => {
    return materials.find(m => m.id === selectedMaterialId) || null;
  }, [materials, selectedMaterialId]);

  const calculatedCosts = useMemo(() => {
    if (!selectedMaterial || !length || !quantity) return null;
    
    try {
      const lengthNum = parseLengthInput(length);
      const quantityNum = parseInt(quantity);
      
      if (isNaN(lengthNum) || isNaN(quantityNum)) return null;
      
      // Convert length to material's default unit for calculation
      const finalLength = measurementUnit === selectedMaterial.measurementUnit 
        ? lengthNum 
        : measurementUnit === 'imperial' 
          ? lengthNum * 0.3048 // feet to meters
          : lengthNum * 3.28084; // meters to feet
      
      const materialCost = finalLength * selectedMaterial.unitCost * quantityNum;
      const costs = calculateJobCost(materialCost, finalLength, quantityNum);
      
      return costs;
    } catch (error) {
      console.error('Error calculating costs:', error);
      return null;
    }
  }, [selectedMaterial, length, quantity, measurementUnit]);

  const stockStatus = useMemo(() => {
    if (!selectedMaterial || !length || !quantity) return null;
    
    try {
      // Convert length to material's default unit for stock check
      const lengthNum = parseLengthInput(length);
      const quantityNum = parseInt(quantity);
      
      if (isNaN(lengthNum) || isNaN(quantityNum)) return null;
      
      const finalLength = measurementUnit === selectedMaterial.measurementUnit 
        ? lengthNum 
        : measurementUnit === 'imperial' 
          ? lengthNum * 0.3048
          : lengthNum * 3.28084;
      
      return getStockStatus(selectedMaterial.currentStock, selectedMaterial.reorderThreshold, finalLength, quantityNum);
    } catch (error) {
      console.error('Error calculating stock status:', error);
      return null;
    }
  }, [selectedMaterial, length, quantity, measurementUnit]);

  const parseLengthInput = useCallback((input: string): number => {
    try {
      if (measurementUnit === 'imperial') {
        return measurementUtils.parseFeetInches(input);
      } else {
        return measurementUtils.parseMetersCm(input);
      }
    } catch (error) {
      console.error('Error parsing length input:', error);
      return 0;
    }
  }, [measurementUnit]);

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'customerName':
        setCustomerName(value);
        break;
      case 'length':
        setLength(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'notes':
        setNotes(value);
        break;
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUnitChange = (newUnit: MeasurementUnit) => {
    if (newUnit === measurementUnit) return;
    
    // Convert length value when changing units
    if (length) {
      const currentLength = parseLengthInput(length);
      if (newUnit === 'imperial') {
        // Convert from metric to imperial
        const { feet, inches } = measurementUtils.inchesToFeetInches(currentLength * 3.28084 * 12);
        if (feet === 0) {
          setLength(`${inches}"`);
        } else if (inches === 0) {
          setLength(`${feet}'`);
        } else {
          setLength(`${feet}' ${inches}"`);
        }
      } else {
        // Convert from imperial to metric
        const { meters, cm } = measurementUtils.cmToMetersCm(currentLength * 0.3048 * 100);
        if (cm === 0) {
          setLength(`${meters}m`);
        } else {
          setLength(`${meters}m ${cm}cm`);
        }
      }
    }
    
    setMeasurementUnit(newUnit);
    setUserMeasurementUnit(newUnit);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!selectedMaterialId) {
      newErrors.material = 'Please select a material';
    }
    
    if (!length.trim()) {
      newErrors.length = 'Length is required';
    } else {
      const lengthNum = parseLengthInput(length);
      if (isNaN(lengthNum) || lengthNum <= 0) {
        newErrors.length = measurementUnit === 'imperial' 
          ? 'Please enter a valid length (e.g., 5\' 3" or 5.25\')'
          : 'Please enter a valid length (e.g., 2.5m or 250cm)';
      }
    }
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const lengthNum = parseLengthInput(length);
      const quantityNum = parseInt(quantity);
      
      if (!selectedMaterial) throw new Error('No material selected');
      
      // Convert length to material's default unit
      const finalLength = measurementUnit === selectedMaterial.measurementUnit 
        ? lengthNum 
        : measurementUnit === 'imperial' 
          ? lengthNum * 0.3048
          : lengthNum * 3.28084;
      
      const materialCost = finalLength * selectedMaterial.unitCost * quantityNum;
      const costs = calculateJobCost(materialCost, finalLength, quantityNum);
      
      const newJob: CutJob = {
        id: Date.now().toString(),
        orderCode: dataStore.generateOrderCode(),
        customerName: customerName.trim(),
        material: selectedMaterial,
        length: finalLength,
        quantity: quantityNum,
        totalCost: costs.totalCost,
        laborCost: costs.laborCost,
        wasteCost: costs.wasteCost,
        status: 'pending',
        createdAt: new Date(),
        notes: notes.trim() || undefined,
        measurementUnit: selectedMaterial.measurementUnit,
      };
      
      // Save job
      dataStore.saveJob(newJob);
      
      // Update material stock
      const updatedMaterials = materials.map(m => 
        m.id === selectedMaterial.id 
          ? { ...m, currentStock: m.currentStock - (finalLength * quantityNum) }
          : m
      );
      dataStore.saveMaterials(updatedMaterials);
      
      // Save user's measurement unit preference
      setUserMeasurementUnit(measurementUnit);
      
      onJobCreated(newJob);
    } catch (error) {
      console.error('Error creating job:', error);
      setErrors({ submit: 'Failed to create job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-solv-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solv-teal mx-auto mb-4"></div>
          <p className="solv-body text-solv-black">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-solv-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="solv-button-secondary flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="solv-h1 text-solv-black">Create New Cut Job</h1>
            <p className="solv-body text-solv-black/70">Fill out the form below to create a new cutting job</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="solv-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h2 className="solv-h2 text-solv-black mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Customer Information
                  </h2>
                  
                  <div>
                    <label htmlFor={customerNameId} className="solv-body font-semibold block mb-2 text-solv-black">
                      Customer Name *
                    </label>
                    <input
                      id={customerNameId}
                      type="text"
                      value={customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className={cn(
                        "solv-input",
                        errors.customerName && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      placeholder="Enter customer name"
                      required
                      aria-describedby={errors.customerName ? `${customerNameId}-error` : undefined}
                      disabled={isSubmitting}
                    />
                    {errors.customerName && (
                      <p id={`${customerNameId}-error`} className="text-red-500 text-sm mt-1" role="alert">
                        {errors.customerName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Material Selection */}
                <div>
                  <h2 className="solv-h2 text-solv-black mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Material Selection
                  </h2>
                  
                  <div>
                    <label htmlFor={materialId} className="solv-body font-semibold block mb-2 text-solv-black">
                      Material *
                    </label>
                    <select
                      id={materialId}
                      value={selectedMaterialId}
                      onChange={(e) => {
                        try {
                          const materialId = e.target.value;
                          setSelectedMaterialId(materialId);
                          
                          // Clear any previous errors
                          if (errors.material) {
                            setErrors(prev => ({ ...prev, material: '' }));
                          }
                        } catch (error) {
                          console.error('Error selecting material:', error);
                          setErrors(prev => ({ ...prev, material: 'Error selecting material' }));
                        }
                      }}
                      className={cn(
                        "solv-input",
                        errors.material && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      required
                      aria-describedby={errors.material ? `${materialId}-error` : undefined}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a material</option>
                      {materials.map(material => (
                        <option key={material.id} value={material.id}>
                          {material.name} - {material.type} (${material.unitCost.toFixed(2)}/{material.measurementUnit === 'imperial' ? 'ft' : 'm'})
                        </option>
                      ))}
                    </select>
                    {errors.material && (
                      <p id={`${materialId}-error`} className="text-red-500 text-sm mt-1" role="alert">
                        {errors.material}
                      </p>
                    )}
                  </div>
                </div>

                {/* AI Material Recommendations */}
                {selectedMaterial && (
                  <div className="mt-6">
                    <h3 className="solv-h3 text-solv-black mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      AI Material Recommendations
                    </h3>
                    <div className="p-4 bg-solv-gray-50 rounded-lg border border-solv-gray-200">
                      <p className="text-sm text-solv-black/70">
                        AI analysis will appear here once you enter length and quantity requirements.
                      </p>
                    </div>
                  </div>
                )}

                {/* Job Specifications */}
                <div>
                  <h2 className="solv-h2 text-solv-black mb-4 flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Job Specifications
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Length */}
                    <div>
                      <label htmlFor={lengthId} className="solv-body font-semibold block mb-2 text-solv-black">
                        Length *
                      </label>
                      <input
                        id={lengthId}
                        type="text"
                        value={length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        className={cn(
                          "solv-input",
                          errors.length && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        placeholder={measurementUtils.getInputPlaceholder(measurementUnit)}
                        required
                        aria-describedby={errors.length ? `${lengthId}-error` : undefined}
                        disabled={isSubmitting}
                      />
                      <p className="solv-small text-solv-black/60 mt-1">
                        {measurementUnit === 'imperial'
                          ? 'Enter as: 5\' 3" or 5.25\' or 5.5'
                          : 'Enter as: 2.5m or 250cm or 2.5'
                        }
                      </p>
                      {errors.length && (
                        <p id={`${lengthId}-error`} className="text-red-500 text-sm mt-1" role="alert">
                          {errors.length}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label htmlFor={quantityId} className="solv-body font-semibold block mb-2 text-solv-black">
                        Quantity *
                      </label>
                      <input
                        id={quantityId}
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className={cn(
                          "solv-input",
                          errors.quantity && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        placeholder="1"
                        required
                        aria-describedby={errors.quantity ? `${quantityId}-error` : undefined}
                        disabled={isSubmitting}
                      />
                      {errors.quantity && (
                        <p id={`${quantityId}-error`} className="text-red-500 text-sm mt-1" role="alert">
                          {errors.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Measurement Unit Toggle */}
                  <div className="mt-4">
                    <label className="solv-body font-semibold block mb-2 text-solv-black">
                      Measurement Unit
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUnitChange('imperial')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-colors",
                          measurementUnit === 'imperial'
                            ? "bg-solv-blue text-white"
                            : "bg-solv-gray-200 text-solv-black hover:bg-solv-gray-300"
                        )}
                      >
                        Imperial (ft/in)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnitChange('metric')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-colors",
                          measurementUnit === 'metric'
                            ? "bg-solv-blue text-white"
                            : "bg-solv-gray-200 text-solv-black hover:bg-solv-gray-300"
                        )}
                      >
                        Metric (m/cm)
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor={notesId} className="solv-body font-semibold block mb-2 text-solv-black">
                      Notes (Optional)
                    </label>
                    <textarea
                      id={notesId}
                      value={notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="solv-input"
                      placeholder="Additional notes or special instructions..."
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="solv-button-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Job...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Create Cut Job
                      </>
                    )}
                  </button>
                </div>

                {errors.submit && (
                  <div className="solv-status-danger">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.submit}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Calculator */}
            {calculatedCosts && (
              <div className="solv-card">
                <h3 className="solv-h3 text-solv-black mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cost Breakdown
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="solv-body text-solv-black/70">Material Cost:</span>
                    <span className="solv-body font-semibold text-solv-black">
                      {formatCurrency(calculatedCosts.materialCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="solv-body text-solv-black/70">Labor Cost:</span>
                    <span className="solv-body font-semibold text-solv-black">
                      {formatCurrency(calculatedCosts.laborCost)} ({quantity} cuts × $0.25)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="solv-body text-solv-black/70">Waste Allowance:</span>
                    <span className="solv-body font-semibold text-solv-black">
                      {formatCurrency(calculatedCosts.wasteCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="solv-body text-solv-black/70">Markup:</span>
                    <span className="solv-body font-semibold text-solv-black">
                      {formatCurrency(calculatedCosts.markup)}
                    </span>
                  </div>
                  <div className="border-t border-solv-black/20 pt-3">
                    <div className="flex justify-between">
                      <span className="solv-h3 text-solv-black">Total Cost:</span>
                      <span className="solv-h3 text-solv-black">
                        {formatCurrency(calculatedCosts.totalCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Summary */}
            {selectedMaterial && (
              <div className="solv-card">
                <h3 className="solv-h3 text-solv-black mb-4">Job Summary</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="solv-small text-solv-black/60">Material:</span>
                    <div className="solv-body font-semibold text-solv-black">
                      {selectedMaterial.name}
                    </div>
                  </div>
                  
                  <div>
                    <span className="solv-small text-solv-black/60">Type:</span>
                    <div className="solv-body font-semibold text-solv-black capitalize">
                      {selectedMaterial.type}
                    </div>
                  </div>
                  
                  <div>
                    <span className="solv-small text-solv-black/60">Unit Cost:</span>
                    <div className="solv-body font-semibold text-solv-black">
                      {formatCurrency(selectedMaterial.unitCost)}/{selectedMaterial.measurementUnit === 'imperial' ? 'ft' : 'm'}
                    </div>
                  </div>
                  
                  <div>
                    <span className="solv-small text-solv-black/60">Current Stock:</span>
                    <div className="solv-body font-semibold text-solv-black">
                      {selectedMaterial.measurementUnit === 'imperial' 
                        ? (() => {
                            const { feet, inches } = measurementUtils.inchesToFeetInches(selectedMaterial.currentStock * 12);
                            if (feet === 0) return `${inches}"`;
                            if (inches === 0) return `${feet}'`;
                            return `${feet}' ${inches}"`;
                          })()
                        : (() => {
                            const { meters, cm } = measurementUtils.cmToMetersCm(selectedMaterial.currentStock * 100);
                            if (cm === 0) return `${meters}m`;
                            return `${meters}m ${cm}cm`;
                          })()
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            {stockStatus && (
              <div className={cn(
                "solv-card",
                stockStatus.status === 'insufficient' && "border-red-300 bg-red-50",
                stockStatus.status === 'low' && "border-yellow-300 bg-yellow-50",
                stockStatus.status === 'sufficient' && "border-green-300 bg-green-50"
              )}>
                <h3 className="solv-h3 text-solv-black mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock Status
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="solv-body text-solv-black/70">Status:</span>
                    <span className={cn(
                      "solv-badge",
                      stockStatus.status === 'insufficient' && "bg-red-100 text-red-800 border-red-300",
                      stockStatus.status === 'low' && "bg-yellow-100 text-yellow-800 border-yellow-300",
                      stockStatus.status === 'sufficient' && "bg-green-100 text-green-800 border-green-300"
                    )}>
                      {stockStatus.status === 'insufficient' ? 'Critical' : 
                       stockStatus.status === 'low' ? 'Low' : 'Good'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="solv-body text-solv-black/70">Available:</span>
                    <span className="solv-body font-semibold text-solv-black">
                      {selectedMaterial?.currentStock.toFixed(2)} {selectedMaterial?.measurementUnit === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  
                  {stockStatus.status !== 'sufficient' && (
                    <div className="mt-3 p-3 bg-solv-black/5 rounded-lg">
                      <p className="solv-small text-solv-black/70">
                        {stockStatus.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}