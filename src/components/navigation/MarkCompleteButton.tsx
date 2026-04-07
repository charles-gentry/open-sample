interface Props {
  onMark: () => void;
  isNear: boolean;
  disabled?: boolean;
}

export default function MarkCompleteButton({ onMark, isNear, disabled }: Props) {
  return (
    <button
      onClick={onMark}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 ${
        disabled
          ? 'bg-slate-300 cursor-not-allowed'
          : isNear
            ? 'bg-emerald-500 hover:bg-emerald-600 animate-pulse shadow-xl shadow-emerald-300'
            : 'bg-brand hover:bg-brand-hover shadow-lg shadow-brand-glow'
      }`}
    >
      {disabled ? 'Waiting for GPS…' : 'Mark Point Complete'}
    </button>
  );
}
