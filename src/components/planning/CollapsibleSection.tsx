import { type ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  status?: { label: string; color: 'green' | 'amber' | 'slate' };
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  status,
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const statusColors = {
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-500',
  };

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full gap-2 py-1 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          {status && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColors[status.color]}`}
            >
              {status.label}
            </span>
          )}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
