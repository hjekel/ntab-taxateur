// ═══════════════════════════════════════════════════════════════════
// Vercel Edge Function: Troostwijk Auctions Scraper
// ═══════════════════════════════════════════════════════════════════
// Endpoint: POST /api/scrape/troostwijk
// Uses: Apify actor lexis-solutions/troostwijkauctions-com-scraper
// Cost: ~$0.25-0.50 per 1000 results
// ═══════════════════════════════════════════════════════════════════

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  // CORS headers
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

  const APIFY_TOKEN = process.env.APIFY_TOKEN
  if (!APIFY_TOKEN) {
    return new Response(JSON.stringify({ error: 'APIFY_TOKEN not configured' }), { status: 500, headers })
  }

  try {
    const { category, brand, model, maxItems = 20 } = await request.json()

    // Build search URL based on category
    const categoryMap = {
      'metaalbewerking': 'machines-en-installaties',
      'heftrucks': 'intern-transport',
      'houtbewerking': 'houtbewerkingsmachines',
      'verpakking': 'verpakkingsmachines',
      'voedingsmiddelen': 'voedingsmiddelenindustrie',
    }

    const searchQuery = [brand, model].filter(Boolean).join(' ')
    const categorySlug = categoryMap[category] || 'machines-en-installaties'
    const searchUrl = `https://www.troostwijkauctions.com/nl/c/${categorySlug}?q=${encodeURIComponent(searchQuery)}`

    // Call Apify actor
    const actorId = 'lexis-solutions~troostwijkauctions-com-scraper'
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}&waitForFinish=60`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: searchUrl }],
          maxItems,
        }),
      }
    )

    if (!runResponse.ok) {
      throw new Error(`Apify run failed: ${runResponse.status}`)
    }

    const run = await runResponse.json()
    const datasetId = run.data?.defaultDatasetId

    if (!datasetId) {
      throw new Error('No dataset returned from Apify')
    }

    // Fetch results
    const dataResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
    )
    const items = await dataResponse.json()

    // Normalize to our schema
    const normalized = items.map((item, i) => ({
      id: `trw-${Date.now()}-${i}`,
      source: 'Troostwijk',
      brand: item.brand || extractBrand(item.title),
      model: item.model || extractModel(item.title),
      year: item.year || extractYear(item.title),
      price: parseFloat(item.price) || null,
      currency: 'EUR',
      location: item.location || 'NL',
      condition: item.condition || null,
      hours: item.hours || null,
      listDate: item.auctionDate || new Date().toISOString().slice(0, 10),
      isAuction: true,
      url: item.url || null,
      imageUrl: item.images?.[0] || null,
    })).filter(item => item.price)

    return new Response(JSON.stringify({
      source: 'troostwijk',
      count: normalized.length,
      results: normalized,
      scrapedAt: new Date().toISOString(),
    }), { headers })

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      source: 'troostwijk',
    }), { status: 500, headers })
  }
}

// Helper: extract brand from title like "DMG Mori CLX 350 CNC Lathe"
function extractBrand(title) {
  if (!title) return null
  const knownBrands = ['DMG Mori', 'Mazak', 'Haas', 'Trumpf', 'Amada', 'Bystronic', 'Okuma', 'Doosan',
    'Toyota', 'Linde', 'Jungheinrich', 'Still', 'Hyster', 'Crown', 'Caterpillar',
    'Homag', 'Biesse', 'SCM', 'Multivac', 'Krones', 'GEA', 'Marel']
  return knownBrands.find(b => title.toLowerCase().includes(b.toLowerCase())) || null
}

function extractModel(title) {
  if (!title) return null
  // Try to find model pattern: alphanumeric after brand
  const match = title.match(/(?:^|\s)([A-Z]{1,3}[\s-]?\d{2,5}[A-Z]?\w*)/)
  return match?.[1] || null
}

function extractYear(title) {
  const match = title?.match(/\b(19|20)\d{2}\b/)
  return match ? parseInt(match[0]) : null
}
