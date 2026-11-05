import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle,
  Plus,
  LayoutDashboard,
  Map,
  AlertTriangle,
  Package,
  Truck,
  Heart,
  Megaphone,
  BarChart3,
  FileSearch,
} from 'lucide-react';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import { FacilityStatusBadge } from '../../components/common/StatusBadges';
import type { NGO } from '../../types';

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

export default function NGODirectory() {
  const { state } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredNgos = state.ngos.filter((n) => {
    const matchesSearch =
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.locality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="CIVIC PARTNERSHIP NETWORK: Accredited humanitarian NGOs, municipal shelters, and international emergency relief agencies." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">NGOs & Partner Relief Centres</h1>
            <p className="text-sm text-gray-500">
              Coordinated relief networks, shelter capacities, and partner operational statuses.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search partner organization by name or locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field py-1.5 text-xs w-48"
            >
              <option value="all">All Organizations</option>
              <option value="ngo">NGOs</option>
              <option value="relief_camp">Relief Camps</option>
              <option value="partner">Municipal Partners</option>
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNgos.map((ngo) => (
            <div key={ngo.id} className="card flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{ngo.id}</span>
                    <h3 className="font-heading font-bold text-base text-[#172D40] mt-0.5">
                      {ngo.name}
                    </h3>
                  </div>
                  <FacilityStatusBadge status={ngo.status} />
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 pt-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{ngo.address}, {ngo.locality}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" />
                    <span className="font-mono text-teal font-medium">{ngo.phone}</span>
                  </div>
                  {ngo.email && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Mail size={14} />
                      <span>{ngo.email}</span>
                    </div>
                  )}
                  {ngo.contactPerson && (
                    <div className="text-gray-700 font-medium">
                      Point of Contact: <strong>{ngo.contactPerson}</strong>
                    </div>
                  )}
                </div>

                {ngo.capacity && (
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
                    <div className="flex justify-between text-gray-700 font-medium mb-1">
                      <span>Shelter Capacity</span>
                      <span>{ngo.currentOccupancy} / {ngo.capacity} occupants</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal h-full rounded-full"
                        style={{ width: `${Math.min(100, ((ngo.currentOccupancy || 0) / ngo.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Services & Specialities</div>
                  <div className="flex flex-wrap gap-1">
                    {ngo.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs text-gray-400">
                <span>Verified Humanitarian Partner</span>
                <span className="font-semibold text-teal">Active Status ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
