# Contributing to IndiaOne

Thank you for helping. IndiaOne is a public-interest open-source project, and every contribution counts: code, rules research, translation, design, or a well-argued critique.

## Ground rules

1. **Be respectful.** Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
2. **Cite your sources.** Any claim about a law, fee, timeline or process must link to an official source: an Act, rules, G.O., gazette notification, or an authority's own website. Secondary sources (blogs, compliance sites) are fine as leads, but mark them as such.
3. **No personal data in the repo.** No real Aadhaar, PAN, phone numbers, addresses or case files, including in test fixtures. Use synthetic data.
4. **No credentials or secrets.** Ever. CI will run secret scanning.
5. **No scraping of login-protected government systems**, and no code that does it.
6. **Never name individual officials** in issues, PRs, test data or docs. Talk about offices, services and patterns.

## Ways to contribute

### 1. Rules research and verification (no coding needed)
- Pick an open item from [PRD §20](docs/PRD.md#20-pre-launch-verification-list-from-research) or an issue labelled `rules:verify`.
- Find the **official** source and record its title, number, date and URL. If the official text is only available as a PDF, include a SHA-256 hash of the file.
- Open a PR that updates the relevant research file or rule, with:
  - the requirement, authority, legal basis, applicability conditions, fee formula, timeline, and portal;
  - a confidence level: **H** = you read the primary source, **M** = several secondary sources agree, **L** = a single or conflicting source.
- Rules need **two approvals**, one of them from a member of the `rules-reviewers` team, before they can be published.

### 2. A new state or ULB
Copy `research/03-pilot-state-telangana.md` to `research/state-<name>.md` and fill it in for your state. Focus on trade licences, Shops & Establishments, FSSAI, fire, pollution, signage, professional tax and Legal Metrology.

### 3. Code
- Discuss significant changes in an issue first. For architecture changes, write an ADR in `docs/adr/`.
- Go: `gofmt`, `golangci-lint`, table-driven tests, no ORMs (use sqlc), wrap errors with `%w`.
- Rust: `cargo fmt`, `cargo clippy -D warnings`.
- TypeScript: strict mode, ESLint, accessible components (test with axe).
- Every PR needs tests. Rule changes need scenario fixtures.
- Keep PRs small and focused.

### 4. Design, UX research and translation
- Prioritise designs for low-end Android phones, 3G connections, Telugu and Hindi first, and low literacy.
- Legal translations need a second reviewer who is fluent in the language.

### 5. Share your story
Tell us how getting a licence went for you: what was asked, how long it took, where it stalled. Open an issue with the `story` template, or email the maintainers if you want to stay anonymous. Anonymised stories become test scenarios. **Don't include officials' names.**

## Workflow

1. Fork the repo and create a branch: `feat/…`, `fix/…`, `rules/…`, `docs/…`
2. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
3. Open a PR against `main` and fill in the template
4. A maintainer reviews it; CI must pass

## Developer Certificate of Origin

By contributing, you certify that you have the right to submit the work under the project licence ([DCO 1.1](https://developercertificate.org/)). Sign off each commit with `git commit -s`.

## Licensing of contributions

- Code is licensed under **Apache-2.0**.
- Rules, research and documentation are licensed under **CC BY 4.0**.
- Don't copy code or data from repositories that have no licence or an incompatible one (see the traps list in `research/01-open-source-repos.md`).
