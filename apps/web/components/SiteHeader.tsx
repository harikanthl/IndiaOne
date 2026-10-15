"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";
import { LanguageMenu } from "./Language";

const nav = [
  { href: "/start", label: "Start" },
  { href: "/plan", label: "Permit plan" },
  { href: "/track", label: "Track files" },
  { href: "/offices", label: "Office records" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link href="/" className="home-link" aria-label="India Business One home">
          <Wordmark />
        </Link>
        <nav aria-label="Main">
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
          <Link href="/report" className="report-link">
            Report a bribe demand
          </Link>
        </div>
      </div>
    </header>
  );
}
