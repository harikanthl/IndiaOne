import type { Metadata } from "next";
import { Art } from "@/components/Art";
import { ReportForm } from "./ReportForm";
import styles from "./report.module.css";

export const metadata: Metadata = { title: "Report a bribe demand | India Business One" };

export default function ReportPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Someone asked you for money</h1>
        <p>
          Record it while it is fresh. You decide who sees it and when. Officers are never named in public, and your details never
          go anywhere without your say.
        </p>
      </header>
      <div className={styles.layout}>
        <ReportForm />
        <aside className={styles.aside}>
          <Art file="court" variant="tall" />
          <ul className={styles.assure}>
            <li>Only you and the office you choose can read the details.</li>
            <li>Each piece of evidence is sealed with a timestamp that cannot be edited.</li>
            <li>Reports count towards the office&rsquo;s public record only once there are at least five.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
