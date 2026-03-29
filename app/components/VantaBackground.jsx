"use client";

import { useEffect, useRef } from "react";

export default function VantaBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let effect;
    let isMounted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const initEffect = async () => {
      const [p5Module, topologyModule] = await Promise.all([
        import("p5"),
        import("vanta/dist/vanta.topology.min"),
      ]);

      if (!isMounted || !containerRef.current) {
        return;
      }

      window.p5 = p5Module.default;

      effect = topologyModule.default({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x646464,
        backgroundColor: 0x0,
      });
    };

    initEffect().catch(() => {});

    return () => {
      isMounted = false;
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/60" />
    </div>
  );
}
