# Claude Code Context

**Purpose:** Context document for AI-assisted development
**Last Updated:** March 2026

---

## Project Overview

TaxaTool is a React-based field tool for NTAB appraisers. It streamlines machinery valuations by aggregating market data and generating professional reports.

**Live URL:** https://hjekel.github.io/ntab-taxateur/

---

## NTAB Ecosystem

| Entity | Focus | Our Relationship |
|--------|-------|------------------|
| **NTAB** (parent) | Appraisals | Primary client |
| **Smart Stock B.V.** | Inventory software | Existing for INVENTORY |
| **NTAB Alcore** | Receivables | Existing for RECEIVABLES |

**TaxaTool fills the gap:** Machinery

---

## Technical Context

### Current Stack
```
Frontend:     React 18 + Vite
Styling:      Tailwind CSS
Hosting:      GitHub Pages
State:        localStorage
PDF:          html2canvas-pro + jsPDF
i18n:         Custom (NL/EN)
```

### Project Structure
```
ntab-taxateur/
├── docs/                    # Documentation
├── src/
│   ├── components/
│   │   ├── AssetForm.jsx    # Step 1
│   │   ├── MarketSearch.jsx # Step 2 animation
│   │   ├── PriceEngine.jsx  # Step 2 values
│   │   ├── TaxateurAdjust.jsx # Step 3
│   │   └── ReportPreview.jsx # Step 4
│   ├── data/
│   │   ├── categories.js
│   │   ├── mockMarketResults.js
│   │   └── mockHistorical.js
│   ├── i18n/
│   │   ├── nl.json
│   │   └── en.json
│   └── utils/
│       └── priceCalculator.js
└── vite.config.js
```

### NTAB Brand Colors
```css
:root {
  --ntab-primary: #003399;
  --ntab-secondary: #0055BB;
  --ntab-accent: #E05500;
  --ntab-light: #F5F7FA;
}
```

---

## Domain Knowledge

### Value Types

| Type | % of Market | When Used |
|------|-------------|-----------|
| Liquidation | 40-60% | Bankruptcy |
| Market | 100% | Normal sale |
| Private Sale | 90-110% | Voluntary |
| Replacement | 120-150% | Insurance |

### Condition Scale (1-5)

| Score | Label | Multiplier |
|-------|-------|------------|
| 1 | Poor | 0.55 |
| 2 | Fair | 0.70 |
| 3 | Average | 0.85 |
| 4 | Good | 0.95 |
| 5 | Excellent | 1.00 |

---

## Common Tasks

### Adding New Category
1. Update `src/data/categories.js`
2. Add mock data
3. Update translations

### Switching to Live Data
1. Set `VITE_API_MODE=live`
2. Ensure `APIFY_TOKEN` set
3. Deploy to Vercel

---

## Notes for Claude

- Use UK English in code/docs
- Price format: `nl-NL` locale (€42.000,00)
- Wizard has 4 steps
- Condition is 1-5, not 1-10
- Liquidation < Market (common mistake!)

---

*Context document - maintained as code evolves*
