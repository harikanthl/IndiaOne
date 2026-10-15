// Art slots. Each slot maps to an open-licensed image in /public/art (full records in credits.json).
export type ArtEntry = {
  src: string;
  alt: string;
  credit: string;
  width: number;
  height: number;
  position?: string;
  /** "contain" shows the whole artwork on a matching backdrop instead of cropping it. */
  fit?: "cover" | "contain";
  backdrop?: string;
};

export const art: Record<string, ArtEntry | undefined> = {
  bazaar: {
    src: "/art/hyderabad-nobles-elephant-procession-cropped.jpg",
    alt: "A painted procession in Hyderabad: three noblemen on a decorated elephant, followed by rows of attendants and soldiers.",
    credit: "Attributed to Venkatchellum, Three Noblemen in Procession on an Elephant. Hyderabad, c. 1790.",
    width: 1895,
    height: 1455,
    position: "50% 14%",
  },
  sweets: {
    src: "/art/company-school-confectioners-shop-patna-cropped.jpg",
    alt: "A sweet-maker's shop in Patna: a cook stirs a large pan while customers buy sweets from trays on the counter.",
    credit: "Confectioner's Shop. Patna, 19th century.",
    width: 1790,
    height: 1340,
    position: "50% 55%",
  },
  scribe: {
    src: "/art/deccan-ruler-presents-document.jpg",
    alt: "A Deccani ruler seated on a terrace hands a document to visiting nobles while attendants look on.",
    credit: "A Ruler Presents a Document to Visiting Nobles. Deccan, c. 1700–1720.",
    width: 2000,
    height: 1378,
    position: "55% 60%",
  },
  scroll: {
    src: "/art/company-school-weaving-and-spinning.jpg",
    alt: "A weaver works a loom while a woman spins thread on a wheel beside him.",
    credit: "Kehar Singh, Weaving and Spinning. Punjab, c. 1860.",
    width: 1832,
    height: 2000,
    position: "50% 60%",
  },
  court: {
    src: "/art/company-school-greengrocer-kunjra.jpg",
    alt: "A greengrocer sits at his stall under a thatched awning, piled with melons and gourds, serving a customer.",
    credit: "Greengrocer, from the Tashrih al-aqvam. Hansi, 1825.",
    width: 1416,
    height: 2000,
    position: "50% 45%",
  },
  pichvai: {
    src: "/art/interim-blockprint-cloth.jpg",
    alt: "",
    credit: "Block-printed cotton with gold leaf. India, 1800s.",
    width: 1000,
    height: 740,
  },
  residency: {
    src: "/art/hyderabad-residency-deen-dayal-1889-cropped.jpg",
    alt: "A tree-lined drive leading to the columned British Residency in Hyderabad.",
    credit: "Lala Deen Dayal, The Residency. Hyderabad, 1889.",
    width: 1860,
    height: 1333,
  },
  dyer: {
    src: "/art/company-school-cloth-dyer-lucknow-cropped.jpg",
    alt: "A cloth dyer kneels beside pots of dye, wringing out red cloth, with dyed lengths hanging behind him.",
    credit: "A Cloth Dyer. Lucknow, 1830s.",
    width: 1440,
    height: 1840,
    position: "50% 75%",
  },
  grain: {
    src: "/art/company-school-grain-seller-cropped.jpg",
    alt: "A grain seller weighs grain on a hand-held balance for a customer, baskets of grain around them.",
    credit: "A Grain Seller. Patna, 1819.",
    width: 841,
    height: 563,
  },
  roads: {
    src: "/art/hyderabad-three-roads-painting-cropped.jpg",
    alt: "Riders, soldiers and elephants travel along three winding roads across a pink landscape.",
    credit: "The Three Roads. Hyderabad, c. 1840.",
    width: 1226,
    height: 1420,
    position: "50% 30%",
  },
  merchants: {
    src: "/art/company-school-cloth-merchants-shop-cropped.jpg",
    alt: "Cloth merchants in a shop under a striped awning, bolts of cloth stacked behind them, a customer at the counter.",
    credit: "Basarat, Cloth Merchants' Shop. c. 1850.",
    width: 1290,
    height: 882,
  },
  printer: {
    src: "/art/company-school-cloth-block-printer-cropped.jpg",
    alt: "A block printer sits cross-legged, stamping patterns onto green cloth, pots of colour beside him.",
    credit: "Cloth Block-Printer, from the Tashrih al-aqvam. Hansi, 1825.",
    width: 1286,
    height: 1876,
    position: "50% 60%",
  },
};
