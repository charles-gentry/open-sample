import ExportMenu from './ExportMenu';

export default function CompletionNotice({
  planName,
  total,
}: {
  planName: string;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center bg-surface">
      <div className="text-6xl">&#x2705;</div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">All Done!</h2>
      <p className="text-slate-500">
        You completed all {total} sampling points
        {planName ? ` for "${planName}"` : ''}.
      </p>
      <div className="w-full max-w-xs">
        <p className="text-sm font-semibold text-slate-700 mb-3">Export Results</p>
        <ExportMenu />
      </div>
    </div>
  );
}
