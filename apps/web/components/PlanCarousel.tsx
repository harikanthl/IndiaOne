"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { art } from "@/lib/art";
import styles from "./PlanCarousel.module.css";

type Stamp = { label: string; kind: "required" | "conditional" | "not_required" | "confirm" };

const cards: { art: string; name: string; place: string; body: string; checked: number; fees: string; stamps: Stamp[] }[] = [
  {
    art: "sweets",
    name: "Bakery",
    place: "Madhapur, Cyberabad MC",
    body: "Bakes on site, 4 staff, 600 sq ft on a 40 ft road.",
    checked: 11,
    fees: "₹6,700",
    stamps: [
      { label: "Trade licence", kind: "required" },
      { label: "FSSAI registration", kind: "required" },
      { label: "Fire NOC", kind: "not_required" },
    ],
  },
  {
    art: "grain",
    name: "Kirana store",
    place: "Siddipet Municipality",
    body: "Sells packed food and grain by weight, 1 helper, 250 sq ft.",
    checked: 9,
    fees: "₹1,600",
    stamps: [
      { label: "Trade licence", kind: "required" },
      { label: "Scale stamping", kind: "required" },
      { label: "GST", kind: "conditional" },
    ],
  },
  {
    art: "merchants",
    name: "Cloth shop",
    place: "Charminar zone, GHMC",
    body: "Sarees and dress material, 3 staff, 400 sq ft on a 25 ft lane.",
    checked: 8,
    fees: "₹2,100",
    stamps: [
      { label: "Trade licence", kind: "required" },
      { label: "Shops & Establishments", kind: "required" },
      { label: "Name board", kind: "conditional" },
    ],
  },
  {
    art: "court",
    name: "Vegetable stall",
    place: "Kukatpally zone, Cyberabad MC",
    body: "Fresh produce, family-run, 150 sq ft shopfront.",
    checked: 7,
    fees: "₹650",
    stamps: [
      { label: "Trade licence", kind: "required" },
      { label: "FSSAI registration", kind: "required" },
      { label: "GST", kind: "not_required" },
    ],
  },
  {
    art: "printer",
    name: "Ikat and print studio",
    place: "Pochampally Municipality",
    body: "Handloom weaving and block printing with natural dyes, 6 artisans.",
    checked: 10,
    fees: "₹2,300",
    stamps: [
      { label: "Trade licence", kind: "required" },
      { label: "Pollution board", kind: "confirm" },
      { label: "Udyam", kind: "conditional" },
    ],
  },
];

const stampLabel = { required: "Required", conditional: "Depends", not_required: "Not needed", confirm: "Confirming" };

export function PlanCarousel() {
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; left: number; t: number; lastX: number; lastT: number; moved: boolean } | null>(null);

  // The card nearest the track's left edge is the active one.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const items = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
        const left = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft);
        let best = 0;
        let bestD = Infinity;
        items.forEach((it, i) => {
          const d = Math.abs(it.getBoundingClientRect().left - left);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    setActive(clamped);
    const item = el.querySelectorAll<HTMLElement>("[data-card]")[clamped];
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  }

  // Mouse drag with momentum. Touch uses native scrolling, which already has it.
  function onPointerDown(e: React.PointerEvent<HTMLOListElement>) {
    if (e.pointerType !== "mouse" || !track.current) return;
    const el = track.current;
    drag.current = { x: e.clientX, left: el.scrollLeft, t: performance.now(), lastX: e.clientX, lastT: performance.now(), moved: false };
    el.setPointerCapture(e.pointerId);
    el.dataset.dragging = "";
  }
  function onPointerMove(e: React.PointerEvent<HTMLOListElement>) {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
    d.lastX = e.clientX;
    d.lastT = performance.now();
  }
  function onPointerUp(e: React.PointerEvent<HTMLOListElement>) {
    const d = drag.current;
    const el = track.current;
    if (!d || !el) return;
    drag.current = null;
    delete el.dataset.dragging;
    el.releasePointerCapture(e.pointerId);
    const dt = Math.max(1, performance.now() - d.t);
    const velocity = (e.clientX - d.x) / dt; // px per ms
    // A quick flick is enough to move one card, regardless of distance.
    if (Math.abs(velocity) > 0.11) go(active + (velocity < 0 ? 1 : -1));
    else go(active);
  }

  return (
    <div className={styles.carousel}>
      <ol
        ref={track}
        className={styles.track}
        aria-label="Sample permit plans"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault();
        }}
      >
        {cards.map((c, i) => {
          const a = art[c.art]!;
          return (
            <li key={c.name} data-card className={styles.card} data-active={i === active ? "" : undefined} aria-current={i === active ? "true" : undefined}>
              <div className={styles.cardArt}>
                <Image
                  src={a.src}
                  alt={a.alt}
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 82vw, 380px"
                  style={{ objectFit: "cover", objectPosition: a.position ?? "center" }}
                />
                <span className={styles.count}>
                  <span className="num">{c.checked}</span> checked
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{c.name}</h3>
                <p className={styles.cardPlace}>{c.place}</p>
                <p className={styles.cardText}>{c.body}</p>
                <ul className={styles.stamps}>
                  {c.stamps.map((s, j) => (
                    <li key={s.label} style={{ ["--i" as string]: j }}>
                      <span className={styles.stampName}>{s.label}</span>
                      <span className={`stamp stamp-${s.kind} ${styles.stamp}`}>{stampLabel[s.kind]}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.cardFoot}>
                  <span>
                    Official fees <strong className="num">{c.fees}</strong>
                  </span>
                  <Link href="/plan" className={styles.cardLink} draggable={false}>
                    Open plan
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
        <li className={styles.spacer} aria-hidden="true" />
      </ol>
      <div className={`wrap ${styles.controls}`}>
        <div className={styles.dots} aria-hidden="true">
          {cards.map((c, i) => (
            <span key={c.name} data-on={i === active ? "" : undefined} />
          ))}
        </div>
        <p className={styles.counter} aria-live="polite">
          <span className="num">{active + 1}</span> of <span className="num">{cards.length}</span>
        </p>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous plan">
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <path d="M12.5 4.5L7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className={styles.arrow} onClick={() => go(active + 1)} disabled={active === cards.length - 1} aria-label="Next plan">
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <path d="M7.5 4.5L13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
