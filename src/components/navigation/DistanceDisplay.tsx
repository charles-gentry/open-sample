export default function DistanceDisplay({ meters }: { meters: number }) {
  const display =
    meters >= 1000
      ? `${(meters / 1000).toFixed(2)} km`
      : `${Math.round(meters)} m`;

  return (
    <div className="text-center">
      <span className="text-4xl font-bold text-gray-800">{display}</span>
      <p className="text-sm text-gray-500">to next point</p>
    </div>
  );
}
