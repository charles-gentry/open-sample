interface Props {
  onMark: () => void;
  isNear: boolean;
}

export default function MarkCompleteButton({ onMark, isNear }: Props) {
  return (
    <button
      onClick={onMark}
      className={`w-full py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 ${
        isNear
          ? 'bg-emerald-500 hover:bg-emerald-600 animate-pulse shadow-xl shadow-emerald-300'
          : 'bg-brand hover:bg-brand-hover shadow-lg shadow-brand-glow'
      }`}
    >
      Mark Point Complete
    </button>
  );
}
