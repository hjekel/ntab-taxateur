# NTAB TaxaTool - Project Brief
**Project:** TaxaTool - Taxateur Field Assistant
**Client:** NTAB (Nederlands Taxatie & AdviesBureau)
**Status:** Demo v0.2 Live
**URL:** https://hjekel.github.io/ntab-taxateur/
---
## Executive Summary
TaxaTool is a React-based field tool for NTAB appraisers, built to streamline machinery valuations. The prototype demonstrates a complete workflow from asset input to professional report, with mock data simulating real market sources.
**Core Value:** Faster, more accurate, more consistent appraisals through data aggregation and expert support.
---
## About NTAB
### Company Profile
- **Founded:** 1904
- **Focus:** Independent appraisal and advisory bureau
- **Certifications:** ISO 27001
- **Clients:** Curators, banks, Asset Based Lenders, enterprises
### Services
- **Appraisals:** Machinery, inventory, receivables, fixtures, vehicles
- **Audits:** Inventory and receivables audits for financiers
- **Advisory:** Sales support, bankruptcy guidance, WHOA proceedings
### NTAB Ecosystem
| Entity | Focus | Relationship |
|--------|-------|--------------|
| **NTAB** (parent) | Appraisals | Core business |
| **Smart Stock B.V.** | Inventory management software | Spin-off since 2018 |
| **NTAB Alcore** | Receivables collection & valuation | Joint venture |
**Where TaxaTool fits:** Machinery (the gap between Smart Stock=inventory and Alcore=receivables)
---
## Problem Statement
### Current Situation
- Appraisers manually search for reference prices across multiple platforms
- Inconsistent methodologies between individual appraisers
- Time-consuming process to compile professional reports
- No centralised real-time market data access
### Opportunity
> "If they're still manually going through spreadsheets and googling... that's where the value is."
---
## Solution: TaxaTool
### Core Features
1. **Asset Input** - Structured form with category/brand/model autocomplete
2. **Market Analysis** - Simulated multi-source price aggregation
3. **Expert Adjustment** - Appraiser override with documented reasoning
4. **Report Generation** - Professional NTAB-branded reports, 5 export formats
### Value Types Supported
| Value Type | Dutch Term | % of Market | Use Case |
|------------|------------|-------------|----------|
| Liquidation | Liquidatiewaarde | 40-60% | Bankruptcy, WHOA |
| Market | Marktwaarde | 100% | Going concern |
| Private Sale | Onderhandse verkoopwaarde | 90-110% | Voluntary sale |
| Replacement | Vervangingswaarde | 120-150% | Insurance |
### Tech Stack
- Frontend: React 18 + Vite
- Styling: Tailwind CSS
- Hosting: GitHub Pages
- State: localStorage (demo) / Supabase (production)
- PDF: html2canvas-pro + jsPDF
- i18n: NL/EN with SVG flag toggle

---

## Data Sources (Planned)

### MVP (Scrapers)
- Apify Troostwijk scraper
- Apify Mascus scraper
- Ritchie Bros Price Results (free)
- Sandhills VIP (5 free/day)

### Production (Official APIs)
- TBAuctions ATLAS API
- Mascus XML Feed
- EquipmentWatch (enterprise)

See [DATA_SOURCES.md](./DATA_SOURCES.md) for full integration details.

---

## Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| **v0.2** (current) | Mock data, full workflow, 5 exports, NL/EN | ✅ Complete |
| **v1.0** | Live Apify data, Supabase cache | Week 1-2 |
| **v1.5** | TBAuctions integration, auth | Month 1-2 |
| **v2.0** | NTAB database integration, multi-user | Month 3-4 |

---

## Links

- **Live Demo:** https://hjekel.github.io/ntab-taxateur/
- **NTAB Website:** https://ntab.nl
- **Smart Stock:** https://smartstock.nl
- **NTAB Alcore:** https://ntabalcore.nl

---

*Last updated: March 2026*
