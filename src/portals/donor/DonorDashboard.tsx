import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  PlusCircle,
  Clock,
  CheckCircle,
  Package,
  TrendingUp,
  Award,
  ArrowRight,
  Shield,
  FileText,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { StatCard, DemoBanner, SectionHeader } from '../../components/common/UIComponents';
import { DonationStatusBadge } from '../../components/common/StatusBadges';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/donor/dashboard', icon: <Heart size={18} /> },
  { label: 'Make a Contribution', to: '/donor/donate', icon: <PlusCircle size={18} /> },
  { label: 'Donation History', to: '/donor/donations', icon: <Clock size={18} /> },
];

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const { state } = useAppState();

  const donations = state.donations;

  // Compute metrics
  const monetaryTotal = donations
    .filter((d) => d.type === 'monetary' && d.amount)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const materialCount = donations
    .filter((d) => d.type === 'material')
    .reduce((acc, curr) => acc + (curr.items?.length || 1), 0);

  const distributedCount = donations.filter((d) => d.status === 'allocated' || d.status === 'distributed').length;
  const pendingInspectionCount = donations.filter((d) => d.status === 'inspected' || d.status === 'received').length;

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Donor Portal" portalColor="#E5A04B">
      <div className="max-w-5xl mx-auto space-y-6">
        <DemoBanner message="TRANSPARENT CIVIC DONATIONS: Track every monetary and material aid contribution from reception to verified field distribution." />

        {/* Welcome CTA Hero */}
        <div className="bg-gradient-to-r from-[#172D40] to-[#24465C] rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-wider font-bold text-amber bg-amber/20 px-2.5 py-1 rounded-full">
              Community Relief Partner
            </span>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-white">
              Welcome, {currentUser?.name || 'Helping Hand Partner'}
            </h1>
            <p className="text-blue-100 text-xs md:text-sm leading-relaxed">
              Your humanitarian contributions directly assist flood-stricken families across Kalyan Nagar and Bhiwandi. ReliefLink maintains zero-leakage transparency with itemized tracking.
            </p>
          </div>
          <Link
            to="/donor/donate"
            className="btn-amber text-sm px-6 py-3 shadow-lg hover:shadow-xl font-bold flex items-center gap-2 flex-shrink-0"
          >
            <PlusCircle size={18} /> Make a Donation
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Monetary Impact"
            value={`₹${monetaryTotal.toLocaleString()}`}
            subtitle="Simulated relief funds"
            icon={<DollarSign size={20} className="text-teal" />}
          />
          <StatCard
            title="Material Supplies"
            value={`${materialCount} Batches`}
            subtitle="Food, water & shelter kits"
            icon={<Package size={20} className="text-amber" />}
            iconBg="bg-amber/10"
          />
          <StatCard
            title="Field Distributed"
            value={distributedCount}
            subtitle="Allocated to victims"
            icon={<CheckCircle size={20} className="text-green-600" />}
            iconBg="bg-green-100"
          />
          <StatCard
            title="Under Inspection"
            value={pendingInspectionCount}
            subtitle="Quality check pending"
            icon={<Clock size={20} className="text-blue-600" />}
            iconBg="bg-blue-100"
          />
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-[#172D40]">Recent Contribution Activity</h2>
            <Link to="/donor/donations" className="text-xs text-teal font-semibold hover:underline flex items-center gap-1">
              View full ledger <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Contribution ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Designated Zone</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#172D40]">{d.id}</td>
                    <td className="py-3 px-4 capitalize font-semibold">{d.type}</td>
                    <td className="py-3 px-4">
                      {d.type === 'monetary'
                        ? `₹${d.amount?.toLocaleString()} ${d.preferredCategory ? `(${d.preferredCategory})` : ''}`
                        : `${d.items?.length || 1} material items (${d.items?.[0]?.name || 'Supplies'})`}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{d.preferredZone || 'All Priority Zones'}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(d.submittedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <DonationStatusBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transparency & Governance Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#172D40]">
              <Shield size={18} className="text-teal" /> Verified Quality & Safety Inspections
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every material donation undergoes physical quality, expiry, and sterility inspection at municipal warehouses before entry into usable inventory. Items that fail safety checks are safely redirected or reported.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#172D40]">
              <Award size={18} className="text-amber" /> Downloadable Contribution Certificates
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Donors receive an official digital verification acknowledgement and unique cryptographic audit hash for all accepted monetary and material contributions.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
