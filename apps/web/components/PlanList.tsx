"use client";

import { useState } from "react";
import { applicabilityLabel, coverageLabel, plan, type Applicability } from "@/lib/data";
import styles from "@/app/plan/plan.module.css";

const filters: { key: "all" | Applicability | "depends"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "required", label: "Required" },
  { key: "depends", label: "Depends on you" },
  { key: "not_required", label: "Not needed" },
];

function matches(key: string, s: Applicability) {
  if (key === "all") return true;
  if (key === "depends") return s === "conditional" || s === "confirm";
  if (key === "not_required") return s === "not_required" || s === "optional";
  return s === key;
}

export function PlanList() {
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>("trade");
  const items = plan.filter((p) => matches(filter, p.status));

  return (
    <div>
      <div className={styles.filters} role="tablist" aria-label="Filter approvals">
        {filters.map((f) => {
          const n = plan.filter((p) => matches(f.key, p.status)).length;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={styles.filter}
              onClick={() => setFilter(f.key)}
            >
              {f.label} <span className="num">{n}</span>
            </button>
          );
        })}
      </div>

      <ol className={styles.register}>
        {items.map((p) => {
          const isOpen = open === p.id;
          return (
            <li key={p.id} className={styles.row} data-status={p.status} data-open={isOpen ? "" : undefined}>
              <button
                className={styles.rowHead}
                aria-expanded={isOpen}
                aria-controls={`detail-${p.id}`}
                onClick={() => setOpen(isOpen ? null : p.id)}
              >
                <span className={`stamp stamp-${p.status}`}>{applicabilityLabel[p.status]}</span>
                <span className={styles.rowTitle}>
                  <span className={styles.rowName}>{p.name}</span>
                  <span className={styles.rowAuth}>{p.authority}</span>
                </span>
                <span className={styles.rowFee}>{p.fee}</span>
                <svg className={styles.chev} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div id={`detail-${p.id}`} className={styles.detail} hidden={!isOpen}>
                <p className={styles.reason}>{p.reason}</p>
                <dl className={styles.facts}>
                  <div>
                    <dt>Official fee</dt>
                    <dd>
                      <span className="num">{p.fee}</span>
                      {p.feeWorking && <span className={styles.working}>{p.feeWorking}</span>}
                    </dd>
                  </div>
                  <div>
                    <dt>Timeline</dt>
                    <dd>{p.timeline}</dd>
                  </div>
                  <div>
                    <dt>The law</dt>
                    <dd className={styles.law}>{p.law}</dd>
                  </div>
                  <div>
                    <dt>How you apply</dt>
                    <dd>
                      <span className={styles.coverage} data-tier={p.coverage}>
                        {coverageLabel[p.coverage]}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className={styles.verified}>Rule last checked against the source on {p.verified}.</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
