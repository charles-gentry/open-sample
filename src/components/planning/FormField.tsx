import { type ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export const fieldClass =
  'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150';

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      {children}
    </label>
  );
}
