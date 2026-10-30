import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; z: number };
const TAU = Math.PI * 2;

/** Three continuous surfaces: fragmented data, connected intelligence, evolving systems. */
function pointAt(u: number, v: number, band: number, mode: number, time: number): Point {
  const angle = u * TAU;
  const width = (v - .5) * .24;
  if (mode === 0) {
    return {
      x: (u - .5) * 2.6 + .15 * Math.sin(v * 21 + band * 2 + time * .2),
      y: (band - 1) * .65 + width * 1.5 + .12 * Math.cos(u * 25 + v * 8),
      z: Math.sin(u * 19 + v * 11 + band) * .7,
    };
  }
  if (mode === 1) {
    const radius = .92 + width + .13 * Math.sin(angle * 3 + time * .22);
    return {
      x: Math.cos(angle) * radius,
      y: (band - 1) * .41 + .28 * Math.sin(angle * 2 + band * .65 + time * .18),
      z: Math.sin(angle) * radius,
    };
  }
  const radius = .92 + width;
  const tilt = (band - 1) * .72;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * Math.sin(tilt) + .08 * Math.sin(angle * 3 + time * .3),
    z: Math.sin(angle) * radius * Math.cos(tilt),
  };
}

export function TransformationField({ mode, paused }: { mode: number; paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ mode, paused });
  const wake = useRef<(() => void) | null>(null);

  useEffect(() => {
    settings.current = { mode, paused };
    wake.current?.();
  }, [mode, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest('section');
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !section) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, last = 0, elapsed = 0;
    let visible = true, disposed = false, currentMode = settings.current.mode;
    let previousMode = currentMode, morph = 1;
    let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;

    const render = (timestamp: number) => {
      frame = 0;
      if (disposed) return;
      const moving = !settings.current.paused && !reduced.matches;
      const delta = Math.min((timestamp - last) / 1000 || 0, .05);
      last = timestamp;
      if (moving) elapsed += delta;
      if (currentMode !== settings.current.mode) {
        previousMode = currentMode;
        currentMode = settings.current.mode;
        morph = reduced.matches || settings.current.paused ? 1 : 0;
      }
      morph = Math.min(1, morph + delta * .8);
      const blend = morph * morph * (3 - 2 * morph);
      tiltX += ((moving ? pointerX : 0) - tiltX) * .035;
      tiltY += ((moving ? pointerY : 0) - tiltY) * .035;
      context.clearRect(0, 0, width, height);
      const mobile = width <= 640;
      const cx = width * (mobile ? .5 : .77);
      const cy = height * (mobile ? .73 : .43);
      const scale = Math.min(width * (mobile ? .34 : .205), height * (mobile ? .23 : .34));
      const spin = elapsed * .065 + tiltX * .14;
      const pitch = .5 + tiltY * .12;
      const roll = -.19;
      const project = (p: Point) => {
        const x = p.x * Math.cos(spin) + p.z * Math.sin(spin);
        const z = -p.x * Math.sin(spin) + p.z * Math.cos(spin);
        const y = p.y * Math.cos(pitch) - z * Math.sin(pitch);
        const depth = p.y * Math.sin(pitch) + z * Math.cos(pitch);
        const perspective = 3.6 / (3.6 + depth);
        return { x: cx + (x * Math.cos(roll) - y * Math.sin(roll)) * scale * perspective,
          y: cy + (x * Math.sin(roll) + y * Math.cos(roll)) * scale * perspective,
          depth, perspective };
      };
      // Quiet signal traces continue across the background, below the reading area.
      for (let line = 0; line < 9; line++) {
        context.beginPath();
        for (let x = 0; x <= width; x += 14) {
          const y = height * .87 + Math.sin(x / width * 6 + elapsed * .1 + line * .08) * (30 + line * 3) + line * 7;
          if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = 'rgba(255,255,255,0.045)';
        context.lineWidth = .7;
        context.stroke();
      }
      const columns = mobile ? 64 : 92;
      const rows = mobile ? 6 : 9;
      for (let band = 0; band < 3; band++) {
        for (let row = 0; row < rows; row++) {
          let previous: ReturnType<typeof project> | undefined;
          for (let column = 0; column <= columns; column++) {
            const u = column / columns, v = row / (rows - 1);
            const a = pointAt(u, v, band, previousMode, elapsed);
            const b = pointAt(u, v, band, currentMode, elapsed);
            const p = project({ x: a.x + (b.x - a.x) * blend, y: a.y + (b.y - a.y) * blend, z: a.z + (b.z - a.z) * blend });
            const alpha = Math.max(.12, Math.min(.85, .5 - p.depth * .24));
            if (previous && (currentMode !== 0 || morph < 1)) {
              context.beginPath(); context.moveTo(previous.x, previous.y); context.lineTo(p.x, p.y);
              context.strokeStyle = `rgba(255,255,255,${alpha * .42})`;
              context.lineWidth = row === 0 || row === rows - 1 ? .9 : .5;
              context.stroke();
            }
            context.beginPath();
            context.arc(p.x, p.y, Math.max(.4, (row % 3 === 0 ? 1.1 : .65) * p.perspective), 0, TAU);
            context.fillStyle = `rgba(255,255,255,${alpha})`;
            context.fill();
            previous = p;
          }
        }
      }
      if (moving && visible && !document.hidden) frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (disposed || frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const rect = section.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      start();
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = section.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - .5;
      pointerY = (event.clientY - rect.top) / rect.height - .5;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; } else start();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(section); resizeObserver.observe(section);
    section.addEventListener('pointermove', pointer, { passive: true });
    section.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', start);
    wake.current = start;
    resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      section.removeEventListener('pointermove', pointer); section.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', start);
      wake.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="transformation-canvas" aria-hidden="true" />;
}
