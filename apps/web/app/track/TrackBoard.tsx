"use client";

import Link from "next/link";
import { useState } from "react";
import { FileJourney } from "@/components/FileJourney";
import { files, ladder } from "@/lib/data";
import styles from "./track.module.css";

export function TrackBoard() {
  const [sent, setSent] = useState(false);
  const approved = files.filter((f) => f.state === "approved").length;

  return (
    <>
      <div className={styles.overview}>
        <div className={styles.meter} aria-label={`${approved} of ${files.length} approvals done`}>
          {files.map((f) => (
            <span key={f.id} data-state={f.state} />
          ))}
        </div>
        <p>
          <span className="num">{approved}</span> of <span className="num">{files.length}</span> done.{" "}
          <span className={styles.overStalled}>1 file is stalled</span> and needs you.
        </p>
      </div>

      <ol className={styles.files}>
        {files.map((f) => (
          <li key={f.id} className={styles.file} data-state={f.state}>
            <header className={styles.fileHead}>
              <div>
                <h2 className={styles.fileName}>{f.name}</h2>
                <p className={styles.fileMeta}>
                  {f.authority}
                  <span className={styles.ref}>{f.ref}</span>
                </p>
              </div>
              <span className={`stamp stamp-${f.state}`}>{f.stateLabel}</span>
            </header>

            <FileJourney file={f} compact />

            <p className={styles.provenance}>
              <span className={styles.provDot} data-kind={f.provenance} aria-hidden="true" />
              {f.provenance}, {f.synced}
            </p>

            {f.state === "stalled" && (
              <div className={styles.escalate}>
                <h3 className={styles.escTitle}>This file is 6 days past its timeline</h3>
                <ol className={styles.ladder}>
                  {ladder.map((l, i) => {
                    const state = i === 1 && sent ? "sent" : l.state;
                    return (
                      <li key={l.title} data-state={state}>
                        <span className={styles.ladderDay}>
                          Day <span className="num">{l.day}</span>
                        </span>
                        <span className={styles.ladderText}>
                          <strong>{l.title}</strong>
                          <span>{i === 1 && sent ? "Sent today at 10:02 am. Reference ZC/SLG/2026/2231." : l.detail}</span>
                        </span>
                        {state === "sent" && <span className={`stamp stamp-approved ${styles.sentStamp}`}>Sent</span>}
                      </li>
                    );
                  })}
                </ol>
                <div className={styles.escActions}>
                  {!sent ? (
                    <button className="btn btn-danger" onClick={() => setSent(true)}>
                      Send escalation to the Zonal Commissioner
                    </button>
                  ) : (
                    <button className="btn btn-ghost" disabled>
                      Escalation sent
                    </button>
                  )}
                  <button className="btn btn-ghost">Draft an RTI now</button>
                  <Link href="/report" className={styles.reportLink}>
                    Someone asked you for money?
                  </Link>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
