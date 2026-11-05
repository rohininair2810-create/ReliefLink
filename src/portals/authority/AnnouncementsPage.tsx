import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  Send,
  Users,
  Heart,
  LayoutDashboard,
  Map,
  Package,
  Truck,
  Building2,
  BarChart3,
  FileSearch,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useAppState } from '../../store/AppContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { DemoBanner } from '../../components/common/UIComponents';
import type { Announcement } from '../../types';

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

export default function AnnouncementsPage() {
  const { currentUser } = useAuth();
  const { state } = useAppState();

  const [announcements, setAnnouncements] = useState<Announcement[]>(state.announcements);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('critical');
  const [audience, setAudience] = useState<'all' | 'victims' | 'volunteers' | 'donors'>('all');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title,
      message,
      audience: [audience],
      priority,
      publishedAt: new Date().toISOString(),
      publishedBy: currentUser?.name || 'District Disaster Coordinator',
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle('');
    setMessage('');
    alert('Emergency announcement broadcast to selected portal audiences!');
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <PortalLayout sidebarItems={SIDEBAR_ITEMS} portalLabel="Authority Portal" portalColor="#172D40">
      <div className="max-w-6xl mx-auto space-y-6">
        <DemoBanner message="CIVIC BROADCAST PROTOCOL: Alerts dispatched here appear instantly on Victim, Volunteer, and Donor portals according to audience filters." />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#172D40]">Official Broadcasts & Alerts</h1>
            <p className="text-sm text-gray-500">
              Publish critical evacuation orders, volunteer muster calls, and humanitarian donor reports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Announcement Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#172D40] flex items-center gap-2">
              <Megaphone size={18} className="text-teal" /> Draft Broadcast Alert
            </h3>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              <div>
                <label className="label">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Flood Evacuation Warning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="label">Target Audience *</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="input-field text-xs"
                >
                  <option value="all">All Stakeholders (Public)</option>
                  <option value="victims">Victims / Affected People</option>
                  <option value="volunteers">Registered Volunteers</option>
                  <option value="donors">Donors & Philanthropies</option>
                </select>
              </div>

              <div>
                <label className="label">Priority Level *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="input-field text-xs"
                >
                  <option value="critical">Critical (Red Emergency Alert)</option>
                  <option value="high">High Warning</option>
                  <option value="medium">Standard Advisory</option>
                  <option value="low">Informational / Update</option>
                </select>
              </div>

              <div>
                <label className="label">Directive Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="State clear, actionable emergency instructions, muster locations, or road closures..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <button
                type="submit"
                className="btn-danger w-full justify-center text-xs py-2.5 flex items-center gap-1.5"
              >
                <Send size={14} /> Broadcast Announcement
              </button>
            </form>
          </div>

          {/* Active Announcements List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#172D40]">
              Active Portal Broadcasts ({announcements.length})
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`card p-5 space-y-3 border-l-4 ${
                    ann.priority === 'critical'
                      ? 'border-l-red-500 bg-red-50/20'
                      : ann.priority === 'high'
                      ? 'border-l-amber bg-amber/5'
                      : 'border-l-teal'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-400">{ann.id}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          ann.priority === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-teal/10 text-teal'
                        }`}>
                          {ann.priority} Priority
                        </span>
                        <span className="text-xs text-gray-500 font-medium capitalize">
                          Target: {ann.audience.join(', ')}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-base text-[#172D40] mt-1">
                        {ann.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">{ann.message}</p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t">
                    <span>Published by {ann.publishedBy}</span>
                    <span>{new Date(ann.publishedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
