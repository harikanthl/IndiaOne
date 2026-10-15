import type { TrackedFile } from "@/lib/data";
import styles from "./FileJourney.module.css";

// A file moving desk to desk. The current desk carries the buff file and the clock.
export function FileJourney({ file, compact = false }: { file: TrackedFile; compact?: boolean }) {
  const over = file.day > file.sla;
  const pct = Math.min(100, (file.day / Math.max(file.sla, file.day)) * 100);
  const slaPct = (file.sla / Math.max(file.sla, file.day)) * 100;

  return (
    <div className={styles.journey} data-compact={compact ? "" : undefined}>
      <ol className={styles.desks} style={{ ["--n" as string]: file.desks.length }}>
        {file.desks.map((d) => (
          <li key={d.name} className={styles.desk} data-state={d.state}>
            <span className={styles.node} aria-hidden="true">
              {d.state === "done" && (
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {d.state === "current" && <FileIcon stalled={over} />}
            </span>
            <span className={styles.deskName}>{d.name}</span>
            {d.date && <span className={styles.deskDate}>{d.date}</span>}
            <span className="visually-hidden">
              {d.state === "done" ? "Completed" : d.state === "current" ? "File is here now" : "Not reached yet"}
            </span>
          </li>
        ))}
      </ol>

      {file.state !== "approved" && (
        <div className={styles.clock} data-over={over ? "" : undefined}>
          <div className={styles.clockText}>
            <span className={styles.clockDay}>
              Day <span className="num">{file.day}</span>
            </span>
            <span className={styles.clockOf}>
              of a <span className="num">{file.sla}</span>-day published timeline
            </span>
            {over && (
              <span className={styles.clockOver}>
                <span className="num">{file.day - file.sla}</span> days over
              </span>
            )}
          </div>
          <div className={styles.bar} aria-hidden="true">
            <span className={styles.barFill} style={{ width: `${pct}%` }} />
            <span className={styles.barSla} style={{ left: `${slaPct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function FileIcon({ stalled }: { stalled: boolean }) {
  return (
    <svg viewBox="0 0 40 32" width="34" height="27" className={styles.fileIcon}>
      <path d="M2 6a3 3 0 0 1 3-3h10l3 3h17a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6Z" fill="var(--buff)" stroke="var(--buff-ink)" strokeWidth="1.4" />
      <path d="M2 11h36" stroke="var(--buff-2)" strokeWidth="1.4" />
      <path
        d="M20 11v19"
        stroke={stalled ? "var(--tape)" : "var(--buff-2)"}
        strokeWidth={stalled ? 3 : 1.4}
      />
      {stalled && <path d="M14 30c2-3 4-4 6-4s4 1 6 4" fill="none" stroke="var(--tape)" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  );
}
