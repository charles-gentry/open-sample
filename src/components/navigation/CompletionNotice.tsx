export default function CompletionNotice({
  planName,
  total,
}: {
  planName: string;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="text-6xl">&#x2705;</div>
      <h2 className="text-2xl font-bold text-gray-800">All Done!</h2>
      <p className="text-gray-600">
        You completed all {total} sampling points
        {planName ? ` for "${planName}"` : ''}.
      </p>
    </div>
  );
}
