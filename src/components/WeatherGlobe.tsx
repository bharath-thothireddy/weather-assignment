import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';

export function WeatherGlobe({ latitude = 0, longitude = 0 }: { latitude?: number; longitude?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    // cobe uses theta and phi.
    // phi: longitude equivalent
    // theta: latitude equivalent
    const locationToAngles = (lat: number, lon: number) => {
      return [
        Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2),
        (lat * Math.PI) / 180
      ];
    };
    
    const [focusPhi, focusTheta] = locationToAngles(latitude, longitude);

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: 400 * 2,
      height: 400 * 2,
      phi: 0,
      theta: 0.3,
      dark: 0.1, // somewhat transparent dark mode
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.1, 0.6, 1], // primary accent color
      glowColor: [1, 1, 1],
      markers: [
        { location: [latitude, longitude], size: 0.1 }
      ],
      onRender: (state: any) => {
        state.phi = focusPhi + phi;
        state.theta = focusTheta;
        phi += 0.002;
      }
    } as any);

    return () => {
      globe.destroy();
    };
  }, [latitude, longitude]);

  return (
    <div className="w-full max-w-[400px] aspect-square mx-auto relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: 100 + '%',
          height: 100 + '%',
          contain: 'layout paint size',
          opacity: 0.9,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  );
}
