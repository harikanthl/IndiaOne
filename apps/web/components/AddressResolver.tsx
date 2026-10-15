"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { demoAddress, jurisdictionChain, plan } from "@/lib/data";
import styles from "./AddressResolver.module.css";

type Phase = "typing" | "resolving" | "done";

const requiredCount = plan.filter((p) => p.status === "required").length;

// The one orchestrated moment on the landing page: the address types itself,
// then the jurisdiction chain resolves one level at a time.
export function AddressResolver() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [level, setLevel] = useState(0);
  const touched = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(demoAddress);
      setLevel(jurisdictionChain.length);
      setPhase("done");
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      if (touched.current) return;
      i += 1;
      setText(demoAddress.slice(0, i));
      if (i < demoAddress.length) {
        timer = setTimeout(type, 28 + Math.random() * 40);
      } else {
        setPhase("resolving");
        let l = 0;
        const step = () => {
          l += 1;
          setLevel(l);
          if (l < jurisdictionChain.length) timer = setTimeout(step, 320);
          else timer = setTimeout(() => setPhase("done"), 260);
        };
        timer = setTimeout(step, 380);
      }
    };
    timer = setTimeout(type, 700);
    return () => clearTimeout(timer);
  }, []);

  function onChange(v: string) {
    touched.current = true;
    setText(v);
    setLevel(v.trim().length > 6 ? jurisdictionChain.length : 0);
    setPhase(v.trim().length > 6 ? "done" : "typing");
  }

  return (
    <div className={styles.panel}>
      <form
        className={styles.field}
        action="/start"
        onSubmit={(e) => {
          if (!text.trim()) e.preventDefault();
        }}
      >
        <label htmlFor="addr" className={styles.label}>
          Where are you opening?
        </label>
        <div className={styles.inputRow}>
          <svg className={styles.pin} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="2.6" fill="currentColor" />
          </svg>
          <input
            id="addr"
            name="addr"
            className={styles.input}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Address, PIN code or DIGIPIN"
            autoComplete="street-address"
          />
          {phase === "typing" && !touched.current && <span className={styles.caret} aria-hidden="true" />}
        </div>
      </form>

      <ol className={styles.chain} aria-live="polite">
        {jurisdictionChain.map((j, i) => (
          <li key={j.level} className={styles.link} data-on={i < level ? "" : undefined}>
            <span className={styles.level}>{j.level}</span>
            <span className={styles.name}>{j.name}</span>
            <span className={styles.code}>{j.code}</span>
          </li>
        ))}
      </ol>

      <div className={styles.result} data-on={phase === "done" ? "" : undefined}>
        <p className={styles.count}>
          <span className="num">{plan.length}</span> approvals checked for a bakery here.{" "}
          <span className="num">{requiredCount}</span> are required.
        </p>
        <Link href="/plan" className="btn btn-primary">
          See the permit plan
        </Link>
      </div>
    </div>
  );
}
