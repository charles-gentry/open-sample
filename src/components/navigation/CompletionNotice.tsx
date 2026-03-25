export default function CompletionNotice({
  planName,
  total,
}: {
  planName: string;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center bg-retro-bg">
      <div className="text-6xl">&#x2705;</div>
      <h2 className="text-2xl font-bold text-retro-green uppercase tracking-widest">Mission Complete</h2>
      <p className="text-retro-text">
        You completed all {total} sampling points
        {planName ? ` for "${planName}"` : ''}.
      </p>
    </div>
  );
}
