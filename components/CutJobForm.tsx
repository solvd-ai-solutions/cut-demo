import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ruler, Package, Calculator, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { dataStore, getUserMeasurementUnit, setUserMeasurementUnit } from '../services/dataStore';
import { Material, CutJob, MeasurementUnit } from '../types';
import { cn, formatCurrency, calculateJobCost, getStockStatus, a11y } from '../utils';
import { measurementUtils } from '../utils';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate unique IDs for accessibility
  const customerNameId = useMemo(() => a11y.generateId('customer-name'), []);
  const materialId = useMemo(() => a11y.generateId('material'), []);
  const lengthId = useMemo(() => a11y.generateId('length'), []);
  const quantityId = useMemo(() => a11y.generateId('quantity'), []);
  const notesId = useMemo(() => a11y.generateId('notes'), []);
  const unitId = useMemo(() => a11y.generateId('measurement-unit'), []);

  // Parse length input based on current unit
  const parseLengthInput = useCallback((input: string): number => {
    if (measurementUnit === 'imperial') {
      return measurementUtils.parseFeetInches(input);
    } else {
      return measurementUtils.parseMetersCm(input);
    }
  }, [measurementUnit]);

  useEffect(() => {
    const allMaterials = dataStore.getMaterials();
    setMaterials(allMaterials);
    if (allMaterials.length > 0) {
      setSelectedMaterialId(allMaterials[0].id);
    }
    
    // Load user's preferred measurement unit
    const userUnit = getUserMeasurementUnit();
    setMeasurementUnit(userUnit);
  }, []);

  const selectedMaterial = useMemo(() => 
    materials.find(m => m.id === selectedMaterialId), 
    [materials, selectedMaterialId]
  );

  const calculatedCosts = useMemo(() => {
    if (!selectedMaterial || !length || !quantity) {
      return null;
    }

    const lengthNum = parseLengthInput(length);
    const quantityNum = parseInt(quantity);
    
    if (isNaN(lengthNum) || isNaN(quantityNum)) {
      return null;
    }

    // Convert length to the material's default unit if different
    let finalLength = lengthNum;
    if (measurementUnit !== selectedMaterial.measurementUnit) {
      finalLength = measurementUtils.convertMeasurement(
        lengthNum, 
        measurementUnit, 
        selectedMaterial.measurementUnit
      );
    }

    const materialCost = selectedMaterial.unitCost * finalLength * quantityNum;
    return calculateJobCost(materialCost, finalLength, quantityNum);
  }, [selectedMaterial, length, quantity, measurementUnit, parseLengthInput]);

  const stockStatus = useMemo(() => {
    if (!selectedMaterial || !length || !quantity) return null;
    
    const lengthNum = parseLengthInput(length);
    const quantityNum = parseInt(quantity);
    
    if (isNaN(lengthNum) || isNaN(quantityNum)) return null;
    
    // Convert length to the material's default unit for stock check
    let finalLength = lengthNum;
    if (measurementUnit !== selectedMaterial.measurementUnit) {
      finalLength = measurementUtils.convertMeasurement(
        lengthNum,
        measurementUnit,
        selectedMaterial.measurementUnit
      );
    }

    return getStockStatus(
      selectedMaterial.currentStock,
      selectedMaterial.reorderThreshold,
      finalLength,
      quantityNum
    );
  }, [selectedMaterial, length, quantity, measurementUnit, parseLengthInput]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!selectedMaterialId) {
      newErrors.material = 'Please select a material';
    }

    if (!length) {
      newErrors.length = 'Length is required';
    } else {
      const lengthNum = parseLengthInput(length);
      if (isNaN(lengthNum) || lengthNum <= 0) {
        newErrors.length = measurementUnit === 'imperial' 
          ? 'Please enter a valid length (e.g., 5\' 3" or 5.25\')'
          : 'Please enter a valid length (e.g., 2.5m or 250cm)';
      }
    }

    if (!quantity || parseInt(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    // Check stock availability
    if (selectedMaterial && length && quantity) {
      const lengthNum = parseLengthInput(length);
      const quantityNum = parseInt(quantity);
      
      // Convert length to the material's default unit for stock check
      let finalLength = lengthNum;
      if (measurementUnit !== selectedMaterial.measurementUnit) {
        finalLength = measurementUtils.convertMeasurement(
          lengthNum,
          measurementUnit,
          selectedMaterial.measurementUnit
        );
      }

      if (finalLength * quantityNum > selectedMaterial.currentStock) {
        newErrors.stock = `Insufficient stock. Available: ${selectedMaterial.currentStock}${selectedMaterial.measurementUnit === 'imperial' ? 'ft' : 'm'}, Needed: ${(finalLength * quantityNum).toFixed(2)}${selectedMaterial.measurementUnit === 'imperial' ? 'ft' : 'm'}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [customerName, selectedMaterialId, length, quantity, selectedMaterial, measurementUnit, parseLengthInput]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedMaterial = materials.find(m => m.id === selectedMaterialId);
      if (!selectedMaterial) return;

      const lengthNum = parseLengthInput(length);
      const quantityNum = parseInt(quantity);
      
      // Convert length to the material's default unit if different
      let finalLength = lengthNum;
      if (measurementUnit !== selectedMaterial.measurementUnit) {
        finalLength = measurementUtils.convertMeasurement(
          lengthNum, 
          measurementUnit, 
          selectedMaterial.measurementUnit
        );
      }

      const materialCost = selectedMaterial.unitCost * finalLength * quantityNum;
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

      dataStore.saveJob(newJob);
      
      // Save user's measurement unit preference
      setUserMeasurementUnit(measurementUnit);
      
      onJobCreated(newJob);
    } catch (error) {
      console.error('Error creating job:', error);
      setErrors({ submit: 'Failed to create job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [customerName, selectedMaterialId, length, quantity, notes, measurementUnit, materials, validateForm, onJobCreated, parseLengthInput]);

  const handleInputChange = useCallback((field: string, value: string) => {
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
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
  }, [errors]);

  const handleUnitChange = useCallback((unit: MeasurementUnit) => {
    setMeasurementUnit(unit);
    
    // Convert length value if user changes units
    if (length && unit !== measurementUnit) {
      let lengthNum: number;
      
      // Parse current length based on current unit
      if (measurementUnit === 'imperial') {
        lengthNum = measurementUtils.parseFeetInches(length);
      } else {
        lengthNum = measurementUtils.parseMetersCm(length);
      }
      
      if (!isNaN(lengthNum)) {
        const convertedLength = measurementUtils.convertMeasurement(
          lengthNum,
          measurementUnit,
          unit
        );
        
        // Format the converted length for the new unit
        if (unit === 'imperial') {
          const { feet, inches } = measurementUtils.inchesToFeetInches(convertedLength * 12);
          if (feet === 0) {
            setLength(`${inches}"`);
          } else if (inches === 0) {
            setLength(`${feet}'`);
          } else {
            setLength(`${feet}' ${inches}"`);
          }
        } else {
          const { meters, cm } = measurementUtils.cmToMetersCm(convertedLength * 100);
          if (cm === 0) {
            setLength(`${meters}m`);
          } else {
            setLength(`${meters}m ${cm}cm`);
          }
        }
      }
    }
  }, [length, measurementUnit]);

  if (!materials.length) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
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
                      onChange={(e) => setSelectedMaterialId(e.target.value)}
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

                {/* Job Specifications */}
                <div>
                  <h2 className="solv-h2 text-solv-black mb-4 flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Job Specifications
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={unitId} className="solv-body font-semibold block mb-2 text-solv-black">
                        Measurement Unit
                      </label>
                      <select
                        id={unitId}
                        value={measurementUnit}
                        onChange={(e) => handleUnitChange(e.target.value as MeasurementUnit)}
                        className="solv-input"
                        disabled={isSubmitting}
                      >
                        <option value="imperial">Imperial (feet & inches)</option>
                        <option value="metric">Metric (meters & cm)</option>
                      </select>
                    </div>
                    
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
                  </div>

                  <div className="mt-4">
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
                    placeholder="Any special instructions or notes..."
                    rows={3}
                    disabled={isSubmitting}
                  />
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
                        <Calculator className="h-4 w-4" />
                        Create Cut Job
                      </>
                    )}
                  </button>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-solv p-4">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Preview Panel */}
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
                    <span className="solv-body text-solv-black/70">Markup (25%):</span>
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
            <div className="solv-card">
              <h3 className="solv-h3 text-solv-black mb-4">Job Summary</h3>
              
              {customerName && selectedMaterial && length && quantity ? (
                <div className="space-y-2">
                  <p className="solv-body text-solv-black">
                    <strong>Customer:</strong> {customerName}
                  </p>
                  <p className="solv-body text-solv-black">
                    <strong>Material:</strong> {selectedMaterial.name}
                  </p>
                  <p className="solv-body text-solv-black">
                    <strong>Specifications:</strong> {length} × {quantity} pieces
                  </p>
                  <p className="solv-body text-solv-black">
                    <strong>Total Length:</strong> {
                      (() => {
                        const lengthNum = parseLengthInput(length);
                        const totalLength = lengthNum * parseInt(quantity);
                        if (measurementUnit === 'imperial') {
                          const { feet, inches } = measurementUtils.inchesToFeetInches(totalLength * 12);
                          if (feet === 0) return `${inches}"`;
                          if (inches === 0) return `${feet}'`;
                          return `${feet}' ${inches}"`;
                        } else {
                          const { meters, cm } = measurementUtils.cmToMetersCm(totalLength * 100);
                          if (cm === 0) return `${meters}m`;
                          return `${meters}m ${cm}cm`;
                        }
                      })()
                    }
                  </p>
                  <p className="solv-body text-solv-black">
                    <strong>Stock After Cut:</strong> {
                      (() => {
                        if (!selectedMaterial) return 'N/A';
                        const lengthNum = parseLengthInput(length || '0');
                        const quantityNum = parseInt(quantity || '1');
                        const stockAfter = selectedMaterial.currentStock - (lengthNum * quantityNum);
                        if (selectedMaterial.measurementUnit === 'imperial') {
                          const { feet, inches } = measurementUtils.inchesToFeetInches(stockAfter * 12);
                          if (feet === 0) return `${inches}"`;
                          if (inches === 0) return `${feet}'`;
                          return `${feet}' ${inches}"`;
                        } else {
                          const { meters, cm } = measurementUtils.cmToMetersCm(stockAfter * 100);
                          if (cm === 0) return `${meters}m`;
                          return `${meters}m ${cm}cm`;
                        }
                      })()
                    }
                  </p>
                  {notes && (
                    <p className="solv-body text-solv-black">
                      <strong>Notes:</strong> {notes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="solv-body text-solv-black/50 text-center py-8">
                  Job details will appear here
                </p>
              )}
            </div>

            {/* Stock Status */}
            {stockStatus && (
              <div className={cn(
                "border-2 border-solv-black rounded-solv p-4",
                stockStatus.status === 'insufficient' && "bg-red-50",
                stockStatus.status === 'low' && "bg-orange-50",
                stockStatus.status === 'sufficient' && "bg-green-50"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {stockStatus.status === 'insufficient' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  {stockStatus.status === 'low' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                  {stockStatus.status === 'sufficient' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  <p className={cn("solv-body font-semibold", stockStatus.color)}>
                    {stockStatus.message}
                  </p>
                </div>
                <p className="solv-small text-solv-black">
                  Current stock: {
                    (() => {
                      if (!selectedMaterial) return 'N/A';
                      if (selectedMaterial.measurementUnit === 'imperial') {
                        const { feet, inches } = measurementUtils.inchesToFeetInches(selectedMaterial.currentStock * 12);
                        if (feet === 0) return `${inches}"`;
                        if (inches === 0) return `${feet}'`;
                        return `${feet}' ${inches}"`;
                      } else {
                        const { meters, cm } = measurementUtils.cmToMetersCm(selectedMaterial.currentStock * 100);
                        if (cm === 0) return `${meters}m`;
                        return `${meters}m ${cm}cm`;
                      }
                    })()
                  } | 
                  Needed: {
                    (() => {
                      const lengthNum = parseLengthInput(length || '0');
                      const quantityNum = parseInt(quantity || '1');
                      const needed = lengthNum * quantityNum;
                      if (measurementUnit === 'imperial') {
                        const { feet, inches } = measurementUtils.inchesToFeetInches(needed * 12);
                        if (feet === 0) return `${inches}"`;
                        if (inches === 0) return `${feet}'`;
                        return `${feet}' ${inches}"`;
                      } else {
                        const { meters, cm } = measurementUtils.cmToMetersCm(needed * 100);
                        if (cm === 0) return `${meters}m`;
                        return `${meters}m ${cm}cm`;
                      }
                    })()
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}