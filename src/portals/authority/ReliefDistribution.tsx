import React, { useState } from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  Shield,
  LayoutDashboard,
  Map,
  AlertTriangle,
  Building2,
  Heart,
  Megaphone,
  BarChart3,
  FileSearch,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, ProgressBar } from '../../components/common/UIComponents';
import { IncidentStatusBadge } from '../../components/common/StatusBadges';
import type { Distribution } from '../../types';

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

export default function ReliefDistribution() {
  const { currentUser } = useAuth();
  const { state } = useAppState();

  const [distributions, setDistributions] = useState<Distribution[]>(state.distributions);
  const [selectedDist, setSelectedDist] = useState<Distribution | null>(null);
  const [confirmQty, setConfirmQty] = useState<number>(20);

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDist) return;

    const newDelivered = Math.min(selectedDist.quantity, selectedDist.deliveredQuantity + confirmQty);
    const isCompleted = newDelivered >= selectedDist.quantity;

    const updated: Distribution = {
      ...selectedDist,
      deliveredQuantity: newDelivered,
      status: isCompleted ? 'delivered' : 'partially_delivered',
      updatedAt: new Date().toISOString(),
      confirmedBy: currentUser?.name || 'District Coordinator',
    };

    setDistributions(distributions.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDist(null);
    alert(`Delivery updated! ${newDelivered} / ${selectedDist.quantity} confirmed delivered.`);
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="SUPPLY CHAIN DISTRIBUTION: Field coordinators verify actual delivered quantities against dispatch manifests to ensure zero diversion." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Relief Supply Distribution</h1>
            <p className="text-sm text-gray-500">
              Track multi-modal transit of water, food, and emergency supplies from warehouses to victims.
            </p>
          </div>
        </div>

        {/* Distributions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Distribution ID</th>
                  <th className="py-3 px-4">Incident Ref</th>
                  <th className="py-3 px-4">Resource & Quantity</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4">Depot Depot</th>
                  <th className="py-3 px-4 w-44">Delivered Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {distributions.map((dist) => (
                  <tr key={dist.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#172D40]">{dist.id}</td>
                    <td className="py-3 px-4 font-mono text-teal font-medium">{dist.incidentId}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {dist.resourceName} ({dist.quantity} units)
                    </td>
                    <td className="py-3 px-4 text-gray-700">{dist.assignedTeam}</td>
                    <td className="py-3 px-4 text-gray-500">{dist.distributionCentre}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                          <span>{dist.deliveredQuantity} delivered</span>
                          <span>{dist.quantity} total</span>
                        </div>
                        <ProgressBar
                          value={dist.deliveredQuantity}
                          max={dist.quantity}
                          colorClass="bg-teal"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <IncidentStatusBadge status={dist.status as any} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {dist.status !== 'delivered' && (
                        <button
                          onClick={() => {
                            setSelectedDist(dist);
                            setConfirmQty(dist.quantity - dist.deliveredQuantity);
                          }}
                          className="btn-primary text-xs py-1 px-3"
                        >
                          Confirm Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirm Delivery Modal */}
        {selectedDist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl text-xs">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">{selectedDist.id}</span>
                <h3 className="font-heading font-extrabold text-xl text-[#172D40] mt-0.5">
                  Confirm Delivered Supplies
                </h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Resource:</span>
                  <span className="font-bold text-gray-800">{selectedDist.resourceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dispatched Quantity:</span>
                  <span className="font-mono">{selectedDist.dispatchedQuantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Already Delivered:</span>
                  <span className="font-mono text-teal font-bold">{selectedDist.deliveredQuantity} units</span>
                </div>
              </div>

              <form onSubmit={handleConfirmDelivery} className="space-y-4">
                <div>
                  <label className="label">Quantity Delivered to Victims *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedDist.quantity - selectedDist.deliveredQuantity}
                    required
                    value={confirmQty}
                    onChange={(e) => setConfirmQty(Number(e.target.value))}
                    className="input-field text-xs font-heading font-bold text-base"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedDist(null)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
                  >
                    Confirm Delivery
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
