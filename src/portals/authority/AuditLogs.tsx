import React, { useState } from 'react';
import {
  FileSearch,
  Search,
  Filter,
  Clock,
  Shield,
  LayoutDashboard,
  Map,
  AlertTriangle,
  Users,
  Package,
  Truck,
  Building2,
  Heart,
  Megaphone,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import type { AuditEntry } from '../../types';

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

export default function AuditLogs() {
  const { state } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const auditLog = state.auditLog;

  const filteredLogs = auditLog.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.entityId && log.entityId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === 'all' || log.actorRole === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="IMMUTABLE AUDIT TRAIL: Every critical action across Victim, Volunteer, Authority, and Donor portals is logged with actor identities." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">System Audit & Activity Logs</h1>
            <p className="text-sm text-gray-500">
              Complete accountability ledger tracking verifications, resource reserves, and field delivery confirmations.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by action, actor, entity ID, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input-field py-1.5 text-xs w-44"
            >
              <option value="all">All Stakeholder Roles</option>
              <option value="authority">Authorities / Coordinators</option>
              <option value="volunteer">Volunteers</option>
              <option value="victim">Victims / Citizens</option>
              <option value="donor">Donors</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Executed</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Portal Role</th>
                  <th className="py-3 px-4">Target Entity ID</th>
                  <th className="py-3 px-4">Audit Details & Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{entry.action}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{entry.actorName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        entry.actorRole === 'authority'
                          ? 'bg-blue-100 text-blue-800'
                          : entry.actorRole === 'volunteer'
                          ? 'bg-teal/10 text-teal'
                          : entry.actorRole === 'victim'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber/10 text-amber-800'
                      }`}>
                        {entry.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 font-semibold">
                      {entry.entityId || '–'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{entry.details || '–'}</td>
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
