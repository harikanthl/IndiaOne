# Government data sources and APIs for v1

*Research snapshot, 14 Oct 2026. **[V]** = confirmed on an official page or in several consistent sources this session. **[S]** = based on secondary or vendor sources, or prior knowledge. Check [S] items against the official page before building on them.*

**Summary.** Most of what the rules engine needs is free to use from day one: geography codes, business classifications, the text of the law, and design and accessibility kits. Anything that involves a person or a business is not. Identity checks, document pulls and official fee payment all need empanelment, a government sponsor, or a commercial aggregator. Official fee payment is the hardest. A private portal cannot legally collect government fees into the treasury, so **send users to the department's payment page** and collect only our own service fee through an RBI-authorised payment aggregator.

## 1. Jurisdiction and geography

| Source | URL | Data | Access | Licence | How we use it |
|---|---|---|---|---|---|
| **Local Government Directory (LGD)**, MoPR [V] | lgdirectory.gov.in/downloadDirectory.do | Codes for states, districts, sub-districts, blocks, villages, urban local bodies (ULBs), panchayats and wards. Changes-only downloads. Mapping to Census 2011 codes. | Open download in CSV/XLS/XML. About 22 web services under `/webservice/lgdws/` (stateList, districtList, localBodyList…); only third parties document them, so test before relying on them. | GoI open data [S] | **Primary jurisdiction key** |
| LGD datasets on OGD [V] | data.gov.in (LGD local bodies, villages, villages with PIN codes, sub-districts) | Copies of LGD, including "Villages with PIN Codes" | CSV download, updated monthly | GODL-India | Join PIN codes to villages |
| **All India Pincode Directory** [V/S] | data.gov.in resource `5c2f62fe5afa4119a499fec9d604d5bd`, plus a version with latitude/longitude | About 157k post offices: PIN, district, state, latitude/longitude | Free OGD API key or CSV. About 9k rows have bad coordinates. | GODL-India | First guess at location. One PIN can span several ULBs, so always ask the user to confirm. |
| Census 2011 town/village directory [S] | censusindia.gov.in | 2011 codes and town class | XLS | GoI | Historic joins only. Census 2027 is still in fieldwork. |
| MoHUA ULB lists, NUDM [V] | mohua.gov.in, nudm.mohua.gov.in | ULB lists and the UPYOG trade-licence spec | PDF and downloads | GoI | Check ULB types |
| **Bharat Maps** (NIC) [V/S] | bharatmaps.gov.in | 23 map layers, village-level boundaries linked to LGD codes | Free to view. Map services (WMS/REST) need NIC approval. | Restricted | Find which polygon an address falls in, once access is approved |
| Bhuvan (NRSC/ISRO) [S] | bhuvan.nrsc.gov.in | Map tiles and thematic layers | Registration needed | Bhuvan terms | Background map layers |
| Survey of India [V] | onlinemaps.surveyofindia.gov.in | Open Series Maps | Account needed. No resale and no sharing with foreign entities. | SoI terms | Official outer boundary of India for any map users see |
| PM Gati Shakti [S] | pmgatishakti.gov.in | Infrastructure and land-use layers | Government users only | Restricted | Not for v1 |
| **DataMeet** [V] | projects.datameet.org/maps, Municipal_Spatial_Data, indian_village_boundaries | Community-built boundaries for states, districts, municipalities and some wards | Free (GitHub) | **Municipal data CC-BY 4.0; village data ODbL** (share-alike) | **Day-one** ward and ULB lookup by location |
| State GIS portals [S] | KGIS, data.telangana.gov.in, GHMC/BBMP open data | Ward boundaries, zoning in some cities | Varies by state | Varies | Ward-level precision |

## 2. Business classification

| Source | Details | Access |
|---|---|---|
| **NIC 2008** [V] | 5-digit activity codes used today by Udyam, GST and MCA | Free from mospi.gov.in |
| **NIC 2025** [V] | Released by MoSPI on 18 Nov 2025. 6-digit codes aligned to ISIC Rev 5. NIC Finder at nicfinder.mospi.gov.in. Portals are moving over gradually: Udyam and GST still mostly use NIC 2008. | Free. **Keep both versions plus a crosswalk between them.** |
| Udyam activity codes [S] | NIC 2008 at 2-, 4- and 5-digit levels | Free |
| GST HSN/SAC [S] | Excel downloads from CBIC and the GST portal. Rates changed under GST 2.0 (Sept 2025). | Free; reload regularly |
| **FSSAI kind of business** [V/S] | The FoSCoS eligibility tool decides registration, state licence or central licence from kind of business and turnover. Turnover bands reportedly changed on 1 Apr 2026: registration up to ₹1.5 cr, state licence ₹1.5–50 cr, central above ₹50 cr. **Confirm against the FSSAI notification.** | Public web tool, no API |

## 3. Regulatory catalogues and legal text

| Source | Status | How we use it |
|---|---|---|
| **NSWS "Know Your Approvals"** [V] | Covers 32 central departments and 35 states. Guidance only. **No public API or export.** Integration is offered only to government departments. | Manual reference for our rules; deep-link users to it |
| BRAP (eodb.dpiit.gov.in) [S] | State reform points, rankings and evidence | Checklist of each state's deemed-approval and timeline commitments |
| **India Code** [V/S] | Central and state Acts, rules and notifications. No official API (DSpace). | Cite as the legal source; scrape politely |
| eGazette and state gazettes [S] | Free PDFs | Watch for fee and form changes |
| **Jan Vishwas** [V/S] | The 2025 bill was withdrawn on 17 Mar 2026. Jan Vishwas 2026 (about 79 Acts) was reportedly passed in Apr 2026. **Check the gazette and commencement dates.** | Update penalty wording |
| Labour Codes and Shram Suvidha [S] | The four Labour Codes were reportedly in force from 21 Nov 2025. **Shops & Establishments remains a state Act.** Several states use self-certification or intimation below a headcount threshold. | Encode each state's S&E rules |

## 4. Identity, verification and document APIs

| Service | Realistic access route | Notes |
|---|---|---|
| **API Setu** [V] | Register on partners.apisetu.gov.in, subscribe, then each data publisher approves you. Private companies fall under the "offline consumer" category. | Weeks to months, case by case |
| **DigiLocker Requester / Auth Partner** [V] | Apply at dlpartners.meripehchaan.gov.in, get an API key, build, pass test and audit, go live | Lets users log in and pull issued documents. **Best government route for v1.5.** |
| Meri Pehchaan (national single sign-on) [V] | Mainly for government apps. Private apps go through the DigiLocker partner route. | e-Pramaan has been merged into it |
| **Aadhaar authentication (AUA/KUA)** [V] | Under s.4(4)(b) and the Good Governance Amendment Rules (31 Jan 2025): a ministry or state sponsors the use case, MeitY notifies it, then UIDAI onboards you | Not realistic for v1 |
| **Aadhaar offline verification (OVSE)** [V] | Register at ovse.uidai.gov.in. Works with the new Aadhaar app (Jan 2026), which supports QR codes, verifiable credentials and selective disclosure. | **Lightest legal Aadhaar route. Apply early.** |
| **eSign** (CCA) [V] | Become an Application Service Provider (ASP) with an empanelled eSign Service Provider (ESP): eMudhra, Protean, CDSL Ventures and others | 1–4 weeks. **Good v1 choice.** |
| GSTIN search [V] | Through a GST Suvidha Provider (GSP) such as Vayana, IRIS, Masters India or Cygnet | Commercial, takes days |
| MCA21 [S] | Free to look up manually. Bulk or API access through aggregators. | Use an aggregator |
| Udyam / PAN / FSSAI checks [S] | No public government API confirmed. Aggregators include Setu, Signzy, Gridlines, Zoop and Karza. | Aggregator, or pull the certificate from DigiLocker |

## 5. Payments

| Channel | Facts | Fit |
|---|---|---|
| **BharatKosh / NTRP** [V] | Collects central non-tax receipts. Runs on RBI e-Kuber 2.0. No merchant API. | Deep-link for central fees |
| State treasury e-challans [S] | Karnataka Khajane-II, Telangana IFMIS, Tamil Nadu Karuvoolam, Maharashtra GRAS, UP eGRAS | Deep-link from the department's portal |
| PayGov / SBI ePay / PFMS [S] | Gateways for government departments | Not available to private merchants |
| Payment aggregators (Razorpay, Cashfree, PayU) [S] | Collecting fees on a department's behalf needs that department's authorisation | **Our own service fee only** |
| **UPI Collect** [V] | P2P collect requests ended on 1 Oct 2025. Merchant collect still works, but intent and QR flows are now the default. | Build intent and QR flows first |

## 6. Open data platforms

- **data.gov.in (OGD):** free API key, REST endpoints, GODL-India licence. Datasets: LGD, pincode directory, ULB lists.
- **NDAP** (ndap.niti.gov.in): data already mapped to LGD codes. Downloads only.
- **UPYOG / NUDM:** open source under **MIT**, with a Trade License module. MoUs signed with 31–33 states and live in about 18. No public citizen-data API, but the specs describe the real trade-licence workflow.
- **Open Budgets India:** CC-BY; not core to v1.
- **State portals:** Telangana and Karnataka open data portals.

## 7. Language and accessibility

- **Bhashini** (bhashini.gov.in): translation, speech-to-text and text-to-speech across 22 languages. Free ULCA API key for prototypes. Production volume needs an agreement or MoU with DIBD. (bhashini.ai is an unrelated private company.)
- **UX4G v3.0** (ux4g.gov.in, from NeGD): npm package and Figma kit, built to WCAG 2.1 AA and GIGW. Free.
- **GIGW 3.0:** mandatory only for government sites. Following it voluntarily builds credibility with government partners.

## 8. Legal and compliance constraints

- **DPDP Act 2023 and DPDP Rules 2025** [V]: Rules notified 13 Nov 2025. Consent Manager provisions apply from 13 Nov 2026. **Core obligations apply from 13 May 2027**: notice, security safeguards, breach reporting, data principal rights. Penalties go up to ₹250 cr. Build for compliance now: per-purpose notice and consent, a retention schedule, a grievance officer, and 72-hour breach reporting.
- **Aadhaar Act:** never store Aadhaar numbers (mask them or keep only a reference). Authenticate only through an approved AUA/KUA or OVSE.
- **CERT-In Directions (28 Apr 2022):** report incidents within 6 hours. Keep 180 days of logs in India. Sync clocks to NIC/NPL NTP servers.
- **Cloud:** private SaaS has no general data-localisation rule. Government data must stay on MeitY-empanelled clouds. **Host in an Indian region** to keep future government partnerships possible.
- **Data licences:** GODL requires attribution. ODbL is share-alike. Survey of India terms ban resale and sharing with foreign entities.

## v1 day-one data stack (no approvals needed)

1. LGD bulk downloads and the monthly changes-only files, plus a test of the lgdws web services
2. data.gov.in API key: pincode directory with latitude/longitude, villages with PIN codes, ULB lists
3. NDAP downloads, and the Census 2011 crosswalk via LGD
4. DataMeet municipal and ward boundaries, state ward shapefiles, and the Survey of India outer boundary
5. NIC 2008, NIC 2025 and the crosswalk between them; the HSN/SAC master
6. A rules corpus we build ourselves from NSWS KYA, FoSCoS, BRAP, state S&E Acts, India Code, eGazette and Jan Vishwas, with every source cited
7. UPYOG open-source trade-licence specs (MIT)
8. UX4G 3.0 with GIGW/WCAG 2.1 AA, and Bhashini prototype keys
9. A payment aggregator for our own service fees only, and deep links for official fees
10. Hosting in an Indian region, CERT-In-compliant logging, and DPDP-ready consent

## Needs partnership or approval

| Need | Route | Timeline |
|---|---|---|
| GSTIN lookup | GSP contract | Days |
| PAN / Udyam / MCA / FSSAI checks | KYC aggregators now; API Setu longer term | Days (aggregator) / months (API Setu) |
| eSign | ASP agreement with an ESP | 1–4 weeks |
| Login and issued documents | DigiLocker Requester / Auth Partner | 1–3 months |
| Aadhaar | OVSE first; AUA/KUA only with a sponsor | OVSE: weeks to months. AUA: 6+ months, uncertain. |
| Bhashini at production volume | DIBD agreement | 1–3 months |
| Bharat Maps / Bhuvan map services | NIC/NRSC approval | Months |
| Submitting applications and getting status | State MoU (Industries/EoDB department, single-window portal) or a UPYOG state/ULB partnership | 3–12 months |
| Collecting official fees | Department authorisation, or the state's own gateway | 6+ months; deep-link until then |

## Verify first

- The lgdws endpoints are live
- The FSSAI turnover bands from Apr 2026
- Commencement of the Jan Vishwas 2026 Act and the DPDP Removal of Difficulties Order
- The Labour Codes in force from 21 Nov 2025
- API Setu's current publisher list
- Bhashini production terms
