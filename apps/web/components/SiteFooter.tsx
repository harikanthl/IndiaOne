import Link from "next/link";
import { DitherClouds } from "./DitherClouds";
import { Halftone } from "./Halftone";

const columns = [
  {
    title: "Use it",
    links: [
      { href: "/start", label: "Start a business" },
      { href: "/plan", label: "Permit plan" },
      { href: "/track", label: "Track files" },
      { href: "/offices", label: "Office records" },
    ],
  },
  {
    title: "The project",
    links: [
      { href: "https://github.com/harikanthl/IndiaOne", label: "Source code on GitHub" },
      { href: "https://github.com/harikanthl/IndiaOne/blob/main/CONTRIBUTING.md", label: "Contribute" },
      { href: "/credits", label: "Art credits" },
    ],
  },
];

// One piece: dithered clouds drift behind the links, and the wordmark rests on a lotus pond.
// Light theme shows the painting; dark theme reprints it in halftone.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <DitherClouds className="footer-sky" parallax={0} alpha={0.16} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/art/footer-lotus.webp" alt="" className="footer-art" loading="lazy" decoding="async" />
      <Halftone src="/art/footer-lotus.webp" className="footer-print" position={[0.5, 1]} cell={5} color="--ink-3" />

      <div className="wrap footer-body">
        <div className="footer-lead">
          <h2 className="footer-kicker">About</h2>
          <p>
            India Business One is an independent, open-source citizen project. It is not affiliated with any government body.
            The competent authority makes every decision. Screens show sample data.
          </p>
          <Link href="/report" className="report-link">
            Report a bribe demand
          </Link>
        </div>
        {columns.map((col) => (
          <nav key={col.title} className="footer-col" aria-label={col.title}>
            <h2 className="footer-kicker">{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("http") ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="wrap footer-masthead">
        <p className="footer-title" aria-hidden="true">
          India Business <b>One</b>
        </p>
      </div>

      <div className="wrap footer-colophon">
        <span>Released under the Apache 2.0 licence.</span>
        <span>
          Paintings from public museum collections, plus generated illustrations. <Link href="/credits">Credits</Link>
        </span>
      </div>
    </footer>
  );
}
