// ═══════════════════════════════════════════════════════════════════
// NTAB Waardedatabase Service
// ═══════════════════════════════════════════════════════════════════
// Mock: lokale historische data
// Live: Supabase verbinding met NTAB waardedatabase
// ═══════════════════════════════════════════════════════════════════

import { API_MODE, SUPABASE_URL, SUPABASE_ANON_KEY } from './config'
import { getHistoricalData as getMockHistorical } from '../data/mockHistorical'

let supabaseClient = null

async function getSupabase() {
  if (supabaseClient) return supabaseClient
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  const { createClient } = await import('@supabase/supabase-js')
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return supabaseClient
}

/**
 * Zoek historische taxaties en veilingresultaten
 */
export async function searchHistoricalData(asset) {
  if (API_MODE === 'mock') {
    return getMockHistorical(asset)
  }

  // ── LIVE: Supabase query ──
  try {
    const supabase = await getSupabase()
    if (!supabase) throw new Error('Supabase niet geconfigureerd')

    let query = supabase
      .from('taxaties')
      .select('*')
      .order('datum', { ascending: false })
      .limit(10)

    if (asset.category) query = query.eq('category', asset.category)
    if (asset.subcategory) query = query.eq('type', asset.subcategory)
    if (asset.brand) query = query.ilike('brand', `%${asset.brand}%`)

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('Supabase query failed, using mock:', err.message)
    return getMockHistorical(asset)
  }
}

/**
 * Sla een nieuwe taxatie op in de database
 */
export async function saveTaxatie(taxatieData) {
  if (API_MODE === 'mock') {
    console.log('Mock: taxatie opgeslagen', taxatieData)
    return { success: true, id: `mock_${Date.now()}` }
  }

  try {
    const supabase = await getSupabase()
    if (!supabase) throw new Error('Supabase niet geconfigureerd')

    const { data, error } = await supabase
      .from('taxaties')
      .insert([{
        brand: taxatieData.asset.brand,
        model: taxatieData.asset.model,
        year: taxatieData.asset.year,
        category: taxatieData.asset.category,
        type: taxatieData.asset.subcategory,
        hours: taxatieData.asset.hours,
        condition: taxatieData.asset.condition,
        liquidatiewaarde: taxatieData.adjustment.adjustedPrices.liquidatiewaarde,
        marktwaarde: taxatieData.adjustment.adjustedPrices.marktwaarde,
        onderhandse_verkoopwaarde: taxatieData.adjustment.adjustedPrices.onderhandseVerkoopwaarde,
        vervangingswaarde: taxatieData.adjustment.adjustedPrices.vervangingswaarde,
        confidence: taxatieData.adjustment.confidence,
        notes: taxatieData.adjustment.notes,
        reason: taxatieData.adjustment.reason,
        datum: new Date().toISOString().slice(0, 10),
        taxateur: 'Demo Gebruiker',
      }])
      .select()

    if (error) throw error
    return { success: true, id: data?.[0]?.id }
  } catch (err) {
    console.error('Save taxatie failed:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Database schema voor Supabase migratie
 * Gebruik dit om de tabel aan te maken in Supabase
 */
export const SCHEMA_SQL = `
-- NTAB Waardedatabase schema
CREATE TABLE IF NOT EXISTS taxaties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  category TEXT NOT NULL,
  type TEXT,
  hours INTEGER,
  condition INTEGER CHECK (condition BETWEEN 1 AND 5),

  -- Waardebegrippen
  liquidatiewaarde DECIMAL(12,2),
  marktwaarde DECIMAL(12,2),
  onderhandse_verkoopwaarde DECIMAL(12,2),
  vervangingswaarde DECIMAL(12,2),

  -- Veilingresultaten
  veiling_opbrengst DECIMAL(12,2),
  veiling_bron TEXT,

  -- Metadata
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  notes TEXT,
  reason TEXT,
  taxateur TEXT,
  datum DATE DEFAULT CURRENT_DATE,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_taxaties_brand_model ON taxaties(brand, model);
CREATE INDEX idx_taxaties_category ON taxaties(category, type);
CREATE INDEX idx_taxaties_datum ON taxaties(datum DESC);

-- Row Level Security
ALTER TABLE taxaties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Taxaties zijn leesbaar" ON taxaties FOR SELECT USING (true);
CREATE POLICY "Taxaties schrijven met auth" ON taxaties FOR INSERT WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════
-- EXTERNAL SOURCES TRACKING
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS external_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'api', 'scraper', 'xml_feed', 'manual'
  base_url TEXT,
  last_sync TIMESTAMPTZ,
  status TEXT DEFAULT 'active',  -- 'active', 'paused', 'error'
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial sources
INSERT INTO external_sources (name, type, base_url, config) VALUES
  ('Apify Troostwijk', 'scraper', 'https://api.apify.com/v2',
   '{"actor": "lexis-solutions/troostwijkauctions-com-scraper"}'),
  ('Apify Mascus Details', 'scraper', 'https://api.apify.com/v2',
   '{"actor": "ecomscrape/mascus-vehicle-details-scraper"}'),
  ('Apify Mascus Search', 'scraper', 'https://api.apify.com/v2',
   '{"actor": "ecomscrape/mascus-vehicles-search-scraper"}'),
  ('TBAuctions ATLAS', 'api', 'https://api.tbauctions.com',
   '{"endpoints": ["items", "categories", "orders"]}'),
  ('Mascus XML Feed', 'xml_feed', 'https://export.mascus.com',
   '{"format": "XML"}'),
  ('Ritchie Bros', 'manual', 'https://www.rbauction.com/price-results', '{}'),
  ('Sandhills VIP', 'manual', 'https://www.machinerytrader.com',
   '{"daily_limit": 5}');

-- ══════════════════════════════════════════════════════════════
-- MARKET CACHE (scraped results with TTL)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS market_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES external_sources(id),
  query_hash TEXT NOT NULL,           -- SHA256 of search params
  query_params JSONB NOT NULL,        -- Original search params
  results JSONB NOT NULL,             -- Array of normalized results
  result_count INTEGER DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX idx_market_cache_query ON market_cache(query_hash);
CREATE INDEX idx_market_cache_expires ON market_cache(expires_at);
CREATE INDEX idx_market_cache_source ON market_cache(source_id);

-- Auto-cleanup expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM market_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
`
