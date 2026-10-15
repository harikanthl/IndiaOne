import type { Metadata } from "next";
import { offices } from "@/lib/data";
import styles from "./offices.module.css";

export const metadata: Metadata = { title: "Office records | India Business One" };

const maxDays = 45;

export default function OfficesPage() {
  const ticks = [0, 15, 30, 45];
  return (
    <div className="wrap">
      <header className="page-head">
        <h1>How long each office takes</h1>
        <p>
          Days from a complete application to a decision, for the pilot offices. These are office figures, never individual
          officers. Bribe reports appear only once there are at least five.
        </p>
      </header>

      <div className={styles.legend} aria-hidden="true">
        <span>
          <i className={styles.keyMedian} /> Half of files done by
        </span>
        <span>
          <i className={styles.keyP90} /> 9 in 10 files done by
        </span>
        <span>
          <i className={styles.keySla} /> Published timeline
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="visually-hidden">Processing times by office, sample data</caption>
          <thead>
            <tr>
              <th scope="col">Office</th>
              <th scope="col" className={styles.plotHead}>
                <span className={styles.axis} aria-hidden="true">
                  {ticks.map((t) => (
                    <span key={t} style={{ left: `${(t / maxDays) * 100}%` }}>
                      {t}
                    </span>
                  ))}
                </span>
                <span className="visually-hidden">Days to decision</span>
              </th>
              <th scope="col" className={styles.numCol}>
                Median
              </th>
              <th scope="col" className={styles.numCol}>
                Late
              </th>
              <th scope="col" className={styles.numCol}>
                Repeat queries
              </th>
              <th scope="col" className={styles.numCol}>
                Bribe reports
              </th>
            </tr>
          </thead>
          <tbody>
            {offices.map((o) => {
              const late = o.medianDays > o.sla;
              return (
                <tr key={o.office}>
                  <th scope="row">
                    <span className={styles.office}>{o.office}</span>
                    <span className={styles.service}>
                      {o.service}, <span className="num">{o.cases}</span> files
                    </span>
                  </th>
                  <td className={styles.plotCell}>
                    <span
                      className={styles.plot}
                      title={`Median ${o.medianDays} days, 90th percentile ${o.p90Days} days, published timeline ${o.sla} days`}
                    >
                      <span className={styles.grid} aria-hidden="true">
                        {ticks.map((t) => (
                          <i key={t} style={{ left: `${(t / maxDays) * 100}%` }} />
                        ))}
                      </span>
                      <span
                        className={styles.range}
                        style={{ left: `${(o.medianDays / maxDays) * 100}%`, width: `${((o.p90Days - o.medianDays) / maxDays) * 100}%` }}
                      />
                      <span className={styles.sla} style={{ left: `${(o.sla / maxDays) * 100}%` }} />
                      <span className={styles.median} data-late={late ? "" : undefined} style={{ left: `${(o.medianDays / maxDays) * 100}%` }} />
                      <span className={styles.p90} style={{ left: `${(Math.min(o.p90Days, maxDays) / maxDays) * 100}%` }} />
                    </span>
                  </td>
                  <td className={styles.numCol}>
                    <span className="num">{o.medianDays}</span> days
                  </td>
                  <td className={styles.numCol}>
                    <span className={styles.status} data-bad={o.overSla > 40 ? "" : undefined}>
                      {o.overSla > 40 && (
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                          <path d="M8 1.5l7 12.5H1z" fill="currentColor" />
                          <path d="M8 6v4M8 11.6v.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      )}
                      <span className="num">{o.overSla}%</span>
                    </span>
                  </td>
                  <td className={styles.numCol}>
                    <span className="num">{o.queryLoops}%</span>
                  </td>
                  <td className={styles.numCol}>{o.reports === null ? <span className={styles.muted}>Under 5</span> : <span className="num">{o.reports}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={styles.method}>
        Sample data for the pilot design. Method: a file counts as late when the decision comes after the published service
        timeline, not counting days the applicant took to answer a query. Data will be downloadable as CSV.
      </p>
    </div>
  );
}
