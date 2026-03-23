import { useRef } from 'react';

interface Props {
  rotation: number; // degrees, 0 = up (north)
}

export default function CompassArrow({ rotation }: Props) {
  const accRef = useRef(rotation);
  const prev = accRef.current;
  const diff = ((rotation - prev + 540) % 360) - 180;
  accRef.current = prev + diff;

  return (
    <div className="flex items-center justify-center w-48 h-48">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
        style={{ transform: `rotate(${accRef.current}deg)`, transition: 'transform 0.1s ease-out' }}
      >
        <polygon
          points="50,10 35,70 50,58 65,70"
          fill="#e63946"
          stroke="#fff"
          strokeWidth="2"
        />
        <circle cx="50" cy="50" r="4" fill="#1d3557" />
      </svg>
    </div>
  );
}
