import Image from "next/image";
import { art } from "@/lib/art";
import styles from "./Art.module.css";

type Variant = "band" | "inset" | "tall" | "plate";

export function Art({ file, variant = "inset", priority = false }: { file: string; variant?: Variant; priority?: boolean }) {
  const a = art[file];
  if (!a) {
    return <div className={styles.placeholder} data-variant={variant} aria-hidden="true" />;
  }
  return (
    <figure className={styles.figure} data-variant={variant}>
      <div className={styles.frame}>
        <Image
          src={a.src}
          alt={a.alt}
          fill
          priority={priority}
          sizes={variant === "band" ? "100vw" : "(max-width: 860px) 100vw, 40vw"}
          style={{ objectFit: "cover", objectPosition: a.position ?? "center" }}
        />
      </div>
      <figcaption className={styles.caption}>{a.credit}</figcaption>
    </figure>
  );
}
