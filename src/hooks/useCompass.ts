import { useState, useEffect, useCallback, useRef } from 'react';

export function useCompass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const smoothRef = useRef(0);
  const rafRef = useRef<number>(0);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let raw: number | null = null;

    // iOS
    if ('webkitCompassHeading' in event) {
      raw = (event as DeviceOrientationEvent & { webkitCompassHeading: number })
        .webkitCompassHeading;
    }
    // Android / standard
    else if (event.alpha !== null) {
      raw = event.absolute ? 360 - event.alpha : event.alpha;
    }

    if (raw !== null) {
      const diff = raw - smoothRef.current;
      const wrapped = ((diff + 540) % 360) - 180;
      smoothRef.current = (smoothRef.current + 0.15 * wrapped + 360) % 360;

      // Throttle React state updates to one per animation frame
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setHeading(smoothRef.current);
          rafRef.current = 0;
        });
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (DOE.requestPermission) {
      const perm = await DOE.requestPermission();
      if (perm === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setNeedsPermission(false);
      } else {
        setError('Compass permission denied');
      }
    }
  }, [handleOrientation]);

  useEffect(() => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (DOE.requestPermission) {
      setNeedsPermission(true);
      return undefined;
    }

    const handler = handleOrientation as EventListener;

    // Try absolute orientation first (Android)
    const hasAbsolute = 'ondeviceorientationabsolute' in window;
    const eventName = hasAbsolute ? 'deviceorientationabsolute' : 'deviceorientation';

    window.addEventListener(eventName, handler, true);
    return () => {
      window.removeEventListener(eventName, handler, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleOrientation]);

  return { heading, error, needsPermission, requestPermission };
}
