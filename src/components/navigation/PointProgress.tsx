export default function PointProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-retro-green-dim mb-1">
        <span>
          {completed} of {total} complete
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full bg-retro-green-muted h-2">
        <div
          className="bg-retro-green h-2 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
