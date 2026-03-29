"use client";

import { useEffect, useRef } from "react";

export default function VantaBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let effect;
    let cancelled = false;

    async function init() {
      const p5 = (await import("p5")).default;
      window.p5 = p5;

      const TOPOLOGY = (await import("vanta/dist/vanta.topology.min")).default;

      if (cancelled || !containerRef.current) return;

      effect = TOPOLOGY({
        el: containerRef.current,
        p5,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x646464,
        backgroundColor: 0x000000,
      });
    }

    init().catch(console.error);

    return () => {
      cancelled = true;
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
