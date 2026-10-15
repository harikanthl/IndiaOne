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
    credit: "Attributed to Venkatchellum, Three Noblemen in Procession on an Elephant, Hyderabad, c. 1790. The Metropolitan Museum of Art, CC0.",
    width: 1895,
    height: 1455,
    position: "50% 14%",
  },
  sweets: {
    src: "/art/company-school-confectioners-shop-patna-cropped.jpg",
    alt: "A sweet-maker's shop in Patna: a cook stirs a large pan while customers buy sweets from trays on the counter.",
    credit: "Confectioner's Shop, Patna School, 19th century. Honolulu Museum of Art, public domain.",
    width: 1790,
    height: 1340,
    position: "50% 55%",
  },
  scribe: {
    src: "/art/deccan-ruler-presents-document.jpg",
    alt: "A Deccani ruler seated on a terrace hands a document to visiting nobles while attendants look on.",
    credit: "A Ruler Presents a Document to Visiting Nobles, Deccan, c. 1700–1720. The Cleveland Museum of Art, CC0.",
    width: 2000,
    height: 1378,
    position: "55% 60%",
  },
  scroll: {
    src: "/art/company-school-weaving-and-spinning.jpg",
    alt: "A weaver works a loom while a woman spins thread on a wheel beside him.",
    credit: "Kehar Singh, Weaving and Spinning, c. 1860. The Cleveland Museum of Art, CC0.",
    width: 1832,
    height: 2000,
    position: "50% 60%",
  },
  court: {
    src: "/art/company-school-greengrocer-kunjra.jpg",
    alt: "A greengrocer sits at his stall under a thatched awning, piled with melons and gourds, serving a customer.",
    credit: "Greengrocer, from Tashrih al-aqvam, 1825. British Library, CC0.",
    width: 1416,
    height: 2000,
    position: "50% 45%",
  },
  textile: {
    src: "/art/hyderabad-kalamkari-pichvai-strip.jpg",
    alt: "",
    credit: "Pichvai with Ladies under the Tree Motif, Hyderabad, c. 1820–30. Art Institute of Chicago, CC0.",
    width: 1140,
    height: 536,
  },
};
