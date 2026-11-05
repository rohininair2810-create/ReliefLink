import React, { useState } from 'react';
import {
  Heart,
  PlusCircle,
  Clock,
  CheckCircle,
  Download,
  ArrowLeft,
  Package,
  DollarSign,
  Shield,
  FileText,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, Timeline, EmptyState } from '../../components/common/UIComponents';
import { DonationStatusBadge } from '../../components/common/StatusBadges';
import type { Donation } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/donor/dashboard', icon: <Heart size={18} /> },
  { label: 'Make a Contribution', to: '/donor/donate', icon: <PlusCircle size={18} /> },
  { label: 'Donation History', to: '/donor/donations', icon: <Clock size={18} /> },
];

export default function DonationHistory() {
  const { currentUser } = useAuth();
  const { state } = useAppState();

  const donations = state.donations;
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(donations[0] || null);
  const [activeTab, setActiveTab] = useState<'all' | 'monetary' | 'material'>('all');
  const [showCertificate, setShowCertificate] = useState(false);

  const filteredDonations = donations.filter((d) => {
    if (activeTab === 'monetary') return d.type === 'monetary';
    if (activeTab === 'material') return d.type === 'material';
    return true;
  });

  const getTimelineSteps = (donation: Donation) => {
    if (donation.type === 'monetary') {
      const statuses = ['registered', 'allocated', 'distributed'];
      const labels = [
        'Pledge Registered',
        'Funds Allocated to Disaster Reserve',
        'Disbursed for Supplies / Rations',
      ];
      const curIndex = statuses.indexOf(donation.status);
      return labels.map((l, i) => ({
        label: l,
        completed: curIndex >= i || donation.status === 'allocated' || donation.status === 'distributed',
        current: curIndex === i,
        timestamp: curIndex >= i ? 'Confirmed' : undefined,
      }));
    } else {
      const statuses = ['registered', 'received', 'inspected', 'added_to_inventory', 'allocated', 'distributed'];
      const labels = [
        'Registration Logged',
        'Received at Municipal Warehouse',
        'Health & Sterility Inspected',
        'Added to Available Inventory',
        'Allocated to Disaster Area',
        'Field Distributed to Victims',
      ];
      const curIndex = statuses.indexOf(donation.status);
      return labels.map((l, i) => ({
        label: l,
        completed: curIndex >= i || donation.status === 'added_to_inventory' || donation.status === 'allocated' || donation.status === 'distributed',
        current: curIndex === i,
        timestamp: curIndex >= i ? 'Verified' : undefined,
        description: i === 2 ? donation.items?.[0]?.inspectionNotes : undefined,
      }));
    }
  };

  const handleDownloadReceipt = () => {
    setShowCertificate(true);
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Donor Portal" portalColor="#E5A04B">
      <div className="max-w-6xl mx-auto space-y-6">
        <DemoBanner message="CIVIC LEDGER: Real-time transparency tracking ensures you see exactly when your donation is inspected, added to warehouse stock, and delivered." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Donation History & Utilization Ledger</h1>
            <p className="text-sm text-gray-500">
              Audit trails and verification timelines for your monetary and material contributions.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b pb-2">
          {[
            { key: 'all', label: `All Contributions (${donations.length})` },
            { key: 'monetary', label: 'Monetary Aid' },
            { key: 'material', label: 'Material Supplies' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donation List */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs uppercase text-gray-500 tracking-wider">
              Contribution Records
            </h3>

            {filteredDonations.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDonation(d)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedDonation?.id === d.id
                    ? 'border-amber bg-amber/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-gray-500">{d.id}</span>
                  <DonationStatusBadge status={d.status} />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#172D40]">
                  {d.type === 'monetary'
                    ? `₹${d.amount?.toLocaleString()} Monetary Relief`
                    : `${d.items?.[0]?.name || 'Supplies'} (${d.items?.[0]?.quantity} ${d.items?.[0]?.unit})`}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>Zone: {d.preferredZone || 'District'}</span>
                  <span>{new Date(d.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Details & Timeline */}
          {selectedDonation ? (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400">{selectedDonation.id}</span>
                      <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {selectedDonation.type}
                      </span>
                    </div>
                    <h2 className="font-heading font-bold text-xl text-[#172D40] mt-1">
                      {selectedDonation.type === 'monetary'
                        ? `₹${selectedDonation.amount?.toLocaleString()} Humanitarian Grant`
                        : `${selectedDonation.items?.[0]?.name} (${selectedDonation.items?.[0]?.quantity} ${selectedDonation.items?.[0]?.unit})`}
                    </h2>
                  </div>

                  <button
                    onClick={handleDownloadReceipt}
                    className="btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <Download size={14} /> Download Certificate
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Designated Disaster Area:</span>
                    <strong className="text-gray-800 text-sm mt-0.5 block">{selectedDonation.preferredZone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Pledged On:</span>
                    <span className="text-gray-800 text-sm mt-0.5 block">
                      {new Date(selectedDonation.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Current Status:</span>
                    <span className="text-teal font-bold uppercase text-sm mt-0.5 block">
                      {selectedDonation.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Material Item Breakdown */}
                {selectedDonation.type === 'material' && selectedDonation.items && (
                  <div>
                    <h4 className="font-heading font-semibold text-xs uppercase text-gray-500 mb-2">
                      Warehouse Inspection & Stock Status
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Item</th>
                            <th className="py-2.5 px-3">Quantity</th>
                            <th className="py-2.5 px-3">Condition</th>
                            <th className="py-2.5 px-3">Inspection</th>
                            <th className="py-2.5 px-3">Inspection Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedDonation.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="py-2.5 px-3 font-medium text-gray-800">{it.name}</td>
                              <td className="py-2.5 px-3">{it.quantity} {it.unit}</td>
                              <td className="py-2.5 px-3 capitalize">{it.condition}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  it.inspectionStatus === 'accepted'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-50 text-amber-800 border border-amber-300'
                                }`}>
                                  {it.inspectionStatus?.toUpperCase() || 'PENDING'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-gray-500">{it.inspectionNotes || 'Pending warehouse intake'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Utilization Timeline */}
                <div>
                  <h4 className="font-heading font-semibold text-xs uppercase text-gray-500 mb-4">
                    Lifecycle & Distribution Journey
                  </h4>
                  <Timeline steps={getTimelineSteps(selectedDonation)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <EmptyState
                icon={<Package size={36} />}
                title="No contribution selected"
                description="Select an entry from the ledger to view full inspection records and supply timelines."
              />
            </div>
          )}
        </div>

        {/* Certificate Modal */}
        {showCertificate && selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 space-y-6 border-4 border-amber/30 text-center relative shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber/10 text-amber flex items-center justify-center mx-auto">
                <Shield size={32} />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Official Demonstration Certificate</span>
                <h2 className="font-heading font-extrabold text-2xl text-[#172D40] mt-1">
                  ReliefLink Humanitarian Recognition
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Issued under Disaster Relief Coordination Protocol
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contributor:</span>
                  <span className="font-bold text-[#172D40]">{selectedDonation.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Donation ID:</span>
                  <span className="font-mono font-bold">{selectedDonation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contribution:</span>
                  <span className="font-bold text-teal">
                    {selectedDonation.type === 'monetary'
                      ? `₹${selectedDonation.amount?.toLocaleString()} INR`
                      : `${selectedDonation.items?.[0]?.quantity} ${selectedDonation.items?.[0]?.unit} (${selectedDonation.items?.[0]?.name})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Designated Operation:</span>
                  <span className="font-semibold text-gray-800">{selectedDonation.preferredZone} Relief Mission</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Hash:</span>
                  <span className="font-mono text-[10px] text-gray-400">0x8F32A9C4E01D...DEMO</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 italic">
                * Note: Prototype demonstration certificate. Not valid for statutory tax deductions.
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="btn-primary text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
