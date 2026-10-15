import Link from "next/link";
import type { Metadata } from "next";
import { PlanList } from "@/components/PlanList";
import { Art } from "@/components/Art";
import { business, demoAddress, jurisdictionChain, plan } from "@/lib/data";
import styles from "./plan.module.css";

export const metadata: Metadata = { title: "Permit plan | India Business One" };

export default function PlanPage() {
  const required = plan.filter((p) => p.status === "required").length;
  const depends = plan.filter((p) => p.status === "conditional" || p.status === "confirm").length;

  return (
    <div className="wrap">
      <header className="page-head">
        <div className="crumbs">
          {jurisdictionChain.slice(2).map((j) => (
            <span key={j.level}>{j.name}</span>
          ))}
        </div>
        <h1>Your permit plan for {business.name}</h1>
        <p>
          {required} approvals are required, {depends} depend on how you run the shop, and the rest you can skip. Every line
          shows the law it comes from.
        </p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.summary} aria-label="Plan summary">
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Your business</h2>
            <dl className={styles.summaryFacts}>
              <div>
                <dt>Address</dt>
                <dd>{demoAddress}</dd>
              </div>
              <div>
                <dt>Activity</dt>
                <dd>{business.activity}</dd>
              </div>
              <div>
                <dt>Premises</dt>
                <dd>
                  <span className="num">{business.area}</span> sq ft on a <span className="num">{business.roadWidth}</span> ft road
                </dd>
              </div>
              <div>
                <dt>Staff and turnover</dt>
                <dd>
                  <span className="num">{business.staff}</span> workers, {business.turnover}
                </dd>
              </div>
            </dl>
            <div className={styles.total}>
              <span className={styles.totalLabel}>Official fees you can count on today</span>
              <span className={styles.totalValue}>₹6,700</span>
              <span className={styles.totalNote}>Plus weighing-scale stamping, which depends on your scales.</span>
            </div>
            <div className={styles.summaryActions}>
              <Link href="/track" className="btn btn-primary">
                Start my applications
              </Link>
              <Link href="/start" className="btn btn-ghost">
                Change my answers
              </Link>
            </div>
          </div>
          <Art file="sweets" variant="plate" />
        </aside>

        <section aria-label="Approvals">
          <PlanList />
          <p className={styles.disclaimer}>
            This plan is guidance built from published rules. The issuing authority makes the final decision. If something here
            looks wrong for your situation, tell us and a reviewer will check it.
          </p>
        </section>
      </div>
    </div>
  );
}
