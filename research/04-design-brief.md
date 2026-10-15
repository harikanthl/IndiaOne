# Design brief: UI and launch video (Oct 2026)

*Research snapshot. Contrast ratios were computed with the WCAG 2.x formula, and the font facts were checked against the Google Fonts API.*

## Direction
Indian office life as the visual language: stamp-pad violet, green ink for "approved" (gazetted officers sign in green), red tape for stalls, buff file covers. Indian art alongside: Company School paintings of tradespeople and Telangana's Cheriyal scrolls.

**Why it fits 2026:** human texture, stamps and handmade marks are coming back as a reaction to "AI sameness" (Adobe 2026 trends). Other current trends we use:
- type as the main visual element, using variable-font axes;
- calmer product UI (Linear's 2026 refresh);
- motion designed as part of the system;
- native CSS scroll-driven animations and View Transitions, with fallbacks.

## UI palette (app)
| Role | Hex | Notes |
|---|---|---|
| Paper | #FFFFFF | The app stays white for clarity. Buff appears only on file objects. |
| Ledger | #F1F3F6 | Surfaces |
| Pen ink | #1B2136 | Text |
| Stamp violet (deep) | #4B2E83 | Primary text and accents; 10.4:1 with white |
| Wet-ink violet | #6D3FB5 | Buttons, large stamps |
| Green ink | #1F6B3A | Approved; 6.5:1 with white |
| Red tape | #B3261E | Stalled or escalated; 6.5:1 with white |
| Turmeric | #8A5A00 | Conditional or needs confirmation |
| File buff | #E6D3A8 / #F3E9D2 | The file object only |

**Always pair colour with a word and a shape.** About 8% of men are colour-blind.

## Video palette: "Cheriyal Night"
| Role | Hex | Contrast on the ground colour |
|---|---|---|
| Ground | #17120E | — |
| Paper text | #F3E9D2 | 15.4:1 |
| Haldi yellow | #F2B33D | 10.0:1 |
| Cheriyal red | #E0533D | 4.85:1 |
| Sky blue | #8FB0FF | 8.7:1 |
| Green | #5FC48A | 8.2:1 |
| Violet | #B79CFF | 8.2:1 |

The traditional red panel colour is #B5281C. Put yellow on it only at display sizes.

## Type
| Family | Use | Notes |
|---|---|---|
| Anek Latin / Telugu / Devanagari (Ek Type) | Display | Variable `wdth` 75–125 and `wght` 100–800. Wide for headlines and stamps, condensed for IDs and dense mobile views. |
| Mukta | Body text for Latin and Devanagari | Static weights. **No Telugu.** |
| Anek Telugu (Noto Sans Telugu fallback) | Telugu body text | Switched via `:lang(te)`, set about 8% larger, line-height 1.7 |

## References
| Reference | What to borrow |
|---|---|
| Singapore GoBusiness | Guided journey that recommends licences; cut 845 food-business fields to 90; premises e-Adviser |
| GOV.UK | One question per page; step-by-step navigation |
| Estonia | The once-only principle: never ask twice for the same data |
| Code for America | Mobile-first forms with SMS status updates |
| UX4G 3.0 | Consent and right-to-service SLA patterns |
| CRED, Zerodha Varsity, Razorpay Blade, Setu, Groww | Indian product craft |
| Swiggy order tracking, Flipkart shipments, Railways PNR | The mental model for file tracking. Make the tracker feel like these, not like an ERP. |

## Video motion ideas
1. Pan across Cheriyal-style panels, one per desk, as the file slides along.
2. Map zoom: India → Telangana → ward → pin. The plan unfolds from the pin.
3. Stamp thud: scale 1.15 → 1 in 120 ms, a slight shake, ink spreading.
4. Red tape wraps a stalled file. Escalation cuts the tape and the file jumps to the next desk.
5. Kinetic type on Anek's width axis: "Approved", "అనుమతి", "स्वीकृत".
6. Fees count up while the legal citation slides in like a margin note.
7. Tooling: Remotion or Hyperframes, plus Rive for the stamp and file state machines.
