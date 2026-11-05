import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Map,
  Filter,
  Search,
  AlertTriangle,
  Users,
  Building,
  Activity,
  Package,
  Shield,
  Clock,
  Layers,
  ChevronRight,
  Info,
  CheckCircle,
  XCircle,
  Truck,
  Building2,
  Heart,
  Megaphone,
  BarChart3,
  FileSearch,
  LayoutDashboard,
} from 'lucide-react';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import { SeverityBadge, IncidentStatusBadge, VerificationBadge } from '../../components/common/StatusBadges';
import type { Incident, Facility, SeverityLevel } from '../../types';

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

export default function DisasterMap() {
  const { state, dispatch } = useAppState();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(state.incidents[0] || null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showFacilities, setShowFacilities] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHeatPerimeter, setShowHeatPerimeter] = useState(true);
  const [searchArea, setSearchArea] = useState('');

  const center: [number, number] = [19.225, 73.01];

  const filteredIncidents = state.incidents.filter((inc) => {
    if (filterSeverity !== 'all' && inc.priority !== filterSeverity) return false;
    if (searchArea && !inc.location.locality.toLowerCase().includes(searchArea.toLowerCase())) return false;
    return true;
  });

  const getIncidentColor = (priority: SeverityLevel) => {
    switch (priority) {
      case 'critical':
        return '#D94B45'; // Emergency Red
      case 'severe':
        return '#E5A04B'; // Amber
      case 'moderate':
        return '#ECC94B'; // Yellow
      case 'low':
        return '#38A169'; // Green
      default:
        return '#718096';
    }
  };

  const getFacilityColor = (type: Facility['type']) => {
    switch (type) {
      case 'hospital':
      case 'medical_centre':
        return '#805AD5'; // Purple
      case 'relief_camp':
      case 'shelter':
        return '#3182CE'; // Blue
      case 'warehouse':
        return '#975A16'; // Brown
      case 'food_distribution':
        return '#D69E2E';
      default:
        return '#4A5568';
    }
  };

  const handleVerify = (inc: Incident) => {
    const updated: Incident = {
      ...inc,
      verificationStatus: 'verified',
      status: 'verified',
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
    setSelectedIncident(updated);
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="h-[calc(100vh-100px)] flex flex-col space-y-3">
        <DemoBanner message="GEOSPATIAL COORDINATION: Live multi-tier map plotting verified incidents, volunteer locations, and relief warehouse perimeters." />

        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Map & Controls Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
            {/* Top Overlay Filters */}
            <div className="p-3 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search locality (e.g. Kalyan)..."
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className="input-field pl-8 py-1 text-xs w-48"
                  />
                </div>

                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Filter size={14} className="text-gray-400" />
                  <span>Severity:</span>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="input-field py-1 text-xs w-28"
                  >
                    <option value="all">All Levels</option>
                    <option value="critical">Critical</option>
                    <option value="severe">Severe</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600 font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIncidents}
                    onChange={(e) => setShowIncidents(e.target.checked)}
                  />
                  <span>Incidents ({filteredIncidents.length})</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFacilities}
                    onChange={(e) => setShowFacilities(e.target.checked)}
                  />
                  <span>Facilities ({state.facilities.length})</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeatPerimeter}
                    onChange={(e) => setShowHeatPerimeter(e.target.checked)}
                  />
                  <span>Hazard Zones</span>
                </label>
              </div>
            </div>

            {/* Leaflet Map */}
            <div className="flex-1 w-full min-h-0">
              <MapContainer
                center={center}
                zoom={11}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Flood Hazard Zones (Circles) */}
                {showHeatPerimeter && (
                  <>
                    <Circle
                      center={[19.2183, 72.9781]}
                      radius={2200}
                      pathOptions={{ color: '#D94B45', fillColor: '#D94B45', fillOpacity: 0.15 }}
                    />
                    <Circle
                      center={[19.2956, 73.0589]}
                      radius={1800}
                      pathOptions={{ color: '#E5A04B', fillColor: '#E5A04B', fillOpacity: 0.15 }}
                    />
                  </>
                )}

                {/* Incident Markers */}
                {showIncidents &&
                  filteredIncidents.map((inc) => {
                    if (!inc.location.lat || !inc.location.lng) return null;
                    const color = getIncidentColor(inc.priority);
                    return (
                      <CircleMarker
                        key={inc.id}
                        center={[inc.location.lat, inc.location.lng]}
                        radius={inc.priority === 'critical' ? 12 : 9}
                        pathOptions={{
                          color: '#FFFFFF',
                          weight: 2,
                          fillColor: color,
                          fillOpacity: 0.9,
                        }}
                        eventHandlers={{
                          click: () => setSelectedIncident(inc),
                        }}
                      >
                        <Popup>
                          <div className="p-1 font-sans text-xs space-y-1">
                            <div className="font-bold text-gray-900">{inc.id}</div>
                            <div className="font-semibold text-gray-800">{inc.title}</div>
                            <div className="text-gray-600">{inc.location.locality}</div>
                            <div className="font-bold uppercase text-red-600">{inc.priority}</div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}

                {/* Facility Markers */}
                {showFacilities &&
                  state.facilities.map((fac) => {
                    const color = getFacilityColor(fac.type);
                    return (
                      <CircleMarker
                        key={fac.id}
                        center={[fac.lat, fac.lng]}
                        radius={7}
                        pathOptions={{
                          color: '#FFFFFF',
                          weight: 2,
                          fillColor: color,
                          fillOpacity: 0.85,
                        }}
                      >
                        <Popup>
                          <div className="p-1 font-sans text-xs space-y-1">
                            <div className="font-bold text-gray-900">{fac.name}</div>
                            <div className="text-gray-600 capitalize">{fac.type.replace('_', ' ')}</div>
                            <div className="text-gray-500">{fac.locality}</div>
                            <div className="text-teal font-semibold capitalize">{fac.status}</div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
              </MapContainer>
            </div>

            {/* Bottom Legend */}
            <div className="p-2.5 bg-white/95 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-600">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">Map Legend:</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D94B45]" /> Critical Incident
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5A04B]" /> Severe Incident
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#805AD5]" /> Hospital / Medical
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3182CE]" /> Relief Camp
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#975A16]" /> Warehouse
                </span>
              </div>
            </div>
          </div>

          {/* Incident Detail Inspection Drawer */}
          <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between overflow-y-auto">
            {selectedIncident ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-400">{selectedIncident.id}</span>
                    <h3 className="font-heading font-bold text-base text-[#172D40] mt-0.5">
                      {selectedIncident.title}
                    </h3>
                  </div>
                  <SeverityBadge level={selectedIncident.priority} />
                </div>

                <div className="text-xs text-gray-600 space-y-2">
                  <p className="bg-gray-50 p-2.5 rounded-lg border text-gray-700">
                    {selectedIncident.description}
                  </p>
                  <div>
                    <span className="text-gray-400 block font-medium">Location:</span>
                    <strong>{selectedIncident.location.address}, {selectedIncident.location.locality}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <span className="text-red-700 block">Life Danger:</span>
                      <strong className="text-red-900">{selectedIncident.impactAssessment.lifeThreatening} people</strong>
                    </div>
                    <div className="bg-amber/10 p-2 rounded border border-amber/20">
                      <span className="text-amber-800 block">Injured:</span>
                      <strong className="text-amber-900">{selectedIncident.impactAssessment.injured}</strong>
                    </div>
                  </div>
                </div>

                {/* AI Preliminary Assessment */}
                {selectedIncident.aiAssessment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span>Preliminary AI Assessment</span>
                      <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                        Confidence: {selectedIncident.aiAssessment.confidence.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      {selectedIncident.aiAssessment.recommendedAction}
                    </p>
                    <div className="text-[10px] text-blue-600 italic">
                      {selectedIncident.aiAssessment.disclaimer}
                    </div>
                  </div>
                )}

                {/* Needed Resources */}
                <div>
                  <h4 className="font-heading font-semibold text-xs uppercase text-gray-500 mb-1.5">
                    Resource Requests
                  </h4>
                  <div className="space-y-1">
                    {selectedIncident.resources.map((r) => (
                      <div key={r.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs border">
                        <span className="font-medium text-gray-800">{r.itemName}</span>
                        <span className="font-bold text-teal">{r.requested} {r.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authority Actions */}
                <div className="pt-2 border-t space-y-2">
                  <div className="text-xs font-semibold text-gray-700">Authority Verification Decision:</div>
                  <div className="flex gap-2">
                    {selectedIncident.verificationStatus !== 'verified' ? (
                      <button
                        onClick={() => handleVerify(selectedIncident)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex-1 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle size={15} className="text-white" />
                        <span>Verify Incident</span>
                      </button>
                    ) : (
                      <div className="text-xs text-emerald-900 font-bold bg-emerald-50 py-2 px-3 rounded-lg text-center w-full border border-emerald-300 flex items-center justify-center gap-1.5">
                        <CheckCircle size={15} className="text-emerald-700" />
                        <span>Incident Field Verified ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                Click any map marker to inspect incident reports.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
