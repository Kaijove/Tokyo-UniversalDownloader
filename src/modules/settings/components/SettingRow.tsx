import type { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

/** A labelled setting with an optional description and its control. */
export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-content-primary">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-content-tertiary">{description}</p>
        )}
      </div>
      <div className="w-56 shrink-0">{children}</div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

/** A setting rendered as a checkbox. */
export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-content-primary">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-content-tertiary">{description}</p>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
      />
    </div>
  );
}
