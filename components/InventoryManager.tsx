import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, AlertTriangle, Package, ShoppingCart, CheckSquare, Square, Lock, TrendingDown, Edit } from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { Material, ReorderAlert, MeasurementUnit } from '../types';
import { measurementUtils } from '../utils';
import { PurchaseOrderModal } from './PurchaseOrderModal';

interface InventoryManagerProps {
  onBack: () => void;
}

export function InventoryManager({ onBack }: InventoryManagerProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [showPurchaseOrders, setShowPurchaseOrders] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [showBulkReorderDialog, setShowBulkReorderDialog] = useState(false);
  const [reorderPassword, setReorderPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showReorderForm, setShowReorderForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'wood' as Material['type'],
    unitCost: '',
    currentStock: '',
    reorderThreshold: '',
    supplier: '',
    measurementUnit: 'imperial' as MeasurementUnit,
  });

  // Predefined password for reordering (in a real app, this would be encrypted/hashed)
  const REORDER_PASSWORD = 'MANAGER2024';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allMaterials = dataStore.getMaterials();
    const alerts = dataStore.getReorderAlerts();
    setMaterials(allMaterials);
    setReorderAlerts(alerts);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'wood',
      unitCost: '',
      currentStock: '',
      reorderThreshold: '',
      supplier: '',
      measurementUnit: 'imperial',
    });
  };

  const handleMaterialSelection = (materialId: string, checked: boolean) => {
    const newSelected = new Set(selectedMaterials);
    if (checked) {
      newSelected.add(materialId);
    } else {
      newSelected.delete(materialId);
    }
    setSelectedMaterials(newSelected);
  };

  const handleSelectAll = () => {
    const allMaterialIds = new Set(materials.map(m => m.id));
    setSelectedMaterials(allMaterialIds);
  };

  const handleSelectNone = () => {
    setSelectedMaterials(new Set());
  };

  const handleSelectLowStock = () => {
    const lowStockIds = new Set(
      materials
        .filter(m => m.currentStock <= m.reorderThreshold)
        .map(m => m.id)
    );
    setSelectedMaterials(lowStockIds);
  };

  const getSelectedMaterials = () => {
    return materials.filter(m => selectedMaterials.has(m.id));
  };

  const handleBulkReorder = () => {
    if (selectedMaterials.size === 0) {
      alert('Please select materials to reorder');
      return;
    }
    setShowBulkReorderDialog(true);
    setReorderPassword('');
    setPasswordError('');
  };

  const confirmBulkReorder = () => {
    if (reorderPassword !== REORDER_PASSWORD) {
      setPasswordError('Incorrect password. Please contact your manager.');
      return;
    }

    setPasswordError('');
    const selectedMaterialsData = getSelectedMaterials();
    
    // Generate bulk purchase order
    const orderNumber = `BULK-${Date.now().toString().slice(-6)}`;
    let totalOrderValue = 0;
    
    const orderItems = selectedMaterialsData.map(material => {
      const suggestedQuantity = Math.max(
        material.reorderThreshold * 2, 
        (material.reorderThreshold - material.currentStock) + material.reorderThreshold
      );
      const itemTotal = suggestedQuantity * material.unitCost;
      totalOrderValue += itemTotal;
      return {
        material,
        quantity: suggestedQuantity,
        cost: itemTotal
      };
    });

    // Generate and print bulk purchase order
    const printContent = `
      <html>
        <head>
          <title>Bulk Purchase Order - ${orderNumber}</title>
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 20px; 
              max-width: 800px; 
              margin: 0 auto;
              background: white;
              color: black;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              border: 2px solid black; 
              padding: 20px; 
              margin-bottom: 30px;
              border-radius: 8px;
            }
            .order-number {
              background: black;
              color: white;
              padding: 10px 20px;
              font-size: 18px;
              font-weight: bold;
              border-radius: 8px;
            }
            .section {
              border: 2px solid black;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid black; 
              padding: 12px; 
              text-align: left;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
            }
            .total-row {
              background-color: rgba(79, 179, 166, 0.1);
              font-weight: bold;
            }
            .urgent {
              color: #F29E8E;
              font-weight: bold;
            }
            .authorized {
              background: rgba(79, 179, 166, 0.1);
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border: 2px solid black;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>🛠️ HARDWARE STORE</h1>
              <p>Custom Cut & Order Division</p>
            </div>
            <div style="text-align: right;">
              <div class="order-number">${orderNumber}</div>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="authorized">
            <h3>✅ MANAGER AUTHORIZATION</h3>
            <p><strong>Authorized by:</strong> Store Manager</p>
            <p><strong>Authorization Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Bulk Order:</strong> ${selectedMaterialsData.length} materials selected</p>
          </div>

          <div class="section">
            <h2>📋 ORDER DETAILS</h2>
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Type</th>
                  <th>Current Stock</th>
                  <th>Order Quantity</th>
                  <th>Unit Cost</th>
                  <th>Total Cost</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems.map(item => `
                  <tr>
                    <td><strong>${item.material.name}</strong></td>
                    <td>${item.material.type}</td>
                    <td>${item.material.currentStock} ft</td>
                    <td>${item.quantity} ft</td>
                    <td>$${item.material.unitCost.toFixed(2)}</td>
                    <td>$${item.cost.toFixed(2)}</td>
                    <td>${item.material.supplier}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="5"><strong>TOTAL ORDER VALUE</strong></td>
                  <td><strong>$${totalOrderValue.toFixed(2)}</strong></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid black; font-size: 14px;">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Cut & Order Manager - Bulk Reorder System</p>
          </div>
        </body>
      </html>
    `;

    // Print the purchase order
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }

    // Show success message
    alert(`✅ Bulk Reorder Successful!\n\n` +
          `📋 Order Generated: ${orderNumber}\n` +
          `📦 Materials Ordered: ${selectedMaterialsData.length}\n` +
          `💰 Total Value: $${totalOrderValue.toFixed(2)}\n\n` +
          `Purchase order has been printed and is ready to send to suppliers.`);

    // Clear selections and close dialog
    setSelectedMaterials(new Set());
    setShowBulkReorderDialog(false);
    setReorderPassword('');
  };

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      type: material.type,
      unitCost: material.unitCost.toString(),
      currentStock: material.currentStock.toString(),
      reorderThreshold: material.reorderThreshold.toString(),
      supplier: material.supplier,
      measurementUnit: material.measurementUnit,
    });
  };

  const openAddDialog = () => {
    setIsAddingMaterial(true);
    resetForm();
  };

  const closeAddDialog = () => {
    setIsAddingMaterial(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setEditingMaterial(null);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.unitCost || !formData.currentStock || !formData.reorderThreshold || !formData.supplier.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const materialData = {
      name: formData.name.trim(),
      type: formData.type,
      unitCost: parseFloat(formData.unitCost),
      currentStock: parseFloat(formData.currentStock),
      reorderThreshold: parseFloat(formData.reorderThreshold),
      supplier: formData.supplier.trim(),
      measurementUnit: formData.measurementUnit,
    };

    if (editingMaterial) {
      // Update existing material
      const updatedMaterials = materials.map(m =>
        m.id === editingMaterial.id ? { ...materialData, id: editingMaterial.id } : m
      );
      dataStore.saveMaterials(updatedMaterials);
      closeEditDialog();
    } else {
      // Add new material
      const newMaterial: Material = {
        ...materialData,
        id: Date.now().toString(),
      };
      const updatedMaterials = [...materials, newMaterial];
      dataStore.saveMaterials(updatedMaterials);
      closeAddDialog();
    }

    loadData();
  };

  const getStockStatus = (material: Material) => {
    if (material.currentStock <= material.reorderThreshold * 0.5) {
      return <div className="solv-badge-danger">🚨 Critical</div>;
    } else if (material.currentStock <= material.reorderThreshold) {
      return <div className="solv-badge-warning">Low Stock</div>;
    } else if (material.currentStock <= material.reorderThreshold * 1.5) {
      return <div className="solv-badge-warning">Warning</div>;
    } else {
      return <div className="solv-badge-success">In Stock</div>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wood': return '🪵';
      case 'metal': return '🔩';
      default: return '📦';
    }
  };

  return (
    <div className="h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-black p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="solv-button-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 stroke-2 text-black" />
              Back
            </button>
            <div>
              <h1 className="solv-h1 text-black">Inventory Manager</h1>
              <p className="solv-body text-black opacity-70">Track stock levels and manage materials</p>
            </div>
          </div>
          <Package className="h-8 w-8 text-solv-coral stroke-2" />
        </div>
      </div>

      {/* Main Content - Single Viewport Grid */}
      <div className="h-[calc(100%-120px)] p-6 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts & Controls */}
          <div className="space-y-4 h-full overflow-auto">
            {/* Critical Reorder Alerts */}
            {reorderAlerts.length > 0 && (
              <div className="solv-status-warning border-2 border-black rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-black animate-pulse" />
                  <span className="solv-body font-semibold text-black">
                    🚨 {reorderAlerts.length} material(s) need reordering!
                  </span>
                </div>
                <p className="solv-small text-black mb-3">
                  Critical stock levels detected.
                </p>
                <button
                  onClick={() => setShowPurchaseOrders(true)}
                  className="solv-button-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  ORDER NOW
                </button>
              </div>
            )}

            {/* Bulk Selection Controls */}
            <div className="solv-card">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="h-5 w-5 text-solv-lavender stroke-2" />
                <h2 className="solv-h2 text-black">Bulk Selection</h2>
              </div>
              
              <p className="solv-small text-black opacity-70 mb-4">
                {selectedMaterials.size} materials selected
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="solv-button-secondary text-xs py-1 px-2 flex items-center justify-center gap-1"
                  >
                    <CheckSquare className="h-3 w-3" />
                    All ({materials.length})
                  </button>
                  <button
                    onClick={handleSelectLowStock}
                    className="solv-button-secondary text-xs py-1 px-2 flex items-center justify-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Low ({reorderAlerts.length})
                  </button>
                </div>
                
                <button
                  onClick={handleSelectNone}
                  className="solv-button-secondary w-full text-xs py-1 px-2 flex items-center justify-center gap-1"
                >
                  <Square className="h-3 w-3" />
                  Clear Selection
                </button>
                
                <button
                  onClick={handleBulkReorder}
                  disabled={selectedMaterials.size === 0}
                  className="solv-button-primary w-full flex items-center justify-center gap-2"
                  style={{
                    opacity: selectedMaterials.size === 0 ? 0.5 : 1,
                    cursor: selectedMaterials.size === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Lock className="h-4 w-4" />
                  Reorder Selected ({selectedMaterials.size})
                </button>
              </div>

              {selectedMaterials.size > 0 && (
                <div className="mt-4 p-3 bg-white border-2 border-black rounded-lg">
                  <h4 className="solv-small font-semibold text-black mb-2">Selected:</h4>
                  <div className="space-y-1">
                    {getSelectedMaterials().slice(0, 3).map(material => (
                      <div key={material.id} className="solv-badge text-xs">
                        {material.name}
                      </div>
                    ))}
                    {selectedMaterials.size > 3 && (
                      <div className="solv-small text-black opacity-70">
                        +{selectedMaterials.size - 3} more...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Add Material Button */}
            <button
              onClick={openAddDialog}
              className="solv-button-primary w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Material
            </button>
          </div>

          {/* Main Materials List */}
          <div className="lg:col-span-2 h-full">
            <div className="solv-card h-full overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-solv-teal stroke-2" />
                <h2 className="solv-h2 text-black">Materials Inventory</h2>
              </div>
              
              <div className="flex-1 overflow-auto space-y-3">
                {materials.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-black opacity-30 mx-auto mb-4" />
                    <p className="solv-body text-black opacity-50">No materials found</p>
                  </div>
                ) : (
                  materials.map(material => (
                    <div
                      key={material.id}
                      className="border-2 border-black rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.has(material.id)}
                            onChange={(e) => handleMaterialSelection(material.id, e.target.checked)}
                            className="w-4 h-4 accent-solv-teal"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(material.type)}</span>
                              <h3 className="solv-body font-semibold text-black">{material.name}</h3>
                            </div>
                            <p className="solv-small text-black opacity-70">Supplier: {material.supplier}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStockStatus(material)}
                          <button
                            onClick={() => openEditDialog(material)}
                            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                          >
                            <Edit className="h-4 w-4 text-black" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 solv-small">
                        <div>
                          <p className="text-black opacity-50">Stock</p>
                          <p className="font-semibold text-black">
                            {(() => {
                              if (material.measurementUnit === 'imperial') {
                                const { feet, inches } = measurementUtils.inchesToFeetInches(material.currentStock * 12);
                                if (feet === 0) return `${inches}"`;
                                if (inches === 0) return `${feet}'`;
                                return `${feet}' ${inches}"`;
                              } else {
                                const { meters, cm } = measurementUtils.cmToMetersCm(material.currentStock * 100);
                                if (cm === 0) return `${meters}m`;
                                return `${meters}m ${cm}cm`;
                              }
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-black opacity-50">Threshold</p>
                          <p className="font-semibold text-black">
                            {(() => {
                              if (material.measurementUnit === 'imperial') {
                                const { feet, inches } = measurementUtils.inchesToFeetInches(material.reorderThreshold * 12);
                                if (feet === 0) return `${inches}"`;
                                if (inches === 0) return `${feet}'`;
                                return `${feet}' ${inches}"`;
                              } else {
                                const { meters, cm } = measurementUtils.cmToMetersCm(material.reorderThreshold * 100);
                                if (cm === 0) return `${meters}m`;
                                return `${meters}m ${cm}cm`;
                              }
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-black opacity-50">Unit Cost</p>
                          <p className="font-semibold text-black">
                            ${material.unitCost.toFixed(2)}/{material.measurementUnit === 'imperial' ? 'ft' : 'm'}
                          </p>
                        </div>
                        <div>
                          <p className="text-black opacity-50">Type</p>
                          <p className="font-semibold text-black capitalize">{material.type}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Reorder Password Dialog */}
      {showBulkReorderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="solv-card max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-solv-coral stroke-2" />
              <h2 className="solv-h2 text-black">Manager Authorization Required</h2>
            </div>
            
            <p className="solv-body text-black mb-4">
              Enter manager password to authorize bulk reorder of {selectedMaterials.size} materials.
            </p>
            
            <input
              type="password"
              value={reorderPassword}
              onChange={(e) => setReorderPassword(e.target.value)}
              placeholder="Manager Password"
              className="solv-input mb-4"
              onKeyPress={(e) => e.key === 'Enter' && confirmBulkReorder()}
            />
            
            {passwordError && (
              <p className="solv-small text-solv-coral mb-4">{passwordError}</p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={confirmBulkReorder}
                className="solv-button-primary flex-1"
              >
                Authorize & Order
              </button>
              <button
                onClick={() => setShowBulkReorderDialog(false)}
                className="solv-button-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Material Dialog */}
      {(isAddingMaterial || editingMaterial) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="solv-card max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
            <h2 className="solv-h2 text-black mb-4">
              {editingMaterial ? 'Edit Material' : 'Add New Material'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="solv-body font-semibold block mb-2 text-black">Material Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="solv-input"
                  placeholder="e.g., Oak 2x4"
                />
              </div>
              
              <div>
                <label className="solv-body font-semibold block mb-2 text-black">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'wood' | 'metal' | 'other'})}
                  className="solv-input"
                >
                  <option value="wood">Wood</option>
                  <option value="metal">Metal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="solv-body font-semibold block mb-2 text-black">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({...formData, unitCost: e.target.value})}
                    className="solv-input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="solv-body font-semibold block mb-2 text-black">Measurement Unit</label>
                  <select
                    value={formData.measurementUnit}
                    onChange={(e) => setFormData({...formData, measurementUnit: e.target.value as MeasurementUnit})}
                    className="solv-input"
                  >
                    <option value="imperial">Imperial (feet)</option>
                    <option value="metric">Metric (meters)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="solv-body font-semibold block mb-2 text-black">
                    Current Stock ({formData.measurementUnit === 'imperial' ? 'ft' : 'm'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                    className="solv-input"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="solv-body font-semibold block mb-2 text-black">
                    Reorder Threshold ({formData.measurementUnit === 'imperial' ? 'ft' : 'm'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.reorderThreshold}
                    onChange={(e) => setFormData({...formData, reorderThreshold: e.target.value})}
                    className="solv-input"
                    placeholder="0.0"
                  />
                </div>
              </div>
              
              <div>
                <label className="solv-body font-semibold block mb-2 text-black">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="solv-input"
                  placeholder="e.g., ABC Lumber Co."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="solv-button-primary flex-1"
              >
                {editingMaterial ? 'Update Material' : 'Add Material'}
              </button>
              <button
                onClick={editingMaterial ? closeEditDialog : closeAddDialog}
                className="solv-button-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Orders Modal */}
      {showPurchaseOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="solv-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="solv-h2 text-black">Purchase Orders</h2>
              <button
                onClick={() => setShowPurchaseOrders(false)}
                className="solv-button-secondary"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-4">
              {materials.filter(m => m.currentStock <= m.reorderThreshold).map(material => (
                <div key={material.id} className="border-2 border-black rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="solv-h3 text-black">{material.name}</h3>
                      <p className="solv-body text-black/70 capitalize">{material.type}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowPurchaseOrders(false);
                        // Show individual reorder modal
                        setShowReorderForm(true);
                        setSelectedMaterial(material);
                      }}
                      className="solv-button-primary"
                    >
                      Reorder
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-black opacity-50">Current Stock</p>
                      <p className="font-semibold text-black">
                        {material.currentStock} {material.measurementUnit === 'imperial' ? 'ft' : 'm'}
                      </p>
                    </div>
                    <div>
                      <p className="text-black opacity-50">Threshold</p>
                      <p className="font-semibold text-black">
                        {material.reorderThreshold} {material.measurementUnit === 'imperial' ? 'ft' : 'm'}
                      </p>
                    </div>
                    <div>
                      <p className="text-black opacity-50">Unit Cost</p>
                      <p className="font-semibold text-black">
                        ${material.unitCost.toFixed(2)}/{material.measurementUnit === 'imperial' ? 'ft' : 'm'}
                      </p>
                    </div>
                    <div>
                      <p className="text-black opacity-50">Supplier</p>
                      <p className="font-semibold text-black">{material.supplier}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showReorderForm && selectedMaterial && (
        <PurchaseOrderModal
          material={selectedMaterial}
          onClose={() => {
            setShowReorderForm(false);
            setSelectedMaterial(null);
          }}
        />
      )}
    </div>
  );
}