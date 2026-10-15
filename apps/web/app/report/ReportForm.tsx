"use client";

import { useState } from "react";
import styles from "./report.module.css";

const kinds = ["Asked for money", "Charged more than the official fee", "Told to use a particular agent", "Kept asking for new documents", "Something else"];
const channels = ["Cash", "UPI to a personal ID", "Through a middleman", "Not paid"];
const routes = [
  { id: "private", title: "Keep it private for now", body: "Saved only to your evidence record. Nothing is sent." },
  { id: "vigilance", title: "Send to the corporation's vigilance officer", body: "The office that supervises the desk holding your file." },
  { id: "acb", title: "Send to the Telangana Anti-Corruption Bureau", body: "They can investigate and set a lawful trap. Toll-free 1064." },
  { id: "count", title: "Only count it, anonymously", body: "Adds to the office's public figures. No details leave your record." },
];

export function ReportForm() {
  const [kind, setKind] = useState(kinds[0]);
  const [channel, setChannel] = useState(channels[1]);
  const [route, setRoute] = useState("acb");
  const [timing, setTiming] = useState<"now" | "after">("after");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className={styles.done} role="status">
        <span className={`stamp stamp-approved ${styles.doneStamp}`}>Recorded</span>
        <h2>Your report is saved. Case IR-2026-00417.</h2>
        <p>
          {timing === "after"
            ? "We will hold it and ask you again the day your trade licence is issued. Nothing has been sent yet."
            : "We are sending it now. You will get the receiving office's reference number here and by SMS."}
        </p>
        <p className={styles.doneNote}>
          Your evidence is sealed with a timestamp that cannot be changed later, even by us. You can export it for the ACB or a
          court at any time.
        </p>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <fieldset className={styles.group}>
        <legend>Which file is this about?</legend>
        <select className={styles.select} defaultValue="trade">
          <option value="trade">Trade licence, Cyberabad MC, TIN CYB/2026/0041187</option>
          <option value="fssai">FSSAI registration, FoSCoS 20926101000318</option>
          <option value="other">A different application</option>
        </select>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>What happened?</legend>
        <div className={styles.chips}>
          {kinds.map((k) => (
            <button key={k} type="button" className={styles.chip} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.pair}>
        <fieldset className={styles.group}>
          <legend>How much was asked?</legend>
          <div className={styles.money}>
            <span>₹</span>
            <input inputMode="numeric" defaultValue="5,000" aria-label="Amount in rupees" />
          </div>
        </fieldset>
        <fieldset className={styles.group}>
          <legend>How did they want it?</legend>
          <div className={styles.chips}>
            {channels.map((c) => (
              <button key={c} type="button" className={styles.chip} aria-pressed={channel === c} onClick={() => setChannel(c)}>
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset className={styles.group}>
        <legend>Anything that shows it happened</legend>
        <p className={styles.help}>Screenshots of messages, the UPI ID they gave you, a note of the date and place. Add what you have.</p>
        <div className={styles.drop}>
          <span>Drop files here or choose from your phone</span>
          <span className={styles.dropFiles}>whatsapp-14-oct.png, upi-id-note.jpg</span>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>Who should receive it?</legend>
        <div className={styles.routes}>
          {routes.map((r) => (
            <label key={r.id} className={styles.route} data-on={route === r.id ? "" : undefined}>
              <input type="radio" name="route" value={r.id} checked={route === r.id} onChange={() => setRoute(r.id)} />
              <span>
                <strong>{r.title}</strong>
                <span>{r.body}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {route !== "private" && route !== "count" && (
        <fieldset className={styles.group}>
          <legend>When should it go?</legend>
          <div className={styles.chips}>
            <button type="button" className={styles.chip} aria-pressed={timing === "after"} onClick={() => setTiming("after")}>
              After my licence is issued
            </button>
            <button type="button" className={styles.chip} aria-pressed={timing === "now"} onClick={() => setTiming("now")}>
              Right now
            </button>
          </div>
          <p className={styles.help}>Waiting protects your application. We will watch your other files for signs of retaliation either way.</p>
        </fieldset>
      )}

      <div className={styles.law} role="note">
        <strong>Do not pay.</strong> Under the Prevention of Corruption Act, giving a bribe is also an offence. If you were forced to
        pay, reporting it to the police or the ACB within 7 days protects you.
      </div>

      <button type="submit" className="btn btn-primary">
        Save my report
      </button>
    </form>
  );
}
