import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home,
  AlertTriangle,
  FileText,
  MapPin,
  User,
  AlertCircle,
  Package,
  CheckCircle,
  ArrowRight,
  Megaphone,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { StatCard, DemoBanner, SectionHeader, EmptyState } from '../../components/common/UIComponents';
import { IncidentStatusBadge, SeverityBadge } from '../../components/common/StatusBadges';
import type { Incident, Announcement } from '../../types';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: <Home size={18} />, to: '/victim/dashboard' },
  { label: 'Report Emergency', icon: <AlertTriangle size={18} />, to: '/victim/report' },
  { label: 'My Requests', icon: <FileText size={18} />, to: '/victim/requests' },
  { label: 'Find Nearby Help', icon: <MapPin size={18} />, to: '/victim/nearby' },
  { label: 'Profile', icon: <User size={18} />, to: '/victim/profile' },
];

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AnnouncementPriorityBadge({ priority }: { priority: Announcement['priority'] }) {
  const cfg = {
    critical: 'bg-red-100 text-[#D94B45] border border-red-200',
    high: 'bg-orange-100 text-orange-700 border border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    low: 'bg-green-100 text-green-700 border border-green-200',
  }[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export default function VictimDashboard() {
  const { currentUser } = useAuth();
  const { state } = useAppState();
  const navigate = useNavigate();

  const userId = currentUser?.id ?? 'V001';
  const myIncidents: Incident[] = state.incidents.filter(
    (inc) => inc.reportedBy === userId || inc.reportedBy === 'V001'
  );

  const activeIncidents = myIncidents.filter(
    (inc) => !['closed', 'delivered'].includes(inc.status)
  );

  const totalAllocated = myIncidents.reduce(
    (sum, inc) => sum + inc.resources.reduce((s, r) => s + r.allocated, 0),
    0
  );
  const totalDelivered = myIncidents.reduce(
    (sum, inc) => sum + inc.resources.reduce((s, r) => s + r.delivered, 0),
    0
  );

  // Announcements for victims (audience = 'all' or 'victims')
  const relevantAnnouncements = state.announcements
    .filter((a) => a.audience.includes('all') || a.audience.includes('victims'))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2);

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Victim Portal">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-[#172D40]">
          Welcome back, {currentUser?.name ?? 'User'} 👋
        </h1>
        <p className="text-sm text-[#718096] mt-1">
          Here's a summary of your active relief requests and nearby help.
        </p>
      </div>

      <DemoBanner />

      {/* Emergency CTA */}
      <button
        onClick={() => navigate('/victim/report')}
        className="w-full flex items-center justify-between gap-4 bg-[#D94B45] hover:bg-red-700 text-white px-5 py-4 rounded-xl shadow-lg transition-all duration-150 mb-6 group"
        aria-label="Report a new emergency"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-colors">
            <AlertTriangle size={22} className="text-white" />
          </span>
          <div className="text-left">
            <p className="font-heading font-bold text-base">Report an Emergency</p>
            <p className="text-xs text-white text-opacity-80">
              Flood, earthquake, fire, or any disaster situation
            </p>
          </div>
        </div>
        <ArrowRight size={20} className="text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Active Requests"
          value={activeIncidents.length}
          icon={<AlertCircle size={20} className="text-[#D94B45]" />}
          iconBg="bg-red-50"
          subtitle="Ongoing relief cases"
        />
        <StatCard
          title="Resources Allocated"
          value={totalAllocated}
          icon={<Package size={20} className="text-purple-600" />}
          iconBg="bg-purple-50"
          subtitle="Units committed to you"
        />
        <StatCard
          title="Resources Delivered"
          value={totalDelivered}
          icon={<CheckCircle size={20} className="text-[#197C78]" />}
          iconBg="bg-teal-50"
          subtitle="Units received so far"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Relief Requests Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-[#172D40]">Active Relief Requests</h2>
              <Link
                to="/victim/requests"
                className="text-xs font-medium text-[#197C78] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {myIncidents.length === 0 ? (
              <EmptyState
                icon={<FileText size={28} />}
                title="No requests yet"
                description="You haven't submitted any emergency reports. Use the button above to report a situation."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-[#718096] font-semibold uppercase tracking-wide">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Location</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Last Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myIncidents.slice(0, 5).map((inc) => (
                      <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            to="/victim/requests"
                            className="font-mono text-xs text-[#197C78] font-semibold hover:underline"
                          >
                            {inc.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className="capitalize text-[#172D40] font-medium text-xs">
                            {inc.disasterType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#718096] truncate block max-w-[120px]">
                            {inc.location.locality}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <IncidentStatusBadge status={inc.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-xs text-[#718096]">
                            <Clock size={11} />
                            {formatRelativeTime(inc.updatedAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Megaphone size={16} className="text-[#E5A04B]" />
              <h2 className="font-heading font-bold text-[#172D40]">Announcements</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {relevantAnnouncements.length === 0 ? (
                <p className="text-sm text-[#718096] px-5 py-4">No announcements at this time.</p>
              ) : (
                relevantAnnouncements.map((ann) => (
                  <div key={ann.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#172D40] leading-snug">{ann.title}</p>
                      <AnnouncementPriorityBadge priority={ann.priority} />
                    </div>
                    <p className="text-xs text-[#718096] line-clamp-2 mb-1">{ann.message}</p>
                    <p className="text-xs text-[#718096] opacity-70">
                      {formatDate(ann.publishedAt)} · {ann.publishedBy}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Find Nearby Help Card */}
          <div
            className="bg-gradient-to-br from-[#197C78] to-[#24465C] rounded-xl p-5 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/victim/nearby')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/victim/nearby')}
            aria-label="Find nearby help"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </span>
              <div>
                <p className="font-heading font-bold text-white text-sm">Find Nearby Help</p>
                <p className="text-xs text-white text-opacity-70">Hospitals, shelters &amp; more</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Hospitals', 'Shelters', 'Food', 'Medical'].map((type) => (
                <div
                  key={type}
                  className="bg-white bg-opacity-10 rounded-lg px-3 py-1.5 text-xs text-white font-medium text-center"
                >
                  {type}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end mt-3">
              <span className="text-xs text-white text-opacity-80 flex items-center gap-1">
                View all facilities <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
