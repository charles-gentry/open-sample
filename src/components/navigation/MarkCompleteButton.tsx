interface Props {
  onMark: () => void;
  isNear: boolean;
}

export default function MarkCompleteButton({ onMark, isNear }: Props) {
  return (
    <button
      onClick={onMark}
      className={`w-full py-4 text-lg font-bold uppercase tracking-wider transition-all ${
        isNear
          ? 'bg-retro-green text-retro-bg border-2 border-retro-green'
          : 'bg-retro-bg text-retro-green border-2 border-retro-green hover:bg-retro-green hover:text-retro-bg'
      }`}
      style={isNear ? { animation: 'retro-pulse 1.5s ease-in-out infinite' } : undefined}
    >
      Mark Point Complete
    </button>
  );
}
