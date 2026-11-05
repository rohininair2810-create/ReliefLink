import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  Truck,
  Award,
  Calendar,
  MapPin,
  ClipboardList,
  Filter,
} from 'lucide-react';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { StatCard, DemoBanner, EmptyState } from '../../components/common/UIComponents';
import { SeverityBadge } from '../../components/common/StatusBadges';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/volunteer/dashboard', icon: <ClipboardList size={18} /> },
  { label: 'My Assignments', to: '/volunteer/assignments', icon: <Truck size={18} /> },
  { label: 'Contribution History', to: '/volunteer/history', icon: <Clock size={18} /> },
];

export default function ContributionHistory() {
  const { state } = useAppState();
  const [filterCategory, setFilterCategory] = useState('all');

  const assignments = state.assignments;
  const filtered = assignments.filter((a) => {
    if (filterCategory === 'all') return true;
    return a.taskCategory.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Volunteer Portal" portalColor="#197C78">
      <div className="max-w-5xl mx-auto space-y-6">
        <DemoBanner message="CIVIC VOLUNTEER RECORD: Verified records of all community disaster relief operations executed." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Contribution & Service History</h1>
            <p className="text-sm text-gray-500">
              Complete chronological audit trail of all deployed relief tasks and emergency response actions.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Missions"
            value={assignments.length}
            subtitle="Authority assigned tasks"
            icon={<ClipboardList size={20} className="text-teal" />}
          />
          <StatCard
            title="Service Hours"
            value="18.5 hrs"
            subtitle="Simulated field deployment"
            icon={<Clock size={20} className="text-amber" />}
            iconBg="bg-amber/10"
          />
          <StatCard
            title="Direct Beneficiaries"
            value="160+ people"
            subtitle="Supplies & first aid delivered"
            icon={<Award size={20} className="text-green-600" />}
            iconBg="bg-green-100"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Filter size={16} className="text-gray-400" />
            <span>Filter Task Category:</span>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field text-xs py-1.5 w-48"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical Assistance</option>
            <option value="food">Food Logistics</option>
            <option value="evacuation">Evacuation</option>
          </select>
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Task Category</th>
                  <th className="py-3 px-4">Area / Site</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Assigned On</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#172D40]">{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.taskCategory}</td>
                    <td className="py-3 px-4 text-gray-600">{item.area}</td>
                    <td className="py-3 px-4">
                      <SeverityBadge level={item.urgency} />
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(item.assignedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-teal capitalize">
                        <CheckCircle size={12} /> {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
