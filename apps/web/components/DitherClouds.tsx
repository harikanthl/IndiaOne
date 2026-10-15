"use client";

import { useEffect, useRef } from "react";

// A painted cumulus (sky-clouds.webp) redrawn as ordered (Bayer 8×8) dither, warped by
// fbm so it drifts like weather. One texel is one dither cell:
// the canvas renders at 1/PIXEL resolution and CSS scales it up pixelated.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform vec3 uColor;
uniform float uAlpha;
uniform sampler2D uTex;
uniform float uReady;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

void main() {
  vec2 cell = gl_FragCoord.xy;
  // world space in cells; scrolling lifts the sky slower than the page (parallax)
  vec2 w = vec2(cell.x, cell.y - uScroll);
  vec2 p = w / 120.0;
  float t = uTime;
  p.x += t * 0.018;                       // steady wind
  vec2 warp = vec2(fbm(p * 0.8 + vec2(0.0, t * 0.01)), fbm(p * 0.8 + vec2(4.1, -t * 0.008)));
  // sample the painting, mirrored so it tiles down the page, nudged by the warp
  vec2 tuv = vec2(w.x / uRes.x, w.y / (uRes.x * 0.5625)) + vec2(t * 0.004, 0.0) + (warp - 0.5) * 0.06;
  tuv = 1.0 - abs(mod(tuv, 2.0) - 1.0);
  float lum = texture2D(uTex, tuv).r;
  float d = smoothstep(0.38, 0.85, lum) * uReady;
  // the cursor parts the cloud a little
  vec2 m = (cell - uMouse) / 60.0;
  d *= 1.0 - 0.7 * exp(-dot(m, m));
  // mod keeps the Bayer math small enough for half-float GPUs; the offset keeps clear sky clear
  float on = step(bayer8(mod(cell, 8.0)) + 0.008, d);
  float a = on * uAlpha;
  gl_FragColor = vec4(uColor * a, a);
}`;

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const PIXEL = 3;

function readColor(varName: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = `var(${varName})`;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0];
  probe.remove();
  return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
}

export function DitherClouds({
  className,
  src = "/art/sky-clouds.webp",
  color = "--accent",
  alpha = 0.2,
  parallax = 0.35,
}: {
  className?: string;
  src?: string;
  color?: string;
  alpha?: number;
  /** how fast the sky scrolls relative to the page; 0 for a sky pinned to its own box */
  parallax?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uScroll = u("uScroll"), uMouse = u("uMouse"), uColor = u("uColor"), uAlpha = u("uAlpha"), uReady = u("uReady");
    let ready = 0;
    const tex = gl.createTexture();
    const img = new Image();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
      // NPOT texture: no mipmaps, clamp (the shader mirrors it itself)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = 1;
      if (reduce) draw(performance.now());
    };
    img.src = src;

    let rgb = readColor(color);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, last = 0, visible = !document.hidden, inView = true;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    const t0 = performance.now() - Math.random() * 600000;

    const resize = () => {
      w = Math.ceil(canvas.clientWidth / PIXEL);
      h = Math.ceil(canvas.clientHeight / PIXEL);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    const draw = (now: number) => {
      // ease the cursor so the gap trails it rather than snapping
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uScroll, reduce ? 0 : (window.scrollY * parallax) / PIXEL);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform3f(uColor, rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(uAlpha, alpha);
      gl.uniform1f(uReady, ready);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !inView || now - last < 33) return; // ~30fps is plenty for weather
      last = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / PIXEL;
      mouse.ty = (r.bottom - e.clientY) / PIXEL;
    };
    const onVis = () => (visible = !document.hidden);
    const recolor = () => {
      rgb = readColor(color);
      if (reduce) draw(performance.now());
    };
    const mo = new MutationObserver(recolor);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });

    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    resize();
    ro.observe(canvas);
    io.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    mq.addEventListener("change", recolor);
    document.addEventListener("visibilitychange", onVis);
    if (reduce) draw(performance.now());
    else {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", recolor);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, color, alpha, parallax]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
