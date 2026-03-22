export function getMarketResults(asset) {
  const allResults = [
    // CNC Draaibanken
    { id: 1, source: 'Mascus', brand: 'DMG Mori', model: 'CLX 350', year: 2019, price: 67500, currency: 'EUR', location: 'Eindhoven, NL', condition: 'Goed', hours: 4200, listDate: '2026-02-15', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 2, source: 'Troostwijk', brand: 'DMG Mori', model: 'CLX 450', year: 2018, price: 72000, currency: 'EUR', location: 'Rotterdam, NL', condition: 'Redelijk', hours: 6800, listDate: '2026-01-20', type: 'cnc-draaibank', category: 'metaalbewerking', isAuction: true },
    { id: 3, source: 'Machineseeker', brand: 'Mazak', model: 'Quick Turn 200', year: 2020, price: 58000, currency: 'EUR', location: 'Dusseldorf, DE', condition: 'Goed', hours: 3100, listDate: '2026-03-01', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 4, source: 'Mascus', brand: 'Haas', model: 'ST-20', year: 2017, price: 38500, currency: 'EUR', location: 'Antwerpen, BE', condition: 'Matig', hours: 9200, listDate: '2026-02-28', type: 'cnc-draaibank', category: 'metaalbewerking' },

    // CNC Freesmachines
    { id: 5, source: 'Mascus', brand: 'DMG Mori', model: 'DMU 50', year: 2020, price: 95000, currency: 'EUR', location: 'Utrecht, NL', condition: 'Goed', hours: 2800, listDate: '2026-03-10', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 6, source: 'Troostwijk', brand: 'Haas', model: 'VF-2SS', year: 2019, price: 52000, currency: 'EUR', location: 'Tilburg, NL', condition: 'Goed', hours: 4500, listDate: '2026-02-05', type: 'cnc-freesmachine', category: 'metaalbewerking', isAuction: true },
    { id: 7, source: 'BVA Auctions', brand: 'Mazak', model: 'VCN 530C', year: 2016, price: 41000, currency: 'EUR', location: 'Zwolle, NL', condition: 'Redelijk', hours: 8100, listDate: '2026-01-15', type: 'cnc-freesmachine', category: 'metaalbewerking', isAuction: true },

    // Heftrucks
    { id: 8, source: 'Mascus', brand: 'Toyota', model: '8FBMT25', year: 2021, price: 18500, currency: 'EUR', location: 'Amsterdam, NL', condition: 'Goed', hours: 3200, listDate: '2026-03-05', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 9, source: 'Troostwijk', brand: 'Linde', model: 'E25', year: 2019, price: 14200, currency: 'EUR', location: 'Den Haag, NL', condition: 'Redelijk', hours: 5600, listDate: '2026-02-20', type: 'heftruck-elektrisch', category: 'heftrucks', isAuction: true },
    { id: 10, source: 'Mascus', brand: 'Jungheinrich', model: 'EFG 320', year: 2020, price: 16800, currency: 'EUR', location: 'Breda, NL', condition: 'Goed', hours: 4100, listDate: '2026-03-12', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 11, source: 'BVA Auctions', brand: 'Still', model: 'RX 20-16', year: 2018, price: 11500, currency: 'EUR', location: 'Groningen, NL', condition: 'Matig', hours: 7800, listDate: '2026-01-25', type: 'heftruck-elektrisch', category: 'heftrucks', isAuction: true },
    { id: 12, source: 'Mascus', brand: 'Toyota', model: '8FD25', year: 2019, price: 21000, currency: 'EUR', location: 'Venlo, NL', condition: 'Goed', hours: 4800, listDate: '2026-02-18', type: 'heftruck-diesel', category: 'heftrucks' },

    // Verpakking
    { id: 13, source: 'Mascus', brand: 'Multivac', model: 'R 245', year: 2018, price: 35000, currency: 'EUR', location: 'Deventer, NL', condition: 'Goed', hours: 5200, listDate: '2026-03-08', type: 'vulmachine', category: 'verpakking' },
    { id: 14, source: 'Machineseeker', brand: 'Bosch Packaging', model: 'CUC 3001', year: 2017, price: 28000, currency: 'EUR', location: 'Hamburg, DE', condition: 'Redelijk', hours: 7100, listDate: '2026-02-12', type: 'sluitmachine', category: 'verpakking' },

    // Houtbewerking
    { id: 15, source: 'Mascus', brand: 'Homag', model: 'Venture 316', year: 2019, price: 45000, currency: 'EUR', location: 'Nijmegen, NL', condition: 'Goed', hours: 3800, listDate: '2026-03-15', type: 'cnc-router', category: 'houtbewerking' },
    { id: 16, source: 'Troostwijk', brand: 'Biesse', model: 'Rover A 1332', year: 2017, price: 38000, currency: 'EUR', location: 'Eindhoven, NL', condition: 'Redelijk', hours: 6200, listDate: '2026-01-30', type: 'cnc-router', category: 'houtbewerking', isAuction: true },

    // Voedingsmiddelen
    { id: 17, source: 'Mascus', brand: 'GEA', model: 'Niro Spray Dryer', year: 2016, price: 125000, currency: 'EUR', location: 'Waalwijk, NL', condition: 'Redelijk', hours: 12000, listDate: '2026-02-25', type: 'menglijn', category: 'voedingsmiddelen' },
    { id: 18, source: 'Machineseeker', brand: 'Marel', model: 'I-Cut 122', year: 2020, price: 85000, currency: 'EUR', location: 'Boxtel, NL', condition: 'Goed', hours: 2900, listDate: '2026-03-18', type: 'transportband', category: 'voedingsmiddelen' },
  ]

  // Filter by category and type, or return fuzzy matches
  let results = allResults.filter(r => {
    if (asset.subcategory && r.type === asset.subcategory) return true
    if (asset.category && r.category === asset.category) return true
    return false
  })

  // Further filter by brand if specified
  if (asset.brand) {
    const brandLower = asset.brand.toLowerCase()
    const brandMatches = results.filter(r => r.brand.toLowerCase().includes(brandLower))
    if (brandMatches.length > 0) results = brandMatches
  }

  // Sort by relevance (same brand first, then by year proximity)
  if (asset.year) {
    results.sort((a, b) => Math.abs(a.year - asset.year) - Math.abs(b.year - asset.year))
  }

  return results.slice(0, 8)
}
