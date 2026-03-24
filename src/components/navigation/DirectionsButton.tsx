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
      className="block w-full py-3 rounded-xl text-base font-semibold text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
    >
      Get Directions
    </a>
  );
}
