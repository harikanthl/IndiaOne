import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const metadata: Metadata = { title: "Art credits | India Business One" };

type Credit = {
  file: string;
  title: string;
  artist: string;
  date: string;
  institution: string;
  source_url: string;
  licence: string;
  attribution_text?: string;
};

async function loadCredits(): Promise<Credit[]> {
  try {
    const raw = await readFile(path.join(process.cwd(), "public/art/credits.json"), "utf8");
    return JSON.parse(raw) as Credit[];
  } catch {
    return [];
  }
}

export default async function CreditsPage() {
  const credits = await loadCredits();
  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Art credits</h1>
        <p>Every artwork on this site is public domain or openly licensed. Thank you to the museums that share their collections.</p>
      </header>
      {credits.length === 0 ? (
        <p>No artwork has been added yet.</p>
      ) : (
        <ul style={{ display: "grid", gap: 18, padding: 0, listStyle: "none", maxWidth: "72ch" }}>
          {credits.map((c) => (
            <li key={c.file} style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
              <strong>{c.title}</strong>
              <div style={{ color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
                {c.artist}, {c.date}. {c.institution}. {c.licence}.{" "}
                {c.source_url && <a href={c.source_url}>Source</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
