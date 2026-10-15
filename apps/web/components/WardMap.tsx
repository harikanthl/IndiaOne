import styles from "./WardMap.module.css";

// Stylised, not cartographic: ward outlines around Madhapur with the selected ward inked in.
export function WardMap() {
  return (
    <figure className={styles.map}>
      <svg viewBox="0 0 600 420" role="img" aria-label="Map showing the pin inside Ward 104, Madhapur, near the boundary with GHMC">
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--accent)" strokeWidth="1.4" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="600" height="420" fill="var(--ledger)" />
        {/* roads */}
        <path d="M-10 300 C 120 280, 240 250, 610 190" className={styles.road} />
        <path d="M180 -10 C 210 120, 230 260, 260 430" className={styles.road} />
        <path d="M380 -10 C 360 140, 400 260, 470 430" className={styles.roadMinor} />
        <path d="M-10 120 C 150 140, 330 110, 610 80" className={styles.roadMinor} />
        {/* lake */}
        <path d="M470 300 c 30 -30 90 -20 110 10 c 20 30 -10 70 -50 70 c -40 0 -90 -40 -60 -80 Z" fill="var(--map-water)" />
        {/* neighbouring wards */}
        <path d="M20 30 L200 20 L230 150 L60 190 Z" className={styles.ward} />
        <path d="M200 20 L400 30 L390 140 L230 150 Z" className={styles.ward} />
        <path d="M60 190 L230 150 L250 300 L40 330 Z" className={styles.ward} />
        <path d="M390 140 L560 120 L580 260 L420 290 Z" className={styles.ward} />
        <path d="M40 330 L250 300 L270 410 L30 410 Z" className={styles.ward} />
        {/* corporation boundary */}
        <path d="M400 30 L390 140 L420 290 L470 410" className={styles.boundary} />
        {/* selected ward */}
        <path d="M230 150 L390 140 L420 290 L250 300 Z" fill="url(#hatch)" className={styles.selected} />
        <text x="270" y="200" className={styles.wardLabel}>
          Ward 104
        </text>
        <text x="270" y="222" className={styles.wardSub}>
          Madhapur
        </text>
        <text x="430" y="60" className={styles.otherLabel}>
          GHMC
        </text>
        <text x="300" y="60" className={styles.otherLabel}>
          Cyberabad MC
        </text>
        {/* pin */}
        <g transform="translate(362 236)">
          <circle r="22" fill="var(--accent)" opacity="0.14" className={styles.pulse} />
          <path d="M0 0 c -10 -14 -16 -22 -16 -30 a 16 16 0 1 1 32 0 c 0 8 -6 16 -16 30 Z" fill="var(--accent)" />
          <circle cy="-30" r="6" fill="var(--on-accent)" />
        </g>
      </svg>
      <figcaption className={styles.legend}>
        <span>
          <i className={styles.keySelected} /> Your ward
        </span>
        <span>
          <i className={styles.keyBoundary} /> Corporation boundary
        </span>
        <span className={styles.note}>Boundaries as of 10 Feb 2026 (G.O.Ms.55)</span>
      </figcaption>
    </figure>
  );
}
