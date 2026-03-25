export default function DistanceDisplay({ meters }: { meters: number }) {
  const display =
    meters >= 1000
      ? `${(meters / 1000).toFixed(2)} km`
      : `${Math.round(meters)} m`;

  return (
    <div className="text-center">
      <span className="text-4xl font-bold text-retro-green">{display}</span>
      <p className="text-sm text-retro-green-dim uppercase tracking-wider">to next point</p>
    </div>
  );
}
