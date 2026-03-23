// ═══════════════════════════════════════════════════════════════════
// Market Data Service — marktplaats integratie
// ═══════════════════════════════════════════════════════════════════
// Mock: lokale data uit mockMarketResults.js
// Live: API calls naar scraping proxy (Vercel Edge Function)
// ═══════════════════════════════════════════════════════════════════

import { API_MODE, API_BASE_URL, MARKET_SOURCES } from './config'
import { getMarketResults as getMockResults } from '../data/mockMarketResults'

/**
 * Zoek marktdata voor een asset
 * @param {Object} asset - { category, subcategory, brand, model, year, hours, condition }
 * @returns {Promise<Array>} Array van marktresultaten
 */
export async function searchMarketData(asset) {
  if (API_MODE === 'mock') {
    // Simuleer netwerk delay voor realistische demo
    await delay(100)
    return getMockResults(asset)
  }

  // ── LIVE MODUS ──
  // Parallel zoeken op alle enabled bronnen
  const enabledSources = Object.entries(MARKET_SOURCES)
    .filter(([, src]) => src.enabled)
    .map(([key]) => key)

  try {
    const response = await fetch(`${API_BASE_URL}/market/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sources: enabledSources,
        query: {
          category: asset.category,
          subcategory: asset.subcategory,
          brand: asset.brand,
          model: asset.model,
          yearFrom: asset.year ? asset.year - 3 : null,
          yearTo: asset.year ? asset.year + 1 : null,
        },
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
 * Haal prijshistorie op voor een specifiek merk/model
 * @param {string} brand
 * @param {string} model
 * @returns {Promise<Array>} Prijshistorie data points
 */
export async function getPriceHistory(brand, model) {
  if (API_MODE === 'mock') {
    // Generate mock price trend
    const basePrice = 50000
    const months = 12
    return Array.from({ length: months }, (_, i) => ({
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
