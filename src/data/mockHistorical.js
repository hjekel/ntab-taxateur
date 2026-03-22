export function getHistoricalData(asset) {
  const allHistorical = [
    // CNC Draaibanken
    { id: 'h1', brand: 'DMG Mori', model: 'CLX 350', year: 2018, taxatieWaarde: 55000, veilingOpbrengst: 48000, datum: '2025-09-15', taxateur: 'J. de Vries', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h2', brand: 'DMG Mori', model: 'CLX 350', year: 2019, taxatieWaarde: 65000, veilingOpbrengst: null, datum: '2025-11-20', taxateur: 'M. Bakker', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h3', brand: 'Mazak', model: 'Quick Turn 200', year: 2018, taxatieWaarde: 42000, veilingOpbrengst: 38500, datum: '2025-06-10', taxateur: 'P. Jansen', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h4', brand: 'Haas', model: 'ST-20', year: 2019, taxatieWaarde: 35000, veilingOpbrengst: 31000, datum: '2025-08-22', taxateur: 'J. de Vries', type: 'cnc-draaibank', category: 'metaalbewerking' },

    // Heftrucks
    { id: 'h5', brand: 'Toyota', model: '8FBMT25', year: 2020, taxatieWaarde: 16500, veilingOpbrengst: 14800, datum: '2025-10-05', taxateur: 'R. van Dam', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 'h6', brand: 'Linde', model: 'E25', year: 2019, taxatieWaarde: 13000, veilingOpbrengst: 11200, datum: '2025-07-18', taxateur: 'M. Bakker', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 'h7', brand: 'Jungheinrich', model: 'EFG 320', year: 2018, taxatieWaarde: 12500, veilingOpbrengst: 10800, datum: '2025-12-01', taxateur: 'P. Jansen', type: 'heftruck-elektrisch', category: 'heftrucks' },

    // CNC Frezen
    { id: 'h8', brand: 'DMG Mori', model: 'DMU 50', year: 2019, taxatieWaarde: 82000, veilingOpbrengst: 74000, datum: '2025-05-30', taxateur: 'J. de Vries', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 'h9', brand: 'Haas', model: 'VF-2SS', year: 2018, taxatieWaarde: 45000, veilingOpbrengst: 41000, datum: '2025-09-25', taxateur: 'R. van Dam', type: 'cnc-freesmachine', category: 'metaalbewerking' },

    // Houtbewerking
    { id: 'h10', brand: 'Homag', model: 'Venture 316', year: 2018, taxatieWaarde: 38000, veilingOpbrengst: 34500, datum: '2025-04-12', taxateur: 'M. Bakker', type: 'cnc-router', category: 'houtbewerking' },

    // Verpakking
    { id: 'h11', brand: 'Multivac', model: 'R 245', year: 2017, taxatieWaarde: 28000, veilingOpbrengst: 24000, datum: '2025-08-15', taxateur: 'P. Jansen', type: 'vulmachine', category: 'verpakking' },
  ]

  let results = allHistorical.filter(r => {
    if (asset.subcategory && r.type === asset.subcategory) return true
    if (asset.category && r.category === asset.category) return true
    return false
  })

  if (asset.brand) {
    const brandLower = asset.brand.toLowerCase()
    const brandMatches = results.filter(r => r.brand.toLowerCase().includes(brandLower))
    if (brandMatches.length > 0) results = brandMatches
  }

  return results.slice(0, 5)
}
