# PRD: India Business One (v1)

| | |
|---|---|
| **Status** | Draft v0.1 for review |
| **Date** | 14 Oct 2026 |
| **Owner** | Founder / product lead |
| **Pilot** | Telangana: GHMC, Cyberabad MC, and one municipality under the Telangana Municipalities Act (Siddipet or Karimnagar) |
| **Archetypes** | (A) small retail shop, (B) bakery / café / small food outlet |
| **Stack** | Go services, Rust rules core (GoRules ZEN), Next.js/TypeScript web, PostgreSQL + PostGIS, Temporal |
| **Research** | [`research/01-open-source-repos.md`](../research/01-open-source-repos.md), [`research/02-govt-data-sources.md`](../research/02-govt-data-sources.md), [`research/03-pilot-state-telangana.md`](../research/03-pilot-state-telangana.md) |

> **Tagline:** One India. One business profile. Every eligible local approval.
>
> **The test of success:** an entrepreneur can move to a new town and learn what the law requires there. They can complete every supported step online and pay only legitimate fees. And they know exactly who is responsible for every remaining decision.

---

## 0. Key decisions in this PRD

| # | Decision | Rationale |
|---|---|---|
| D1 | **Location first, not department first.** The user picks an address, and we work out the authorities from it. | This is the gap NSWS leaves open. NSWS covers 32 central departments and 35 states/UTs but is weak at the local-body level, and that is where small businesses get stuck. |
| D2 | **Pilot Telangana**: GHMC, Cyberabad MC, and one municipality under the TM Act 2019. | The founder is in Hyderabad. Telangana municipalities use one statewide fee formula (TM Trade Licence Rules 2020). Telangana was a BRAP 2024 Top Achiever in 4 areas. The GHMC split of Feb 2026 is a live case of the problem we solve: which authority covers this address? |
| D3 | **v1 does not collect official government fees.** We deep-link to each authority's own payment page and then record and reconcile the receipt. | A private portal cannot legally collect fees into a treasury without the department's authorisation. Our own optional service fees go through an RBI-authorised payment aggregator. |
| D4 | **Every integration declares a capability level (L0–L4) and the provenance of its status data.** | We never claim "live" status that we do not have. |
| D5 | **Rules are versioned data with legal citations, run by GoRules ZEN (Rust core).** A human reviewer must approve every change. | This catalogue is the core asset. It has to be auditable, testable, and quick to withdraw. |
| D6 | **Backend: a Go modular monolith plus a Temporal worker.** Non-Go components are allowed only as unmodified, separately run services where no production-grade Go/Rust option exists (Keycloak, Photon, ClamAV). | User requirement: Go or Rust wherever possible, production grade. |
| D7 | **LGD codes are the primary keys for jurisdictions.** Boundaries are versioned with effective dates. | Local bodies merge and split. Telangana alone saw a 27-ULB merger in Dec 2025 and a three-way split in Feb 2026. |
| D8 | **Identity in tiers.** Mobile OTP first, then DigiLocker, then Aadhaar offline verification (OVSE). We never store Aadhaar numbers. | Direct Aadhaar authentication (AUA/KUA) requires a ministry sponsor, so it is out of reach for v1. |
| D9 | **Host in Indian cloud regions on a MeitY-empanelled provider.** Primary is Mumbai, disaster recovery is Hyderabad. | CERT-In log localisation; it keeps the door open to government adoption; it fits DPDP posture. |

---

## 1. Problem

India has a national market. Starting a physical business, though, still means dealing with state departments, municipal bodies and local inspectors, and each has its own portal, forms, fees and timelines. NSWS helps with discovery for central and state approvals, but it has three limits:

- Its "Know Your Approvals" questionnaire is guidance only. It has no API or data export.
- Coverage of municipal and local-body services is thin and uneven.
- After submission, status tracking, deadline enforcement and escalation are weak. NITI Aayog's Feb 2026 report names these same gaps: fragmented approvals, repeated documents, disconnected systems and weak escalation.

The result for a small business owner is repeat visits, repeated documents, unclear fees, unofficial payment demands, and no idea who holds their file.

## 2. Users

| Persona | Need | v1 priority |
|---|---|---|
| **First-time shopkeeper** (kirana, mobile shop, salon) | "What do I need, how much does it cost, and where do I apply?" Wants Telugu/Hindi, mobile, low literacy load. | P0 |
| **Food entrepreneur** (bakery, café, cloud kitchen) | FSSAI tier, trade licence category, pollution/fire triggers, signage | P0 |
| **Multi-branch owner** | Reuse their profile for a new branch in another ULB or state | P1 (architecture is P0) |
| **Facilitator / CA / CSC operator** | Apply on behalf of clients with delegated authority | P1 |
| **ULB / department officer** | A clean case queue, fewer incomplete applications, an audit trail | P1 (L4 integration only) |
| **Supervisory authority** (Commissioner, CDMA, Labour Commissioner) | Visibility into SLA breaches and escalations | P1 |
| **Rules reviewer** (legal/policy) | Author, review and publish rules with citations | P0 (internal) |
| **Ops / support** | Assisted-mode help and grievance triage | P0 (internal) |

## 3. Goals, non-goals, metrics

### Goals for v1
1. For both archetypes in all three pilot ULBs, produce a **complete and correct permit plan**: every requirement with its legal basis, official fee, timeline, authority and how to apply.
2. **Cut down repeated data entry and portal-hopping.** One business profile, pre-filled hand-off packets, and one tracker across all authorities.
3. **Make every fee and status traceable.** Use official fee schedules only, record each receipt against its application, and label where every status came from.
4. **Remove the single point of human failure.** Every stalled file, query loop, inflated fee or bribe demand becomes visible, escalates automatically and can be reported safely (§12).
5. **Lay architectural foundations that scale nationally.** That means LGD-keyed jurisdictions, rules as data, and the adapter framework. No Telangana-specific hard-coding.

### Non-goals for v1
- Granting or deeming any approval. Only the authority decides.
- Collecting government fees on an authority's behalf, unless it has authorised us in writing.
- Covering manufacturing or other high-complexity archetypes, or states beyond the pilot.
- Direct Aadhaar authentication (AUA/KUA), or storing Aadhaar, PAN or voter-ID numbers in clear text.
- Scraping systems that require login, or submitting applications as the user without explicit consent and authorisation.
- Native mobile apps. v1 is a responsive PWA.

### Metrics
| Metric | Target (pilot) |
|---|---|
| **North star:** median days from a complete application to all mandatory approvals granted, by archetype and ULB | Baseline in M1; track trend |
| Correct requirements identified (vs. a human-reviewed test set of ≥ 60 scenarios) | ≥ 95%. **Missing a mandatory approval counts as a Sev-1 defect.** |
| Official fee accuracy | 100% of published fee rules carry a cited source and pass review before use |
| Status provenance | 100% of displayed statuses carry a provenance label and timestamp |
| Applicant preparation time vs. measured baseline | −50% |
| Fields re-entered across applications | Zero re-entry for reusable fields |
| Grievance acknowledgement | 100% within 1 working day |
| Availability (citizen-facing) | 99.5% monthly in pilot; 99.9% target for GA |
| p95 latency for permit-plan generation | < 800 ms |
| Accessibility | WCAG 2.1 AA; GIGW 3.0 practices |

---

## 4. Scope

### 4.1 What "supported" means: coverage tiers per (jurisdiction × service)

| Tier | Label shown to user | Meaning |
|---|---|---|
| **C0** | Not covered | We know the requirement may exist but we haven't encoded it. We show a warning and tell the user to check locally. |
| **C1** | Guidance | The requirement, legal basis, fee and timeline are encoded and reviewed. We deep-link to the authority's portal. |
| **C2** | Guided hand-off | C1, plus a pre-filled packet (data and documents), a step-by-step walkthrough, receipt capture, and tracking from public status lookups or what the applicant tells us |
| **C3** | Integrated | Submission and/or status go through an API under an MoU (adapter L3) |
| **C4** | Native | The authority processes the case in our officer console (adapter L4) |

**v1 target:** C2 for every row in the seed rules for both archetypes in the three pilot ULBs. C3 for at least one service if a partner MoU lands; the leading candidates are the GHMC trade licence and Telangana Shops & Establishments.

### 4.2 Pilot requirement set (Telangana)

The full seed tables, with confidence levels, are in `research/03-pilot-state-telangana.md`. A summary:

| Requirement | Shop | Bakery/café | Authority |
|---|---|---|---|
| Trade licence: GHMC Act 1955 s.521/622 (GHMC, Cyberabad, Malkajgiri), or TM Trade Licence Rules 2020 (other ULBs) | ✔ | ✔ (eating-establishment category) | Municipal corporation / municipality |
| Shops & Establishments registration (TS S&E Act 1988; G.O.Rt.383/2025) | ✔ | ✔ | Labour Department |
| OSH Code registration (10+ workers) | conditional | conditional | Labour / Shram Suvidha |
| FSSAI registration (turnover ≤ ₹1.5 cr, from 1 Apr 2026) or state licence (₹1.5–50 cr) | conditional (packaged food) | ✔ | FSSAI / Commissioner of Food Safety |
| GST (Telangana goods threshold ₹20 L; services ₹20 L) | conditional | conditional | CBIC / Telangana Commercial Taxes |
| Professional tax (employer registration and enrolment) | conditional | conditional | Telangana Commercial Taxes |
| Legal Metrology: weighing-scale stamping; packer registration (LMPC) | conditional | conditional | Controller of Legal Metrology |
| Signage / name-board permission (G.O.Ms.68/2020) | conditional | conditional | ULB |
| Fire NOC | conditional (height/occupancy) | conditional | Telangana Fire Services |
| Pollution control board consent, or white-category self-declaration | n/a | conditional (in-house production) | Telangana Pollution Control Board |
| Udyam | optional | optional | Ministry of MSME |

Every item marked L (low confidence) in the research must be verified in the field before it is published (§20).

---

## 5. Core user journey

1. **Where?** The user searches an address, PIN code or DIGIPIN, or drops a map pin. The **jurisdiction resolver** returns state → district → ULB → zone/circle → ward, with confidence. The user confirms. Ambiguous cases (a PIN code spanning several ULBs, a point near a boundary) need an explicit choice.
2. **What?** A guided interview, modelled on Docassemble patterns: activity (NIC 2008/2025, plain-language search), legal structure, premises (owned/rented, area in sq ft, road width, floor and building height, basement), staff count, expected turnover, food handling (none, packaged, cooked, baked on site), weighing scales, signage, LPG use. Only questions whose answers change the plan are asked.
3. **Permit plan.** A list of items, each with a status (*Required*, *Conditionally required, because…*, *Not required, because…*, *Needs confirmation*). Each item shows:
   - the authority and the legal citation;
   - the official fee, worked out with the formula shown;
   - the published timeline;
   - how to apply, with a coverage-tier badge;
   - the dependencies (for example, S&E before the trade licence where a ULB requires it);
   - the date the rule was last verified.
4. **Verify.** Mobile OTP sign-in, then optional DigiLocker sign-in and document pull. Create or link the business profile, which is kept separate from the person's identity.
5. **Prepare and apply.** Fill one profile; the system generates a per-authority packet. For C2 items: open the authority portal with a copy-field helper, upload missing documents to the vault, then come back and record the application ID and fee receipt. For C3/C4 items: submit in-app.
6. **Track.** One tracker across all authorities. For each step it shows the state, the provenance label, the statutory or published deadline, a days-elapsed clock (with legitimate pauses for queries), outstanding queries and documents, and the final certificate.
7. **Escalate.** If a deadline is missed or something is wrong (an unexplained demand, a suspected bribe request), the user files a grievance with evidence. It gets a case ID and is routed to the designated supervisory authority or grievance portal.
8. **Operate.** The user gets a compliance calendar: renewals (for example, trade licence by the Telangana municipal deadline of 31 March, S&E by 31 December, the FSSAI annual fee and return), professional-tax returns, and re-verification of weighing scales.

---

## 6. Functional requirements

Priority: **P0** = pilot launch, **P1** = by the end of the pilot, **P2** = national scale. Each FR has acceptance criteria (AC).

### FR-01 Jurisdiction resolver (P0)
- Input: address text, PIN code, DIGIPIN, or lat/lng. Output: an ordered list of candidate jurisdictions with LGD codes, the authorities linked to each, a confidence score, and the boundary dataset version.
- Point-in-polygon against **versioned boundary sets** (an `effective_from`/`effective_to` range and a source on each set). A resolution can be made for a past date ("which ULB covered this address on 1 Jan 2026?").
- PIN code is only a hint. It never decides on its own.
- **AC:** ≥ 98% correct ULB on a 300-address pilot test set; every resolution is stored with the dataset version; boundary changes create a new version and never edit in place; addresses within 50 m of a boundary always need user confirmation.

### FR-02 Rules and approvals catalogue (P0)
- Rules are versioned records (§8): applicability logic as a ZEN JDM decision graph, plus metadata such as legal citations, source documents (hash and URL), fee formula, timeline, authority, effective dates, reviewer and confidence.
- A rule moves through a state machine: `draft → in_review → approved → published → withdrawn`. Two people must sign off on publishing (author ≠ approver). There is a **kill switch** to withdraw a rule within minutes.
- **AC:**
  - Every published rule has at least one citation and a `last_verified_at` within 180 days, or it is shown with a "stale" badge.
  - The regression suite (scenario → expected plan) must pass before publishing.
  - Withdrawing a rule invalidates cached plans and notifies affected applicants.

### FR-03 Permit-plan generator (P0)
- Inputs: resolved jurisdiction plus interview answers. Output: a deterministic plan with an explanation trace (which conditions fired) and the IDs and versions of the rules used.
- Plans are **immutable snapshots**. If rules change later, we compare the new plan against the snapshot and tell the user what changed.
- **AC:** the same inputs and rule versions always give the same plan; p95 < 800 ms; the explanation can be shown to users.

### FR-04 Accounts, identity and business profile (P0)
- Sign in with mobile OTP (SMS via a DLT-registered sender, with WhatsApp as a fallback). Email is optional. DigiLocker sign-in is P1, after partner onboarding.
- The **person** (identity verifications) is kept separate from the **business entity** (proprietorship, partnership, LLP, company, other), which is linked through memberships with roles (owner, partner, director, authorised representative, facilitator).
- Each branch location gets its own jurisdiction resolution.
- **AC:** a user can belong to more than one business; facilitators act only under delegation scoped to one business and expiring after a set period; every action is recorded with both the actor and the "on behalf of" party.

### FR-05 Document vault (P0)
- Upload, run a malware scan (ClamAV), hash with SHA-256, classify by document type, and record expiry dates. Documents are stored encrypted in an India-region object store. Upload and download use short-lived pre-signed URLs.
- Provenance on each document: `user_upload` | `digilocker_issued` (P1) | `authority_issued`.
- **AC:** no document can be fetched without an access-policy check plus an audit event; the user can delete documents, subject to the retention schedule (§15).

### FR-06 Application packets and hand-off (P0)
- For each permit item, generate a packet: field values mapped to the authority's form (a JSON Schema per authority form version), a document checklist, a fee calculation, and step-by-step portal instructions with screenshots maintained by ops.
- Capture the result of the hand-off: the authority's application number, a receipt (upload or reference), and the submission date.
- **AC:** a reusable field is never asked for twice; a packet records the form-schema version it targets.

### FR-07 Fee engine and payment records (P0)
- Fee formulas live in the rules (for example, Telangana trade licence: rate per sq ft by road-width band × plinth area; S&E by headcount band). The fee is shown with its working and its citation.
- **The official fee and any optional service charge are always shown separately.** v1 has no service charge on the core flow.
- Payment record: payee authority, amount, mode, the authority's receipt number, the receipt document, and reconciliation status (`claimed` → `verified` against a public receipt lookup or an authority confirmation, or `disputed`).
- **AC:** 100% of fee rules have a cited source; if the receipt amount ≠ the calculated fee, the user is warned and offered a grievance. We never display personal UPI IDs or third-party payees.

### FR-08 Application tracker (P0)
- Step state machine: `not_started → preparing → submitted → under_scrutiny → query_raised ⇄ query_answered → inspection_scheduled → approved | rejected | withdrawn | deemed_approved*`.
  - `deemed_approved` is used only where a statute provides for it (for example, FSSAI registration not decided within 30 days, or Karnataka S&E under the 2026 amendment). It is shown with the citation, and the platform never claims it as a grant.
- Each status change records its **provenance**: `live_api` | `synced_public_lookup (at T)` | `applicant_reported` | `officer_recorded` | `awaiting_confirmation`.
- An SLA clock per step uses the published or statutory timeline, pauses during legitimate query time, and records breaches.
- **AC:** the user sees provenance and timestamp on every status; every transition is in the audit log; breaches create escalation tasks.

### FR-09 Grievances and escalation (P0)
- Grievance categories: delay, an unexplained document request, a fee mismatch, a suspected unofficial payment demand, misconduct, or a platform error. The user attaches evidence and gets a case ID.
- Routing: our ops triage first, then the authority's designated grievance officer or supervisory authority. Channels include GHMC/ULB grievance portals, CPGRAMS, and the Telangana Labour/CDMA escalation contacts. A report of a suspected bribe demand is passed to the authority's vigilance channel, with the user's consent, and is never made public.
- **AC:** acknowledgement within 1 working day; every hand-off records the external reference; the user can see the timeline.
- The full integrity toolkit is specified in §12: escalation ladder, RTI generator, deemed-approval assistant, bribe-demand reporting to ACB/vigilance, evidence vault, and retaliation watch. Everything in §12.3 is **P0**. §12.4 applies to L3/L4 partners.

### FR-10 Notifications (P0)
- SMS (DLT-registered templates), email, and WhatsApp Business (template messages) for: plan changes, deadlines, SLA breaches, queries, renewals and grievance updates. Users set preferences; the content is localised.
- **AC:** every message is sent from a template with a version; delivery receipts are stored; users can opt out of non-essential messages.

### FR-11 Rules authoring console (P0, internal)
- Embeds the GoRules **jdm-editor**, plus forms for citations and fees, a source-document viewer, a diff view between versions, a scenario test runner, and the two-person publish flow.
- An AI assistant (P1) may suggest candidate rules drawn from gazette or notification PDFs. These are drafts only; a human approves and publishes them.

### FR-12 Ops and assisted mode (P0, internal)
- Support staff can view a user's case only after the user grants consent for a fixed time. They can help prepare packets and annotate cases. Every action is audited.
- Coverage dashboard: for each jurisdiction × service, the tier, the last verification date, and adapter health.

### FR-13 Public catalogue and transparency pages (P1)
- Public, server-rendered pages for each service and ULB. Each shows the requirement, legal basis, official fee, published timeline, coverage tier, last verified date, and anonymised outcome statistics (median and p90 processing days) once n ≥ 20.
- **AC:** pages are indexable and work without JavaScript; the data is downloadable (CSV/JSON) under an open licence.

### FR-14 Officer console (P1, used only for L4 partners)
- Inbox by ULB, ward and service. Officers can scrutinise cases, raise queries, schedule inspections, and record decisions with a mandatory reason code and legal basis for any rejection. They issue digitally signed certificates (PDF with a QR verification link) and can see SLA breaches.
- MFA is mandatory. Access is scoped by ULB and ward through policy (OPA).
- DIGIT's `egov-workflow-v2` / UPYOG `tl-services` state machines are the reference for the configurable workflow.

### FR-15 Certificate verification (P1)
- A public `verify/{id}` page and a QR code for certificates we issue (L4) or have recorded (C2: an image of the authority-issued certificate with an authority lookup link).
- P2: W3C Verifiable Credentials (via Sunbird RC) and DigiLocker issuer integration.

### FR-16 Multilingual and accessible UI (P0 for English + Telugu; P1 for Hindi + Urdu)
- All copy goes through i18n keys; legal text is reviewed by a human translator; Bhashini is used for draft translation and (P1) voice-guided interview.
- **AC:** WCAG 2.1 AA audit passes; the app works on a low-end Android phone on 3G (Lighthouse performance ≥ 80 on Moto G-class emulation).

### P1 / P2 backlog (summary)
- **P1:**
  - DigiLocker sign-in and document pull
  - eSign through an ESP
  - GSTIN/PAN/Udyam verification through aggregators
  - OVSE Aadhaar offline verification
  - Renewals and amendments
  - Branch-opening flow
  - Inspection scheduling
  - Facilitator (CA/CSC) workspace
  - Hindi and Urdu
- **P2:**
  - Standard adapter SDK for states and ULBs
  - Portable credentials
  - Interoperable status events (published schema)
  - Public performance dashboards
  - Beckn/ONDC exposure
  - More states and archetypes, starting with light manufacturing

---

## 7. Integration adapter framework

Every external service is reached through one Go interface. Adapters **declare** what they can actually do.

```go
type Capability string // "requirements", "validate", "fee", "submit", "status", "queries", "decision", "verify_certificate"

type Adapter interface {
    Descriptor() Descriptor // id, authority LGD/org code, service code, level L0–L4, capabilities, freshness SLA, fallback
    Requirements(ctx context.Context, in PlanContext) ([]Requirement, error)
    Validate(ctx context.Context, app Application) (ValidationResult, error)
    Fee(ctx context.Context, app Application) (FeeQuote, error)
    Submit(ctx context.Context, app Application) (SubmissionRef, error)          // ErrNotSupported below L3
    Status(ctx context.Context, ref SubmissionRef) (StatusSnapshot, error)        // includes Provenance + ObservedAt
    Decision(ctx context.Context, ref SubmissionRef) (Decision, error)
    VerifyCertificate(ctx context.Context, cert CertificateRef) (Verification, error)
}
```

| Level | Name | What it does | v1 examples |
|---|---|---|---|
| **L0** | Info | Rules + deep link only | Fire NOC, pollution board consent |
| **L1** | Guided hand-off | Pre-filled packet; applicant reports status | Telangana S&E, Legal Metrology, professional tax |
| **L2** | Public lookup | L1 + **polling of public, no-login status/certificate lookups**, within their terms and with rate limits | GHMC `TradeStatus.aspx` / TIN search, FoSCoS FBO search (subject to CAPTCHA, terms and legal review) |
| **L3** | API (MoU) | Submit/status through an authorised API | Target: GHMC/CDMA trade licence, Telangana Labour |
| **L4** | Native | The authority works the case in our officer console | Target: a small municipality partner |

Rules:
- Adapters run as **Temporal activities** with retries, timeouts and circuit breakers. Each sync writes a `StatusSnapshot` with provenance.
- An adapter health dashboard shows last success, error rate and freshness against SLA. If an adapter breaks, the UI falls back to the next lower level.
- **No credentialed scraping, and no acting as the user without explicit consent.** L2 polling of public pages needs legal review per source and must respect robots.txt and the site's terms.

---

## 8. Rules engine design

- **Engine:** GoRules **ZEN** (Rust core, MIT), embedded through **zen-go**. Decision graphs are stored as JDM JSON. Evaluation is in-process with no network hop. Each published rule version is compiled and cached on load.
- **Why ZEN rather than OPA for applicability:** decision tables are readable by legal reviewers, the visual editor (jdm-editor) can go in the console, it is deterministic, and it is fast. **OPA** stays for authorisation.
- **Rule record** (Postgres; the JDM lives in a JSONB column, and every version is immutable):

```text
approval_rule
  id, version, status (draft|in_review|approved|published|withdrawn)
  jurisdiction_scope   (LGD codes + level: state|district|ulb|ward)  -- inherits downward
  authority_id
  service_code         (internal catalogue code, e.g. TG.ULB.TRADE_LICENCE)
  activity_codes       (NIC-2008[], NIC-2025[])
  applicability_jdm    (JSONB: ZEN decision graph → required|conditional|not_required|needs_confirmation + reason keys)
  fee_jdm              (JSONB: ZEN graph → amount, currency, breakdown, formula text)
  timeline             (published_days, statutory_days, deemed_approval_citation?)
  legal_citations[]    (act, section, rule, G.O./notification no., date, URL, source_doc_hash)
  dependencies[]       (service_codes that must precede)
  effective_from, effective_to
  confidence           (H|M|L)  -- L may not be published without field verification
  authored_by, reviewed_by, published_by, last_verified_at
```

- **Testing:** each rule ships with scenario fixtures (input → expected outcome and fee). The full catalogue runs in CI against a golden set of ≥ 60 pilot scenarios. Catala (REF) is optional for writing oracle tests for complex statutes.
- **Evaluation order:** resolve jurisdiction → pick the rules whose scope covers the location and whose effective date covers the as-of date → evaluate applicability → evaluate fees → build the dependency DAG → plan.

---

## 9. Jurisdiction data design

- **Canonical keys:** LGD codes for state, district, sub-district, ULB, ward and village. Ingested from LGD bulk downloads plus the monthly delta, with the LGD web services tested as an alternative.
- **Boundaries** come from datameet `Municipal_Spatial_Data` (CC BY 4.0), state and municipal GIS shapefiles (GHMC and Telangana open data), and Bharat Maps once NIC approves access. Each boundary is stored as `boundary_set(version, source, licence, effective_from/to)` → `boundary(lgd_code, geom MultiPolygon, 4326)`. PostGIS GiST indexes are used for lookups.
- **The GHMC 2026 reorganisation** is modelled as new boundary sets:
  - 27 ULBs merged into GHMC (G.O. 292, Dec 2025);
  - then split into GHMC / Cyberabad / Malkajgiri (G.O.Ms.55, 10 Feb 2026).
  
  A pending High Court challenge goes in as a `watch` flag.
- **Geocoding:** Photon (OSM, Apache-2.0) runs as a separate service for autocomplete, with Nominatim as a fallback. DIGIPIN encode/decode is ported to Go from the India Post Apache-2.0 reference. A commercial geocoder (for example, Google or Mappls) can sit behind an interface flag if OSM's address quality is too poor.
- **Map display:** MapLibre GL JS + **Martin** (Rust) vector tiles from PostGIS. Every map shows the Survey of India-compliant national boundary and a disclaimer: "boundaries indicative; jurisdiction determined by authority records".
- **Ops loop:** a user's "this is wrong" report creates a data ticket; an ops reviewer fixes it with a new boundary version.

---

## 10. Identity, consent and privacy

| Layer | v1 | Later |
|---|---|---|
| Sign-in | Mobile OTP (DLT SMS) via Keycloak; email optional | DigiLocker / Meri Pehchaan as an identity provider brokered through Keycloak |
| Identity verification | Not needed for discovery or planning. For applying, rely on the authority's own KYC on its portal (C2). | **OVSE** Aadhaar offline verification (QR / verifiable credential from the Aadhaar app), DigiLocker-issued PAN/Aadhaar XML |
| Business verification | User-declared, with document upload | GSTIN via a GST Suvidha Provider (GSP); PAN/Udyam/MCA/FSSAI via KYC aggregators; DigiLocker-issued certificates |
| e-Signature | n/a (signing happens on authority portals) | eSign through a CCA-empanelled ESP (we register as an ASP) |
| Staff sign-in | Keycloak with mandatory WebAuthn / TOTP MFA; separate realm | SAML/OIDC federation with state government SSO |

Rules:
- **Never store an Aadhaar number.** Store only the verification result, method, provider reference, the masked last 4 digits (if needed) and a timestamp. PAN is stored encrypted at field level (envelope encryption via KMS) and shown masked.
- A **purpose-bound consent ledger** (DPDP): consent ID, purpose, data categories, recipient (for example, "GHMC trade licence application"), granted/withdrawn timestamps, and the notice version. Every data share or packet export references a consent ID.
- **Data principal rights:** access, correction, erasure (subject to legal retention) and nominee, all exposed in settings. A Grievance Officer is named in the privacy notice.
- **DPDP timeline:**
  - Rules notified 13 Nov 2025.
  - Consent Manager provisions apply from 13 Nov 2026.
  - Core obligations apply from 13 May 2027.
  
  The pilot launches DPDP-compliant regardless. Counsel signs off before launch.

---

## 11. Payments

- **v1 official fees:** deep-link to the authority's payment page (GHMC `onlinepayments.ghmc.gov.in`, FoSCoS, the labour portal, the IFMIS e-challan for state receipts, BharatKosh for central non-tax receipts). Capture the receipt and reconcile it against FR-07.
- **Our own charges** (optional assisted service, P1 if ever): an RBI-authorised payment aggregator (Razorpay / Cashfree / PayU) using UPI intent/QR first. UPI P2P collect requests were withdrawn on 1 Oct 2025. Our charges always appear as a separate line with a GST invoice.
- **Later:** an authorised fee-facilitator role or integration with the authority's gateway, only with written authorisation from the department or treasury. Money goes straight to the government beneficiary and we never hold it.
- **Never:** pooling government fees in our account, showing personal or third-party payee VPAs, or charging for "faster" processing.

---

## 12. Integrity: anti-corruption and anti-chokepoint design

### 12.1 The threat we are designing against

The core failure is not missing software. It is a **single point of human failure**: one clerk, section officer, inspector or approving authority who holds the file. They can sit on it, raise one query after another, insist on a physical visit or an inspection "visit fee", or quietly let it be known that the licence moves only after an unofficial payment. Online portals in all three pilot ULBs have narrowed this but not removed it. The file still waits in one officer's inbox, and an application can stall at "under scrutiny" indefinitely with no consequence.

We treat this as an adversarial problem with these actors and patterns:

| Pattern | How it shows up | Who |
|---|---|---|
| **Stalling** | A file sits at one desk well beyond the published timeline, with no query and no decision | Dealing clerk / approving officer |
| **Query loops** | Deficiencies raised one at a time, or vague demands ("bring the original", "get it attested") so the clock keeps resetting | Scrutiny officer |
| **Inspection leverage** | An inspection is scheduled but not done, or done with demands; the report is withheld | Inspector (fire, food safety, health, trade licence field staff) |
| **Gatekeeping** | "Apply only through this agent", or a portal-only process routed through a favoured middleman | Officer + touts |
| **Fee manipulation** | Demands above the official fee, "processing" or "urgent" charges, payments to a personal UPI ID or in cash | Officer / tout |
| **Arbitrary rejection** | Rejection with no reason or a non-legal reason, so the applicant has to start again | Approving officer |
| **Insider risk on our side** | Our ops staff, facilitators or CSC partners selling "faster" processing, or leaking data | Platform insiders |

We cannot fire anyone or reassign a file inside a government system. What we can do is make every one of these patterns **visible, measurable, costly and escalatable**, and make the honest path easier than the corrupt one. Where an authority adopts our console (L4), we can **design the chokepoint out structurally**.

### 12.2 Principles

1. **No single human controls the outcome without being seen.** Every file has a named holder (the desk or office where it can be identified), a clock and a supervisor.
2. **The applicant's evidence is first-class.** Timestamps, receipts and their own records of demands are captured at the time they happen. They are tamper-evident and owned by the applicant.
3. **Escalation is automatic and needs no favours.** The applicant never has to "know someone".
4. **We publish aggregates about offices, never accusations against individuals.** Patterns are public. Individual allegations go privately to bodies with legal authority to act.
5. **Protect the reporter.** No one should lose their licence for reporting a bribe demand.
6. **The platform itself can't be bought.** No paid priority, no insider who can change a status, and four-eyes on anything sensitive.

### 12.3 Controls for every authority (C1–C3, no government cooperation needed)

| # | Control | What it does |
|---|---|---|
| I-1 | **"What you will never be asked for" card** on every service | Lists the official fee, the exact document list, whether an inspection is legally required, and the statutory timeline. Anything beyond this is a red flag. It is printable as a PDF so the applicant can show it at the counter. |
| I-2 | **Per-step SLA clock with an escalation ladder** | When the published or statutory timeline is breached: (1) we auto-draft a reminder to the designated officer; (2) at +7 days, escalation to the supervisory officer named under the applicable service-guarantee law or citizen charter; (3) at +15 days, a CPGRAMS / state grievance portal filing, pre-filled; (4) at +30 days, an RTI application (I-4). The applicant sends each step with one tap, and every step is logged with external references. |
| I-3 | **Deemed-approval assistant** | Where a statute provides deemed approval (for example, FSSAI registration not decided in 30 days; Karnataka S&E 2026 amendment, 7 days; TN Business Facilitation Act; TG-iPASS for industrial approvals), it generates a dated notice claiming deemed approval with the citation, and records it. It never claims deemed approval where the law doesn't provide it. |
| I-4 | **RTI generator** (RTI Act 2005) | One tap drafts an RTI application to the public information officer (PIO) asking for the file noting sheet, the current holder of the file, the date of each movement and the reasons for delay. It covers fee payment (₹10) and the 30-day reply clock, and tracks the first appeal. RTI file-movement disclosures are the strongest lever against a desk that is sitting on a file. |
| I-5 | **Query discipline tracking** | Every query is logged with date and content. If a second or later query raises something that could have been raised the first time, it is flagged as a *query loop*. The applicant gets a ready-made escalation citing the authority's one-time-query norms where they exist (for example, BRAP reform commitments). |
| I-6 | **Bribe-demand report** ("Someone asked me for money") | A private, guided flow that captures the authority, office, date and time, amount, channel (cash, UPI ID, middleman) and any evidence. The applicant chooses what happens next: (a) record it privately only; (b) route it to the authority's vigilance officer; (c) route it to the **Telangana Anti-Corruption Bureau (toll-free 1064 / WhatsApp)** or the relevant state ACB or Lokayukta, which can set a legal trap; (d) count it in anonymous aggregate statistics only. **Timing control:** the applicant can delay forwarding until their licence is issued, to limit retaliation. |
| I-7 | **Legal guidance on bribery** | A plain-language explainer. Under the Prevention of Corruption Act 1988 as amended in 2018, **giving** a bribe is also an offence (s.8). There is an exception for a person **compelled** to pay who **reports it to law enforcement within 7 days**. So the platform always advises: don't pay, and report. If you were coerced into paying, report within 7 days. Reviewed by counsel. |
| I-8 | **Evidence vault** | Timestamped, hash-anchored (Tessera) entries for receipts, queries, screenshots, messages and, where the applicant lawfully made one, audio. These are the applicant's own records, exportable as a signed evidence bundle for ACB, Lokayukta or a court. Guidance on lawful recording comes from counsel. |
| I-9 | **Fee-integrity checks** | If a receipt's amount doesn't match the calculated official fee, or the payee isn't the official beneficiary, it is flagged automatically. **Any payment to a personal UPI ID or in cash outside an official receipt is treated as a red flag.** |
| I-10 | **Office-level integrity analytics** (public, aggregated) | Per office, ward or service, once a minimum count is reached (k ≥ 20 cases, or k ≥ 5 for bribe-report aggregates): median and p90 days per step, % of cases that breached SLA, query-loop rate, rejection rate with no legal reason, and the stall distribution (time held at a single step). **Offices only, never individuals, in public.** Methodology is published and data is downloadable. |
| I-11 | **Chokepoint detection** (internal) | Statistical anomaly detection flags any step whose dwell time is far above its peers (for example, > p90 of comparable ULBs) or a sudden change in an office's pattern. Findings go to our integrity team and, under a partner MoU, to the authority's vigilance cell, never straight to the public. |
| I-12 | **Retaliation watch** | After someone files a bribe report or escalation, we watch their later cases (renewals, inspections, other permits) for anomalies such as new queries, sudden inspections or rejections. Spikes are surfaced to the applicant and, with consent, to the receiving authority. |

### 12.4 Structural controls for partner authorities (L3/L4, by MoU)

These are what our officer console enforces. They are what we ask partner ULBs to adopt.

| # | Control | Effect on chokepoints |
|---|---|---|
| S-1 | **Pooled queues with automatic routing** (round-robin, weighted by workload, within the legally competent officer pool) | No applicant can be steered to a "friendly" desk, and no desk owns a file forever |
| S-2 | **Hold timers with auto-escalation and auto-reassignment** | If a case sits idle at one desk past X% of its SLA, it moves to the supervisor's queue (or to the next competent officer, where rules allow), with a mandatory reason recorded. **No single officer can stall a case silently.** |
| S-3 | **One-time query** | All deficiencies are raised at once, from a checklist. A second query needs supervisor approval and a reason code. Each query is checked against the published document list. |
| S-4 | **Randomised, logged inspections** | Inspector assignment is randomised. The inspection window is given to the applicant in advance. Inspection runs on a published checklist and is geotagged and timestamped with photos in the inspector app. The report is due within N days or the case escalates. Where the law allows risk-based selection, low-risk categories skip inspection or are inspected after approval. |
| S-5 | **Faceless processing** | Scrutiny is done by an officer who never meets the applicant, and identities are masked where the law permits. Communication happens in the platform only and is logged. No physical attendance is needed unless the law requires it. |
| S-6 | **Four-eyes on sensitive actions** | Rejections, fee overrides, reopening a case, changing a decision after issue, and changing an inspection report all need a second approver plus a reason code and legal basis |
| S-7 | **Mandatory reasoned decisions** | A rejection can't be recorded without a reason code, a legal provision and a free-text explanation. It generates appeal instructions for the applicant automatically. |
| S-8 | **Supervisor and vigilance dashboards** | Per-officer dwell times, SLA breaches, query-loop rates, reassignment counts and complaint links. These are visible to the supervising officer and the vigilance cell, **not to the public**. |
| S-9 | **Rotation support** | Expose desk and ward tenure so the authority can apply its own rotation policy |
| S-10 | **Tamper-evident case history** | Every view, edit, assignment and decision is an audit event anchored in Tessera. An officer can't change history; they can only append. |

### 12.5 Platform-side integrity (we are a target too)

- **Our own staff and partners cannot change status or decisions.** They can only annotate, under consent, with an audit trail. There is no "VIP" or paid priority anywhere in the product.
- **Facilitators and CSCs** must register and accept a code of conduct. They never collect government fees. Applicants rate them, and solicitation reports go to the integrity team. A facilitator found soliciting bribes is removed and reported.
- **Separation of duties:** the integrity team is separate from authority-relations and sales, so we don't hide findings to protect a partnership.
- **Integrity-data access** is limited to named roles. Every query against bribe reports is audited and reviewed every quarter.
- **Transparency report** every quarter: aggregate bribe reports, escalations, outcomes, takedown and legal requests received, and any pressure applied to suppress data.

### 12.6 Audit foundation

- An append-only `audit_event` table: INSERT only, enforced by DB grants and a trigger, with a hash chain (`prev_hash`, `row_hash`).
- Each hourly batch root is anchored in a **Tessera** transparency log. Anyone can verify inclusion proofs.
- pgaudit records privileged DB sessions.
- Audit records stay in India for at least 180 days (CERT-In) and 8 years under our retention policy.

### 12.7 Legal guardrails

> - An internal countdown is not a legal deadline. We show **statutory** timelines (with citations) separately from **published service-charter** timelines, and claim deemed approval only where the law provides it.
> - We **never name individual officers publicly.** Individual allegations go only to bodies with legal authority to act (ACB, Lokayukta, vigilance, CVC). This avoids defamation risk and protects due process.
> - We do not run sting operations. Lawful evidence capture by the applicant follows counsel's guidance.
> - The whistleblower and reporter data flows, including retention, access and law-enforcement requests, are reviewed by counsel before launch.

### 12.8 Integrity metrics (pilot)

| Metric | Target |
|---|---|
| % of stalled steps (past SLA) escalated within 24 h of breach | 100% |
| Median days stalled after the first escalation | Baseline, then trend down |
| Query-loop rate per office | Measured and published once k ≥ 20 |
| Bribe-demand reports acknowledged within 1 working day | 100% |
| Reports forwarded to ACB / vigilance (when the reporter chooses) with a tracked reference | 100% |
| Retaliation signals investigated | 100% |
| Payments to non-official payees flagged | 100% |

---

## 13. Architecture

```text
                    ┌───────────────────────────────────────────────┐
  Citizens / CSCs → │  Web (Next.js 15, TS, PWA, SSR public pages)   │ ← Officers / Ops / Rules reviewers
                    └──────────────┬────────────────────────────────┘
                                   │ HTTPS (OpenAPI 3.1)
                    ┌──────────────▼────────────────────────────────┐
                    │ Edge: CDN + WAF + rate limit (cloud LB)        │
                    └──────────────┬────────────────────────────────┘
          OIDC ┌──────────────┐    │
        ◄─────►│  Keycloak    │    │
               └──────────────┘    │
                    ┌──────────────▼────────────────────────────────┐
                    │  core-api  (Go modular monolith)               │
                    │  modules: identity · business · jurisdiction · │
                    │  rules(ZEN/Rust via zen-go) · plans · apps ·   │
                    │  documents · payments · grievances · notify ·  │
                    │  audit · consent · admin   | authz: OPA (lib)  │
                    └───┬────────────┬─────────────┬────────────┬───┘
                        │            │             │            │
              ┌─────────▼──┐  ┌──────▼──────┐ ┌────▼─────┐ ┌────▼──────────┐
              │ PostgreSQL │  │  Temporal   │ │ Object   │ │ Photon geocoder│
              │ 17+PostGIS │  │  (Go server)│ │ storage  │ │ Martin tiles   │
              │ +River jobs│  └──────┬──────┘ │ (S3, IN) │ └────────────────┘
              │ +pgaudit   │         │        └────┬─────┘
              └────────────┘  ┌──────▼──────────┐  │ clamd (ClamAV)
                              │ worker (Go)     │  │ Gotenberg (PDF)
                              │ workflows +     │
                              │ adapter activities ─► Govt portals / APIs / aggregators
                              └─────────────────┘     (L0–L4), SMS/WhatsApp/email
   Observability: OpenTelemetry → Prometheus · Tempo · Loki/VictoriaLogs → Grafana; Sentry (self-hosted, optional)
   Audit anchoring: Tessera log (Go)            Secrets: cloud KMS + Secrets Manager (or OpenBao on-prem)
```

**Deployables:** `core-api` (Go), `worker` (Go Temporal worker plus River workers), `web` (Next.js), and the third-party services (Temporal, Keycloak, Photon, Martin, clamd, Gotenberg, Tessera). They are separate deployables but share one repo and one CI pipeline.

**Why a modular monolith:** one team, regulated workflows, and correctness matter more than independent scaling. Module boundaries are enforced with Go packages and `internal/`, with no cross-module DB access except through module APIs. A module can be extracted later if load requires it.

---

## 14. Technology stack (production)

| Concern | Choice | Language | Licence | Notes |
|---|---|---|---|---|
| Backend API | Go 1.25+, `net/http` + **chi** router, **oapi-codegen** (spec-first OpenAPI 3.1) | Go | MIT/Apache | Spec-first contracts; generated TS client for the web |
| DB access | **pgx v5** + **sqlc**; migrations with **goose** | Go | MIT | Type-safe SQL, no ORM |
| Database | **PostgreSQL 17 + PostGIS 3.5**, pg_trgm (search), pgaudit | — | PostgreSQL/GPL (service) | Managed: Amazon RDS / Aurora PostgreSQL in ap-south-1 with Multi-AZ |
| Rules engine | **GoRules ZEN** via zen-go (cgo) | **Rust** core | MIT | Decision tables / graphs stored as data |
| Authorisation | **OPA** embedded as a Go library (Rego policies in repo) | Go | Apache-2.0 | Scoped by ULB, ward and role; decisions logged |
| Durable workflows | **Temporal** (self-host on K8s, or Temporal Cloud India region if available) + Go SDK | Go | MIT | SLA timers, adapter retries, long-running applications |
| Background jobs | **River** (Postgres-backed) | Go | MPL-2.0 | Notifications, PDFs, ingestion; no Redis needed |
| Cache / rate-limit | **Valkey** (optional; add when measured need arises) | C | BSD | Fork of Redis under the BSD licence |
| Identity provider | **Keycloak** | Java [SVC] | Apache-2.0 | **Exception:** no Go IdP matches its maturity in realms, MFA, brokering and SAML. Ory Kratos/Hydra is the Go-native alternative if Keycloak is rejected. |
| Object storage | Amazon S3 (ap-south-1, SSE-KMS, versioning, Object Lock for receipts); **SeaweedFS** (Go) for on-prem/government cloud | Go | Apache-2.0 | MinIO is archived; don't use it |
| Malware scan | ClamAV `clamd` sidecar | C [SVC] | GPL-2.0 (separate process) | |
| PDF generation | **Gotenberg** | Go | MIT | Receipts, packets, certificates |
| Geocoding | **Photon** (Java [SVC]); Nominatim fallback | — | Apache / GPL (service) | Pluggable interface |
| Map tiles | **Martin** | **Rust** | Apache/MIT | MapLibre GL JS on web |
| Audit transparency | **Tessera** | Go | Apache-2.0 | Merkle-anchored audit batches |
| Frontend | **Next.js 15 (App Router) + React 19 + TypeScript**, **RJSF** forms, TanStack Query, MapLibre, next-intl | TS | MIT/Apache | **Exception:** the browser needs JS/TS; there is no production-grade Go/Rust option for an accessible SSR citizen web app |
| Design system | Own components based on **GOV.UK Frontend** patterns (MIT) + **UX4G** look and feel (licence for the code to be confirmed with NeGD) | TS/CSS | MIT | GIGW 3.0 / WCAG 2.1 AA |
| Form schemas | JSON Schema 2020-12; Go validation with **santhosh-tekuri/jsonschema** | Go | Apache-2.0 | One schema, validated on client and server |
| Translation | **Bhashini** APIs (prototype key, then a DIBD MoU) + human review | HTTP | — | Go client written in-house |
| Messaging | SMS via a DLT-registered provider (e.g., Gupshup, Kaleyra, MSG91); WhatsApp Business Platform; Amazon SES email | — | Commercial | TRAI DLT template registration is required |
| Observability | **OpenTelemetry** SDK (Go/JS) → OTel Collector → Prometheus, Tempo, Loki or VictoriaLogs → Grafana | Go | Apache / AGPL (unmodified service) | SLO dashboards, adapter health |
| Secrets / keys | AWS KMS + Secrets Manager (cloud); **OpenBao** (on-prem) | Go | MPL-2.0 | No secrets in git; gitleaks in CI |
| Infra as code | **OpenTofu** | Go | MPL-2.0 | |
| Runtime | **Amazon EKS** (ap-south-1 primary, ap-south-2 Hyderabad DR) + Karpenter; **Argo CD** GitOps | Go | Apache-2.0 | K8s is justified here by the number of components to run (Temporal, Keycloak, Photon, etc.) |
| CI/CD | GitHub Actions: lint (golangci-lint, eslint), unit tests, sqlc diff, rules regression, contract tests, Playwright E2E, SBOM (Syft), vulnerability scans (govulncheck, Trivy, Grype), image signing (cosign), SLSA provenance | — | — | Protected branches; CODEOWNERS on `rules/` |
| Testing | Go `testing` + **testcontainers-go**, Temporal test suite, Playwright, k6 (load), Schemathesis (API fuzz) | Go/TS | — | |

**Cloud choice.** We default to AWS India because both regions (Mumbai and Hyderabad) are MeitY-empanelled. Everything is portable to Azure/GCP India or an Indian government cloud (NIC/Yotta) through OpenTofu modules and standard components. The only provider-specific managed services are RDS and S3, and both have drop-in substitutes.

### Repository layout (monorepo)

```text
/apps/web                  Next.js citizen + console UI
/services/core-api         Go modular monolith (cmd/, internal/<module>/)
/services/worker           Temporal + River workers, adapters (internal/adapters/<authority>/)
/pkg                       shared Go libs (audit, consent, otel, errors)
/api/openapi.yaml          source of truth for HTTP contracts
/rules                     JDM decision graphs, fixtures, scenario golden tests (CODEOWNERS: legal)
/data/ingest               Go CLIs: LGD, pincode, NIC 2008/2025 + crosswalk, boundaries
/db/migrations             goose SQL migrations; /db/queries for sqlc
/policies                  OPA Rego
/infra                     OpenTofu modules, Helm charts, Argo CD apps
/docs                      PRD, ADRs, runbooks, threat model
/research                  source research snapshots
```

---

## 15. Data model (core tables)

| Table | Key fields / notes |
|---|---|
| `users` | id, phone (unique, verified), email, locale, created_at |
| `identity_verifications` | user_id, method (otp/digilocker/ovse/aggregator), provider_ref, result, masked_attrs, verified_at. **No Aadhaar numbers.** |
| `business_entities` | id, legal_name, constitution, PAN (encrypted), GSTIN, Udyam no., CIN/LLPIN, status |
| `business_memberships` | business_id, user_id, role, delegation_scope, valid_until |
| `business_locations` | business_id, address, geom (Point), digipin, resolved_jurisdiction_id, resolution_dataset_version |
| `jurisdictions` | lgd_code, level, name (multilingual), parent_lgd_code, valid_from/to |
| `boundary_sets` / `boundaries` | version, source, licence, effective range / lgd_code, geom MultiPolygon |
| `authorities` | id, name, type, jurisdiction scope, contacts, grievance & supervisory channels |
| `services` | service_code, authority_id, name, form schema versions, adapter_id, coverage tier |
| `approval_rules` | §8 |
| `permit_plans` | id, business_location_id, inputs (JSONB), rule_versions[], result (JSONB), created_at. Immutable. |
| `applications` / `application_steps` | per plan; step: service_code, state, provenance, authority_ref, sla_due_at, paused_ms |
| `status_events` | step_id, from→to, provenance, observed_at, source_payload_hash |
| `documents` | id, owner, type, sha256, storage_key, provenance, expires_at, retention_class |
| `payments` | step_id, payee_authority_id, amount, mode, authority_receipt_no, receipt_doc_id, reconciliation_state |
| `decisions` | step_id, outcome, reason_code, legal_basis, certificate_doc_id, decided_by (L4) |
| `grievances` | id, category, step_id?, evidence[], routing[], external_refs[], state |
| `consents` | id, user_id, purpose, data_categories, recipient, notice_version, granted_at, withdrawn_at |
| `audit_events` | seq, ts, actor, on_behalf_of, action, object, before/after hash, prev_hash, row_hash. Append-only. |
| `adapter_runs` | adapter_id, op, started/ended, outcome, latency, error class |

**Retention (draft, needs counsel sign-off):**
- Draft plans: 12 months.
- Applications and payments: 8 years (aligned to tax and audit norms).
- Audit events: 8 years.
- Uploaded identity documents: deleted 90 days after the application closes, unless the user keeps them.
- Logs: 180 days in India.

---

## 16. Non-functional requirements

- **Security:**
  - OWASP ASVS L2 as the baseline; ASVS L3 for staff and admin surfaces.
  - Threat model (STRIDE) before the pilot.
  - Independent VAPT by a CERT-In-empanelled auditor before launch, then yearly.
  - CSP, HSTS and SRI on the web app.
  - Least-privilege IAM; private subnets; no public DB.
  - Field-level encryption for PAN and similar data.
  - Secret scanning; dependency and SBOM scanning; signed images.
- **CERT-In:**
  - Report incidents within **6 hours**.
  - Keep logs for 180 days in India.
  - Sync clocks to NIC/NPL NTP.
  - Maintain an incident response runbook with a named point of contact.
- **Privacy (DPDP 2023 / Rules 2025):**
  - Notice and purpose-bound consent; data minimisation.
  - Retention schedule; data principal rights.
  - Breach notification to the Data Protection Board and to affected users.
  - A DPIA before launch.
- **Availability and DR:**
  - 99.5% in the pilot.
  - Multi-AZ, with a warm DR site in ap-south-2.
  - RPO ≤ 15 min, RTO ≤ 4 h.
  - Quarterly restore drills.
- **Performance:**
  - p95 API < 300 ms (excluding adapters).
  - Plan generation < 800 ms.
  - Web LCP < 2.5 s on 4G and usable on 3G.
- **Accessibility and language:**
  - WCAG 2.1 AA; GIGW 3.0 practices.
  - English and Telugu at launch.
  - Plain-language legal summaries next to the exact citations.
- **Data residency:** all personal data and logs stay in India regions.
- **Observability:** SLOs per journey (plan, apply, track); adapter freshness SLOs; alerting via on-call rotation.

---

## 17. Open-source reuse plan

Details and licence checks are in `research/01-open-source-repos.md`.

| Use directly (dependency or service) | Use as reference/spec only | Avoid |
|---|---|---|
| Temporal + Go SDK, GoRules ZEN/zen-go/jdm-editor, OPA, River, pgx/sqlc/goose, PostGIS, paulmach/orb, Keycloak, Photon, Martin, MapLibre, Gotenberg, ClamAV, Tessera, pgaudit, RJSF, santhosh-tekuri/jsonschema, OpenTelemetry, OpenTofu, Argo CD, SeaweedFS (on-prem), DIGIPIN (port) | **UPYOG** (`tl-services`, `tl-calculator`, `firenoc-services`, `pgr-services`, `inbox`) and **DIGIT Core** (`egov-workflow-v2`, `mdms-v2`, `boundary-service`): domain models and state machines. Docassemble (interview patterns), Catala (statute modelling), GOV.UK Frontend / Forms, Canada GC Forms, GC/GOV.UK Notify, UNCTAD eRegulations data model, BizPaL UX | Camunda 8 (paid production licence), Camunda 7 CE (end of life), MinIO (archived), immudb / Restate / Vault (BSL), Inngest (SSPL), Beckn specs (non-commercial), unlicensed repos (egov-mdms-data, PincodeBoundary), forking AGPL projects |

## 18. Data sources plan

Details are in `research/02-govt-data-sources.md`.

**Day one (no approvals needed):**
- LGD bulk downloads and the monthly delta.
- data.gov.in: Pincode Directory with lat/lng, and LGD villages ↔ PIN.
- NDAP.
- datameet municipal and ward boundaries (CC BY); GHMC/Telangana open-data ward shapefiles.
- Survey of India boundary, for display.
- NIC 2008 + NIC 2025, with a crosswalk.
- GST HSN/SAC master.
- Rules corpus built by hand from NSWS KYA, FoSCoS eligibility, BRAP, India Code, eGazette, Telangana G.O.s and the TM Trade Licence Rules 2020.
- UPYOG specs; Bhashini prototype keys; UX4G (via CDN).

**Attribution:** a public `/data-sources` page credits GODL and CC BY sources. ODbL share-alike is respected wherever we republish derived data.

---

## 19. Partnerships and approvals (start in week 1)

| Track | Route | Lead time | Unblocks |
|---|---|---|---|
| Telangana MA&UD / CDMA, GHMC, Cyberabad MC | Pilot MoU or letter of support; data sharing for trade-licence status (L2→L3) | 3–6 months | C3 trade licence, officer contacts, boundary data |
| Small municipality (Siddipet / Karimnagar) | L4 officer-console pilot | 3–6 months | Native flow + north-star measurement |
| Telangana Labour Dept | S&E status API or bulk confirmation | 3–6 months | C3 S&E |
| DigiLocker Requester / Auth Partner | dlpartners.meripehchaan.gov.in | 1–3 months | Sign-in, document pull |
| UIDAI OVSE | ovse.uidai.gov.in | weeks–months | Aadhaar offline verification |
| eSign ASP | Agreement with an empanelled ESP | 1–4 weeks | Signed applications (P1) |
| GSP + KYC aggregator | Commercial contracts | days | GSTIN, PAN, Udyam, FSSAI checks |
| Bhashini production | DIBD MoU | 1–3 months | Production translation and voice |
| NIC Bharat Maps | Registration / approval | months | Official boundaries |
| API Setu | Publisher-by-publisher approval | months | Government verification APIs (long-term) |
| DPIIT / NSWS | Engage as a complementary local-body layer; deep links now, integration with government sponsorship later | 6–12 months | National path |
| Legal counsel | DPDP, Aadhaar, scraping/terms review, entity structure | week 1 | Launch sign-off |

---

## 20. Pre-launch verification list (from research)

Each item must be resolved, or the affected rule must stay `L`-confidence and unpublished.

1. GHMC trade-licence fee-rate PDF and the 2026 renewal circular (official text).
2. Whether Cyberabad MC and Malkajgiri MC use `trade.ghmc.gov.in`, and how legacy TINs carry over.
3. CDMA trade-licence portal URL; fee resolutions in the chosen small municipality.
4. Whether Telangana will drop S&E registration for units registered under the OSH Code (as Maharashtra and Haryana did).
5. Fire NOC triggers for shops and restaurants under 15 m (area, seating, LPG, basement).
6. Annexure to TGPCB Circular 94/2025: whether small bakeries fall in the White category.
7. Whether the FSSAI registration manufacturing-capacity cap survives the amendment of 10 Mar 2026.
8. Professional-tax portal and the threshold for entity enrolment.
9. Labour portal fee table for S&E.
10. Whether the LGD `lgdws` web services are live; commencement dates for Jan Vishwas 2026 and the DPDP Removal of Difficulties Order; current API Setu publishers.

---

## 21. Roadmap

| Phase | Weeks | Deliverables | Exit criteria |
|---|---|---|---|
| **0. Foundations** | 1–3 | Repo, CI/CD, IaC (dev and staging on EKS), Keycloak, Postgres/PostGIS, Temporal, OTel; ADRs; threat model v0; counsel engaged; partnership applications filed (DigiLocker, OVSE, GSP, Bhashini) | `make up` works locally; staging deploys through GitOps |
| **1. Data + rules core** | 3–8 | LGD/pincode/NIC ingestion; boundary sets including the GHMC 2026 reorganisation; resolver (FR-01); rules engine + console (FR-02, FR-11); seed rules for both archetypes; 60-scenario golden suite; field-verification sprint in Hyderabad (§20) | ≥ 98% ULB resolution on the test set; golden suite green; all P0 rules at H/M confidence |
| **2. Applicant MVP** | 8–14 | Interview + permit plan (FR-03), profile (FR-04), vault (FR-05), packets (FR-06), fees and receipts (FR-07), tracker (FR-08) with L1/L2 adapters, grievances (FR-09), notifications (FR-10), English + Telugu | 10 real entrepreneurs complete a plan → submission in moderated tests |
| **3. Hardening + closed pilot** | 14–20 | VAPT, DPIA, load tests, DR drill, accessibility audit; ops console (FR-12); closed pilot with 50–100 businesses across 3 ULBs | No open Sev-1/Sev-2 issues; baseline vs. pilot metrics captured |
| **4. Integrations** | 20–30 | DigiLocker, OVSE, GSP/aggregator checks; first L3 adapter (MoU-dependent); public catalogue (FR-13); Hindi | At least one C3 service live, or a documented blocker and fallback |
| **5. Expand** | 30–52 | L4 officer console with a partner municipality (FR-14, FR-15); renewals and branches; second state (Karnataka is the leading candidate: deemed S&E registration under the 2026 amendment); adapter SDK | Second state live at C1/C2; published performance data |

**Team (minimum, production grade):**
- Product/engineering lead
- 3 Go backend engineers (one focused on integrations and security)
- 1 frontend engineer
- 1 product designer (accessibility and Telugu UX)
- 1 SRE/platform engineer
- Legal/regulatory researcher (0.5 → 1)
- QA/security (0.5)
- Pilot operations lead (field verification, authority relations, assisted support)

**Budget band:** "Production pilot with legal, security and integration specialists": ₹60 lakh–₹1.5 crore for months 0–6. Cloud spend is roughly ₹1.5–3 lakh a month for the pilot footprint.

---

## 22. Risks

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| A wrong or missing mandatory requirement leads to a user's business being penalised | M / **High** | Confidence gating; two-person publishing; golden tests; "needs confirmation" state; visible `last_verified`; fast withdrawal; clear disclaimer that the authority decides; professional indemnity insurance |
| Jurisdiction churn (GHMC split, High Court challenge) | **H** / M | Versioned boundaries; watch flags; ops ticket loop; plan diffs notified to users |
| No MoU, so we stay at C2 | H / M | C2 is useful on its own (planning + packets + tracker + grievances); measure and publish the value to build the adoption case |
| Public status lookups change or become blocked (L2) | M / M | Adapter health checks; fall back to L1; legal review of each source's terms |
| Data breach / identity misuse | L / **High** | Minimise data (no Aadhaar numbers); field encryption; least privilege; VAPT; CERT-In runbook |
| DPDP / Aadhaar non-compliance | L / High | Counsel sign-off; DPIA; consent ledger; OVSE/DigiLocker only |
| Seen as "yet another portal" or as competing with NSWS | M / M | Position as the complementary local-body layer; deep-link to NSWS; open data; aim for government adoption |
| Bribe-reporting creates conflict with officials | M / M | Consented, private routing to vigilance and grievance channels; no public naming; evidence handling SOP |
| **Retaliation against reporters** (new queries, surprise inspections, renewal refusals) | M / **High** | Reporter controls when a report is forwarded; retaliation watch (I-12); priority escalation; counsel-reviewed reporter protections |
| **Entrenched officers resist or sabotage partnerships** (to protect informal income) | H / M | Start with willing reform-minded commissioners; publish office-level aggregates to create public pressure; work with BRAP/EoDB cells, which are scored on these metrics |
| **Defamation / legal threats** over published data | M / M | Aggregate office-level stats only, with k-thresholds; published methodology; no individual naming; legal review |
| Go/Rust talent and cgo complexity (zen-go) | L / L | ZEN wrapped behind a `rules.Engine` interface; a pure-Go fallback evaluator is possible for simple tables |

---

## 23. Open questions for the founder

1. Legal entity: for-profit startup, Section 8 non-profit, or a government-backed project? This affects funding, procurement eligibility and how much the public trusts us.
2. ~~Licence~~ **Decided:** open source. Code under Apache-2.0; rules catalogue and research data under CC BY 4.0. See README.
3. Brand and domain: "India Business One" needs trademark and domain checks, and must avoid implying government affiliation (no national emblem, no gov.in-like domains).
4. Cloud: AWS India as the default, or a hard requirement for NIC/government cloud from day one?
5. Is a CSC/facilitator-led assisted channel in scope for the pilot, or self-serve only?

---

## Appendix A: Glossary

| Term | Meaning |
|---|---|
| ULB | Urban local body: municipal corporation, municipality or nagar panchayat |
| LGD | Local Government Directory (MoPR), the canonical codes for administrative units |
| NSWS | National Single Window System (DPIIT) |
| CDMA | Commissioner & Director of Municipal Administration (Telangana) |
| S&E | Shops & Establishments registration |
| OVSE | Offline Verification Seeking Entity (UIDAI) |
| ESP / ASP | eSign Service Provider / Application Service Provider (CCA eSign) |
| GSP | GST Suvidha Provider |
| JDM | JSON Decision Model (GoRules ZEN format) |
| C0–C4 / L0–L4 | Coverage tier (user-facing) / adapter capability level (technical) |
