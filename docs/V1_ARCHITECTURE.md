# V1.0 Architecture Specification

**Document:** TaxaTool Technical Architecture
**Version:** 1.0
**Target Release:** April 2026

---

## System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React + Vite + Tailwind)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Asset   │  │  Market  │  │ Taxateur │  │  Report  │        │
│  │  Input   │──│ Analysis │──│  Adjust  │──│ Preview  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL EDGE FUNCTIONS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ /api/scrape/ │  │ /api/scrape/ │  │ /api/scrape/ │          │
│  │  troostwijk  │  │    mascus    │  │    search    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│     APIFY        │ │   SUPABASE       │ │  TBAUCTIONS      │
│   (Scrapers)     │ │   (Cache + DB)   │ │  (ATLAS API)     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## Price Calculation Logic
```javascript
// utils/priceCalculator.js

export function calculateValues(marketPrice, condition, hours, year) {
  const conditionFactors = {
    1: 0.55, 2: 0.70, 3: 0.85, 4: 0.95, 5: 1.00
  };

  const hoursDepreciation = hours
    ? Math.max(0.70, 1 - (hours / 20000) * 0.30)
    : 1;

  const age = new Date().getFullYear() - year;
  const ageDepreciation = Math.max(0.80, 1 - (age / 10) * 0.20);

  const adjusted = marketPrice
    * conditionFactors[condition]
    * hoursDepreciation
    * ageDepreciation;

  return {
    liquidation: Math.round(adjusted * 0.52),
    market: Math.round(adjusted),
    privateSale: Math.round(adjusted * 1.05),
    replacement: Math.round(adjusted * 1.35)
  };
}
```

---

## Database Schema (Supabase)
```sql
CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),

  -- Asset
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  hours INTEGER,
  condition INTEGER CHECK (condition BETWEEN 1 AND 5),

  -- Values
  liquidation_value INTEGER,
  market_value INTEGER,
  private_sale_value INTEGER,
  replacement_value INTEGER,
  confidence_score INTEGER,

  -- Adjustments
  adjusted_liquidation INTEGER,
  adjusted_market INTEGER,
  adjusted_private_sale INTEGER,
  adjusted_replacement INTEGER,
  adjustment_reason TEXT,

  -- Metadata
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment Configuration

### Development
```env
VITE_API_MODE=mock
```

### Production
```env
VITE_API_MODE=live
APIFY_TOKEN=apify_api_xxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
```

---

## Migration Path: v0.2 → v1.0

1. Add Vercel Edge Functions (`/api/scrape/*`)
2. Set up Supabase (project + tables)
3. Configure environment variables
4. Toggle API mode (`mock` → `live`)
5. Test with single source first
6. Add additional sources
7. Enable caching

---

*Architecture document v1.0 - March 2026*
