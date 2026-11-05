import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  ChevronRight,
  Shield,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, ResourceTracker, Timeline, EmptyState } from '../../components/common/UIComponents';
import { IncidentStatusBadge, SeverityBadge, VerificationBadge } from '../../components/common/StatusBadges';
import type { Incident } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/victim/dashboard', icon: <Users size={18} /> },
  { label: 'Report Emergency', to: '/victim/report', icon: <AlertTriangle size={18} /> },
  { label: 'My Requests', to: '/victim/requests', icon: <Package size={18} /> },
  { label: 'Find Nearby Help', to: '/victim/nearby', icon: <MapPin size={18} /> },
];

export default function MyRequests() {
  const { currentUser } = useAuth();
  const { state } = useAppState();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Filter requests submitted by this victim or demo victim 'V001'
  const myIncidents = state.incidents.filter(
    (inc) => inc.reportedBy === currentUser?.id || inc.reportedBy === 'V001'
  );

  const filteredIncidents = myIncidents.filter((inc) => {
    if (activeTab === 'active') return inc.status !== 'delivered' && inc.status !== 'closed';
    if (activeTab === 'completed') return inc.status === 'delivered' || inc.status === 'closed';
    return true;
  });

  const getTimelineSteps = (inc: Incident) => {
    const statuses = ['submitted', 'verified', 'resources_allocated', 'dispatched', 'delivered'];
    const labels = [
      'Incident Submitted',
      'Authority Verified',
      'Supplies Allocated',
      'Dispatched via Team',
      'Relief Delivered',
    ];

    const curIndex = statuses.indexOf(inc.status);

    return labels.map((label, idx) => ({
      label,
      completed: curIndex >= idx || inc.status === 'delivered',
      current: curIndex === idx,
      timestamp: curIndex >= idx ? 'Logged' : undefined,
      description: idx === 0 ? `Reported at ${inc.location.locality}` : undefined,
    }));
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Victim Portal" portalColor="#D94B45">
      <div className="max-w-5xl mx-auto space-y-6">
        <DemoBanner message="DEMO VIEW: Track resource delivery progress in real time as authorities allocate supplies and dispatch volunteers." />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">My Relief Requests & Status</h1>
            <p className="text-sm text-gray-500">
              Live end-to-end tracking of all emergency declarations and supplies dispatched to your location.
            </p>
          </div>
          <Link to="/victim/report" className="btn-danger inline-flex items-center gap-2 self-start">
            <AlertTriangle size={16} /> New Emergency Request
          </Link>
        </div>

        {selectedIncident ? (
          /* DETAILED TRACKING VIEW */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-xs font-semibold text-gray-600 hover:text-[#172D40] flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Back to All Requests
              </button>
              <div className="flex items-center gap-2">
                <IncidentStatusBadge status={selectedIncident.status} />
                <SeverityBadge level={selectedIncident.priority} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Incident Meta */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <div className="text-xs font-mono text-gray-400">ID: {selectedIncident.id}</div>
                  <h2 className="font-heading font-bold text-xl text-[#172D40] mt-1">
                    {selectedIncident.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">{selectedIncident.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-500 block">Location:</span>
                    <strong className="text-gray-800">{selectedIncident.location.address}, {selectedIncident.location.locality}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Assigned Volunteer Unit:</span>
                    <strong className="text-[#172D40]">{selectedIncident.assignedTeam || 'Deployment in coordination'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Reported At:</span>
                    <span className="text-gray-700">{new Date(selectedIncident.submittedAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Verification Status:</span>
                    <VerificationBadge status={selectedIncident.verificationStatus} />
                  </div>
                </div>

                {/* Resource-by-resource Progress Tracker */}
                <div>
                  <h3 className="font-heading font-bold text-base text-[#172D40] mb-3">
                    Resource Distribution Progress
                  </h3>
                  <div className="space-y-4">
                    {selectedIncident.resources.map((res) => (
                      <ResourceTracker
                        key={res.id}
                        name={res.itemName}
                        unit={res.unit}
                        requested={res.requested}
                        allocated={res.allocated}
                        dispatched={res.dispatched}
                        delivered={res.delivered}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-heading font-semibold text-sm text-[#172D40] mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-teal" /> Status Journey
                </h3>
                <Timeline steps={getTimelineSteps(selectedIncident)} />
              </div>
            </div>
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b pb-2">
              {[
                { key: 'all', label: `All Requests (${myIncidents.length})` },
                { key: 'active', label: 'Active In-Progress' },
                { key: 'completed', label: 'Completed Relief' },
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

            {filteredIncidents.length === 0 ? (
              <EmptyState
                icon={<Package size={32} />}
                title="No relief requests found"
                description="You haven't submitted any incident reports matching this filter."
                action={
                  <Link to="/victim/report" className="btn-primary text-xs mt-3">
                    Report an Emergency
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className="card hover:border-gray-300 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 p-5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-500">{incident.id}</span>
                        <SeverityBadge level={incident.priority} />
                        <IncidentStatusBadge status={incident.status} />
                      </div>
                      <h3 className="font-heading font-bold text-base text-[#172D40]">
                        {incident.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {incident.location.locality}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package size={14} /> {incident.resources.length} resource types requested
                        </span>
                        <span>
                          Updated: {new Date(incident.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-semibold text-gray-700">View Delivery Details</div>
                        <div className="text-xs text-teal font-medium">Click to track</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
