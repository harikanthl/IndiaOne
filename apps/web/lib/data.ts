// Demo data for the UI skeleton. Sourced from research/03-pilot-state-telangana.md.
// Ward numbers, people and case IDs are illustrative, not real records.

export type Applicability = "required" | "conditional" | "confirm" | "not_required" | "optional";
export type Coverage = "C0" | "C1" | "C2" | "C3" | "C4";

export const coverageLabel: Record<Coverage, string> = {
  C0: "Not covered yet",
  C1: "Guidance",
  C2: "Guided hand-off",
  C3: "Integrated",
  C4: "Native",
};

export const applicabilityLabel: Record<Applicability, string> = {
  required: "Required",
  conditional: "Depends",
  confirm: "Needs confirmation",
  not_required: "Not required",
  optional: "Optional",
};

export const demoAddress = "Plot 14, Road No. 36, Madhapur, Hyderabad 500081";

export const jurisdictionChain = [
  { level: "State", name: "Telangana", code: "LGD 36" },
  { level: "District", name: "Ranga Reddy", code: "LGD 537" },
  { level: "Local body", name: "Cyberabad Municipal Corporation", code: "Formed 10 Feb 2026" },
  { level: "Zone", name: "Serilingampally", code: "Zone 3" },
  { level: "Ward", name: "Madhapur", code: "Ward 104" },
];

export const business = {
  name: "Sri Lakshmi Bakery",
  owner: "K. Lakshmi",
  activity: "Bakery with in-house baking",
  nic: "NIC 10712, manufacture of bakery products",
  area: 600,
  roadWidth: 40,
  staff: 4,
  turnover: "₹45 lakh a year",
};

export type PlanItem = {
  id: string;
  name: string;
  authority: string;
  status: Applicability;
  reason: string;
  fee: string;
  feeWorking?: string;
  timeline: string;
  law: string;
  coverage: Coverage;
  verified: string;
};

export const plan: PlanItem[] = [
  {
    id: "trade",
    name: "Trade licence (eating establishment)",
    authority: "Cyberabad Municipal Corporation",
    status: "required",
    reason: "Every trade inside the corporation needs one.",
    fee: "₹3,600",
    feeWorking: "600 sq ft × ₹6 (road wider than 30 ft)",
    timeline: "15 days",
    law: "GHMC Act 1955, s.521 and s.622",
    coverage: "C2",
    verified: "2 Oct 2026",
  },
  {
    id: "fssai",
    name: "FSSAI food registration",
    authority: "Food Safety Officer, Ranga Reddy",
    status: "required",
    reason: "You bake and sell food. Turnover is under ₹1.5 crore, so registration is enough.",
    fee: "₹100 a year",
    timeline: "7 days, deemed granted at 30",
    law: "FSS Act 2006, s.31; Licensing Regulations as amended 10 Mar 2026",
    coverage: "C2",
    verified: "28 Sep 2026",
  },
  {
    id: "se",
    name: "Shops & Establishments registration",
    authority: "Telangana Labour Department",
    status: "required",
    reason: "Needed for every shop. 1 to 5 workers puts you in the ₹500 slab.",
    fee: "₹500",
    feeWorking: "4 workers, slab 1–5",
    timeline: "1 working day",
    law: "Telangana Shops & Establishments Act 1988; G.O.Rt.383/2025",
    coverage: "C1",
    verified: "30 Sep 2026",
  },
  {
    id: "gst",
    name: "GST registration",
    authority: "Telangana Commercial Taxes / CBIC",
    status: "required",
    reason: "Goods turnover above ₹20 lakh. Telangana kept the lower threshold.",
    fee: "No fee",
    timeline: "3 to 7 working days",
    law: "CGST Act 2017, s.22",
    coverage: "C1",
    verified: "1 Oct 2026",
  },
  {
    id: "pt",
    name: "Professional tax enrolment",
    authority: "Telangana Commercial Taxes",
    status: "required",
    reason: "You will pay staff more than ₹15,000 a month.",
    fee: "₹2,500 a year",
    timeline: "Same day",
    law: "Telangana Tax on Professions Act 1987",
    coverage: "C1",
    verified: "1 Oct 2026",
  },
  {
    id: "lm",
    name: "Weighing scale stamping",
    authority: "Controller of Legal Metrology",
    status: "required",
    reason: "You sell by weight.",
    fee: "Per instrument, from schedule",
    timeline: "Re-verify every year",
    law: "Legal Metrology Act 2009",
    coverage: "C1",
    verified: "25 Sep 2026",
  },
  {
    id: "sign",
    name: "Name board permission",
    authority: "Cyberabad MC, circle office",
    status: "conditional",
    reason: "Only if your board faces the street. Keep it under 15% of the frontage.",
    fee: "Self-calculated per sq m",
    timeline: "Not published",
    law: "G.O.Ms.68/2020",
    coverage: "C1",
    verified: "20 Sep 2026",
  },
  {
    id: "lmpc",
    name: "Packer registration",
    authority: "Controller of Legal Metrology",
    status: "conditional",
    reason: "Only if you sell pre-packed, labelled goods.",
    fee: "About ₹500",
    timeline: "Not published",
    law: "Legal Metrology (Packaged Commodities) Rules 2011",
    coverage: "C1",
    verified: "20 Sep 2026",
  },
  {
    id: "pcb",
    name: "Pollution board consent",
    authority: "Telangana Pollution Control Board",
    status: "confirm",
    reason: "Depends on daily baking capacity. We are checking Circular 94/2025 with the board.",
    fee: "To be confirmed",
    timeline: "To be confirmed",
    law: "Water Act 1974; Air Act 1981",
    coverage: "C0",
    verified: "Pending field check",
  },
  {
    id: "fire",
    name: "Fire NOC",
    authority: "Telangana Fire Services",
    status: "not_required",
    reason: "Your building is under 15 m.",
    fee: "—",
    timeline: "—",
    law: "Telangana Fire Service Act 1999",
    coverage: "C1",
    verified: "18 Sep 2026",
  },
  {
    id: "udyam",
    name: "Udyam registration",
    authority: "Ministry of MSME",
    status: "optional",
    reason: "Free. Unlocks MSME loans and schemes.",
    fee: "Free",
    timeline: "Instant",
    law: "MSMED Act 2006",
    coverage: "C1",
    verified: "1 Oct 2026",
  },
];

export type Provenance = "Live from authority" | "Synced from public lookup" | "You reported" | "Officer recorded";

export type Desk = {
  name: string;
  state: "done" | "current" | "next";
  date?: string;
};

export type TrackedFile = {
  id: string;
  name: string;
  authority: string;
  ref: string;
  state: "approved" | "moving" | "query" | "stalled";
  stateLabel: string;
  day: number;
  sla: number;
  provenance: Provenance;
  synced: string;
  desks: Desk[];
};

export const files: TrackedFile[] = [
  {
    id: "trade",
    name: "Trade licence",
    authority: "Cyberabad Municipal Corporation",
    ref: "TIN CYB/2026/0041187",
    state: "stalled",
    stateLabel: "Held at field verification",
    day: 21,
    sla: 15,
    provenance: "Synced from public lookup",
    synced: "Today, 9:40 am",
    desks: [
      { name: "Submitted", state: "done", date: "23 Sep" },
      { name: "Provisional TIN", state: "done", date: "23 Sep" },
      { name: "Field verification", state: "current", date: "since 24 Sep" },
      { name: "Zonal approval", state: "next" },
      { name: "Signed licence", state: "next" },
    ],
  },
  {
    id: "fssai",
    name: "FSSAI registration",
    authority: "Food Safety Officer, Ranga Reddy",
    ref: "FoSCoS 20926101000318",
    state: "query",
    stateLabel: "Query answered, waiting",
    day: 9,
    sla: 30,
    provenance: "You reported",
    synced: "Yesterday, 6:15 pm",
    desks: [
      { name: "Submitted", state: "done", date: "5 Oct" },
      { name: "Scrutiny", state: "done", date: "8 Oct" },
      { name: "Query answered", state: "current", date: "since 10 Oct" },
      { name: "Registered", state: "next" },
    ],
  },
  {
    id: "se",
    name: "Shops & Establishments",
    authority: "Telangana Labour Department",
    ref: "SE/RR/2026/118204",
    state: "approved",
    stateLabel: "Registered",
    day: 1,
    sla: 1,
    provenance: "Officer recorded",
    synced: "24 Sep",
    desks: [
      { name: "Submitted", state: "done", date: "23 Sep" },
      { name: "Registered", state: "done", date: "24 Sep" },
    ],
  },
  {
    id: "gst",
    name: "GST registration",
    authority: "CBIC",
    ref: "GSTIN 36ABCDE1234F1Z5",
    state: "approved",
    stateLabel: "Registered",
    day: 5,
    sla: 7,
    provenance: "Live from authority",
    synced: "29 Sep",
    desks: [
      { name: "Submitted", state: "done", date: "24 Sep" },
      { name: "Verification", state: "done", date: "26 Sep" },
      { name: "Registered", state: "done", date: "29 Sep" },
    ],
  },
];

export type LadderStep = {
  day: number;
  title: string;
  detail: string;
  state: "sent" | "ready" | "later";
};

export const ladder: LadderStep[] = [
  { day: 16, title: "Reminder to the verifying officer", detail: "Sent 9 Oct with your application number and the 15-day timeline.", state: "sent" },
  { day: 22, title: "Escalate to the Zonal Commissioner", detail: "Drafted and ready. Cites the published service timeline.", state: "ready" },
  { day: 30, title: "File on the state grievance portal", detail: "Pre-filled with your file history and receipts.", state: "later" },
  { day: 45, title: "RTI: who holds my file, and why", detail: "Asks for the file movement record and reasons for delay. ₹10 fee.", state: "later" },
];

export type OfficeStat = {
  office: string;
  service: string;
  cases: number;
  medianDays: number;
  p90Days: number;
  sla: number;
  overSla: number; // percent
  queryLoops: number; // percent
  reports: number | null; // null below k-threshold
};

export const offices: OfficeStat[] = [
  { office: "Cyberabad MC, Serilingampally zone", service: "Trade licence", cases: 412, medianDays: 19, p90Days: 41, sla: 15, overSla: 58, queryLoops: 22, reports: 9 },
  { office: "Cyberabad MC, Kukatpally zone", service: "Trade licence", cases: 287, medianDays: 12, p90Days: 24, sla: 15, overSla: 21, queryLoops: 9, reports: null },
  { office: "GHMC, Khairatabad zone", service: "Trade licence", cases: 530, medianDays: 8, p90Days: 17, sla: 15, overSla: 11, queryLoops: 6, reports: null },
  { office: "GHMC, Charminar zone", service: "Trade licence", cases: 344, medianDays: 16, p90Days: 38, sla: 15, overSla: 49, queryLoops: 18, reports: 6 },
  { office: "Siddipet Municipality", service: "Trade licence", cases: 96, medianDays: 4, p90Days: 9, sla: 7, overSla: 6, queryLoops: 3, reports: null },
  { office: "Food Safety, Ranga Reddy", service: "FSSAI registration", cases: 621, medianDays: 6, p90Days: 13, sla: 7, overSla: 14, queryLoops: 8, reports: null },
];
