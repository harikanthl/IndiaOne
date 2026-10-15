"use client";

import { useLang } from "./Language";
import styles from "@/app/home.module.css";

const copy = {
  en: {
    h: "Every licence, every fee, every desk your file sits on.",
    p: "Enter the address where you are opening. See what the law requires there, what it officially costs, and who holds your file until it is approved.",
  },
  te: {
    h: "ప్రతి లైసెన్స్, ప్రతి ఫీజు, మీ ఫైల్ ఉన్న ప్రతి టేబుల్.",
    p: "మీరు వ్యాపారం ప్రారంభించే చిరునామా ఇవ్వండి. అక్కడ చట్టం ఏమి కోరుతుందో, అధికారిక ఫీజు ఎంతో, ఆమోదం వచ్చే వరకు మీ ఫైల్ ఎవరి దగ్గర ఉందో చూడండి.",
  },
};

export function HeroCopy() {
  const { lang } = useLang();
  const c = copy[lang];
  return (
    <div className={styles.heroCopy} lang={lang}>
      <h1 className={styles.heroTitle} data-lang={lang}>
        {c.h}
      </h1>
      <p className={styles.heroSub}>{c.p}</p>
    </div>
  );
}
