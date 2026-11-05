import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Users,
  Package,
  Eye,
  Plus,
  Send,
  Sparkles,
  Layers,
  MapPin,
  Truck,
  Building2,
  Heart,
  Megaphone,
  BarChart3,
  FileSearch,
  LayoutDashboard,
  Map,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, Modal, ConfirmModal } from '../../components/common/UIComponents';
import { SeverityBadge, IncidentStatusBadge, VerificationBadge } from '../../components/common/StatusBadges';
import type { Incident, SeverityLevel, VerificationStatus } from '../../types';

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

export default function IncidentManagement() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Note entry
  const [newNote, setNewNote] = useState('');

  // Team assignment
  const [assignTeamName, setAssignTeamName] = useState('Team Alpha – Flood Triage');

  const filteredIncidents = state.incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.locality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = filterSeverity === 'all' || inc.priority === filterSeverity;
    const matchesVer = filterVerification === 'all' || inc.verificationStatus === filterVerification;
    return matchesSearch && matchesSev && matchesVer;
  });

  const handleVerify = (status: VerificationStatus) => {
    if (!selectedIncident) return;
    const updated: Incident = {
      ...selectedIncident,
      verificationStatus: status,
      status: status === 'verified' ? 'verified' : selectedIncident.status,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
    setSelectedIncident(updated);

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: `Verification: ${status.toUpperCase()}`,
        actorId: currentUser?.id || 'AUTH001',
        actorName: currentUser?.name || 'District Coordinator',
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        details: `Incident ${selectedIncident.id} set to ${status}`,
        entityId: selectedIncident.id,
        entityType: 'incident',
      },
    });
  };

  const handleAssignTeam = () => {
    if (!selectedIncident) return;
    const updated: Incident = {
      ...selectedIncident,
      assignedTeam: assignTeamName,
      status: 'resources_allocated',
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
    setSelectedIncident(updated);

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: 'Volunteer Unit Deployed',
        actorId: currentUser?.id || 'AUTH001',
        actorName: currentUser?.name || 'District Coordinator',
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        details: `Assigned ${assignTeamName} to Incident ${selectedIncident.id}`,
        entityId: selectedIncident.id,
        entityType: 'incident',
      },
    });
    alert(`Volunteer unit "${assignTeamName}" assigned to ${selectedIncident.id}`);
  };

  const handleAddNote = () => {
    if (!selectedIncident || !newNote) return;
    const noteObj = {
      id: `NOTE-${Date.now()}`,
      authorId: currentUser?.id || 'AUTH001',
      authorName: currentUser?.name || 'District Coordinator',
      note: newNote,
      createdAt: new Date().toISOString(),
    };
    const updated: Incident = {
      ...selectedIncident,
      notes: [...(selectedIncident.notes || []), noteObj],
    };
    dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
    setSelectedIncident(updated);
    setNewNote('');
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="INCIDENT TRIAGE CONSOLE: Direct authority control to verify reports, review preliminary AI summaries, and deploy emergency teams." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Emergency Request Management</h1>
            <p className="text-sm text-gray-500">
              Review, verify, and orchestrate relief response for all citizen disaster reports.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, title, or locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 font-medium">Severity:</span>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="input-field py-1.5 text-xs w-32"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="severe">Severe</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 font-medium">Verification:</span>
              <select
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
                className="input-field py-1.5 text-xs w-32"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Disaster Type</th>
                  <th className="py-3 px-4">Title & Locality</th>
                  <th className="py-3 px-4">Reported Severity</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4">Workflow Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#172D40]">{inc.id}</td>
                    <td className="py-3 px-4 font-semibold capitalize">{inc.disasterType}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800 line-clamp-1">{inc.title}</div>
                      <div className="text-gray-400 text-[11px] flex items-center gap-1">
                        <MapPin size={11} /> {inc.location.locality}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge level={inc.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <VerificationBadge status={inc.verificationStatus} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {inc.assignedTeam ? (
                        <span className="font-semibold text-teal">{inc.assignedTeam}</span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <IncidentStatusBadge status={inc.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        Triage & Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection & Action Modal */}
        {selectedIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-400">{selectedIncident.id}</span>
                    <SeverityBadge level={selectedIncident.priority} />
                    <VerificationBadge status={selectedIncident.verificationStatus} />
                  </div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#172D40] mt-1">
                    {selectedIncident.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Filed at {new Date(selectedIncident.submittedAt).toLocaleString()} by Citizen ID: {selectedIncident.reportedBy}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* Location & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">Location & Landmarks</div>
                  <div><strong>Address:</strong> {selectedIncident.location.address}</div>
                  <div><strong>Locality:</strong> {selectedIncident.location.locality}</div>
                  {selectedIncident.location.landmark && (
                    <div><strong>Landmark:</strong> {selectedIncident.location.landmark}</div>
                  )}
                  <p className="text-gray-600 pt-2 border-t">{selectedIncident.description}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">Reported Casualty & Danger</div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-gray-600">Immediate Life Threat:</span>
                    <strong className="text-red-600">{selectedIncident.impactAssessment.lifeThreatening} persons</strong>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-gray-600">Injured Requiring Aid:</span>
                    <strong className="text-amber-600">{selectedIncident.impactAssessment.injured} persons</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evacuation Needed:</span>
                    <strong className="text-teal">{selectedIncident.impactAssessment.evacuation} persons</strong>
                  </div>
                </div>
              </div>

              {/* Preliminary AI Assessment Panel */}
              {selectedIncident.aiAssessment && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading font-bold text-sm text-blue-900">
                      <Sparkles size={18} className="text-blue-600" />
                      Preliminary AI Incident Assessment
                    </div>
                    <span className="text-xs bg-blue-200/70 text-blue-900 font-bold px-2 py-0.5 rounded">
                      Confidence: {selectedIncident.aiAssessment.confidence.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-blue-900 leading-relaxed font-medium">
                    {selectedIncident.aiAssessment.recommendedAction}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-blue-200">
                    <div>
                      <span className="text-blue-800 font-bold block mb-1">Key Signals Identified:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-blue-700">
                        {selectedIncident.aiAssessment.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-blue-800 font-bold block mb-1">Pending Missing Info:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-blue-700">
                        {selectedIncident.aiAssessment.missingInfo.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-600 italic">
                    {selectedIncident.aiAssessment.disclaimer}
                  </div>
                </div>
              )}

              {/* Resource Requirements List */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#172D40] uppercase tracking-wider">
                  Requested Supplies & Relief Items ({selectedIncident.resources.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedIncident.resources.map((r) => (
                    <div key={r.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-gray-800">{r.itemName}</div>
                      <div className="text-gray-500">Requested: <strong>{r.requested} {r.unit}</strong></div>
                      <div className="text-teal font-semibold">Delivered: {r.delivered} / {r.requested}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-5">
                {/* Verification Control */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-700 uppercase">Field Verification Action</div>
                  <div className="flex gap-2">
                    {selectedIncident.verificationStatus === 'verified' ? (
                      <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs py-2 px-3 rounded-lg text-center flex-1 flex items-center justify-center gap-1.5">
                        <CheckCircle size={15} className="text-emerald-700" />
                        <span>Incident Verified ✓</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerify('verified')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex-1 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle size={15} className="text-white" />
                        <span>Verify Incident</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleVerify('pending')}
                      className="bg-amber hover:opacity-90 text-white font-bold text-xs py-2 px-3 rounded-lg flex-1 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      Request Check
                    </button>
                    <button
                      onClick={() => handleVerify('rejected')}
                      className="btn-secondary text-xs text-red-600 flex-1 justify-center font-bold hover:bg-red-50 hover:border-red-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Team Deployment */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-700 uppercase">Deploy Volunteer Team</div>
                  <div className="flex gap-2">
                    <select
                      value={assignTeamName}
                      onChange={(e) => setAssignTeamName(e.target.value)}
                      className="input-field text-xs flex-1 py-1.5"
                    >
                      <option value="Team Alpha – Flood Triage">Team Alpha – Flood Triage (Arjun Kumar)</option>
                      <option value="Team Bravo – Logistics Transport">Team Bravo – Logistics (Meera Singh)</option>
                      <option value="NDRF Specialist Auxiliary">NDRF Specialist Dive Auxiliary</option>
                    </select>
                    <button
                      onClick={handleAssignTeam}
                      className="btn-primary text-xs"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>

              {/* Authority Notes */}
              <div className="border-t pt-4 space-y-3">
                <div className="text-xs font-bold text-gray-700 uppercase">Authority Log Notes</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedIncident.notes?.map((n) => (
                    <div key={n.id} className="p-2.5 bg-gray-50 rounded border text-xs">
                      <div className="flex justify-between font-semibold text-gray-800">
                        <span>{n.authorName}</span>
                        <span className="text-gray-400 font-mono text-[10px]">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-0.5">{n.note}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add operational directive or on-ground note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="input-field text-xs flex-1"
                  />
                  <button
                    onClick={handleAddNote}
                    className="btn-secondary text-xs"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="btn-secondary text-xs px-6"
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
