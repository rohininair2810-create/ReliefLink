import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  Truck,
  ArrowRight,
  Shield,
  Clock,
  Layers,
  MapPin,
  Building2,
  Heart,
  Megaphone,
  BarChart3,
  FileSearch,
  LayoutDashboard,
  Map,
  Users,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import type { InventoryItem, ResourceCategory } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Overview', to: '/authority/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Live Disaster Map', to: '/authority/map', icon: <Map size={18} /> },
  { label: 'Emergency Requests', to: '/authority/incidents', icon: <AlertTriangle size={18} /> },
  { label: 'Volunteer Management', to: '/authority/volunteers', icon: <Users size={18} /> },
  { label: 'Resource & Inventory', to: '/authority/inventory', icon: <Package size={18} /> },
  { label: 'Relief Distribution', to: '/authority/distribution', icon: <Truck size={18} /> },
  { label: 'NGOs & Relief Centres', to: '/authority/ngos', icon: <Building2 size={18} /> },
  { label: 'Donor Management', to: '/authority/donations', icon: <Heart size={18} /> },
  { label: 'Announcements', to: '/authority/announcements', icon: <Megaphone size={18} /> },
  { label: 'Reports & Analytics', to: '/authority/reports', icon: <BarChart3 size={18} /> },
  { label: 'Audit Logs', to: '/authority/audit', icon: <FileSearch size={18} /> },
];

export default function InventoryManagement() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Allocation modal state
  const [allocateQty, setAllocateQty] = useState<number>(100);
  const [targetIncidentId, setTargetIncidentId] = useState(state.incidents[0]?.id || 'RL-INC-001');

  // Add stock modal state
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ResourceCategory>('water');
  const [newItemStock, setNewItemStock] = useState<number>(1000);
  const [newItemUnit, setNewItemUnit] = useState('bottles');
  const [newItemWarehouse, setNewItemWarehouse] = useState('Central Warehouse – Thane');

  const filteredInventory = state.inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (allocateQty > selectedItem.availableStock) {
      alert(`Allocation Error: Cannot allocate ${allocateQty} ${selectedItem.unit}. Only ${selectedItem.availableStock} ${selectedItem.unit} available in usable inventory! Shortage of ${allocateQty - selectedItem.availableStock} units.`);
      return;
    }

    const updatedItem: InventoryItem = {
      ...selectedItem,
      reservedStock: selectedItem.reservedStock + allocateQty,
      availableStock: selectedItem.availableStock - allocateQty,
      lastUpdated: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_INVENTORY', payload: updatedItem });

    // Update target incident resources
    const targetIncident = state.incidents.find((i) => i.id === targetIncidentId);
    if (targetIncident) {
      const updatedRes = targetIncident.resources.map((r) => {
        if (r.category === selectedItem.category) {
          return {
            ...r,
            allocated: r.allocated + allocateQty,
            status: 'resources_allocated' as const,
          };
        }
        return r;
      });

      dispatch({
        type: 'UPDATE_INCIDENT',
        payload: {
          ...targetIncident,
          resources: updatedRes,
          status: 'resources_allocated',
          updatedAt: new Date().toISOString(),
        },
      });
    }

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: 'Supplies Allocated',
        actorId: currentUser?.id || 'AUTH001',
        actorName: currentUser?.name || 'District Coordinator',
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        details: `Allocated ${allocateQty} ${selectedItem.unit} of ${selectedItem.name} to ${targetIncidentId}. New Available: ${updatedItem.availableStock}`,
        entityId: selectedItem.id,
        entityType: 'inventory',
      },
    });

    alert(`Successfully reserved and allocated ${allocateQty} ${selectedItem.unit} to ${targetIncidentId}!`);
    setSelectedItem(null);
  };

  const handleCreateStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      name: newItemName,
      category: newItemCategory,
      totalStock: newItemStock,
      reservedStock: 0,
      availableStock: newItemStock,
      requiredStock: newItemStock,
      incomingStock: 0,
      unavailableStock: 0,
      warehouse: newItemWarehouse,
      condition: 'good',
      inspectionStatus: 'inspected',
      unit: newItemUnit,
      lastUpdated: new Date().toISOString(),
    };

    dispatch({
      type: 'UPDATE_INVENTORY',
      payload: newItem,
    });
    setShowAddStockModal(false);
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="INVENTORY RESERVATION ENGINE: System enforces Available Stock = Total Usable - Reserved. Over-allocation is strictly prohibited." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Resource & Central Inventory</h1>
            <p className="text-sm text-gray-500">
              Manage district relief warehouses, reserve supplies for verified incidents, and track stock burn rate.
            </p>
          </div>

          <button
            onClick={() => setShowAddStockModal(true)}
            className="btn-primary text-xs flex items-center gap-1.5 self-start"
          >
            <Plus size={14} /> Intake New Warehouse Stock
          </button>
        </div>

        {/* Shortage Warning Banner */}
        <div className="bg-amber/10 border border-amber/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Stock Shortage Alert:</strong> Clean Drinking Water (1L) demand exceeds warehouse buffer in Bhiwandi Sector. 2,000 units are incoming from donor pledge DON-002.
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by item name or warehouse facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field py-1.5 text-xs w-48"
            >
              <option value="all">All Categories</option>
              <option value="water">Drinking Water</option>
              <option value="food">Food & Rations</option>
              <option value="shelter">Shelter & Tents</option>
              <option value="medical">Medical First Aid</option>
              <option value="clothing_essentials">Clothing & Hygiene</option>
            </select>
          </div>
        </div>

        {/* Inventory Ledger Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Item & Unit</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Warehouse Depot</th>
                  <th className="py-3 px-4 text-right">Total Stock</th>
                  <th className="py-3 px-4 text-right">Reserved</th>
                  <th className="py-3 px-4 text-right bg-teal/5 text-teal font-bold">Available to Allocate</th>
                  <th className="py-3 px-4">Quality & Inspection</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {item.name}
                      <span className="block text-[11px] font-normal text-gray-400">Unit: {item.unit}</span>
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold">{item.category.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-gray-600 flex items-center gap-1 mt-2">
                      <MapPin size={12} className="text-gray-400" /> {item.warehouse}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">{item.totalStock.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber font-semibold">{item.reservedStock.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-teal bg-teal/5 text-sm">
                      {item.availableStock.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        Inspected ✓
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setAllocateQty(Math.min(100, item.availableStock));
                        }}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        Allocate Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocate Stock Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">ID: {selectedItem.id}</span>
                <h3 className="font-heading font-extrabold text-xl text-[#172D40] mt-0.5">
                  Allocate {selectedItem.name}
                </h3>
              </div>

              {/* Stock calculation display */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Warehouse Location:</span>
                  <span className="font-bold text-gray-800">{selectedItem.warehouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Physical Stock:</span>
                  <span className="font-mono">{selectedItem.totalStock} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between text-amber">
                  <span>Currently Reserved:</span>
                  <span className="font-mono font-bold">{selectedItem.reservedStock} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between text-teal border-t pt-1 font-bold">
                  <span>Available to Allocate:</span>
                  <span className="font-mono text-sm">{selectedItem.availableStock} {selectedItem.unit}</span>
                </div>
              </div>

              <form onSubmit={handleAllocate} className="space-y-4 text-xs">
                <div>
                  <label className="label">Target Incident *</label>
                  <select
                    value={targetIncidentId}
                    onChange={(e) => setTargetIncidentId(e.target.value)}
                    className="input-field text-xs"
                  >
                    {state.incidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        {inc.id} – {inc.title} ({inc.location.locality})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Quantity to Reserve & Allocate ({selectedItem.unit}) *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItem.availableStock}
                    required
                    value={allocateQty}
                    onChange={(e) => setAllocateQty(Number(e.target.value))}
                    className="input-field text-xs font-heading font-bold text-base"
                  />
                  <div className="text-[11px] text-gray-500 mt-1">
                    Remaining after allocation: <strong>{selectedItem.availableStock - allocateQty}</strong> {selectedItem.unit}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
                  >
                    Confirm Allocation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Stock Modal */}
        {showAddStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 space-y-4 shadow-2xl text-xs">
              <h3 className="font-heading font-extrabold text-xl text-[#172D40]">
                Intake New Warehouse Stock
              </h3>

              <form onSubmit={handleCreateStock} className="space-y-3">
                <div>
                  <label className="label">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Tarpaulins 4x6m"
                    className="input-field text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as any)}
                      className="input-field text-xs"
                    >
                      <option value="water">Water</option>
                      <option value="food">Food</option>
                      <option value="shelter">Shelter</option>
                      <option value="medical">Medical</option>
                      <option value="clothing_essentials">Clothing</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Packaging Unit</label>
                    <input
                      type="text"
                      required
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      placeholder="e.g. pieces"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Intake Stock Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="label">Depot Facility</label>
                  <select
                    value={newItemWarehouse}
                    onChange={(e) => setNewItemWarehouse(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Central Warehouse – Thane">Central Warehouse – Thane</option>
                    <option value="Regional Store – Bhiwandi">Regional Store – Bhiwandi</option>
                    <option value="Medical Store – Kalyan">Medical Store – Kalyan</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddStockModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
                  >
                    Register Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
