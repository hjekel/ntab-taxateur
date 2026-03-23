// ═══════════════════════════════════════════════════════════════════
// Vercel Edge Function: Mascus Scraper
// ═══════════════════════════════════════════════════════════════════
// Endpoint: POST /api/scrape/mascus
// Uses: Apify actor ecomscrape/mascus-vehicles-search-scraper
// Fallback: ecomscrape/mascus-vehicle-details-scraper
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

  const APIFY_TOKEN = process.env.APIFY_TOKEN
  if (!APIFY_TOKEN) {
    return new Response(JSON.stringify({ error: 'APIFY_TOKEN not configured' }), { status: 500, headers })
  }

  try {
    const { category, subcategory, brand, model, maxItems = 20 } = await request.json()

    // Build Mascus search URL
    const subcategoryMap = {
      'cnc-draaibank': 'metalworking/cnc-lathes',
      'cnc-freesmachine': 'metalworking/cnc-milling-machines',
      'laser-snijmachine': 'metalworking/laser-cutting-machines',
      'kantpers': 'metalworking/press-brakes',
      'heftruck-elektrisch': 'forklifts/electric-forklift-trucks',
      'heftruck-diesel': 'forklifts/diesel-forklift-trucks',
      'reachtruck': 'forklifts/reach-trucks',
      'cnc-router': 'woodworking-machinery/cnc-routers',
      'formaatzaag': 'woodworking-machinery/panel-saws',
      'vulmachine': 'packaging-machinery/filling-machines',
      'etiketteermachine': 'packaging-machinery/labelling-machines',
      'menglijn': 'food-processing/mixers',
      'oven-industrieel': 'food-processing/ovens',
    }

    const slug = subcategoryMap[subcategory] || 'metalworking'
    const searchQuery = [brand, model].filter(Boolean).join('+')
    const searchUrl = `https://www.mascus.nl/${slug}?search=${searchQuery}`

    // Call Apify search scraper
    const actorId = 'ecomscrape~mascus-vehicles-search-scraper'
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
    if (!datasetId) throw new Error('No dataset returned')

    const dataResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
    )
    const items = await dataResponse.json()

    // Normalize
    const normalized = items.map((item, i) => ({
      id: `mas-${Date.now()}-${i}`,
      source: 'Mascus',
      brand: item.brand || item.manufacturer || null,
      model: item.model || null,
      year: item.year ? parseInt(item.year) : null,
      price: item.price ? parseFloat(String(item.price).replace(/[^\d.]/g, '')) : null,
      currency: item.currency || 'EUR',
      location: item.location || null,
      condition: item.condition || null,
      hours: item.hours ? parseInt(item.hours) : null,
      listDate: item.listDate || new Date().toISOString().slice(0, 10),
      isAuction: false,
      url: item.url || null,
      imageUrl: item.image || item.images?.[0] || null,
    })).filter(item => item.price)

    return new Response(JSON.stringify({
      source: 'mascus',
      count: normalized.length,
      results: normalized,
      scrapedAt: new Date().toISOString(),
    }), { headers })

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      source: 'mascus',
    }), { status: 500, headers })
  }
}
