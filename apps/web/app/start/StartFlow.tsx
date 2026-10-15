"use client";

import Link from "next/link";
import { useState } from "react";
import { WardMap } from "@/components/WardMap";
import { demoAddress, jurisdictionChain } from "@/lib/data";
import styles from "./start.module.css";

type Q = { id: string; question: string; help?: string; options: string[] };

const questions: Q[] = [
  { id: "what", question: "What are you opening?", options: ["Bakery", "Café", "Kirana or general store", "Salon", "Mobile and electronics", "Something else"] },
  { id: "bake", question: "Will you make food on the premises?", help: "This decides your FSSAI category and whether the pollution board needs to hear from you.", options: ["Yes, we bake or cook here", "No, we only sell packed food", "No food"] },
  { id: "area", question: "How big is the shop floor?", help: "Trade licence fees are charged per square foot.", options: ["Under 300 sq ft", "300 to 1,000 sq ft", "Over 1,000 sq ft"] },
  { id: "road", question: "How wide is the road in front?", help: "In Telangana, a wider road means a higher rate per square foot.", options: ["Up to 20 ft", "20 to 30 ft", "Wider than 30 ft"] },
  { id: "staff", question: "How many people will work there?", options: ["Just me", "1 to 5", "6 to 10", "More than 10"] },
  { id: "turnover", question: "Expected sales in the first year?", options: ["Under ₹20 lakh", "₹20 lakh to ₹1.5 crore", "Over ₹1.5 crore"] },
  { id: "extras", question: "Anything else that applies?", options: ["Weighing scale", "Board facing the street", "LPG cylinders", "Basement space"] },
];

const defaults: Record<string, string[]> = {
  what: ["Bakery"],
  bake: ["Yes, we bake or cook here"],
  area: ["300 to 1,000 sq ft"],
  road: ["Wider than 30 ft"],
  staff: ["1 to 5"],
  turnover: ["₹20 lakh to ₹1.5 crore"],
  extras: ["Weighing scale", "Board facing the street"],
};

export function StartFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>(defaults);

  function toggle(q: Q, opt: string) {
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      if (q.id === "extras") {
        return { ...a, [q.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] };
      }
      return { ...a, [q.id]: [opt] };
    });
  }

  const count = 6 + (answers.extras?.length ?? 0) + (answers.bake?.[0]?.startsWith("Yes") ? 1 : 0);

  return (
    <div className={styles.flow}>
      <ol className={styles.progress} aria-label="Steps">
        <li data-on={step >= 1 ? "" : undefined} aria-current={step === 1 ? "step" : undefined}>
          Where
        </li>
        <li data-on={step >= 2 ? "" : undefined} aria-current={step === 2 ? "step" : undefined}>
          What
        </li>
        <li>Plan</li>
      </ol>

      {step === 1 && (
        <section className={styles.panel} aria-labelledby="where">
          <div className={styles.whereGrid}>
            <div>
              <h1 id="where" className={styles.title}>
                Is this the right place?
              </h1>
              <p className={styles.addr}>{demoAddress}</p>
              <ol className={styles.chain}>
                {jurisdictionChain.map((j) => (
                  <li key={j.level}>
                    <span className={styles.chainLevel}>{j.level}</span>
                    <span className={styles.chainName}>{j.name}</span>
                  </li>
                ))}
              </ol>
              <div className={styles.notice} role="note">
                <strong>You are 40 m from the GHMC boundary.</strong> Rules and fees differ across it. Check the pin sits on your
                shop before you continue.
              </div>
              <label className={styles.check}>
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                <span>The pin is on my shop</span>
              </label>
              <div className={styles.actions}>
                <button className="btn btn-primary" disabled={!confirmed} onClick={() => setStep(2)}>
                  Continue to my business
                </button>
                <Link href="/" className="btn btn-ghost">
                  Change the address
                </Link>
              </div>
            </div>
            <WardMap />
          </div>
        </section>
      )}

      {step === 2 && (
        <section className={styles.panel} aria-labelledby="what">
          <h1 id="what" className={styles.title}>
            Tell us about the business
          </h1>
          <p className={styles.sub}>We only ask what changes the licences you need. You can change any answer later.</p>
          <div className={styles.questions}>
            {questions.map((q) => (
              <fieldset key={q.id} className={styles.q}>
                <legend className={styles.qTitle}>{q.question}</legend>
                {q.help && <p className={styles.qHelp}>{q.help}</p>}
                <div className={styles.options}>
                  {q.options.map((o) => {
                    const on = answers[q.id]?.includes(o) ?? false;
                    return (
                      <button
                        key={o}
                        type="button"
                        className={styles.option}
                        aria-pressed={on}
                        onClick={() => toggle(q, o)}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className={styles.dock}>
            <p>
              <span className="num">{count}</span> approvals likely so far
            </p>
            <div className={styles.dockActions}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <Link href="/plan" className="btn btn-primary">
                Build my permit plan
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
