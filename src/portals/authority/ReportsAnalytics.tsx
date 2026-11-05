import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Map,
  AlertTriangle,
  Users,
  Package,
  Truck,
  Building2,
  Heart,
  Megaphone,
  FileSearch,
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
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner, StatCard } from '../../components/common/UIComponents';

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

const ZONE_DATA = [
  { zone: 'Kalyan Nagar', incidents: 42, delivered: 85, volunteers: 28 },
  { zone: 'Bhiwandi', incidents: 28, delivered: 64, volunteers: 16 },
  { zone: 'Thane West', incidents: 15, delivered: 92, volunteers: 12 },
  { zone: 'Dombivli', incidents: 8, delivered: 45, volunteers: 6 },
];

const RESOURCE_UTIL = [
  { name: 'Water (1L)', demand: 6000, allocated: 5000, delivered: 3800 },
  { name: 'Food Kits', demand: 4000, allocated: 3000, delivered: 2200 },
  { name: 'Blankets', demand: 700, allocated: 500, delivered: 350 },
  { name: 'First Aid', demand: 300, allocated: 200, delivered: 150 },
];

export default function ReportsAnalytics() {
  const { state } = useAppState();

  const handleExportCSV = () => {
    alert('Simulated Report Export: Generating comprehensive municipal response CSV audit bundle (DEMO).');
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoBanner message="DISASTER ANALYTICS & AUDIT INTEL: Aggregate data across intake, allocation efficiency, volunteer hours, and donor utilization." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Operational Reports & Analytics</h1>
            <p className="text-sm text-gray-500">
              Cross-sectoral performance indicators and supply chain fulfillment metrics.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-primary text-xs flex items-center gap-1.5 self-start"
          >
            <Download size={14} /> Export Operational Summary (CSV)
          </button>
        </div>

        {/* High Level KPI summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Relief Delivery Rate"
            value="86.4%"
            subtitle="Fulfilled vs requested"
            icon={<CheckCircle size={20} className="text-teal" />}
          />
          <StatCard
            title="Avg Response Latency"
            value="38 mins"
            subtitle="From report to volunteer deploy"
            icon={<Clock size={20} className="text-amber" />}
            iconBg="bg-amber/10"
          />
          <StatCard
            title="Supplies Dispatched"
            value="14,200 kg"
            subtitle="Dry ration & bottled water"
            icon={<Package size={20} className="text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Volunteers Mobilized"
            value="62 personnel"
            subtitle="Across 3 flood zones"
            icon={<Users size={20} className="text-green-600" />}
            iconBg="bg-green-100"
          />
        </div>

        {/* Chart 1: Zone-wise Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-[#172D40]">
                Disaster Zone Operations Comparison
              </h3>
              <p className="text-xs text-gray-500">Incidents logged, delivery % reached, and deployed volunteers per zone</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="zone" stroke="#718096" fontSize={11} />
                <YAxis stroke="#718096" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="incidents" name="Incidents Logged" fill="#D94B45" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" name="Delivery % Fulfilled" fill="#197C78" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volunteers" name="Active Volunteers" fill="#24465C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Resource Demand vs Allocation vs Delivery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#172D40]">
              Critical Supply Fulfillment (Demand vs Allocated vs Delivered)
            </h3>
            <p className="text-xs text-gray-500">Volume tracking to prevent shortages</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_UTIL}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" stroke="#718096" fontSize={11} />
                <YAxis stroke="#718096" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="demand" name="Total Demand" fill="#718096" radius={[4, 4, 0, 0]} />
                <Bar dataKey="allocated" name="Stock Allocated" fill="#E5A04B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" name="Physically Delivered" fill="#197C78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
