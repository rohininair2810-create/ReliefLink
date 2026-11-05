import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search…', className }: SearchBarProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9"
        aria-label={placeholder}
      />
    </div>
  );
}

// ─── SELECT FILTER ───────────────────────────────────────────────────────────
interface SelectFilterProps {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  label?: string;
  className?: string;
}

export function SelectFilter({ value, onChange, options, label, className }: SelectFilterProps) {
  return (
    <div className={`relative ${className || ''}`}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input-field pr-9 appearance-none cursor-pointer"
          aria-label={label}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}

// ─── FILTER BAR ──────────────────────────────────────────────────────────────
interface FilterOption { label: string; value: string }

interface FilterBarProps {
  tabs: FilterOption[];
  active: string;
  onSelect: (v: string) => void;
}

export function FilterBar({ tabs, active, onSelect }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
      {tabs.map(t => (
        <button
          key={t.value}
          onClick={() => onSelect(t.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
            active === t.value
              ? 'bg-white text-navy-primary shadow-sm'
              : 'text-text-secondary hover:text-navy-primary'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── FORM INPUT ──────────────────────────────────────────────────────────────
interface FormInputProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, id, error, hint, required, children }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-emergency-red">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-secondary mt-1">{hint}</p>}
      {error && <p className="text-xs text-emergency-red mt-1" role="alert">{error}</p>}
    </div>
  );
}

// ─── TEXTAREA ────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, id, error, ...rest }: TextareaProps) {
  return (
    <div>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <textarea id={id} className={`input-field resize-none ${error ? 'border-emergency-red focus:ring-emergency-red' : ''}`} rows={3} {...rest} />
      {error && <p className="text-xs text-emergency-red mt-1" role="alert">{error}</p>}
    </div>
  );
}

// ─── FILE UPLOAD ─────────────────────────────────────────────────────────────
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: FileList) => void;
  label?: string;
  hint?: string;
}

export function FileUpload({ accept, multiple, onFiles, label = 'Upload Files', hint }: FileUploadProps) {
  return (
    <div>
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-teal hover:bg-teal hover:bg-opacity-5 transition-colors">
        <div className="w-10 h-10 bg-teal bg-opacity-10 rounded-lg flex items-center justify-center mb-3">
          <Filter size={20} className="text-teal" />
        </div>
        <span className="text-sm font-medium text-navy-primary">{label}</span>
        {hint && <span className="text-xs text-text-secondary mt-1">{hint}</span>}
        <input type="file" className="sr-only" accept={accept} multiple={multiple}
          onChange={e => { if (e.target.files && onFiles) onFiles(e.target.files); }} />
      </label>
    </div>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
interface Step { label: string; icon?: React.ReactNode }

interface StepIndicatorProps {
  steps: Step[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
              i < current ? 'bg-teal border-teal text-white' :
              i === current ? 'bg-white border-teal text-teal' :
              'bg-white border-gray-200 text-text-secondary'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${i === current ? 'text-teal' : i < current ? 'text-teal' : 'text-text-secondary'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 min-w-6 mx-1 mb-5 transition-colors ${i < current ? 'bg-teal' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
