import Image from "next/image";
import Link from "next/link";
import { AddressResolver } from "@/components/AddressResolver";
import { HeroCopy } from "@/components/HeroCopy";
import { FileJourney } from "@/components/FileJourney";
import { Art } from "@/components/Art";
import { files, ladder, offices } from "@/lib/data";
import { art } from "@/lib/art";
import { PlanCarousel } from "@/components/PlanCarousel";
import { StampWord } from "@/components/StampWord";
import styles from "./home.module.css";

const steps = [
  { art: "residency", title: "Where", body: "Type the address, PIN code or DIGIPIN. We find the exact corporation, zone and ward, even after a boundary change." },
  { art: "dyer", title: "What", body: "Answer a few plain questions about your business. Only the ones that change what you need." },
  { art: "grain", title: "Plan", body: "Every licence that applies, with the official fee worked out, the law behind it and the published timeline." },
  { art: "roads", title: "Track", body: "One page for every file. See which desk it is at, for how long, and what happens next if it stalls." },
];

const promises = [
  { title: "Only the official fee", body: "Each fee shows its formula and the order it comes from. Anything more is a red flag, and we tell you so." },
  { title: "Nothing to buy", body: "No paid priority, no agents, no faster lane. The queue is the queue." },
  { title: "Report privately", body: "Asked for money? Record it, keep the evidence, and choose when it goes to the Anti-Corruption Bureau." },
  { title: "Offices, not people", body: "We publish how each office performs. Allegations about individuals go only to bodies that can act on them." },
];

export default function Home() {
  const stalled = files[0];
  const worst = [...offices].sort((a, b) => b.overSla - a.overSla).slice(0, 4);

  return (
    <>
      <section className={styles.hero}>
        <div className={`wrap ${styles.heroGrid}`}>
          <HeroCopy />
          <figure className={styles.heroStage}>
            <div className={styles.stage}>
              <Image src={art.pichvai!.src} alt="" fill priority sizes="(max-width: 920px) 100vw, 46vw" className={styles.stageArt} />
              <div className={styles.fileCover}>
                <span className={styles.fileTab}>New business file</span>
                <AddressResolver />
                <span className={styles.tape} aria-hidden="true" />
              </div>
            </div>
            <figcaption className={styles.stageCredit}>On block-printed cotton, India, 1800s.</figcaption>
          </figure>
        </div>
      </section>

      <Art file="bazaar" variant="band" />

      <section className={`wrap ${styles.section}`} aria-labelledby="how">
        <h2 id="how" className={styles.h2}>
          From an address to an open shutter
        </h2>
        <ol className={styles.steps}>
          {steps.map((s, i) => {
            const a = art[s.art]!;
            return (
            <li key={s.title} className={styles.step}>
              <div className={styles.stepArt}>
                <Image src={a.src} alt={a.alt} title={a.credit} fill sizes="(max-width: 520px) 100vw, (max-width: 860px) 50vw, 25vw" style={{ objectFit: "cover", objectPosition: a.position ?? "center" }} />
              </div>
              <span className={styles.stepNo}>{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.carouselSection} aria-labelledby="plans">
        <div className="wrap">
          <h2 id="plans" className={styles.h2}>
            Every kind of shop, its own plan
          </h2>
          <p className={styles.lede}>Sample plans from the Telangana pilot. Swipe or drag through them.</p>
        </div>
        <PlanCarousel />
      </section>

      <section className={styles.stallSection} aria-labelledby="stall">
        <div className={`wrap ${styles.stallGrid}`}>
          <div>
            <h2 id="stall" className={styles.h2}>
              When a file sits on one desk, it goes up the ladder.
            </h2>
            <p className={styles.lede}>
              Most delays are not the law. They are one desk holding one file. We count the days against the published timeline,
              draft every escalation for you, and keep a tamper-proof record of who had it and when.
            </p>
            <div className={styles.stallCard}>
              <div className={styles.stallHead}>
                <div>
                  <h3>{stalled.name}</h3>
                  <p>{stalled.authority}</p>
                </div>
                <span className="stamp stamp-stalled">Stalled</span>
              </div>
              <FileJourney file={stalled} />
            </div>
          </div>
          <ol className={styles.ladder}>
            {ladder.map((l) => (
              <li key={l.title} className={styles.rung} data-state={l.state}>
                <span className={styles.rungDay}>
                  Day <span className="num">{l.day}</span>
                </span>
                <div>
                  <h3>{l.title}</h3>
                  <p>{l.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <StampWord />

      <section className={`wrap ${styles.section}`} aria-labelledby="promise">
        <div className={styles.promiseGrid}>
          <div>
            <h2 id="promise" className={styles.h2}>
              Built so the honest path is the easy one
            </h2>
            <Art file="scribe" variant="inset" />
          </div>
          <dl className={styles.promises}>
            {promises.map((p) => (
              <div key={p.title} className={styles.promise}>
                <dt>{p.title}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`wrap ${styles.section}`} aria-labelledby="records">
        <div className={styles.recordsHead}>
          <h2 id="records" className={styles.h2}>
            Which offices keep their word
          </h2>
          <Link href="/offices" className="btn btn-ghost">
            Open office records
          </Link>
        </div>
        <ul className={styles.records}>
          {worst.map((o) => (
            <li key={o.office} className={styles.record}>
              <span className={styles.recordName}>{o.office}</span>
              <span className={styles.recordBar} aria-hidden="true">
                <span style={{ width: `${o.overSla}%` }} data-bad={o.overSla > 40 ? "" : undefined} />
              </span>
              <span className={styles.recordPct}>
                <span className="num">{o.overSla}%</span> of {o.service === "Trade licence" ? "trade licences" : "FSSAI registrations"} late
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.openSection} aria-labelledby="open">
        <div className={`wrap ${styles.openGrid}`}>
          <div>
            <h2 id="open" className={styles.h2}>
              Built in the open, by people who have stood in that queue.
            </h2>
            <p className={styles.lede}>
              Engineers, lawyers, CAs, translators, GIS people and shopkeepers. Verify a rule for your town, translate a screen,
              or write the adapter for your municipality.
            </p>
            <div className={styles.openActions}>
              <a className="btn btn-primary" href="https://github.com/harikanthl/IndiaOne">
                Contribute on GitHub
              </a>
              <Link className="btn btn-ghost" href="/start">
                Try the planner
              </Link>
            </div>
          </div>
          <Art file="scroll" variant="tall" />
        </div>
      </section>
    </>
  );
}
