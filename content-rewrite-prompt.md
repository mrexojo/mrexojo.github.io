# Prompt: Analyze and Rewrite Site Content — Senior Cloud Contractor

You are rewriting the website of a senior cloud infrastructure contractor.
Work from evidence, not adjectives. Every claim must be traceable to the CV.

## Inputs

- CV (source of truth for experience, skills, certifications): `src/content/cv/cv.pdf`
- Current landing page: `src/content/landing/index.html`
- Blog posts: `src/content/blog/*.md`
- Services/portfolio pages: `src/content/works/*.md`
- Site pages and layout: `src/pages/`, `src/layouts/`

Read the CV first. Build a fact sheet (years of experience, employers/clients,
technologies, certifications, measurable outcomes) and use only those facts.
If a claim cannot be backed by the CV, do not write it.

## Objective

Win remote **cloud infrastructure** and **infrastructure automation** contracts
as an independent contractor / freelancer.

- **Buyer persona:** CTOs, Heads of Cloud/Platform, Engineering Directors, and
  Engineering Managers who hire contractors directly or approve them. They skim,
  they distrust hype, and they decide based on risk reduction and delivery evidence.
- **Geography:** remote-first across Europe, with explicit positioning for
  **DACH · Netherlands · United Kingdom · Benelux · Nordics**. Mention time zone
  (CET/CEST), English working proficiency, EU-based invoicing/contracting if the
  CV supports it. Do not fake local presence.

## Voice and tone — non-negotiable

- Professional business English throughout. **Everything** in English: page copy,
  headings, meta titles/descriptions, alt text, URL slugs, file names, tags,
  frontmatter, image captions, error pages, RSS.
- No hype, no snake oil, no thought-leader posturing. Banned vocabulary:
  "ninja", "rockstar", "guru", "passionate", "cutting-edge", "world-class",
  "revolutionary", "synergy", "unlock", "supercharge", "10x", "game-changing".
- Prefer concrete over abstract: "reduced deployment time from 2 hours to
  15 minutes with Terraform pipelines" beats "delivers automation excellence".
  If the CV lacks a number, describe the mechanism instead — never invent metrics.
- Short sentences. Active voice. One idea per paragraph. A CTO should grasp the
  offer in a 30-second skim of the landing page.

## Task 1 — Landing page rewrite (`src/content/landing/index.html`)

Restructure around what a hiring decision-maker needs, in this order:

1. **Positioning statement** (1–2 sentences): who, what, for whom.
   Pattern: "Senior cloud infrastructure contractor. I design, automate, and
   operate [platforms from CV] for [company types from CV] across Europe."
2. **Services** (3–4 max, matching `src/content/works/`): each with the problem
   it solves, what the engagement looks like, and typical deliverables. Frame as
   engagements a manager can budget for, not as a technology list.
3. **Proof**: selected outcomes from the CV, certifications, years of experience.
   Anonymize clients if needed ("a Nordic fintech", "a German logistics group")
   rather than dropping the evidence.
4. **How I work**: remote-first, CET time zone, async-friendly, contracting terms
   (B2B invoice, IR35-aware for UK if applicable per CV), languages.
5. **Call to action**: one primary action (book a call / email). Keep the existing
   Google Calendar scheduling embed.

## Task 2 — Services pages (`src/content/works/`)

- Rename all files to English slugs (e.g. `automatizacion-e-infraestructura-como-codigo.md`
  → `infrastructure-as-code-and-automation.md`). Update every internal link.
- Rewrite each as an engagement page: problem → approach → deliverables →
  who it is for. 300–500 words each. No pricing unless the CV/user provides it.

## Task 3 — Blog (`src/content/blog/`)

- Rename existing files to English slugs; translate any remaining Spanish
  frontmatter, tags, and content. Update internal links and RSS.
- Expand each existing post to **1,200–2,000 words**, rewritten for the buyer
  persona: lead with the business decision, then the technical reasoning. A post
  should help a CTO or cloud director make or defend a decision.
- Add **6–8 new posts** at the same depth. Choose topics at the intersection of
  the CV's strengths and what European engineering leaders search for, e.g.:
  - When (not) to bring in a contractor for cloud infrastructure work
  - Terraform/IaC adoption for teams of 5–50 engineers: sequencing and pitfalls
  - Cloud cost review: what a one-week audit finds and what it is worth
  - Migrating to managed Kubernetes: decision criteria for mid-size companies
  - Backup and recovery that survives an auditor (relevant for DACH compliance culture)
  - Handing infrastructure back to the internal team: how a good engagement ends
  - Working with a remote contractor across EU borders: contracts, security, access
- Each post: specific title (no clickbait), 150–160 char meta description,
  English tags, a "when this applies / when it doesn't" section, and a closing
  paragraph linking to the relevant service page. No fabricated case studies —
  generalize from CV experience or mark scenarios as illustrative.

## Task 4 — Full-site English audit

Sweep the whole repo for non-English strings: page titles, nav labels, button
text, footer, 404 page, `about` page, search page, OG images text, alt
attributes, `<html lang>`, RSS titles, image file names referenced in content.
Fix all of them. Slugs and file names count as content.

## Quality gate before finishing

- [ ] Zero Spanish strings anywhere (grep for common Spanish words: `para`, `sin`, `automatización`, `gestionado`, `seguro`).
- [ ] Every factual claim traceable to the CV.
- [ ] No banned vocabulary (grep the list above).
- [ ] All internal links resolve after renames; site builds (`npm run build`).
- [ ] Landing page skimmable in 30 seconds: positioning, services, proof, CTA visible in order.
- [ ] Each blog post ≥ 1,200 words, decision-maker framing, English slug and tags.
