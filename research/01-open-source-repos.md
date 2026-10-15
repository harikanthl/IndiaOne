# Open-source projects we can reuse (verified 14 Oct 2026)

*Every repo, licence and last-push date was checked through the GitHub API on 14 Oct 2026. Where GitHub reported "NOASSERTION", the LICENSE file itself was read. Anything not confirmed is marked UNVERIFIED.*

**Tags.** The backend is Go and Rust first.

- **[REF]** Java, Python or Node project. We use it only as a reference or spec.
- **[SVC]** Not Go or Rust, but runs as a separate service that our Go code calls.

## 1. Indian govtech

| Project | URL | Licence | Activity | What we'd reuse | Caveats |
|---|---|---|---|---|---|
| **DIGIT Core** (eGov) | github.com/egovernments/Digit-Core | MIT | Active (pushed 2026-10-14) | **[REF]** Designs of `egov-workflow-v2` (JSON-configured state machine), `mdms-v2` (versioned master data with JSON Schema), `boundary-service`, `egov-idgen`, `egov-pg-service`, `audit-service`, `egov-filestore`, `egov-localization`, `egov-malware-detection` | Java/Spring and Kafka, heavy to run. Copy the data models and contracts, not the code. |
| DIGIT Urban (Trade Licence, Fire NOC, building plans, grievances) | github.com/egovernments/URBAN | MIT | **Archived May 2026** | **[REF]** Trade-licence, Fire NOC and building-plan approval flows (including automated drawing checks), the grievance system, fee calculators | Succeeded by UPYOG |
| DIGIT-OSS | github.com/egovernments/DIGIT-OSS | MIT | **Archived** | History only | Don't build on it |
| egov-mdms-data | github.com/egovernments/egov-mdms-data | **No licence** | Archived | Shows how sample trade-type and fee data is structured | All rights reserved: learn the structure only, don't copy |
| **UPYOG** (MoHUA/NIUA) | github.com/upyog/UPYOG | MIT | **Active** | **[REF]** `tl-services`/`tl-calculator`, `firenoc-services`, `bpa-services`, `noc-services`, `pgr-services`, `billing-service`/`collection-services`, `inbox`. **The best domain blueprint for Indian trade licences.** | Java (DIGIT). Use this repo, not the stale `egovernments/upyog` or `upyog-niua/UPYOG`. |
| eGovStack core-services | github.com/eGovStack/core-services | MIT | Feb 2026 | — | Low activity |
| Citizen-Complaint-Resolution-System | github.com/egovernments/Citizen-Complaint-Resolution-System | MIT | Active | **[REF]** Standalone grievance system | Maturity unclear |
| MOSIP eSignet | github.com/mosip/esignet | MPL-2.0 | Active | **[SVC]** Pattern for OIDC login on top of national ID | We'll more likely use DigiLocker / Meri Pehchaan |
| Sunbird RC | github.com/Sunbird-RC/sunbird-rc-core | MIT | Active | **[SVC]** Schema-driven registry and W3C verifiable credentials; could issue permits as VCs (P2) | Java; UI is stale |
| OpenG2P | github.com/OpenG2P/openg2p-registry | LGPL-3.0 | Jun 2026 | — | Wrong domain (social protection) |
| Beckn ONIX | github.com/beckn/beckn-onix | MIT | Active | Go Beckn adapter (P2+) | Out of v1 scope |
| Beckn protocol specs | github.com/beckn/protocol-specifications | **CC BY-NC-SA 4.0** | — | Read only | **Non-commercial licence: trap** |
| ONDC reference implementations | github.com/ONDC-Official/reference-implementations | MIT | Jul 2026 | Reference | `developer-docs` has no licence |
| Bhashini ULCA | github.com/bhashini-dibd/ulca | MIT | Jan 2026 | Model catalogue | No official Bhashini SDK (UNVERIFIED). Write a Go HTTP client. |
| DigiLocker | — | — | — | Use the OAuth2 + PKCE Requester API spec on API Setu | **No official open-source SDK**, and `digilocker/sample_code` doesn't exist |
| **DIGIPIN** (India Post) | github.com/INDIAPOST-gov/digipin | Apache-2.0 | May 2026 | Grid-based digital address code (4×4 m cells); trivial to port to Go | Use this repo; the CEPT-VZG copy has no licence |
| State single-window code | — | — | — | — | **No real open-source state single-window system found** |

## 2. Rules as code

| Project | URL | Licence | Fit |
|---|---|---|---|
| **GoRules ZEN** (Rust core) + **zen-go** + **jdm-editor** | github.com/gorules/zen, /zen-go, /jdm-editor | MIT | **Top pick.** Decision tables in JSON Decision Model (JDM) format, run in-process. The editor is a React component for the admin console. |
| **OPA** (Go) | github.com/open-policy-agent/opa | Apache-2.0 | Authorization for officers, scoped by local body (ULB) and ward. Can be embedded in a Go service. |
| Cedar (Rust) + cedar-go | github.com/cedar-policy/cedar, /cedar-go | Apache-2.0 | Alternative to OPA whose policies can be formally analysed |
| OpenFGA (Go) | github.com/openfga/openfga | Apache-2.0 | Relationship-based access control (ReBAC) |
| Casbin (Go) | github.com/apache/casbin | Apache-2.0 | Simple role-based access control |
| Catala | github.com/CatalaLang/catala | Apache-2.0 | **[REF]** Encodes statutes side by side with the legal text; useful for legal modelling and test oracles. No Go/Rust backend (UNVERIFIED). |
| OpenFisca | github.com/openfisca/openfisca-core | **AGPL-3.0** | Concepts only. There is no official openfisca-india. |
| json-rules-engine | github.com/CacheControl/json-rules-engine | ISC | Client-side previews only |
| Drools / Kogito | github.com/apache/incubator-kie-drools | Apache-2.0 | **[REF]** Java; avoid |
| **Docassemble** | github.com/jhpyle/docassemble | MIT | **[REF]** Best reference for guided legal interviews |
| Blawx | github.com/Lexpedite/blawx | MIT | Stale (Nov 2024) |

## 3. Workflow, queues and forms

| Project | URL | Licence | Notes |
|---|---|---|---|
| **Temporal** + Go SDK | github.com/temporalio/temporal, /sdk-go | MIT | **Top pick.** Long-running approvals with deadline timers, retries and versioning. The server is written in Go. |
| **River** | github.com/riverqueue/river | MPL-2.0 | Go job queue built on Postgres. File-level copyleft, fine to use unmodified. |
| Hatchet | github.com/hatchet-dev/hatchet | MIT | Lighter Go alternative to Temporal |
| Conductor OSS | github.com/conductor-oss/conductor | Apache-2.0 | [SVC] Java server |
| Flowable / CIB seven / Operaton | — | Apache-2.0 | [REF] Java BPMN engines |
| Camunda 7 CE | github.com/camunda/camunda-bpm-platform | Apache-2.0 | **Archived. End of life with 7.24 (14 Oct 2025).** |
| Camunda 8 | github.com/camunda/camunda | **Camunda License 1.0** | **Trap:** production use needs a paid licence |
| Restate | github.com/restatedev/restate | **BSL 1.1** | Source-available |
| Inngest | github.com/inngest/inngest | **SSPL** | Trap for self-hosting |
| **RJSF** | github.com/rjsf-team/react-jsonschema-form | Apache-2.0 | **Top pick** for forms: renders JSON Schema in the web app; Go validates the same schema with `santhosh-tekuri/jsonschema` (Apache-2.0) |
| JSON Forms | github.com/eclipsesource/jsonforms | MIT | Alternative with a UI schema |
| SurveyJS | github.com/surveyjs/survey-library | MIT runtime | **Creator is commercial** |
| Form.io | github.com/formio/formio | OSL-3.0 server | Copyleft |
| GOV.UK Forms, XGov Form Builder, Canada GC Forms, Singapore FormSG | govuk-forms/*, XGovFormBuilder/*, cds-snc/platform-forms-client, opengovsg/FormSG | MIT | [REF] Patterns for versioning and publishing forms |

## 4. Geo and jurisdiction lookup

| Project or data | URL | Licence | Notes |
|---|---|---|---|
| **PostGIS** + `paulmach/orb` / `twpayne/go-geom` + pgx | — | MIT / BSD-2 | Core of the address-to-authority lookup |
| Tile38 (Go) | github.com/tidwall/tile38 | MIT | Optional geofencing service |
| Nominatim | github.com/osm-search/Nominatim | GPL-3.0 | [SVC] Geocoder. GPL covers the service only. Indian address quality is mediocre. |
| **Photon** | github.com/komoot/photon | Apache-2.0 | [SVC] Address autocomplete over OpenStreetMap (OSM) data, multilingual |
| Pelias | github.com/pelias/pelias | MIT | [SVC] Heavy (Elasticsearch) |
| **Martin** (Rust) / pg_tileserv (Go) | maplibre/martin, CrunchyData/pg_tileserv | Apache-2.0 | Serve vector map tiles |
| **datameet/maps** | github.com/datameet/maps | Code MIT, data CC BY 4.0 | Not the official Survey of India boundary; show a disclaimer |
| **datameet/Municipal_Spatial_Data** | github.com/datameet/Municipal_Spatial_Data | CC BY 4.0 (stated in README) | Ward boundaries for about 27 cities; ages vary (last push Feb 2024) |
| datameet/indian_village_boundaries | github.com/datameet/indian_village_boundaries | ODbL-1.0 | Share-alike; stale |
| datameet/PincodeBoundary | — | No licence | Unusable |
| ramSeraph/opendata, ramSeraph/indian_admin_boundaries | — | Unclear | Mirrors of LGD and Survey of India data; check the original source terms |
| **LGD** | lgdirectory.gov.in | GODL | **Canonical codes; use as the primary keys** |

## 5. Identity, audit, storage, observability and UI

| Project | URL | Licence | Notes |
|---|---|---|---|
| Ory Kratos/Hydra/Keto (Go) | github.com/ory/* | Apache-2.0 | Go-native; open-source release pace has slowed |
| **Keycloak** | github.com/keycloak/keycloak | Apache-2.0 | [SVC] Most complete identity provider: realms, SAML, identity brokering |
| Zitadel (Go) | github.com/zitadel/zitadel | **AGPL-3.0** (since v3) | Fine as an unmodified service. The `zitadel/oidc` library is Apache-2.0. |
| Casdoor (Go) | github.com/casdoor/casdoor | Apache-2.0 | Alternative identity provider |
| **pgaudit** | github.com/pgaudit/pgaudit | PostgreSQL | Database-level audit logging |
| **Tessera** / Trillian (Go) | transparency-dev/tessera, google/trillian | Apache-2.0 | Tamper-evident Merkle log. Tessera is the newer, simpler option. |
| immudb | github.com/codenotary/immudb | **BSL 1.1** (recent versions) | Trap |
| MinIO | github.com/minio/minio | AGPL-3.0, **archived** | Don't use. Use SeaweedFS (Go, Apache-2.0) or managed S3. |
| ClamAV | github.com/Cisco-Talos/clamav | GPL-2.0 | [SVC] Run `clamd` as a separate daemon over a socket |
| **Gotenberg** (Go) | github.com/gotenberg/gotenberg | MIT | PDF generation |
| **OpenBao** | github.com/openbao/openbao | MPL-2.0 | Secrets management. Vault is BSL. |
| OpenTelemetry Collector | github.com/open-telemetry/opentelemetry-collector | Apache-2.0 | Standard. Grafana Loki is AGPL. |
| **sqlc, pgx, goose** | sqlc-dev/sqlc, jackc/pgx, pressly/goose | MIT | Go data layer |
| UX4G (NeGD) | github.com/ux4g/ux4g-design-system-v1, doc.ux4g.gov.in | **No licence file on the code**; docs CC BY 3.0 | Reuse rights for the code are UNVERIFIED. Use the official CDN and confirm terms with NeGD. |
| GOV.UK Frontend | github.com/alphagov/govuk-frontend | MIT | Proven accessible patterns. Don't use the crown or other GOV.UK branding. |
| USWDS | github.com/uswds/uswds | CC0 | Accessible components |
| GOV.UK / GC Notify | alphagov/notifications-api, cds-snc/notification-api | MIT | [REF] Design for a notification service |

## 6. Other countries' business portals

- **UNCTAD eRegistrations:** the old framework is MIT but archived since 2018. The current platform is not open source (UNVERIFIED). Learn from the eRegulations data model: step, requirement, cost, legal basis.
- **BizPaL (Canada), GoBusiness (Singapore), Business.gov.au, Estonia:** no source code is published. Borrow their UX ideas and the "jurisdiction × activity → permits" model.
- **GovStack** building-block specs: a useful shared vocabulary. The API repo is GPL-3.0 and stale.

## Top 10 for v1

1. **Temporal + Go SDK:** application workflows, deadline timers, adapter retries
2. **GoRules ZEN + zen-go + jdm-editor:** the rules engine (checklist and fees), with citation metadata
3. **PostGIS + pgx + sqlc + LGD codes + datameet wards:** the jurisdiction resolver
4. **Keycloak** [SVC], or Ory as the Go-native alternative: identity (OIDC) and brokering to DigiLocker / Meri Pehchaan
5. **OPA** or **Cedar:** officer authorization
6. **RJSF + santhosh-tekuri/jsonschema:** one JSON Schema per form, used in both the web app and Go
7. **River:** background jobs on Postgres
8. **UPYOG + DIGIT Core** [REF]: domain blueprint for trade licences, NOCs, grievances and fees
9. **pgaudit + Tessera:** tamper-evident audit trail
10. **Photon/Nominatim** [SVC] + **Martin** + DIGIPIN: geocoding and map tiles

## Licensing traps

- **Licences that block or restrict commercial or production use:** Beckn specs (CC BY-NC-SA), Camunda 8, immudb, Restate, Vault (BSL), Inngest (SSPL), Flipt (Fair Core), SurveyJS Creator.
- **AGPL:** Zitadel, OpenFisca, Grafana Loki, Unleash. Run them only as unmodified separate services; never embed or fork them.
- **Copyleft:** Form.io server (OSL), and ODbL data (datameet villages, OSM).
- **No licence file, so no right to copy:** egov-mdms-data, datameet/PincodeBoundary, CEPT-VZG/digipin, UX4G v1 code, ONDC developer-docs.
- **Archived:** the DIGIT repos (DIGIT-OSS, URBAN, municipal-services, business-services, egovernments/upyog), MinIO, Camunda 7 CE.
- **Unofficial India maps:** datameet and OSM boundaries differ from the official Survey of India boundary. Show a disclaimer.
