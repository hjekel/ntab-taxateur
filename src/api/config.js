// ═══════════════════════════════════════════════════════════════════
// NTAB TaxaTool — API Configuration
// ═══════════════════════════════════════════════════════════════════
// Schakel tussen 'mock' en 'live' modus.
// In 'mock' modus worden lokale JSON data gebruikt.
// In 'live' modus worden echte API endpoints aangesproken.
// ═══════════════════════════════════════════════════════════════════

export const API_MODE = 'mock' // 'mock' | 'live'

// Supabase configuratie (NTAB Waardedatabase)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Backend API (voor scraping proxy)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ntab-api.vercel.app/api'

// Externe marktplaats endpoints
export const MARKET_SOURCES = {
  mascus: {
    name: 'Mascus',
    baseUrl: 'https://www.mascus.nl',
    searchPath: '/zoeken',
    enabled: true,
  },
  troostwijk: {
    name: 'Troostwijk Auctions',
    baseUrl: 'https://www.troostwijkauctions.com',
    searchPath: '/nl/zoeken',
    enabled: true,
  },
  bva: {
    name: 'BVA Auctions',
    baseUrl: 'https://www.bfraa.com',
    searchPath: '/zoeken',
    enabled: true,
  },
  machineseeker: {
    name: 'Machineseeker',
    baseUrl: 'https://www.machineseeker.nl',
    searchPath: '/zoeken',
    enabled: true,
  },
  ritchiebros: {
    name: 'Ritchie Bros',
    baseUrl: 'https://www.rbauction.com',
    searchPath: '/search',
    enabled: false, // Fase 2
  },
  tractorpool: {
    name: 'TractorPool',
    baseUrl: 'https://www.tractorpool.nl',
    searchPath: '/zoeken',
    enabled: false, // Fase 2
  },
}

// NTAB interne systemen
export const NTAB_SYSTEMS = {
  waardedatabase: {
    name: 'NTAB Waardedatabase',
    description: 'Historische taxaties en veilingresultaten',
    connectionType: 'supabase', // 'supabase' | 'sql' | 'api'
    enabled: API_MODE === 'live',
  },
  smartStock: {
    name: 'Smart Stock',
    description: 'Voorraadbeheer en -analyse',
    connectionType: 'api',
    enabled: false, // Fase 2
  },
  alcore: {
    name: 'NTAB Alcore',
    description: 'Debiteurenwaardering en incasso',
    connectionType: 'api',
    enabled: false, // Fase 2
  },
}
