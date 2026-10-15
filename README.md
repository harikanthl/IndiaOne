# India Business One (IndiaOne)

**One India. One business profile. Every eligible local approval.**

IndiaOne is an **open-source, public-interest platform**. Any Indian entrepreneur should be able to pick an address anywhere in India, describe their business, and see every licence and registration the law requires there. They can then apply, pay only the official fees, and track every decision in one place. When a file gets stuck on someone's desk, the platform helps them escalate.

> 🇮🇳 **A call to India's builders.** IndiaOne is a citizen-led effort, and we're asking India's engineers, designers, lawyers, policy researchers, civil servants, data people and small-business owners to help build it. If you have ever lost weeks, money or dignity getting a trade licence, you already understand the problem. Come help fix it.

---

## Why this exists

India has a national market for goods, services and capital. Opening a physical business, though, still means working through a maze of state departments, municipal bodies and local inspectors, each with its own forms, fees and timelines.

The National Single Window System (NSWS) helps with central and state approvals. The hardest part for small businesses is still the **local layer**: municipal trade licences, Shops & Establishments registration, food safety, fire, signage and pollution consent. That layer also has a human problem. **One officer holds the file, the file stalls, and an unofficial payment unsticks it.**

IndiaOne attacks both problems:

1. **Clarity.** A location-first permit plan. Every requirement comes with its legal citation, its official fee (with the working shown), its published timeline, and when it was last checked.
2. **Integrity.** Every application has a clock, an escalation ladder, an RTI generator and a deemed-approval assistant where the law allows one. Applicants can report bribe demands safely to the Anti-Corruption Bureau or vigilance, keep tamper-evident evidence, and get protection from retaliation. Office-level performance data is public. See [PRD §12](docs/PRD.md#12-integrity-anti-corruption-and-anti-chokepoint-design).

We are **not** a government authority and we never grant licences. We make the lawful path clear, traceable and hard to block.

## Status

🚧 **Pre-alpha (October 2026).** We have the PRD, the research and a clickable UI prototype with sample data. There is no backend yet. This is the best time to shape the architecture.

| Read this | What's inside |
|---|---|
| 📄 [**docs/PRD.md**](docs/PRD.md) | The product requirements: scope, journeys, functional requirements, integrity design, architecture, stack, data model, roadmap, risks |
| 🧩 [research/01-open-source-repos.md](research/01-open-source-repos.md) | Open-source projects we can reuse (licences checked), and licence traps to avoid |
| 🏛️ [research/02-govt-data-sources.md](research/02-govt-data-sources.md) | Indian government data and APIs: what's usable on day one, and what needs a partnership |
| 📍 [research/03-pilot-state-telangana.md](research/03-pilot-state-telangana.md) | Telangana pilot research and draft seed rules for a shop and a bakery |

## The first pilot

- **State:** Telangana
- **Urban local bodies (ULBs):** GHMC, Cyberabad Municipal Corporation, and one smaller municipality (Siddipet or Karimnagar)
- **Business types:** (A) small retail shop, (B) bakery / café / small food outlet
- **Goal:** for every requirement, a correct permit plan, a pre-filled application packet, a single tracker, and an escalation path that works

After the pilot proves the model, it expands state by state. Karnataka is the likely next state.

## Try the UI skeleton

A clickable prototype of the citizen experience lives in [`apps/web`](apps/web). It uses Next.js and sample data from the Telangana pilot research.

```bash
cd apps/web
pnpm install
pnpm dev        # http://localhost:3000
```

| Screen | Route | What it shows |
|---|---|---|
| Home | `/` | The address resolves to state, district, corporation, zone and ward, then the stalled-file story |
| Start | `/start` | Confirm the pin (boundary warning), then the guided business questions |
| Permit plan | `/plan` | Every approval with its status stamp, the official fee and how it's worked out, the law, coverage tier and last-checked date |
| Track files | `/track` | Desk-by-desk progress, SLA clock, status provenance, and an escalation ladder you can act on |
| Report | `/report` | A private bribe-demand report: you choose who receives it and when |
| Office records | `/offices` | Office-level processing times, late rates and repeat-query rates |

**Design language:**
- Indian office vernacular: stamp-pad violet, green ink for approvals, red tape for stalls, buff file covers.
- Typefaces: Anek and Mukta, both by the Indian foundry Ek Type.
- Art: public-domain and CC0 Deccani, Hyderabadi and Company School paintings from The Met, the Cleveland Museum of Art, the Art Institute of Chicago and the British Library. Credits are in [`apps/web/public/art/credits.json`](apps/web/public/art/credits.json).
- Design research is in [`research/04-design-brief.md`](research/04-design-brief.md).

## How it works (v1)

```text
Address / PIN / DIGIPIN / map pin
        │
        ▼
Jurisdiction resolver ──► state → district → ULB → ward (LGD codes, versioned boundaries)
        │
        ▼
Guided interview ──► activity (NIC), premises, staff, turnover, food handling …
        │
        ▼
Rules engine (GoRules ZEN, Rust) ──► permit plan: required / conditional / not required,
        │                             legal citation, official fee, timeline, authority
        ▼
Business profile + document vault ──► pre-filled packets for each authority
        │
        ▼
Apply (hand-off or API) ──► tracker with status provenance + SLA clocks
        │
        ▼
Stalled? ──► reminder → supervisor → CPGRAMS → RTI → deemed approval (where lawful)
Bribe demand? ──► private report → vigilance / ACB (1064 in Telangana), on the reporter's terms
```

Each integration declares an honest **capability level**:

| Level | What we can do with that authority |
|---|---|
| L0 | Information only |
| L1 | Guided hand-off |
| L2 | Status from public lookups |
| L3 | API integration under an MoU |
| L4 | The authority uses our officer console |

We **never** claim "live status" we don't have, and we **never** scrape systems that sit behind a login.

## Tech stack

A production-grade stack. **Go and Rust wherever possible.**

| Layer | Choice |
|---|---|
| Backend | **Go** modular monolith (chi, oapi-codegen, pgx, sqlc, goose) |
| Rules engine | **GoRules ZEN** (Rust core) via zen-go. Rules are versioned data with legal citations. |
| Workflows | **Temporal** (Go SDK): SLA timers, retries, long-running applications |
| Jobs | **River** (Go, Postgres-backed) |
| Database | **PostgreSQL 17 + PostGIS**, with pgaudit |
| AuthZ / AuthN | **OPA** (embedded Go library) / **Keycloak** (OIDC, MFA for staff) |
| Audit | Append-only hash-chained events, anchored in a **Tessera** transparency log (Go) |
| Maps | PostGIS + **Martin** (Rust) vector tiles + MapLibre; Photon geocoder; DIGIPIN |
| Web | **Next.js + TypeScript**: accessible (WCAG 2.1 AA, GIGW 3.0), English + Telugu first |
| Infra | OpenTofu, Kubernetes (EKS India regions), Argo CD, OpenTelemetry → Grafana |

The full rationale and the deliberate exceptions to Go/Rust are in [PRD §14](docs/PRD.md#14-technology-stack-production).

## Planned repository layout

```text
apps/web            Next.js citizen + officer + rules console
services/core-api   Go modular monolith
services/worker     Temporal + River workers, government adapters
pkg/                Shared Go libraries (audit, consent, otel)
api/openapi.yaml    HTTP contract (source of truth)
rules/              Rule decision graphs (JDM), fixtures, golden scenario tests
data/ingest         LGD, pincode, NIC 2008/2025, boundary ingestion CLIs
db/                 Migrations and sqlc queries
policies/           OPA Rego policies
infra/              OpenTofu, Helm, Argo CD
docs/               PRD, ADRs, runbooks, threat model
research/           Research snapshots with sources
```

## How you can contribute

You don't have to write Go to make a big difference. These are the areas we need help with most:

| If you are… | You can help by… |
|---|---|
| **A Go or Rust engineer** | Building the jurisdiction resolver, rules engine integration, Temporal workflows, adapters and the audit log |
| **A frontend / accessibility engineer** | Building the citizen PWA on low-end Android and 3G, accessible forms, the officer console |
| **A designer / UX researcher** | Designing Telugu-first, low-literacy journeys; testing with real shopkeepers |
| **A lawyer, CA, CS or policy researcher** | Encoding and **verifying rules**: Acts, rules, G.O.s, fee schedules and timelines, with citations. Reviewing DPDP, Aadhaar and RTI flows. |
| **A data / GIS person** | Ingesting LGD data, building ward boundaries for your city, maintaining the NIC 2008↔2025 crosswalk |
| **A translator** | Translating into Telugu, Hindi, Urdu and every other Indian language, starting with legal plain-language summaries |
| **A current or former government official** | Explaining how files actually move, where they stall, and which reforms work |
| **An entrepreneur** | Telling us your licensing story (anonymously if you prefer). Real cases become test scenarios. |
| **Someone in another state** | Researching your state's trade-licence, S&E and food-safety rules, and getting your state ready for the next expansion |

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Good first contributions right now:

1. **Verify a rule.** Pick an item from the [pre-launch verification list](docs/PRD.md#20-pre-launch-verification-list-from-research) and find the official source.
2. **Research a state.** Copy `research/03-pilot-state-telangana.md` as a template for your state.
3. **Review the PRD.** Open an issue with critiques, gaps or better designs.
4. **Write an ADR.** Propose an architecture decision (`docs/adr/NNNN-title.md`).

## Principles we won't compromise on

- **Accuracy over coverage.** A wrong "not required" can get a shopkeeper penalised. Every rule has a citation, a reviewer and a confidence level. We'd rather say "needs confirmation" than guess.
- **Only official fees, and never "faster" processing for sale.** No paid priority, ever.
- **Minimal personal data.** We never store Aadhaar numbers. Consent is tied to a purpose. Data stays in India.
- **Name patterns, not people.** Public data covers offices and services. Individual allegations go only to authorities who can act on them.
- **Honest labels.** Every status shows where it came from and when.
- **Open by default.** Open code, an open rules catalogue, open methodology.
- **Complement the government.** We work alongside NSWS and state systems, and aim to have governments adopt this infrastructure.

## Licence

- **Code:** [Apache License 2.0](LICENSE)
- **Rules catalogue, research and documentation:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), unless a file says otherwise
- **Third-party data** keeps its own licence (for example GODL-India, CC BY 4.0, ODbL). See `research/02-govt-data-sources.md`.

## Disclaimer

IndiaOne is an independent citizen initiative. It is **not affiliated with, endorsed by, or acting for** the Government of India, any state government or any local body. Permit plans are guidance; the competent authority makes the decision. Always confirm with the issuing authority before you rely on a requirement. Nothing here is legal advice.

## Security

Found a vulnerability? Please **don't** open a public issue. See [SECURITY.md](SECURITY.md).

---

*Built in India, for every Indian who wants to build something.*
