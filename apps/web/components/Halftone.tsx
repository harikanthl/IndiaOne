"use client";

import { useEffect, useRef } from "react";

// Reprints an image as a newspaper halftone: one ink dot per cell on a 45° screen,
// dot area proportional to how dark the picture is there. Drawn once per size/theme.
export function Halftone({
  src,
  className,
  cell = 6,
  color = "--ink",
  position = [0.5, 0.5],
}: {
  src: string;
  className?: string;
  cell?: number;
  color?: string;
  position?: [number, number];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let img: HTMLImageElement | null = null;
    let frame = 0;

    const render = () => {
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // object-fit: cover into a CSS-pixel sized sample buffer
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      const sample = document.createElement("canvas");
      sample.width = w;
      sample.height = h;
      const sx = sample.getContext("2d", { willReadFrequently: true })!;
      sx.drawImage(img, (w - iw) * position[0], (h - ih) * position[1], iw, ih);
      const px = sx.getImageData(0, 0, w, h).data;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue(color).trim() || "#000";
      const c = Math.SQRT1_2, max = cell * 0.62;
      const reach = Math.hypot(w, h);
      ctx.beginPath();
      for (let v = -reach; v < reach; v += cell) {
        for (let u = -reach; u < reach; u += cell) {
          const x = (u - v) * c, y = (u + v) * c;
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const i = ((y | 0) * w + (x | 0)) * 4;
          const lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
          const r = max * Math.sqrt(1 - lum);
          if (r < 0.35) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };

    // Only fetch the picture once the footer is close to view.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || img) return;
        io.disconnect();
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          img = im;
          schedule();
        };
        im.src = `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;
      },
      { rootMargin: "600px" },
    );
    const ro = new ResizeObserver(schedule);
    const mo = new MutationObserver(schedule);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    io.observe(canvas);
    ro.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    mq.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", schedule);
    };
  }, [src, cell, color, position[0], position[1]]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
