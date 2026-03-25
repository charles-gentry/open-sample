interface Props {
  onMark: () => void;
  isNear: boolean;
}

export default function MarkCompleteButton({ onMark, isNear }: Props) {
  return (
    <button
      onClick={onMark}
      className={`w-full py-4 rounded-xl text-lg font-semibold text-white transition-all ${
        isNear
          ? 'bg-green-500 hover:bg-green-600 animate-pulse'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      Mark Point Complete
    </button>
  );
}
