// ═══════════════════════════════════════════════════════════════════
// Market Data Service — marktplaats integratie
// ═══════════════════════════════════════════════════════════════════
// mock:   lokale data uit mockMarketResults.js
// hybrid: mock + live scraping via Apify (directe calls)
// live:   alles via Vercel Edge Function proxy
// ═══════════════════════════════════════════════════════════════════

import { API_MODE, API_BASE_URL, APIFY_TOKEN, APIFY_BASE_URL, DATA_SOURCES } from './config'
import { getMarketResults as getMockResults } from '../data/mockMarketResults'

/**
 * Zoek marktdata voor een asset
 * @param {Object} asset - { category, subcategory, brand, model, year, hours, condition }
 * @returns {Promise<Array>} Array van marktresultaten
 */
export async function searchMarketData(asset) {
  if (API_MODE === 'mock') {
    await delay(100)
    return getMockResults(asset)
  }

  if (API_MODE === 'hybrid') {
    // Combine mock data with live scraping
    const [mockResults, liveResults] = await Promise.all([
      getMockResults(asset),
      fetchLiveData(asset).catch(err => {
        console.warn('Live scraping failed, using mock only:', err.message)
        return []
      }),
    ])
    // Merge: live results first, then mock to fill gaps
    return deduplicateResults([...liveResults, ...mockResults]).slice(0, 12)
  }

  // ── LIVE MODUS via Vercel proxy ──
  try {
    const response = await fetch(`${API_BASE_URL}/scrape/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sources: ['troostwijk', 'mascus'],
        category: asset.category,
        subcategory: asset.subcategory,
        brand: asset.brand,
        model: asset.model,
        maxItems: 20,
      }),
    })

    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const data = await response.json()
    return data.results || []
  } catch (err) {
    console.warn('Live market search failed, falling back to mock:', err.message)
    return getMockResults(asset)
  }
}

/**
 * Direct Apify scraping (hybrid mode, vanuit browser)
 * NB: Apify token moet in env staan, calls duren 10-60 sec
 */
async function fetchLiveData(asset) {
  if (!APIFY_TOKEN) {
    console.warn('No APIFY_TOKEN, skipping live data')
    return []
  }

  const actors = DATA_SOURCES.primary.actors
  const enabledActors = Object.entries(actors).filter(([, a]) => a.enabled)

  // Run enabled scrapers in parallel
  const promises = enabledActors.map(async ([key, actor]) => {
    try {
      const searchQuery = [asset.brand, asset.model].filter(Boolean).join(' ')
      const input = buildActorInput(key, asset, searchQuery)

      const runRes = await fetch(
        `${APIFY_BASE_URL}/acts/${actor.actorId.replace('/', '~')}/runs?token=${APIFY_TOKEN}&waitForFinish=60`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }
      )

      if (!runRes.ok) throw new Error(`${key}: HTTP ${runRes.status}`)
      const run = await runRes.json()
      const datasetId = run.data?.defaultDatasetId
      if (!datasetId) return []

      const dataRes = await fetch(`${APIFY_BASE_URL}/datasets/${datasetId}/items?token=${APIFY_TOKEN}`)
      const items = await dataRes.json()

      return normalizeResults(items, key)
    } catch (err) {
      console.warn(`Scraper ${key} failed:`, err.message)
      return []
    }
  })

  const allResults = await Promise.all(promises)
  return allResults.flat()
}

function buildActorInput(actorKey, asset, searchQuery) {
  const categoryUrls = {
    troostwijk: {
      metaalbewerking: 'https://www.troostwijkauctions.com/nl/c/machines-en-installaties',
      heftrucks: 'https://www.troostwijkauctions.com/nl/c/intern-transport',
      houtbewerking: 'https://www.troostwijkauctions.com/nl/c/houtbewerkingsmachines',
    },
    mascusSearch: {
      metaalbewerking: 'https://www.mascus.nl/metalworking',
      heftrucks: 'https://www.mascus.nl/forklifts',
      houtbewerking: 'https://www.mascus.nl/woodworking-machinery',
    },
  }

  const baseUrl = categoryUrls[actorKey]?.[asset.category]
  const url = baseUrl
    ? `${baseUrl}?q=${encodeURIComponent(searchQuery)}`
    : `https://www.mascus.nl/search?q=${encodeURIComponent(searchQuery)}`

  return {
    startUrls: [{ url }],
    maxItems: 15,
  }
}

function normalizeResults(items, source) {
  const sourceNames = {
    troostwijk: 'Troostwijk',
    mascusSearch: 'Mascus',
    mascusDetails: 'Mascus',
  }

  return items
    .map((item, i) => ({
      id: `${source}-${Date.now()}-${i}`,
      source: sourceNames[source] || source,
      brand: item.brand || item.manufacturer || null,
      model: item.model || null,
      year: item.year ? parseInt(item.year) : null,
      price: item.price ? parseFloat(String(item.price).replace(/[^\d.]/g, '')) : null,
      currency: item.currency || 'EUR',
      location: item.location || null,
      condition: item.condition || null,
      hours: item.hours ? parseInt(item.hours) : null,
      listDate: item.auctionDate || item.listDate || new Date().toISOString().slice(0, 10),
      isAuction: source === 'troostwijk',
      url: item.url || null,
      imageUrl: item.image || item.images?.[0] || null,
    }))
    .filter(item => item.price)
}

function deduplicateResults(results) {
  const seen = new Map()
  return results.filter(r => {
    const key = `${r.brand}-${r.model}-${r.year}-${Math.round((r.price || 0) / 1000)}`
    if (seen.has(key)) return false
    seen.set(key, true)
    return true
  })
}

/**
 * Haal prijshistorie op voor een specifiek merk/model
 */
export async function getPriceHistory(brand, model) {
  if (API_MODE === 'mock') {
    const basePrice = 50000
    return Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2025, i, 1).toISOString().slice(0, 7),
      avgPrice: Math.round(basePrice * (1 - i * 0.015) + (Math.random() - 0.5) * 5000),
      listings: Math.floor(Math.random() * 8) + 2,
    }))
  }

  const response = await fetch(`${API_BASE_URL}/market/history?brand=${brand}&model=${model}`)
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return (await response.json()).history || []
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}
