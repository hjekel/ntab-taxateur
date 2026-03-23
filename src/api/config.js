// ═══════════════════════════════════════════════════════════════════
// NTAB TaxaTool — API Configuration
// ═══════════════════════════════════════════════════════════════════
// Schakel tussen 'mock', 'hybrid' en 'live' modus.
//   mock   = lokale JSON data (demo, geen kosten)
//   hybrid = mock + live scraping via Apify (€50-100/maand)
//   live   = alles via echte APIs (na Robin akkoord)
// ═══════════════════════════════════════════════════════════════════

export const API_MODE = 'mock' // 'mock' | 'hybrid' | 'live'

// ── Supabase (NTAB Waardedatabase) ──
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// ── Apify (scraping platform) ──
export const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN || ''
export const APIFY_BASE_URL = 'https://api.apify.com/v2'

// ── Backend API proxy (Vercel Edge Functions) ──
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ntab-api.vercel.app/api'

// ══════════════════════════════════════════════════════════════════
// DATA BRONNEN — Fase 1 (MVP, €50-100/maand)
// ══════════════════════════════════════════════════════════════════

export const DATA_SOURCES = {
  // ── Apify Scrapers (kant-en-klaar, ~$0.25-0.50 per 1000 results) ──
  primary: {
    name: 'Apify Scrapers',
    cost: '€50-100/maand',
    actors: {
      troostwijk: {
        name: 'Troostwijk Auctions',
        actorId: 'lexis-solutions/troostwijkauctions-com-scraper',
        // Output: title, price, location, auctionDate, specifications, images, BPM
        fields: ['title', 'price', 'location', 'auctionDate', 'specifications', 'images'],
        enabled: true,
      },
      mascusDetails: {
        name: 'Mascus Vehicle Details',
        actorId: 'ecomscrape/mascus-vehicle-details-scraper',
        // Output: full listing details per URL
        enabled: true,
      },
      mascusSearch: {
        name: 'Mascus Search Results',
        actorId: 'ecomscrape/mascus-vehicles-search-scraper',
        // Output: search results page listings
        enabled: true,
      },
    },
  },

  // ── Gratis bronnen ──
  secondary: {
    ritchieBros: {
      name: 'Ritchie Bros Price Results',
      type: 'manual_lookup', // Geen API, web tool
      url: 'https://www.rbauction.com/price-results',
      // Bevat: RB auctions + Marketplace-E + IronPlanet + Mascus data
      // Filters: model, bouwjaar, locatie, meterstand, 3mnd-2jaar
      // Talen: NL, EN, FR, IT, DE, ES, FI, SV, NO, TR, PL, RO, PT, DA
      cost: 'GRATIS',
      enabled: true,
    },
    sandhillsVip: {
      name: 'Sandhills VIP / FleetEvaluator',
      type: 'manual_lookup',
      url: 'https://www.machinerytrader.com',
      // Account op MachineryTrader.com → VIP button → 5 gratis valuations/dag
      // $182 miljard aan jaarlijkse transactiedata
      // Output: auction, wholesale, market, asking values + 12-mnd forecast
      // Platforms: MachineryTrader, TractorHouse, TruckPaper, AuctionTime
      cost: 'GRATIS (5/dag)',
      enabled: true,
    },
  },
}

// ══════════════════════════════════════════════════════════════════
// OFFICIËLE APIs — Fase 2 (na Robin akkoord + accounts)
// ══════════════════════════════════════════════════════════════════

export const OFFICIAL_APIS = {
  tbauctions: {
    name: 'TBAuctions ATLAS Platform',
    // Developer portal: https://apidocs.tbauctions.com/
    // Platform: Microsoft Azure API Management
    // Auth: ATLAS Developer Account (via sales)
    baseUrl: 'https://api.tbauctions.com', // verify exact URL
    auth: import.meta.env.VITE_ATLAS_TOKEN || '',
    endpoints: {
      items: '/api/items',         // Catalogus items + attributen
      categories: '/api/categories', // Categorieen met nested structuur
      buckets: '/api/buckets',     // Items toewijzen aan veilingen
      orders: '/api/orders',       // Verkochte lots, koper/verkoper info
      imports: '/api/imports',     // Bulk item upload
    },
    // NB: ATLAS = POST-auction data. Niet live listings.
    // "After an auction is closed, items are sold and invoiced through ATLAS"
    enabled: false,
  },
  mascusXml: {
    name: 'Mascus Officiële XML Feed',
    // URL: mascus.com/Html_Template.aspx?product=importexport
    // Partnership/dealer account nodig
    feedUrl: import.meta.env.VITE_MASCUS_FEED_URL || '',
    format: 'XML',
    // XML structure: <mascus_feed><listing>{ id, category, brand, model,
    //   year, hours, price, condition, location, images }</listing></mascus_feed>
    enabled: false,
  },
  bvaSdk: {
    name: 'BVA Auctions SDK',
    // GitHub: github.com/BVA-Holding-BV/bva-auctions-sdk
    // API docs: api-acc.bva-auctions.com/api/docs
    // ATLAS account nodig
    enabled: false,
  },
}

// ══════════════════════════════════════════════════════════════════
// ENTERPRISE APIs — Fase 3 (na budget goedkeuring)
// ══════════════════════════════════════════════════════════════════

export const ENTERPRISE_APIS = {
  equipmentWatch: {
    name: 'EquipmentWatch',
    baseUrl: 'https://api.equipmentwatch.com',
    // Values API: adjustedFmv, adjustedFlv, adjustedOlv per machine
    // Verification API: serial number + year check
    // Market Data API: raw transacties, utilization, popularity
    // US-focus maar industry standard
    cost: '€5.000-15.000/jaar (geschat)',
    enabled: false,
  },
  rouse: {
    name: 'Rouse Services',
    // Onderdeel van RB Global (Ritchie Bros)
    // $75B fleet data, $32B rental, $24B private-party sales
    // UK/EU coverage
    // Ingang: via NTAB relatie met Troostwijk/RB
    type: 'partnership',
    enabled: false,
  },
}

// ══════════════════════════════════════════════════════════════════
// NTAB INTERNE SYSTEMEN
// ══════════════════════════════════════════════════════════════════

export const NTAB_SYSTEMS = {
  waardedatabase: {
    name: 'NTAB Waardedatabase',
    description: 'Miljoenen objecten: historische taxaties + veilingresultaten',
    connectionType: 'supabase', // 'supabase' | 'sql' | 'api'
    enabled: API_MODE === 'live',
  },
  smartStock: {
    name: 'Smart Stock B.V.',
    description: 'Voorraadbeheer, ERP-integratie, dashboards, ABC-XYZ analyse',
    kvk: '86215191',
    location: 'Hoevelaken',
    tech: 'Power BI, SQL, ETL, VBA',
    connectionType: 'api',
    enabled: false, // Fase 2
  },
  alcore: {
    name: 'NTAB Alcore',
    description: 'Debiteurenwaardering, incasso, credit management, WHOA-trajecten',
    startDate: 'Januari 2022',
    connectionType: 'api',
    enabled: false, // Fase 2
  },
}

// ══════════════════════════════════════════════════════════════════
// VRAGEN VOOR ROBIN (Demo Dinsdag)
// ══════════════════════════════════════════════════════════════════
// 1. TBAuctions relatie:
//    "Werkt NTAB al met Troostwijk/BVA? ATLAS Developer Account?"
// 2. Budget data bronnen:
//    "MVP ~€50-100/maand (scraping). Enterprise €5-15K/jaar."
// 3. NTAB Waardedatabase:
//    "Sample van jullie database om import te testen?"
// 4. Mascus partnership:
//    "Contacten bij Mascus? Ze bieden XML feeds aan partners."
