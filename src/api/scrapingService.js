// ═══════════════════════════════════════════════════════════════════
// Scraping Service — echte marktdata ophalen
// ═══════════════════════════════════════════════════════════════════
// Dit bestand bevat de structuur voor een server-side scraping proxy.
// Directe browser-scraping is niet mogelijk (CORS), dus dit draait
// als Vercel Edge Function of Supabase Edge Function.
//
// ARCHITECTUUR:
// Browser → API Proxy (Vercel) → Marktplaatsen → Genormaliseerde data
//
// STATUS PER BRON:
// ┌──────────────────┬────────────┬───────────────────────────────┐
// │ Bron             │ Methode    │ Status                        │
// ├──────────────────┼────────────┼───────────────────────────────┤
// │ Mascus           │ SOAP API   │ ✅ API beschikbaar            │
// │ Troostwijk/BVA   │ REST API   │ ✅ ATLAS API (account nodig)  │
// │ BVA Auctions     │ SDK        │ ✅ Open source SDK op GitHub  │
// │ Machineseeker    │ CSV/API    │ ⚠️ Alleen import-API (write)  │
// │ Ritchie Bros     │ Scraping   │ ⚠️ Geen publieke API          │
// │ TractorPool      │ Scraping   │ ⚠️ Geen publieke API          │
// └──────────────────┴────────────┴───────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════

import { API_BASE_URL } from './config'

/**
 * ── MASCUS ──
 * SOAP API: api.mascus.com
 * Documentatie: mascus.com (dealer login vereist)
 * Data: categorie, prijs, bouwjaar, locatie, specs (motorvermogen, transmissie)
 * Toegang: dealer account of partnership agreement
 */
export async function searchMascus(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/scrape/mascus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
    if (!response.ok) throw new Error(`Mascus: ${response.status}`)
    return await response.json()
  } catch (err) {
    console.warn('Mascus search failed:', err.message)
    return []
  }
}

/**
 * ── TROOSTWIJK / BVA AUCTIONS ──
 * REST API via ATLAS platform: apidocs.tbauctions.com
 * SDK: github.com/BVA-Holding-BV/bva-auctions-sdk
 * API docs: api-acc.bva-auctions.com/api/docs
 * Toegang: ATLAS platform account
 * Data: veilingresultaten, biedingen, specs, afbeeldingen, datums, locaties
 *
 * BVA = B2C markt, Troostwijk = B2B markt (zelfde holding)
 */
export async function searchTroostwijk(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/scrape/troostwijk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
    if (!response.ok) throw new Error(`Troostwijk: ${response.status}`)
    return await response.json()
  } catch (err) {
    console.warn('Troostwijk search failed:', err.message)
    return []
  }
}

/**
 * ── RITCHIE BROS ──
 * Geen publieke API, wel publieke veilingresultaten:
 * rbauction.com/equipment-values-auction-results
 * Price Results Tool: app.rbassetsolutions.com
 * Data: historische verkoopprijzen, filters op merk/model/jaar/regio
 * Methode: scraping van results pages of RB Price Results tool
 */
export async function searchRitchieBros(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/scrape/ritchiebros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
    if (!response.ok) throw new Error(`Ritchie Bros: ${response.status}`)
    return await response.json()
  } catch (err) {
    console.warn('Ritchie Bros search failed:', err.message)
    return []
  }
}

/**
 * ── MACHINESEEKER ──
 * Alleen import-API (machines uploaden), geen read-API voor prijzen
 * Real-time API voor dealer listing management
 * CSV import: 32 kolommen (type, merk, prijs)
 * Methode: publieke listings scrapen
 */
export async function searchMachineseeker(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/scrape/machineseeker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
    if (!response.ok) throw new Error(`Machineseeker: ${response.status}`)
    return await response.json()
  } catch (err) {
    console.warn('Machineseeker search failed:', err.message)
    return []
  }
}

/**
 * ── GENORMALISEERDE OUTPUT ──
 * Alle bronnen worden genormaliseerd naar dit formaat:
 */
export const NORMALIZED_RESULT_SCHEMA = {
  id: 'string',           // Unieke ID
  source: 'string',       // Bronnaam (Mascus, Troostwijk, etc.)
  brand: 'string',        // Merk
  model: 'string',        // Model
  year: 'number',         // Bouwjaar
  price: 'number',        // Prijs in EUR
  currency: 'string',     // Valuta (EUR)
  location: 'string',     // Locatie (stad, land)
  condition: 'string',    // Conditie (Slecht/Matig/Redelijk/Goed/Uitstekend)
  hours: 'number|null',   // Draaiuren
  listDate: 'string',     // Datum listing (YYYY-MM-DD)
  isAuction: 'boolean',   // Is het een veiling?
  url: 'string|null',     // Link naar originele listing
  imageUrl: 'string|null', // Afbeelding URL
}
