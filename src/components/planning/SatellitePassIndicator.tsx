import type { SatellitePass } from '../../services/satellite';

export default function SatellitePassIndicator({ passes }: { passes: SatellitePass[] }) {
  if (passes.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded text-xs text-indigo-700">
      <span className="text-base">&#x1F6F0;&#xFE0F;</span>
      <div className="flex flex-col">
        {passes.slice(0, 3).map((pass, i) => (
          <span key={i}>
            {pass.satellite}:{' '}
            {pass.time.toLocaleDateString('en', { month: 'short', day: 'numeric' })}{' '}
            {pass.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ))}
        {passes.length > 3 && <span>+{passes.length - 3} more passes</span>}
      </div>
    </div>
  );
}
