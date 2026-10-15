"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StampWord.module.css";

const words = [
  { text: "Approved", lang: "en", name: "English", font: "var(--font-display)" },
  { text: "ఆమోదం", lang: "te", name: "Telugu", font: "var(--font-te)" },
  { text: "स्वीकृत", lang: "hi", name: "Hindi", font: "var(--font-hi)" },
  { text: "ஒப்புதல்", lang: "ta", name: "Tamil", font: "var(--font-ta)" },
  { text: "ಅನುಮೋದನೆ", lang: "kn", name: "Kannada", font: "var(--font-kn)" },
  { text: "অনুমোদিত", lang: "bn", name: "Bangla", font: "var(--font-bn)" },
];

// One kinetic moment: the approval stamp lands, in every script India's offices work in.
// Runs only while on screen; holds still for reduced motion.
export function StampWord() {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [live]);

  const w = words[i];
  return (
    <section ref={root} className={styles.section} aria-labelledby="stamp-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <h2 id="stamp-title" className={styles.title}>
            The word every shopkeeper is waiting for
          </h2>
          <p className={styles.lede}>
            In whichever language your office works in. We cannot stamp it for you, but we can make sure nothing stands between
            you and it except the law.
          </p>
        </div>
        <div className={styles.stage} aria-live="off">
          <div key={i} className={styles.stamp} data-live={live ? "" : undefined} lang={w.lang} style={{ fontFamily: w.font }}>
            <span className={styles.word}>{w.text}</span>
            <span className={styles.meta}>
              <span>Trade licence</span>
              <span className="num">14 Oct 2026</span>
            </span>
          </div>
          <p className={styles.lang}>
            {w.name}
            <span className="visually-hidden">: {w.text}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
