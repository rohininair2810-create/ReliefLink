import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  Wrench,
  FileText,
  Upload,
  ArrowLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, Timeline, EmptyState } from '../../components/common/UIComponents';
import { SeverityBadge } from '../../components/common/StatusBadges';
import type { VolunteerAssignment, Incident } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/volunteer/dashboard', icon: <ClipboardList size={18} /> },
  { label: 'My Assignments', to: '/volunteer/assignments', icon: <Truck size={18} /> },
  { label: 'Contribution History', to: '/volunteer/history', icon: <Clock size={18} /> },
];

export default function AssignmentDetails() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppState();

  const assignments = state.assignments;
  const [selectedAssignment, setSelectedAssignment] = useState<VolunteerAssignment | null>(
    assignments[0] || null
  );

  const [notes, setNotes] = useState(selectedAssignment?.progressNotes || '');
  const [showUnsafeModal, setShowUnsafeModal] = useState(false);
  const [unsafeReason, setUnsafeReason] = useState('');
  const [deliveredInput, setDeliveredInput] = useState<number>(20);

  const handleUpdateStatus = (newStatus: VolunteerAssignment['status']) => {
    if (!selectedAssignment) return;

    const updatedAssignment: VolunteerAssignment = {
      ...selectedAssignment,
      status: newStatus,
      progressNotes: notes || selectedAssignment.progressNotes,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : selectedAssignment.completedAt,
    };

    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
    setSelectedAssignment(updatedAssignment);

    // If completed or partially completed, update related incident resource delivery
    const relIncident = state.incidents.find((i) => i.id === selectedAssignment.incidentId);
    if (relIncident) {
      const updatedResources = relIncident.resources.map((r) => {
        if (r.category === 'water' || r.category === 'food') {
          const newDelivered = Math.min(r.requested, r.delivered + deliveredInput);
          return {
            ...r,
            delivered: newDelivered,
            status: newDelivered >= r.requested ? ('delivered' as const) : ('partially_delivered' as const),
          };
        }
        return r;
      });

      const allDelivered = updatedResources.every((r) => r.delivered >= r.requested);

      const updatedInc: Incident = {
        ...relIncident,
        resources: updatedResources,
        status: allDelivered ? 'delivered' : 'partially_delivered',
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_INCIDENT', payload: updatedInc });
    }

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: `Task Status: ${newStatus.toUpperCase()}`,
        actorId: currentUser?.id || 'VOL001',
        actorName: currentUser?.name || 'Field Volunteer',
        actorRole: 'volunteer',
        timestamp: new Date().toISOString(),
        details: `Volunteer updated assignment ${selectedAssignment.id} to ${newStatus}. Notes: ${notes}`,
        entityId: selectedAssignment.id,
        entityType: 'assignment',
      },
    });

    alert(`Task status successfully updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  const handleReportUnsafe = () => {
    if (!selectedAssignment || !unsafeReason) return;

    const updatedAssignment: VolunteerAssignment = {
      ...selectedAssignment,
      status: 'unsafe',
      progressNotes: `UNSAFE HAZARD REPORTED: ${unsafeReason}`,
    };

    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
    setSelectedAssignment(updatedAssignment);
    setShowUnsafeModal(false);

    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        id: `GLOG-${Date.now()}`,
        action: 'Task Flagged Unsafe',
        actorId: currentUser?.id || 'VOL001',
        actorName: currentUser?.name || 'Field Volunteer',
        actorRole: 'volunteer',
        timestamp: new Date().toISOString(),
        details: `Hazard reported for ${selectedAssignment.id}: ${unsafeReason}`,
        entityId: selectedAssignment.id,
        entityType: 'assignment',
      },
    });

    alert('Task has been marked Unsafe. Authorities have been alerted to re-evaluate conditions.');
  };

  const timelineSteps = [
    { label: 'Assignment Issued', completed: true, timestamp: selectedAssignment ? new Date(selectedAssignment.assignedDate).toLocaleTimeString() : '' },
    { label: 'Accepted by Volunteer', completed: selectedAssignment?.status !== 'pending' && selectedAssignment?.status !== 'declined' },
    { label: 'Operation In Progress', completed: selectedAssignment?.status === 'in_progress' || selectedAssignment?.status === 'partially_completed' || selectedAssignment?.status === 'completed' },
    { label: 'Field Distribution Reported', completed: selectedAssignment?.status === 'partially_completed' || selectedAssignment?.status === 'completed' },
    { label: 'Task Completed & Authority Confirmed', completed: selectedAssignment?.status === 'completed' },
  ];

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Volunteer Portal" portalColor="#197C78">
      <div className="max-w-6xl mx-auto space-y-6">
        <DemoBanner message="CROSS-PORTAL REALTIME STATE: Marking tasks In Progress or Completed here immediately updates the Authority dashboard and Victim's delivery progress." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Field Assignments & Execution</h1>
            <p className="text-sm text-gray-500">
              Authority-directed relief actions, triage logistics, and progress reporting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Selection Column */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-sm text-[#172D40] uppercase tracking-wider">
              Assigned Tasks ({assignments.length})
            </h3>
            {assignments.map((asn) => (
              <div
                key={asn.id}
                onClick={() => {
                  setSelectedAssignment(asn);
                  setNotes(asn.progressNotes || '');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAssignment?.id === asn.id
                    ? 'border-teal bg-teal/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-gray-500">{asn.id}</span>
                  <SeverityBadge level={asn.urgency} />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#172D40] line-clamp-1">
                  {asn.taskCategory}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {asn.area}
                </p>
                <div className="mt-2 text-xs font-semibold capitalize text-teal">
                  Status: {asn.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>

          {/* Details & Actions Pane */}
          {selectedAssignment ? (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400">{selectedAssignment.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal">
                        Incident Ref: {selectedAssignment.incidentId}
                      </span>
                    </div>
                    <h2 className="font-heading font-bold text-xl text-[#172D40] mt-1">
                      {selectedAssignment.taskObjective}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-gray-100 text-gray-700">
                      {selectedAssignment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Location & Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Deployment Site:</span>
                    <strong className="text-gray-800 text-sm flex items-center gap-1 mt-0.5">
                      <MapPin size={14} className="text-red-500" /> {selectedAssignment.area}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Relief Unit / Team:</span>
                    <strong className="text-[#172D40] text-sm flex items-center gap-1 mt-0.5">
                      <Users size={14} className="text-teal" /> {selectedAssignment.teamInfo || 'Unit Alpha'}
                    </strong>
                  </div>
                </div>

                {/* Safety Directives (Amber Highlight) */}
                <div className="bg-amber/10 border border-amber/30 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-xs uppercase tracking-wide">
                    <AlertTriangle size={15} className="text-amber-600" /> Crucial Safety Instructions
                  </div>
                  <p className="text-xs text-[#263238] leading-relaxed">
                    {selectedAssignment.safetyInstructions}
                  </p>
                </div>

                {/* Required Skills & Equipment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Shield size={14} className="text-teal" /> Verified Qualifications Needed
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedAssignment.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 border">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Wrench size={14} className="text-gray-600" /> Essential Gear
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedAssignment.equipment.map((eq, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 border">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Authority Field Orders */}
                <div className="border-t pt-4">
                  <h4 className="font-heading font-semibold text-xs uppercase text-gray-500 mb-1">
                    Authority Coordinator Instructions
                  </h4>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {selectedAssignment.authorityInstructions}
                  </p>
                </div>

                {/* Operational Progress Journey */}
                <div className="border-t pt-4">
                  <h4 className="font-heading font-semibold text-xs uppercase text-gray-500 mb-3">
                    Assignment Progress State
                  </h4>
                  <Timeline steps={timelineSteps} />
                </div>

                {/* Actions & Report Entry */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-heading font-semibold text-sm text-[#172D40]">
                    Update On-Ground Task Status
                  </h4>

                  <div>
                    <label className="label text-xs">Field Progress Notes / Observations</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add on-site status notes, number of affected people helped, physical road obstacles..."
                      className="input-field text-xs"
                    />
                  </div>

                  {/* Quantity Delivered simulator */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-800">Record Distributed Units:</span>
                      <span className="text-gray-500 block">Quantity of water/food physically handed over</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={deliveredInput}
                        onChange={(e) => setDeliveredInput(Number(e.target.value))}
                        className="input-field w-20 text-xs py-1"
                      />
                      <span className="text-gray-500">units</span>
                    </div>
                  </div>

                  {/* Button Group */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {selectedAssignment.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus('accepted')}
                          className="btn-primary text-xs"
                        >
                          <CheckCircle size={14} /> Accept Assignment
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus('declined')}
                          className="btn-secondary text-xs text-red-600"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </>
                    )}

                    {(selectedAssignment.status === 'accepted' || selectedAssignment.status === 'pending') && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('in_progress')}
                        className="btn-primary text-xs"
                      >
                        Mark In Progress
                      </button>
                    )}

                    {selectedAssignment.status === 'in_progress' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus('partially_completed')}
                          className="btn-amber text-xs"
                        >
                          Report Partial Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus('completed')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <CheckCircle size={14} className="text-white" />
                          <span>Mark Fully Completed</span>
                        </button>
                      </>
                    )}

                    {selectedAssignment.status === 'partially_completed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('completed')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle size={14} className="text-white" />
                        <span>Mark Fully Completed</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowUnsafeModal(true)}
                      className="btn-secondary text-xs text-red-600 hover:bg-red-50 border-red-200 ml-auto"
                    >
                      <AlertTriangle size={14} /> Report Unsafe Conditions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <EmptyState
                icon={<ClipboardList size={36} />}
                title="No assignment selected"
                description="Select an assignment from the left list to review instructions and report task completion."
              />
            </div>
          )}
        </div>

        {/* Unsafe Modal */}
        {showUnsafeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-600 font-heading font-bold text-lg">
                <AlertTriangle size={20} />
                Report Unsafe Conditions
              </div>
              <p className="text-xs text-gray-600">
                If the disaster zone has become dangerous due to structural collapses, deep flash floods, electrical fires, or violence, halt actions immediately.
              </p>
              <textarea
                rows={3}
                required
                value={unsafeReason}
                onChange={(e) => setUnsafeReason(e.target.value)}
                placeholder="Specify exact danger and why assignment cannot proceed safely..."
                className="input-field text-xs"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnsafeModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReportUnsafe}
                  className="btn-danger text-xs"
                >
                  Confirm Unsafe & Abort
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
