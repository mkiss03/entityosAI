import { useEffect, useRef } from "react";

export function ParticleNetwork({ density = 62 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const rand = (a, b) => a + Math.random() * (b - a);

    const points = Array.from({ length: density }).map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: rand(1.2, 2.2),
      phase: rand(0, Math.PI * 2),
    }));

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const p of points) {
        if (!p.x && !p.y) {
          p.x = rand(0, w);
          p.y = rand(0, h);
          p.vx = rand(-0.18, 0.18);
          p.vy = rand(-0.14, 0.14);
        } else {
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const render = (t) => {
      const time = (t || 0) / 1000;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(
        w * 0.5,
        h * 0.35,
        40,
        w * 0.5,
        h * 0.35,
        Math.max(w, h)
      );
      g.addColorStop(0, "rgba(15,23,42,0.0)");
      g.addColorStop(1, "rgba(2,6,23,0.35)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.01;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const maxD = 150;
          if (d2 < maxD * maxD) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / maxD) * 0.22;
            const hueMix = 0.5 + 0.5 * Math.sin(time * 0.35 + (i + j) * 0.03);
            const stroke = `rgba(${Math.round(34 + 183 * hueMix)}, ${Math.round(
              211 - 70 * hueMix
            )}, ${Math.round(238)}, ${alpha})`;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const pulse = 0.6 + 0.4 * Math.sin(p.phase + time * 0.7);
        ctx.fillStyle = `rgba(34,211,238,${0.20 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(217,70,239,${0.10 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(226,232,240,${0.10 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(render);
    };

    raf = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
