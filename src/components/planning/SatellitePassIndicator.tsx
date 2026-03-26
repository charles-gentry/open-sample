import type { SatellitePass } from '../../services/satellite';

export default function SatellitePassIndicator({ passes, timezone }: { passes: SatellitePass[]; timezone?: string }) {
  if (passes.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-brand-light border border-brand-glow rounded-2xl text-xs text-brand">
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand animate-pulse-dot" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand">SAT</span>
      </span>
      <div className="flex flex-col">
        {passes.slice(0, 3).map((pass, i) => (
          <span key={i}>
            {pass.satellite}:{' '}
            {pass.time.toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: timezone })}{' '}
            {pass.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: timezone })}
          </span>
        ))}
        {passes.length > 3 && <span>+{passes.length - 3} more passes</span>}
      </div>
    </div>
  );
}
