interface Props {
  lat: number;
  lng: number;
}

export default function DirectionsButton({ lat, lng }: Props) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 text-brand hover:bg-brand-light hover:border-brand-glow transition-all duration-150"
      aria-label="Get Directions"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M22.46 10.46l-8.92-8.92a1.5 1.5 0 0 0-2.12 0L2.5 10.46a1.5 1.5 0 0 0 0 2.12l8.92 8.92a1.5 1.5 0 0 0 2.12 0l8.92-8.92a1.5 1.5 0 0 0 0-2.12zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    </a>
  );
}
