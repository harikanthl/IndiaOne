"use client";

import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.77, 0, 0.175, 1)";

// First visit only: a jungle scene (bushes, a passing peacock, the tiger) around the turning seal.
// Enter sends the seal up into the header logo while the site opens from the button,
// the same ink-spread motion as the theme toggle.
export function Splash() {
  const root = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const enter = useRef<HTMLButtonElement>(null);
  // Only first-time visitors download the scene; everyone else never mounts the images.
  const [scene, setScene] = useState(false);

  useEffect(() => {
    if (!("splash" in document.documentElement.dataset)) return;
    setScene(true);
    enter.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function close() {
    const el = root.current;
    const html = document.documentElement;
    try {
      localStorage.setItem("splash-seen", "1");
    } catch {}
    if (!el || !("splash" in html.dataset) || el.dataset.closing) return;
    el.dataset.closing = "";
    const done = () => {
      delete html.dataset.splash;
      delete el.dataset.closing;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.animate({ opacity: [1, 0] }, { duration: 200, easing: "ease-out" }).finished.then(done);
      return;
    }

    // The seal leaves the splash (which is about to be masked away) as a fixed clone and
    // lands exactly on the header logo, which is the same image. Its ring keeps the angle it had.
    const seal = sealRef.current, mark = document.querySelector<HTMLElement>(".wordmark-mascot");
    if (seal && mark) {
      const a = seal.getBoundingClientRect(), b = mark.getBoundingClientRect();
      const ringAngle = getComputedStyle(seal.querySelector(".splash-seal-ring")!).transform;
      const clone = seal.cloneNode(true) as HTMLDivElement;
      Object.assign(clone.style, { position: "fixed", left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, zIndex: "210", margin: "0", translate: "none", transformOrigin: "0 0", pointerEvents: "none", animation: "none" });
      const ring = clone.querySelector<HTMLElement>(".splash-seal-ring")!;
      Object.assign(ring.style, { animation: "none", transform: ringAngle });
      document.body.appendChild(clone);
      seal.style.visibility = "hidden";
      const s = b.width / a.width;
      // straighten the ring on the way up so it matches the static header logo
      ring.animate([{ transform: ringAngle }, { transform: "none" }], { duration: 640, easing: EASE, fill: "forwards" });
      mark.style.opacity = "0";
      clone
        .animate([{ transform: "none" }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})` }], {
          duration: 640,
          easing: EASE,
          fill: "forwards",
        })
        .finished.then(() => {
          mark.style.opacity = "";
          clone.remove();
          seal.style.visibility = "";
        });
    }

    const r = enter.current!.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    el.style.setProperty("--hole-x", `${x}px`);
    el.style.setProperty("--hole-y", `${y}px`);
    el.animate({ "--hole": ["0px", `${radius}px`] } as PropertyIndexedKeyframes, { duration: 600, easing: EASE, fill: "forwards" }).finished.then(done);
  }

  return (
    <div ref={root} className="splash" role="dialog" aria-modal="true" aria-label="India Business One">
      {scene && (
        <>
          <img src="/mascot/jungle-glow.webp" alt="" className="splash-glow" />
          <img src="/mascot/bush-left.webp" alt="" className="splash-bush splash-bush-l" />
          <img src="/mascot/bush-right.webp" alt="" className="splash-bush splash-bush-r" />
          <img src="/mascot/peacock.webp" alt="" className="splash-peacock" />
          <img src="/mascot/tiger.webp" alt="" className="splash-tiger" width={605} height={809} />
        </>
      )}
      <div className="splash-mark">
        {scene && (
          // only the paisley ring turns; the lotus stays upright
          <div ref={sealRef} className="splash-seal">
            <img src="/brand/seal-ring.webp" alt="" className="splash-seal-ring" />
            <img src="/brand/seal-core.webp" alt="" className="splash-seal-core" />
          </div>
        )}
        <p className="splash-name">
          India Business <b>One</b>
        </p>
        <p className="splash-line">Every licence, every fee, every desk your file sits on.</p>
      </div>
      <button ref={enter} type="button" className="splash-enter" onClick={close}>
        Enter
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
