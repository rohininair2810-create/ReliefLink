import React, { useState } from 'react';
import {
  Heart,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  DollarSign,
  Shield,
  LayoutDashboard,
  Map,
  AlertTriangle,
  Users,
  Truck,
  Building2,
  Megaphone,
  BarChart3,
  FileSearch,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import { DonationStatusBadge } from '../../components/common/StatusBadges';
import type { Donation, InventoryItem } from '../../types';

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

export default function DonorManagement() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppState();

  const [activeTab, setActiveTab] = useState<'all' | 'monetary' | 'material' | 'pending'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [inspectionNote, setInspectionNote] = useState('Quality passed, seal intact');

  const filteredDonations = state.donations.filter((d) => {
    if (activeTab === 'monetary') return d.type === 'monetary';
    if (activeTab === 'material') return d.type === 'material';
    if (activeTab === 'pending') return d.status === 'inspected' || d.status === 'received';
    return true;
  });

  const handleInspect = (approved: boolean) => {
    if (!selectedDonation) return;

    const newStatus = approved ? 'added_to_inventory' : 'rejected';
    const updatedDonation: Donation = {
      ...selectedDonation,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      items: selectedDonation.items?.map((it) => ({
        ...it,
        inspectionStatus: approved ? 'accepted' : 'rejected',
        inspectionNotes: inspectionNote,
      })),
    };

    dispatch({ type: 'UPDATE_DONATION', payload: updatedDonation });

    // If accepted, add directly into inventory
    if (approved && selectedDonation.items?.[0]) {
      const it = selectedDonation.items[0];
      const newInvItem: InventoryItem = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        name: it.name,
        category: it.category,
        totalStock: it.quantity,
        reservedStock: 0,
        availableStock: it.quantity,
        requiredStock: it.quantity,
        incomingStock: 0,
        unavailableStock: 0,
        warehouse: it.location || 'Central Warehouse – Thane',
        condition: 'good',
        inspectionStatus: 'inspected',
        unit: it.unit,
        lastUpdated: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_INVENTORY', payload: newInvItem });
    }

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: `Donation ${approved ? 'Accepted' : 'Rejected'}`,
        actorId: currentUser?.id || 'AUTH001',
        actorName: currentUser?.name || 'District Coordinator',
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        details: `Donation ${selectedDonation.id} inspected. Status: ${newStatus}`,
        entityId: selectedDonation.id,
        entityType: 'donation',
      },
    });

    alert(`Donation ${selectedDonation.id} marked as: ${newStatus.toUpperCase()}`);
    setSelectedDonation(null);
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="DONOR GOVERNANCE & INTAKE: Material donations must be formally inspected and approved before entering the usable district inventory." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Donor & Aid Management</h1>
            <p className="text-sm text-gray-500">
              Review pledged monetary contributions and execute health/sterility inspections on material intake.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b pb-2">
          {[
            { key: 'all', label: `All Contributions (${state.donations.length})` },
            { key: 'pending', label: 'Pending Inspection' },
            { key: 'monetary', label: 'Monetary Funds' },
            { key: 'material', label: 'Material Shipments' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#172D40] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Donation ID</th>
                  <th className="py-3 px-4">Donor Name / Org</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Contribution Content</th>
                  <th className="py-3 px-4">Target Zone</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#172D40]">{d.id}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{d.donorName}</td>
                    <td className="py-3 px-4 uppercase font-semibold text-[11px]">{d.type}</td>
                    <td className="py-3 px-4">
                      {d.type === 'monetary' ? (
                        <span className="font-bold text-teal">₹{d.amount?.toLocaleString()} INR</span>
                      ) : (
                        <span>{d.items?.[0]?.name} ({d.items?.[0]?.quantity} {d.items?.[0]?.unit})</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{d.preferredZone || 'District Priority'}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(d.submittedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <DonationStatusBadge status={d.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {d.type === 'material' && d.status !== 'added_to_inventory' && d.status !== 'distributed' ? (
                        <button
                          onClick={() => setSelectedDonation(d)}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          Inspect & Approve
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Logged ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspection Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl text-xs">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">{selectedDonation.id}</span>
                <h3 className="font-heading font-extrabold text-xl text-[#172D40] mt-0.5">
                  Warehouse Intake Inspection
                </h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contributor:</span>
                  <strong className="text-gray-800">{selectedDonation.donorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Material Item:</span>
                  <strong className="text-gray-800">{selectedDonation.items?.[0]?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-mono text-teal font-bold">{selectedDonation.items?.[0]?.quantity} {selectedDonation.items?.[0]?.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reported Condition:</span>
                  <span className="capitalize">{selectedDonation.items?.[0]?.condition}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="label">Inspector Verification Notes *</label>
                <input
                  type="text"
                  required
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-between gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedDonation(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInspect(false)}
                    className="btn-secondary text-xs text-red-600"
                  >
                    Reject Item
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInspect(true)}
                    className="btn-primary text-xs"
                  >
                    Accept & Add to Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
