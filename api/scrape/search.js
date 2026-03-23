// ═══════════════════════════════════════════════════════════════════
// Vercel Edge Function: Unified Market Search
// ═══════════════════════════════════════════════════════════════════
// Endpoint: POST /api/scrape/search
// Aggregates results from all enabled scrapers in parallel
// Caches results in Supabase market_cache table
// ═══════════════════════════════════════════════════════════════════

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  try {
    const body = await request.json()
    const { sources = ['troostwijk', 'mascus'], ...query } = body

    // Check cache first
    const cacheKey = JSON.stringify({ sources, ...query })
    const cached = await checkCache(cacheKey)
    if (cached) {
      return new Response(JSON.stringify({
        ...cached,
        fromCache: true,
      }), { headers })
    }

    // Call scrapers in parallel
    const baseUrl = new URL(request.url).origin
    const scraperPromises = sources.map(source =>
      fetch(`${baseUrl}/api/scrape/${source}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      })
        .then(r => r.ok ? r.json() : { source, results: [], error: `HTTP ${r.status}` })
        .catch(err => ({ source, results: [], error: err.message }))
    )

    const scraperResults = await Promise.all(scraperPromises)

    // Merge and deduplicate results
    const allResults = scraperResults.flatMap(r => r.results || [])
    const deduplicated = deduplicateResults(allResults)

    const response = {
      totalResults: deduplicated.length,
      sources: scraperResults.map(r => ({
        name: r.source,
        count: r.count || 0,
        error: r.error || null,
      })),
      results: deduplicated,
      scrapedAt: new Date().toISOString(),
      fromCache: false,
    }

    // Cache results (fire and forget)
    cacheResults(cacheKey, response).catch(() => {})

    return new Response(JSON.stringify(response), { headers })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers })
  }
}

// Deduplicate results by brand+model+year+price similarity
function deduplicateResults(results) {
  const seen = new Map()
  return results.filter(r => {
    const key = `${r.brand}-${r.model}-${r.year}-${Math.round((r.price || 0) / 1000)}`
    if (seen.has(key)) return false
    seen.set(key, true)
    return true
  })
}

// Cache helpers (Supabase)
async function checkCache(key) {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
  if (!SUPABASE_URL || !SUPABASE_KEY) return null

  try {
    const hash = await sha256(key)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/market_cache?query_hash=eq.${hash}&expires_at=gt.${new Date().toISOString()}&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    const data = await response.json()
    return data?.[0]?.results || null
  } catch { return null }
}

async function cacheResults(key, results) {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
  if (!SUPABASE_URL || !SUPABASE_KEY) return

  const hash = await sha256(key)
  await fetch(`${SUPABASE_URL}/rest/v1/market_cache`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      query_hash: hash,
      query_params: JSON.parse(key),
      results,
      result_count: results.totalResults || 0,
    }),
  })
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}
