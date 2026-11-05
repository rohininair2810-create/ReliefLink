import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Truck,
  MapPin,
  Award,
  AlertTriangle,
  Plus,
  LayoutDashboard,
  Map,
  Package,
  Building2,
  Heart,
  Megaphone,
  BarChart3,
  FileSearch,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, Modal } from '../../components/common/UIComponents';
import { VolunteerStatusBadge, VerificationBadge } from '../../components/common/StatusBadges';
import type { VolunteerProfile, VolunteerAssignment } from '../../types';

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

export default function VolunteerManagement() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // New assignment form fields
  const [assignIncidentId, setAssignIncidentId] = useState(state.incidents[0]?.id || 'RL-INC-001');
  const [assignCategory, setAssignCategory] = useState('Medical Assistance');
  const [assignObjective, setAssignObjective] = useState('Administer first aid and evaluate mobility');
  const [assignSafety, setAssignSafety] = useState('Wear high-visibility life vest and carry radio');

  const filteredVolunteers = state.volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.serviceArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill =
      filterSkill === 'all' || v.skills.some((s) => s.toLowerCase().includes(filterSkill.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  const handleVerifyCredential = (type: 'identity' | 'skills' | 'certificates') => {
    if (!selectedVolunteer) return;
    const updated: VolunteerProfile = {
      ...selectedVolunteer,
      identityVerified: type === 'identity' ? true : selectedVolunteer.identityVerified,
      skillsVerified: type === 'skills' ? true : selectedVolunteer.skillsVerified,
      certificatesVerified: type === 'certificates' ? true : selectedVolunteer.certificatesVerified,
      verificationStatus: 'verified',
    };
    dispatch({ type: 'UPDATE_VOLUNTEER', payload: updated });
    setSelectedVolunteer(updated);

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: `Volunteer Verified: ${type.toUpperCase()}`,
        actorId: currentUser?.id || 'AUTH001',
        actorName: currentUser?.name || 'District Coordinator',
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        details: `Credentials verified for volunteer ${selectedVolunteer.name}`,
        entityId: selectedVolunteer.id,
        entityType: 'volunteer',
      },
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    const newAssignment: VolunteerAssignment = {
      id: `ASN-${Math.floor(100 + Math.random() * 900)}`,
      incidentId: assignIncidentId,
      volunteerId: selectedVolunteer.id,
      taskCategory: assignCategory,
      area: selectedVolunteer.serviceArea,
      urgency: 'critical',
      requiredSkills: selectedVolunteer.skills,
      assignedDate: new Date().toISOString(),
      status: 'pending',
      taskObjective: assignObjective,
      safetyInstructions: assignSafety,
      authorityInstructions: `Report to Sector Chief at ${selectedVolunteer.serviceArea} command tent.`,
      equipment: ['High-Vis Vest', 'Water Boots', 'Two-Way Radio'],
      teamInfo: `Unit ${selectedVolunteer.serviceArea} Relief`,
    };

    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });

    // Update volunteer's assigned list
    const updatedVol: VolunteerProfile = {
      ...selectedVolunteer,
      assignments: [...selectedVolunteer.assignments, newAssignment.id],
    };
    dispatch({ type: 'UPDATE_VOLUNTEER', payload: updatedVol });
    setSelectedVolunteer(updatedVol);
    setShowAssignModal(false);

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: 'Assignment Issued',
        actorId: currentUser?.id || 'AUTH001',
        actorName: currentUser?.name || 'District Coordinator',
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        details: `Assignment ${newAssignment.id} created for ${selectedVolunteer.name}`,
        entityId: newAssignment.id,
        entityType: 'assignment',
      },
    });

    alert(`Assignment ${newAssignment.id} successfully dispatched to ${selectedVolunteer.name}!`);
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="CIVIC PERSONNEL DIRECTORY: Coordinators must verify volunteer certifications before dispatching high-risk flood or medical assignments." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Volunteer Personnel Management</h1>
            <p className="text-sm text-gray-500">
              Verify volunteer credentials, assess physical mobilization readiness, and issue field tasks.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by volunteer name or service area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="input-field py-1.5 text-xs w-48"
            >
              <option value="all">All Skills</option>
              <option value="first aid">First Aid</option>
              <option value="medical">Medical Support</option>
              <option value="logistics">Logistics</option>
              <option value="rescue">Specialist Rescue</option>
            </select>
          </div>
        </div>

        {/* Volunteer Directory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Volunteer Name</th>
                  <th className="py-3 px-4">Skills & Speciality</th>
                  <th className="py-3 px-4">Service Area</th>
                  <th className="py-3 px-4">Identity</th>
                  <th className="py-3 px-4">Skills Verified</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Active Tasks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{vol.name}</div>
                      <div className="text-gray-400 text-[11px]">{vol.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {vol.skills.map((s, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{vol.serviceArea}</td>
                    <td className="py-3 px-4">
                      {vol.identityVerified ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle size={13} className="text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Clock size={13} className="text-amber-600" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {vol.skillsVerified ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle size={13} className="text-emerald-600" /> Certified
                        </span>
                      ) : (
                        <span className="text-gray-400">Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        vol.availability
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {vol.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-teal">
                      {vol.assignments.length} assignments
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedVolunteer(vol)}
                        className="btn-secondary text-xs py-1 px-3"
                      >
                        Inspect & Deploy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Volunteer Profile Inspection Modal */}
        {selectedVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-extrabold text-2xl text-[#172D40]">
                      {selectedVolunteer.name}
                    </h2>
                    <VerificationBadge status={selectedVolunteer.verificationStatus} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedVolunteer.email} • {selectedVolunteer.phone}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Bio & Logistics */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs border border-gray-200">
                <div>
                  <span className="text-gray-400 block font-medium">Service Area / Perimeter:</span>
                  <strong className="text-gray-800">{selectedVolunteer.serviceArea} ({selectedVolunteer.maxDistance} km radius)</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Vehicle / Transport:</span>
                  <strong className="text-gray-800">{selectedVolunteer.transport ? 'Personal Vehicle Available ✓' : 'Foot / Public Only'}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Spoken Languages:</span>
                  <strong className="text-gray-800">{selectedVolunteer.languages.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Previous Disaster Experience:</span>
                  <span className="text-gray-800">{selectedVolunteer.experience || 'First-time community volunteer'}</span>
                </div>
              </div>

              {/* Credential Verifications */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase text-gray-500">
                  Authority Credential Endorsement
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg border text-center space-y-2">
                    <span className="text-xs font-semibold block text-gray-700">Govt ID Proof</span>
                    <button
                      onClick={() => handleVerifyCredential('identity')}
                      disabled={selectedVolunteer.identityVerified}
                      className={`text-xs py-1.5 px-3 rounded-lg font-bold w-full transition-all flex items-center justify-center gap-1 ${
                        selectedVolunteer.identityVerified
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 cursor-default shadow-none'
                          : 'bg-[#172D40] hover:bg-[#24465C] text-white shadow-sm'
                      }`}
                    >
                      {selectedVolunteer.identityVerified ? (
                        <>
                          <CheckCircle size={13} className="text-emerald-700" />
                          <span>Verified ✓</span>
                        </>
                      ) : (
                        <span>Confirm ID</span>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border text-center space-y-2">
                    <span className="text-xs font-semibold block text-gray-700">Skills Audit</span>
                    <button
                      onClick={() => handleVerifyCredential('skills')}
                      disabled={selectedVolunteer.skillsVerified}
                      className={`text-xs py-1.5 px-3 rounded-lg font-bold w-full transition-all flex items-center justify-center gap-1 ${
                        selectedVolunteer.skillsVerified
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 cursor-default shadow-none'
                          : 'bg-[#172D40] hover:bg-[#24465C] text-white shadow-sm'
                      }`}
                    >
                      {selectedVolunteer.skillsVerified ? (
                        <>
                          <CheckCircle size={13} className="text-emerald-700" />
                          <span>Certified ✓</span>
                        </>
                      ) : (
                        <span>Audit Skills</span>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border text-center space-y-2">
                    <span className="text-xs font-semibold block text-gray-700">Rescue Certificate</span>
                    <button
                      onClick={() => handleVerifyCredential('certificates')}
                      disabled={selectedVolunteer.certificatesVerified}
                      className={`text-xs py-1.5 px-3 rounded-lg font-bold w-full transition-all flex items-center justify-center gap-1 ${
                        selectedVolunteer.certificatesVerified
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 cursor-default shadow-none'
                          : 'bg-[#172D40] hover:bg-[#24465C] text-white shadow-sm'
                      }`}
                    >
                      {selectedVolunteer.certificatesVerified ? (
                        <>
                          <CheckCircle size={13} className="text-emerald-700" />
                          <span>Endorsed ✓</span>
                        </>
                      ) : (
                        <span>Endorse</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Plus size={14} /> Issue New Relief Assignment
                </button>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="btn-secondary text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Assignment Modal */}
        {showAssignModal && selectedVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
              <h3 className="font-heading font-extrabold text-xl text-[#172D40]">
                Dispatch Field Assignment to {selectedVolunteer.name}
              </h3>

              <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
                <div>
                  <label className="label">Target Incident ID *</label>
                  <select
                    value={assignIncidentId}
                    onChange={(e) => setAssignIncidentId(e.target.value)}
                    className="input-field text-xs"
                  >
                    {state.incidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        {inc.id} – {inc.title} ({inc.location.locality})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Task Category *</label>
                  <select
                    value={assignCategory}
                    onChange={(e) => setAssignCategory(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Medical Assistance">Medical Assistance & Triage</option>
                    <option value="Food & Ration Logistics">Food & Ration Logistics</option>
                    <option value="Shelter Erection">Shelter Erection</option>
                    <option value="Evacuation Support">Evacuation Support</option>
                  </select>
                </div>

                <div>
                  <label className="label">Task Objective *</label>
                  <textarea
                    rows={2}
                    required
                    value={assignObjective}
                    onChange={(e) => setAssignObjective(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="label">Mandatory Safety Protocols *</label>
                  <textarea
                    rows={2}
                    required
                    value={assignSafety}
                    onChange={(e) => setAssignSafety(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
                  >
                    Dispatch Assignment
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
