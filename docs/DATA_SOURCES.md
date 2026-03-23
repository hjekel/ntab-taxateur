# Data Sources & API Integration

**Document:** TaxaTool Data Architecture
**Version:** 1.0
**Last Updated:** March 2026

---

## Overview

TaxaTool aggregates pricing data from multiple sources to provide accurate equipment valuations. This document details all data sources, their integration methods, and implementation status.

---

## Source Tiers

### Tier 1: MVP (Direct Integration)

These sources can be integrated immediately with minimal cost.

#### Apify Scrapers (~€50-100/month)

| Source | Actor ID | Data Type |
|--------|----------|-----------|
| Troostwijk | `lexis-solutions/troostwijkauctions-com-scraper` | NL auction listings |
| Mascus Search | `ecomscrape/mascus-vehicles-search-scraper` | EU marketplace listings |
| Mascus Details | `ecomscrape/mascus-vehicle-details-scraper` | Full listing details |

**Implementation:**
```javascript
// api/scrape/troostwijk.js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

export async function scrapeTroostwijk(category, brand) {
  const run = await client.actor('lexis-solutions/troostwijkauctions-com-scraper').call({
    startUrls: [{
      url: `https://www.troostwijkauctions.com/nl/search?q=${encodeURIComponent(brand)}`
    }],
    maxItems: 50
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return normalizeResults(items);
}
```

#### Free Tools (Manual/Scrape)

| Source | URL | Method | Limit |
|--------|-----|--------|-------|
| Ritchie Bros Price Results | rbauction.com/price-results | Web scrape | Unlimited |
| Sandhills VIP | machinerytrader.com | Account | 5/day free |

---

### Tier 2: Official APIs (Partnership Required)

#### TBAuctions ATLAS API

**Developer Portal:** https://apidocs.tbauctions.com/

**Requirements:**
- ATLAS Developer Account (via sales contact)
- Azure API Management subscription

**Endpoints:**

| Endpoint | Description |
|----------|-------------|
| `/api/items` | Auction items (post-sale) |
| `/api/categories` | Category taxonomy |
| `/api/orders` | Transaction data |
| `/api/buckets` | Lot groupings |

**Note:** ATLAS provides POST-auction data (sold items). For LIVE listings, use scrapers.

#### Mascus XML Feed

**Contact:** mascus.com/contact (partnership program)

---

### Tier 3: Enterprise APIs (€5-15K/year)

#### EquipmentWatch

**API Documentation:** equipmentwatch.com/api

| API | Description | Use Case |
|-----|-------------|----------|
| Values API | FMV, FLV, OLV per model/year/condition | Primary valuation |
| Verification API | Serial number validation | Fraud prevention |
| Market Data API | Raw transaction data | Trend analysis |

---

## Data Normalisation

All sources are normalised to a common schema:
```typescript
interface MarketListing {
  id: string;
  source: 'troostwijk' | 'mascus' | 'rbauction' | 'tbauctions';
  category: string;
  brand: string;
  model: string;
  year: number;
  hours?: number;
  price: number;
  currency: 'EUR' | 'USD' | 'GBP';
  priceType: 'asking' | 'sold' | 'estimate';
  country: string;
  url: string;
  fetchedAt: Date;
}
```

---

## Caching Strategy

### Supabase Cache Schema
```sql
CREATE TABLE market_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  results JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX idx_cache_hash ON market_cache(query_hash);
CREATE INDEX idx_cache_expires ON market_cache(expires_at);
```

---

## Environment Variables
```env
# Required for MVP
APIFY_TOKEN=your_apify_token

# Required for v1.0
TBAUCTIONS_KEY=your_atlas_subscription_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Optional (Enterprise)
EQUIPMENTWATCH_API_KEY=your_ew_key
```

---

## Rate Limits & Costs

| Source | Rate Limit | Cost |
|--------|------------|------|
| Apify | Per actor run | ~€50-100/mo |
| TBAuctions | TBD (account-based) | Free with account |
| Mascus XML | Unlimited (partnership) | Free |
| EquipmentWatch | Per API call | €5-15K/year |
| Ritchie Bros | None | Free |

---

*Document maintained by development team*
