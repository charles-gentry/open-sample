export default function DistanceDisplay({ meters }: { meters: number }) {
  const display =
    meters >= 1000
      ? `${(meters / 1000).toFixed(2)} km`
      : `${Math.round(meters)} m`;

  return (
    <div className="text-center">
      <span className="text-5xl font-black text-slate-900 tracking-tight tabular-nums">{display}</span>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">to next point</p>
    </div>
  );
}
