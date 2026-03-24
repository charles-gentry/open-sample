import { useRef, useEffect } from 'react';

interface Props {
  rotation: number; // degrees, 0 = up (north)
}

export default function CompassArrow({ rotation }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const displayAngle = useRef(rotation);
  const targetAngle = useRef(rotation);
  const prevProp = useRef(rotation);

  // Unwrap rotation prop into continuous target angle (avoids 359→1 jumps)
  const propDiff = ((rotation - prevProp.current + 540) % 360) - 180;
  targetAngle.current += propDiff;
  prevProp.current = rotation;

  // Persistent rAF loop — single source of visual animation
  useEffect(() => {
    let rafId: number;
    const ALPHA = 0.18;

    function animate() {
      const diff = targetAngle.current - displayAngle.current;
      displayAngle.current += ALPHA * diff;
      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${displayAngle.current}deg)`;
      }
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex items-center justify-center w-48 h-48">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
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
