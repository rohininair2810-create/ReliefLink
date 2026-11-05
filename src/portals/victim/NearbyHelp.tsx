import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Shield,
  Building,
  Activity,
  Home,
  Utensils,
  Flame,
  Search,
  Filter,
  Users,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import { FacilityStatusBadge } from '../../components/common/StatusBadges';
import type { Facility, FacilityType } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/victim/dashboard', icon: <Users size={18} /> },
  { label: 'Report Emergency', to: '/victim/report', icon: <AlertTriangle size={18} /> },
  { label: 'My Requests', to: '/victim/requests', icon: <Package size={18} /> },
  { label: 'Find Nearby Help', to: '/victim/nearby', icon: <MapPin size={18} /> },
];

export default function NearbyHelp() {
  const { state } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const facilities = state.facilities;

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.locality.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || f.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getFacilityIcon = (type: FacilityType) => {
    switch (type) {
      case 'hospital':
      case 'medical_centre':
        return <Activity className="text-red-600" size={20} />;
      case 'relief_camp':
      case 'shelter':
        return <Home className="text-teal" size={20} />;
      case 'food_distribution':
        return <Utensils className="text-amber" size={20} />;
      case 'fire_station':
        return <Flame className="text-orange-600" size={20} />;
      default:
        return <Building className="text-gray-600" size={20} />;
    }
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Victim Portal" portalColor="#D94B45">
      <div className="max-w-5xl mx-auto space-y-6">
        <DemoBanner message="VERIFIED CIVIC FACILITIES: Operational statuses are field-confirmed by disaster authorities every 4 hours." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Find Nearby Emergency Facilities</h1>
            <p className="text-sm text-gray-500">
              Locate active relief shelters, medical centres, and supply points verified by authorities.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by facility name, locality, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field py-2 text-xs"
            >
              <option value="all">All Types</option>
              <option value="hospital">Hospitals</option>
              <option value="medical_centre">Medical Centres</option>
              <option value="relief_camp">Relief Camps</option>
              <option value="food_distribution">Food Distribution</option>
              <option value="fire_station">Fire Stations</option>
              <option value="warehouse">Warehouses</option>
            </select>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="card flex flex-col justify-between hover:border-gray-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                      {getFacilityIcon(facility.type)}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#172D40]">
                        {facility.name}
                      </h3>
                      <span className="text-xs text-gray-500 capitalize">{facility.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <FacilityStatusBadge status={facility.status} />
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 pt-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{facility.address}, {facility.locality}</span>
                  </div>
                  {facility.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href={`tel:${facility.phone}`} className="text-teal hover:underline font-medium">
                        {facility.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock size={14} />
                    <span>Last checked: {new Date(facility.lastVerified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {facility.capacity && (
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
                    <div className="flex justify-between text-gray-700 font-medium mb-1">
                      <span>Shelter Capacity</span>
                      <span>{facility.currentOccupancy} / {facility.capacity} occupants</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal h-full rounded-full"
                        style={{ width: `${Math.min(100, ((facility.currentOccupancy || 0) / facility.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Available Services</div>
                  <div className="flex flex-wrap gap-1">
                    {facility.services.map((svc, idx) => (
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

              <div className="pt-4 border-t mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {facility.distance ? `~${facility.distance} km away` : 'Within relief perimeter'}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  Get Directions <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
