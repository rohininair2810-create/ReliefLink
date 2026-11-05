import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ─── STAT CARD ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon, iconBg = 'bg-teal bg-opacity-10', change, changeType, subtitle, className }: StatCardProps) {
  return (
    <div className={`card flex flex-col gap-3 ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold font-heading text-navy-primary mt-1">{value}</p>
          {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        <span className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </span>
      </div>
      {change && (
        <p className={`text-xs font-medium ${changeType === 'up' ? 'text-emergency-red' : changeType === 'down' ? 'text-teal' : 'text-text-secondary'}`}>
          {change}
        </p>
      )}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  if (!isOpen) return null;
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id="modal-title" className="font-heading font-bold text-lg text-navy-primary">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close modal">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>
  );
}

// ─── CONFIRMATION MODAL ──────────────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'primary', isLoading }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className={confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}>
            {isLoading ? 'Processing…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-text-secondary">{message}</p>
    </Modal>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const configs = {
    success: { icon: <CheckCircle size={18} className="text-teal flex-shrink-0" />, bg: 'bg-green-50 border-green-200' },
    error: { icon: <X size={18} className="text-emergency-red flex-shrink-0" />, bg: 'bg-red-50 border-red-200' },
    info: { icon: <Info size={18} className="text-blue-500 flex-shrink-0" />, bg: 'bg-blue-50 border-blue-200' },
    warning: { icon: <AlertTriangle size={18} className="text-amber flex-shrink-0" />, bg: 'bg-amber bg-opacity-10 border-amber border-opacity-30' },
  };
  const cfg = configs[type];
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${cfg.bg} min-w-72 max-w-sm`}>
      {cfg.icon}
      <p className="text-sm text-text-main flex-1">{message}</p>
      <button onClick={onClose} className="p-0.5 hover:opacity-70" aria-label="Dismiss notification">
        <X size={14} className="text-text-secondary" />
      </button>
    </div>
  );
}

// ─── TOAST CONTAINER ─────────────────────────────────────────────────────────
interface ToastItem { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2" aria-live="polite">
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />)}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-text-secondary">
        {icon}
      </span>
      <h3 className="font-heading font-semibold text-navy-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ─── LOADING STATE ───────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' };
  return (
    <div className={`${sizes[size]} rounded-full border-teal border-t-transparent animate-spin`} role="status" aria-label="Loading" />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, label, colorClass = 'bg-teal' }: { value: number; max: number; label?: string; colorClass?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-text-secondary mb-1"><span>{label}</span><span>{value}/{max}</span></div>}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} />
      </div>
    </div>
  );
}

// ─── DEMO BANNER ─────────────────────────────────────────────────────────────
export function DemoBanner({ message = 'SAMPLE DATA – This is a demonstration. No real operations are connected.' }: { message?: string }) {
  return (
    <div className="demo-banner mb-4">
      <Info size={14} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── RESOURCE TRACKER ────────────────────────────────────────────────────────
interface ResourceTrackerProps {
  name: string;
  unit: string;
  requested: number;
  allocated: number;
  dispatched: number;
  delivered: number;
}

export function ResourceTracker({ name, unit, requested, allocated, dispatched, delivered }: ResourceTrackerProps) {
  return (
    <div className="card">
      <h4 className="font-heading font-semibold text-navy-primary mb-3">{name}</h4>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Requested', value: requested, color: 'text-blue-600' },
          { label: 'Allocated', value: allocated, color: 'text-purple-600' },
          { label: 'Dispatched', value: dispatched, color: 'text-amber' },
          { label: 'Delivered', value: delivered, color: 'text-teal' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className={`text-lg font-bold font-heading ${color}`}>{value}</p>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="text-xs text-text-secondary">{unit}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <ProgressBar value={allocated} max={requested} label="Allocated" colorClass="bg-purple-500" />
        <ProgressBar value={dispatched} max={requested} label="Dispatched" colorClass="bg-amber" />
        <ProgressBar value={delivered} max={requested} label="Delivered" colorClass="bg-teal" />
      </div>
    </div>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
interface TimelineStep {
  label: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
  description?: string;
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative border-l-2 border-gray-100 ml-3 space-y-6">
      {steps.map((step, i) => (
        <li key={i} className="ml-5">
          <span className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            step.current ? 'bg-teal border-teal' : step.completed ? 'bg-teal border-teal' : 'bg-white border-gray-200'
          }`}>
            {step.completed && <CheckCircle size={12} className="text-white" />}
          </span>
          <div>
            <p className={`text-sm font-semibold font-heading ${step.completed || step.current ? 'text-navy-primary' : 'text-text-secondary'}`}>
              {step.label}
            </p>
            {step.timestamp && <p className="text-xs text-text-secondary mt-0.5">{step.timestamp}</p>}
            {step.description && <p className="text-xs text-text-secondary mt-1">{step.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── PAGINATION ──────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="btn-secondary px-3 py-2 text-xs disabled:opacity-40">
        Previous
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const page = i + 1;
        return (
          <button key={page} onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-navy-primary text-white' : 'bg-white border border-gray-200 text-text-secondary hover:bg-gray-50'}`}>
            {page}
          </button>
        );
      })}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="btn-secondary px-3 py-2 text-xs disabled:opacity-40">
        Next
      </button>
    </div>
  );
}
