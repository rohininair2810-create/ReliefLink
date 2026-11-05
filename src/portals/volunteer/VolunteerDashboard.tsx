import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  ClipboardList,
  Shield,
  Truck,
  MapPin,
  Megaphone,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { StatCard, DemoBanner, SectionHeader, EmptyState } from '../../components/common/UIComponents';
import { SeverityBadge, VolunteerStatusBadge, VerificationBadge } from '../../components/common/StatusBadges';
import type { VolunteerProfile } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/volunteer/dashboard', icon: <ClipboardList size={18} /> },
  { label: 'My Assignments', to: '/volunteer/assignments', icon: <Truck size={18} /> },
  { label: 'Contribution History', to: '/volunteer/history', icon: <Clock size={18} /> },
];

export default function VolunteerDashboard() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppState();

  // Find volunteer profile or default to demo VOL001
  const volunteer =
    state.volunteers.find((v) => v.id === currentUser?.id || v.email === currentUser?.email) ||
    state.volunteers[0];

  const assignments = state.assignments.filter(
    (a) => a.volunteerId === volunteer.id || a.volunteerId === 'VOL001'
  );

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const activeCount = assignments.filter((a) => a.status === 'in_progress' || a.status === 'accepted').length;
  const completedCount = assignments.filter((a) => a.status === 'completed').length;

  const toggleAvailability = () => {
    const updated: VolunteerProfile = {
      ...volunteer,
      availability: !volunteer.availability,
    };
    dispatch({ type: 'UPDATE_VOLUNTEER', payload: updated });
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Volunteer Portal" portalColor="#197C78">
      <div className="max-w-5xl mx-auto space-y-6">
        <DemoBanner message="SAMPLE VOLUNTEER WORKFLOW: Official assignments are provisioned solely by Authorized Emergency Coordinators." />

        {/* Top Profile & Availability Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal text-white flex items-center justify-center font-heading font-bold text-xl">
              {volunteer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-xl text-[#172D40]">{volunteer.name}</h1>
                <VerificationBadge status={volunteer.verificationStatus} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Service Zone: <strong>{volunteer.serviceArea}</strong> • Preferred Travel: {volunteer.maxDistance} km
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {volunteer.skills.map((skill, i) => (
                  <span key={i} className="text-[11px] bg-teal/10 text-teal px-2 py-0.5 rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-700">Deployment Status</div>
              <div className="text-[11px] text-gray-500">
                {volunteer.availability ? 'Available for emergency dispatch' : 'Currently off-duty'}
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                volunteer.availability
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {volunteer.availability ? 'STATUS: ACTIVE' : 'STATUS: PAUSED'}
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Active Operations"
            value={activeCount}
            subtitle="Tasks in progress on-site"
            icon={<Truck size={20} className="text-teal" />}
          />
          <StatCard
            title="Pending Assignments"
            value={pendingCount}
            subtitle="Awaiting your acceptance"
            icon={<Clock size={20} className="text-amber" />}
            iconBg="bg-amber/10"
          />
          <StatCard
            title="Completed Missions"
            value={completedCount}
            subtitle="Verified relief deliveries"
            icon={<CheckCircle size={20} className="text-green-600" />}
            iconBg="bg-green-100"
          />
        </div>

        {/* Current Active Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-[#172D40]">Active Operational Assignments</h2>
            <Link to="/volunteer/assignments" className="text-xs text-teal font-semibold hover:underline flex items-center gap-1">
              View all assignments <ArrowRight size={14} />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <EmptyState
              icon={<ClipboardList size={32} />}
              title="No active tasks assigned"
              description="Authority coordinators have not assigned tasks for your profile yet. Ensure your availability status is ACTIVE."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((asn) => (
                <div key={asn.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:border-gray-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-500">{asn.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-teal/10 text-teal font-semibold">{asn.taskCategory}</span>
                      <SeverityBadge level={asn.urgency} />
                      <span className="text-xs font-medium text-gray-400">[{asn.status.replace('_', ' ').toUpperCase()}]</span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#172D40]">{asn.taskObjective}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-3">
                      <span className="flex items-center gap-1"><MapPin size={13} /> {asn.area}</span>
                      <span className="flex items-center gap-1"><Users size={13} /> {asn.teamInfo}</span>
                    </p>
                  </div>

                  <Link
                    to="/volunteer/assignments"
                    className="btn-primary text-xs self-start md:self-center"
                  >
                    Open Action Dashboard
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Urgent Authority Announcements */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-heading font-bold text-sm">
            <Megaphone size={18} className="text-blue-600" />
            <span>Authority Field Directives & Announcements</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Kalyan Nagar Flood Coordination:</strong> All volunteers deployed to Riverside Colony must wear Level-2 life vests and register at Bridge No. 4 Supply Point before entering flooded zones. High-risk rescue operations are restricted to NDRF-certified specialists.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
