import React from 'react';
import { Link } from 'react-router-dom';
import {
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
  FileSearch,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { StatCard, DemoBanner, SectionHeader } from '../../components/common/UIComponents';
import { SeverityBadge, IncidentStatusBadge, VerificationBadge } from '../../components/common/StatusBadges';

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

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#D94B45',
  severe: '#E5A04B',
  moderate: '#ECC94B',
  low: '#38A169',
};

export default function AuthorityDashboard() {
  const { currentUser } = useAuth();
  const { state } = useAppState();

  const incidents = state.incidents;
  const volunteers = state.volunteers;
  const inventory = state.inventory;
  const distributions = state.distributions;
  const auditLog = state.auditLog;

  // Operational metrics
  const totalIncidents = incidents.length;
  const criticalUnresolved = incidents.filter(
    (i) => (i.priority === 'critical' || i.priority === 'severe') && i.status !== 'delivered' && i.status !== 'closed'
  ).length;
  const unverifiedIncidents = incidents.filter((i) => i.verificationStatus === 'pending').length;
  const availableVolunteers = volunteers.filter((v) => v.availability).length;
  const activeDeliveries = distributions.filter((d) => d.status !== 'delivered').length;

  // Chart data: Incident intake trend
  const intakeTrendData = [
    { time: '06:00', requests: 4 },
    { time: '08:00', requests: 12 },
    { time: '10:00', requests: 19 },
    { time: '12:00', requests: 28 },
    { time: '14:00', requests: 35 },
    { time: '16:00', requests: 42 },
  ];

  // Chart data: Severity breakdown
  const severityCounts = incidents.reduce((acc, curr) => {
    acc[curr.priority] = (acc[curr.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityPieData = Object.keys(severityCounts).map((key) => ({
    name: key.toUpperCase(),
    value: severityCounts[key],
    color: SEVERITY_COLORS[key] || '#718096',
  }));

  // Resource Supply vs Reserved
  const resourceData = inventory.slice(0, 4).map((item) => ({
    name: item.name.split(' ')[0],
    available: item.availableStock,
    reserved: item.reservedStock,
  }));

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="CENTRAL COMMAND ENVIRONMENT: Connected operational dashboard for disaster verification, inventory allocation, and volunteer deployment." />

        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Active Operations Center • District 14
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-[#172D40] mt-1">
              Disaster Response Operations Command
            </h1>
          </div>

          <div className="flex gap-2">
            <Link to="/authority/map" className="btn-secondary text-xs flex items-center gap-1.5">
              <Map size={14} /> Open Live Map
            </Link>
            <Link to="/authority/incidents" className="btn-danger text-xs flex items-center gap-1.5">
              <AlertTriangle size={14} /> Triage Emergencies ({unverifiedIncidents})
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Incidents"
            value={totalIncidents}
            subtitle={`${unverifiedIncidents} pending verification`}
            icon={<AlertTriangle size={20} className="text-[#172D40]" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Critical Cases"
            value={criticalUnresolved}
            subtitle="Immediate life-threat priority"
            icon={<AlertTriangle size={20} className="text-emergency-red" />}
            iconBg="bg-red-100"
          />
          <StatCard
            title="Deployable Volunteers"
            value={availableVolunteers}
            subtitle={`${volunteers.length} registered total`}
            icon={<Users size={20} className="text-teal" />}
            iconBg="bg-teal/10"
          />
          <StatCard
            title="Active Deliveries"
            value={activeDeliveries}
            subtitle="Trucks / boat teams en route"
            icon={<Truck size={20} className="text-amber" />}
            iconBg="bg-amber/10"
          />
        </div>

        {/* Operational Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Intake Trend (LineChart) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-[#172D40]">
                  Incident Inflow & Accumulation
                </h3>
                <p className="text-xs text-gray-500">Hourly emergency report volume received by portal</p>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">Last 12 Hours</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={intakeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                  <XAxis dataKey="time" stroke="#718096" fontSize={11} />
                  <YAxis stroke="#718096" fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    name="Reports Received"
                    stroke="#D94B45"
                    strokeWidth={3}
                    dot={{ fill: '#D94B45', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Breakdown (PieChart) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div>
              <h3 className="font-heading font-bold text-base text-[#172D40]">
                Severity Distribution
              </h3>
              <p className="text-xs text-gray-500">Citizen reported threat classification</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {severityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
              {severityPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-600 font-medium capitalize">{item.name.toLowerCase()}:</span>
                  <strong className="text-gray-800">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Grid: Priority Incidents & Supply Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Incident Triage Queue */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-[#172D40]">
                  Immediate Incident Triage Queue
                </h3>
                <p className="text-xs text-gray-500">Awaiting field assessment or volunteer assignment</p>
              </div>
              <Link to="/authority/incidents" className="text-xs text-teal font-semibold hover:underline flex items-center gap-1">
                Full Incident Table <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Incident Title</th>
                    <th className="py-2.5 px-3">Locality</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incidents.slice(0, 4).map((inc) => (
                    <tr key={inc.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#172D40]">{inc.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-800 line-clamp-1">{inc.title}</td>
                      <td className="py-2.5 px-3 text-gray-600">{inc.location.locality}</td>
                      <td className="py-2.5 px-3">
                        <SeverityBadge level={inc.priority} />
                      </td>
                      <td className="py-2.5 px-3">
                        <IncidentStatusBadge status={inc.status} />
                      </td>
                      <td className="py-2.5 px-3">
                        <Link
                          to="/authority/incidents"
                          className="text-xs text-teal hover:underline font-bold"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Inventory Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-[#172D40]">
                  Critical Supplies
                </h3>
                <p className="text-xs text-gray-500">Available vs Reserved stock</p>
              </div>
              <Link to="/authority/inventory" className="text-xs text-teal font-semibold hover:underline">
                Manage
              </Link>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EDF2F7" />
                  <XAxis type="number" fontSize={10} stroke="#718096" />
                  <YAxis dataKey="name" type="category" fontSize={11} stroke="#718096" width={70} />
                  <Tooltip />
                  <Bar dataKey="available" name="Available Stock" fill="#197C78" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="reserved" name="Reserved Stock" fill="#E5A04B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Real-Time Operational Audit Trail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-teal" />
              <h3 className="font-heading font-bold text-sm text-[#172D40]">
                Live Cross-Portal Audit Log
              </h3>
            </div>
            <Link to="/authority/audit" className="text-xs text-teal font-semibold hover:underline">
              View complete log
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {auditLog.slice(0, 4).map((entry) => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-800">{entry.action}</strong>
                  <span className="text-gray-400 font-mono text-[11px]">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-600">
                  By <strong>{entry.actorName}</strong> ({entry.actorRole})
                </div>
                {entry.details && <div className="text-gray-500 italic">{entry.details}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
