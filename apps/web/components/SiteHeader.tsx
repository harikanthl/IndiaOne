"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { LanguageMenu } from "./Language";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/start", label: "Start" },
  { href: "/plan", label: "Permit plan" },
  { href: "/track", label: "Track files" },
  { href: "/offices", label: "Office records" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  // Close the sheet on navigation, Escape, or a tap outside the header.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header className="site-header" ref={root} data-menu-open={open ? "" : undefined}>
      <div className="glass site-header-inner">
        <Link href="/" className="home-link" aria-label="India Business One home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="nav-wide">
          <ul className="nav">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="nav-link" aria-current={path === n.href ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <LanguageMenu />
          <ThemeToggle />
          <Link href="/report" className="report-link">
            Report a bribe demand
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="glass mobile-sheet" hidden={!open}>
        <nav aria-label="Main" className="sheet-inner">
          <ul className="sheet-nav">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="sheet-link" aria-current={path === n.href ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/report" className="sheet-report">
            Report a bribe demand
          </Link>
          <div className="sheet-prefs">
            <LanguageMenu />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
