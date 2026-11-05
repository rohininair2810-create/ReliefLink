import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, Clock, Truck, Package, Shield, Users } from 'lucide-react';
import type { IncidentStatus, SeverityLevel, VerificationStatus, ResourceStatus, DonationStatus, VolunteerStatus, FacilityStatus } from '../../types';

// ─── SEVERITY BADGE ──────────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; className: string; icon: React.ReactNode }> = {
  critical: { label: 'Critical', className: 'bg-red-50 text-red-800 border border-red-300 font-semibold', icon: <AlertTriangle size={12} className="text-red-700" /> },
  severe: { label: 'Severe', className: 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold', icon: <AlertTriangle size={12} className="text-orange-700" /> },
  moderate: { label: 'Moderate', className: 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold', icon: <AlertTriangle size={12} className="text-amber-700" /> },
  low: { label: 'Low', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold', icon: <Info size={12} className="text-emerald-700" /> },
  unknown: { label: 'Unknown', className: 'bg-gray-100 text-gray-700 border border-gray-300 font-semibold', icon: <Info size={12} className="text-gray-600" /> },
};

export function SeverityBadge({ level }: { level: SeverityLevel }) {
  const cfg = SEVERITY_CONFIG[level];
  return (
    <span className={`status-badge ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── INCIDENT STATUS BADGE ───────────────────────────────────────────────────
const INCIDENT_STATUS_CONFIG: Record<IncidentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  submitted: { label: 'Submitted', className: 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold', icon: <Clock size={12} className="text-blue-700" /> },
  under_review: { label: 'Under Review', className: 'bg-yellow-50 text-yellow-800 border border-yellow-300 font-semibold', icon: <Clock size={12} className="text-yellow-700" /> },
  verified: { label: 'Verified', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold', icon: <Shield size={12} className="text-emerald-700" /> },
  resources_allocated: { label: 'Resources Allocated', className: 'bg-purple-50 text-purple-800 border border-purple-300 font-semibold', icon: <Package size={12} className="text-purple-700" /> },
  dispatched: { label: 'Dispatched', className: 'bg-indigo-50 text-indigo-800 border border-indigo-300 font-semibold', icon: <Truck size={12} className="text-indigo-700" /> },
  partially_delivered: { label: 'Partially Delivered', className: 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold', icon: <Truck size={12} className="text-orange-700" /> },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold', icon: <CheckCircle size={12} className="text-emerald-700" /> },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-700 border border-gray-300 font-semibold', icon: <CheckCircle size={12} className="text-gray-600" /> },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-800 border border-red-300 font-semibold', icon: <XCircle size={12} className="text-red-700" /> },
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const cfg = INCIDENT_STATUS_CONFIG[status];
  return (
    <span className={`status-badge ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── RESOURCE STATUS BADGE ───────────────────────────────────────────────────
const RESOURCE_STATUS_CONFIG: Record<ResourceStatus, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold' },
  under_review: { label: 'Under Review', className: 'bg-yellow-50 text-yellow-800 border border-yellow-300 font-semibold' },
  verified: { label: 'Verified', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold' },
  resources_allocated: { label: 'Allocated', className: 'bg-purple-50 text-purple-800 border border-purple-300 font-semibold' },
  dispatched: { label: 'Dispatched', className: 'bg-indigo-50 text-indigo-800 border border-indigo-300 font-semibold' },
  partially_delivered: { label: 'Partial Delivery', className: 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold' },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold' },
};

export function ResourceStatusBadge({ status }: { status: ResourceStatus }) {
  const cfg = RESOURCE_STATUS_CONFIG[status];
  return <span className={`status-badge ${cfg.className}`}>{cfg.label}</span>;
}

// ─── VERIFICATION BADGE ──────────────────────────────────────────────────────
const VERIFICATION_CONFIG: Record<VerificationStatus, { label: string; className: string; icon: React.ReactNode }> = {
  verified: { label: 'Verified', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold', icon: <CheckCircle size={12} className="text-emerald-700" /> },
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold', icon: <Clock size={12} className="text-amber-700" /> },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-800 border border-red-300 font-semibold', icon: <XCircle size={12} className="text-red-700" /> },
  unverified: { label: 'Unverified', className: 'bg-gray-100 text-gray-700 border border-gray-300 font-semibold', icon: <Info size={12} className="text-gray-600" /> },
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const cfg = VERIFICATION_CONFIG[status];
  return (
    <span className={`status-badge ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── DONATION STATUS BADGE ───────────────────────────────────────────────────
const DONATION_STATUS_CONFIG: Record<DonationStatus, { label: string; className: string }> = {
  registered: { label: 'Registered', className: 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold' },
  received: { label: 'Received', className: 'bg-indigo-50 text-indigo-800 border border-indigo-300 font-semibold' },
  inspected: { label: 'Inspected', className: 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold' },
  accepted: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-800 border border-red-300 font-semibold' },
  added_to_inventory: { label: 'In Inventory', className: 'bg-purple-50 text-purple-800 border border-purple-300 font-semibold' },
  allocated: { label: 'Allocated', className: 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold' },
  distributed: { label: 'Distributed', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold' },
};

export function DonationStatusBadge({ status }: { status: DonationStatus }) {
  const cfg = DONATION_STATUS_CONFIG[status];
  return <span className={`status-badge ${cfg.className}`}>{cfg.label}</span>;
}

// ─── VOLUNTEER STATUS BADGE ──────────────────────────────────────────────────
const VOLUNTEER_STATUS_CONFIG: Record<VolunteerStatus, { label: string; className: string; icon: React.ReactNode }> = {
  available: { label: 'Available', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold', icon: <CheckCircle size={12} className="text-emerald-700" /> },
  assigned: { label: 'Assigned', className: 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold', icon: <Users size={12} className="text-blue-700" /> },
  on_task: { label: 'On Task', className: 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold', icon: <Truck size={12} className="text-orange-700" /> },
  unavailable: { label: 'Unavailable', className: 'bg-gray-100 text-gray-700 border border-gray-300 font-semibold', icon: <XCircle size={12} className="text-gray-600" /> },
};

export function VolunteerStatusBadge({ status }: { status: VolunteerStatus }) {
  const cfg = VOLUNTEER_STATUS_CONFIG[status];
  return (
    <span className={`status-badge ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── FACILITY STATUS BADGE ───────────────────────────────────────────────────
const FACILITY_STATUS_CONFIG: Record<FacilityStatus, { label: string; className: string }> = {
  operational: { label: 'Operational', className: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold' },
  limited: { label: 'Limited Services', className: 'bg-yellow-50 text-yellow-800 border border-yellow-300 font-semibold' },
  closed: { label: 'Temporarily Closed', className: 'bg-red-50 text-red-800 border border-red-300 font-semibold' },
  unknown: { label: 'Unknown / Unverified', className: 'bg-gray-100 text-gray-700 border border-gray-300 font-semibold' },
};

export function FacilityStatusBadge({ status }: { status: FacilityStatus }) {
  const cfg = FACILITY_STATUS_CONFIG[status];
  return <span className={`status-badge ${cfg.className}`}>{cfg.label}</span>;
}

// ─── PRIORITY BADGE ──────────────────────────────────────────────────────────
export function PriorityBadge({ priority }: { priority: string }) {
  const configs: Record<string, string> = {
    critical: 'bg-red-50 text-red-800 border border-red-300 font-semibold',
    high: 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold',
    medium: 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold',
    low: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold',
  };
  return (
    <span className={`status-badge ${configs[priority] || 'bg-gray-100 text-gray-700 border border-gray-300 font-semibold'}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
