# Portfolio Page Review Status
## Last updated: 2026-04-09

| # | Page | Path | Status |
|---|------|------|--------|
| | **CORE (5)** | | |
| 1 | Homepage | `/` | Approved |
| 2 | About | `/about` | Approved |
| 3 | Resume | `/resume` | Approved |
| 4 | Consulting | `/consulting` | Approved |
| 5 | 404 | `/404` | Approved |
| | **STORIES (14)** | | |
| 6 | Stories Landing | `/stories` | Approved |
| 7 | SadaPay | `/stories/sadapay` | Rebuilt — Basit has fixes pending |
| 8 | Nukta | `/stories/sadapay/nukta` | Needs review |
| 9 | SadaBiz | `/stories/sadapay/sadabiz` | Needs review |
| 10 | Waitlist | `/stories/sadapay/waitlist` | Needs review |
| 11 | ZAR | `/stories/zar` | Needs review |
| 12 | Golden Flow | `/stories/zar/golden-flow` | Needs review |
| 13 | Machina | `/stories/zar/machina` | Needs review |
| 14 | Techtonic | `/stories/zar/techtonic` | Needs review |
| 15 | ADIB | `/stories/adib` | Needs review |
| 16 | Walking the Talk | `/stories/wtt` | Needs review |
| 17 | Taylor | `/stories/wtt/taylor` | Needs review |
| 18 | Bolt VPN | `/stories/bolt-vpn` | Needs review |
| 19 | GoSaaS | `/stories/gosaas` | Needs review |
| 20 | Xpence | `/stories/xpence` | Missing — linked but no page |
| | **WRITING (5)** | | |
| 21 | Writing Landing | `/writing` | Needs review |
| 22 | AI Didn't Kill the Designer's Job | `/writing/ai-didnt-kill-the-designers-job` | Needs review |
| 23 | Design Systems That Outlast | `/writing/design-systems-that-outlast` | Needs review |
| 24 | The 1:12 Ratio | `/writing/the-1-12-ratio` | Needs review |
| 25 | Watching Merchants | `/writing/watching-merchants` | Needs review |

## Summary
- **6 approved** — Homepage, About, Resume, Consulting, 404, Stories Landing
- **1 rebuilt, pending fixes** — SadaPay (Basit spotted issues, not yet addressed)
- **17 need review** — All other stories + all writing pages
- **1 missing** — Xpence (linked from stories landing, no page file)

## Design Decisions Applied During Reviews
- **Button hover pattern B**: secondary border buttons fill rose on hover (normalized 2026-04-08)
- **404 page**: no nav bar (escape links at bottom are sufficient), entry animations, pulse dot
- **Story page architecture (Approach A)**: no "Case Study" vs "Project" labels. Featured cards (large) for deep dives, compact cards for lighter projects. Visual weight differentiates depth.
- **Story pages keep company umbrella**: each company gets its own story page with narrative + work cards. NOT flat structure. Basit's site is his home, not a portfolio template.
- **Testimonials on story pages**: cream background (matches homepage), dark cards on cream. Nav/cursor inversion active.
- **Narrative format**: break into sections with Tanker sub-headings, not a wall of text.
- **Umami analytics**: added sitewide via Base.astro (2026-04-08). Website ID: dcd588fe-7465-4f25-b904-c044d2a17532
