export function getHistoricalData(asset) {
  const allHistorical = [
    // CNC Draaibanken
    { id: 'h1', brand: 'DMG Mori', model: 'CLX 350', year: 2018, taxatieWaarde: 55000, veilingOpbrengst: 48000, datum: '2025-09-15', taxateur: 'J. de Vries', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h2', brand: 'DMG Mori', model: 'CLX 350', year: 2019, taxatieWaarde: 65000, veilingOpbrengst: null, datum: '2025-11-20', taxateur: 'M. Bakker', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h3', brand: 'Mazak', model: 'Quick Turn 200', year: 2018, taxatieWaarde: 42000, veilingOpbrengst: 38500, datum: '2025-06-10', taxateur: 'P. Jansen', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h4', brand: 'Haas', model: 'ST-20', year: 2019, taxatieWaarde: 35000, veilingOpbrengst: 31000, datum: '2025-08-22', taxateur: 'J. de Vries', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h12', brand: 'Okuma', model: 'LB3000 EX II', year: 2018, taxatieWaarde: 58000, veilingOpbrengst: 52000, datum: '2025-10-08', taxateur: 'R. van Dam', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 'h13', brand: 'Doosan', model: 'Puma 2600SY', year: 2019, taxatieWaarde: 54000, veilingOpbrengst: null, datum: '2026-01-12', taxateur: 'M. Bakker', type: 'cnc-draaibank', category: 'metaalbewerking' },

    // CNC Frezen
    { id: 'h8', brand: 'DMG Mori', model: 'DMU 50', year: 2019, taxatieWaarde: 82000, veilingOpbrengst: 74000, datum: '2025-05-30', taxateur: 'J. de Vries', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 'h9', brand: 'Haas', model: 'VF-2SS', year: 2018, taxatieWaarde: 45000, veilingOpbrengst: 41000, datum: '2025-09-25', taxateur: 'R. van Dam', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 'h14', brand: 'Hurco', model: 'VMX 42i', year: 2017, taxatieWaarde: 38000, veilingOpbrengst: 34500, datum: '2025-07-18', taxateur: 'P. Jansen', type: 'cnc-freesmachine', category: 'metaalbewerking' },

    // Laser
    { id: 'h15', brand: 'Trumpf', model: 'TruLaser 3030', year: 2017, taxatieWaarde: 105000, veilingOpbrengst: 92000, datum: '2025-11-05', taxateur: 'J. de Vries', type: 'laser-snijmachine', category: 'metaalbewerking' },
    { id: 'h16', brand: 'Amada', model: 'LCG 3015 AJ', year: 2018, taxatieWaarde: 115000, veilingOpbrengst: 98000, datum: '2025-08-20', taxateur: 'M. Bakker', type: 'laser-snijmachine', category: 'metaalbewerking' },

    // Heftrucks
    { id: 'h5', brand: 'Toyota', model: '8FBMT25', year: 2020, taxatieWaarde: 16500, veilingOpbrengst: 14800, datum: '2025-10-05', taxateur: 'R. van Dam', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 'h6', brand: 'Linde', model: 'E25', year: 2019, taxatieWaarde: 13000, veilingOpbrengst: 11200, datum: '2025-07-18', taxateur: 'M. Bakker', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 'h7', brand: 'Jungheinrich', model: 'EFG 320', year: 2018, taxatieWaarde: 12500, veilingOpbrengst: 10800, datum: '2025-12-01', taxateur: 'P. Jansen', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 'h17', brand: 'Crown', model: 'SC 5240', year: 2019, taxatieWaarde: 14000, veilingOpbrengst: 12200, datum: '2025-09-15', taxateur: 'J. de Vries', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 'h18', brand: 'Toyota', model: '8FD25', year: 2018, taxatieWaarde: 17500, veilingOpbrengst: 15800, datum: '2025-06-22', taxateur: 'R. van Dam', type: 'heftruck-diesel', category: 'heftrucks' },
    { id: 'h19', brand: 'Caterpillar', model: 'DP25N', year: 2019, taxatieWaarde: 20000, veilingOpbrengst: null, datum: '2025-11-30', taxateur: 'M. Bakker', type: 'heftruck-diesel', category: 'heftrucks' },

    // Houtbewerking
    { id: 'h10', brand: 'Homag', model: 'Venture 316', year: 2018, taxatieWaarde: 38000, veilingOpbrengst: 34500, datum: '2025-04-12', taxateur: 'M. Bakker', type: 'cnc-router', category: 'houtbewerking' },
    { id: 'h20', brand: 'Biesse', model: 'Rover A 1332', year: 2016, taxatieWaarde: 28000, veilingOpbrengst: 24500, datum: '2025-08-05', taxateur: 'P. Jansen', type: 'cnc-router', category: 'houtbewerking' },
    { id: 'h21', brand: 'Altendorf', model: 'F45', year: 2017, taxatieWaarde: 10500, veilingOpbrengst: 9200, datum: '2025-10-18', taxateur: 'J. de Vries', type: 'formaatzaag', category: 'houtbewerking' },

    // Verpakking
    { id: 'h11', brand: 'Multivac', model: 'R 245', year: 2017, taxatieWaarde: 28000, veilingOpbrengst: 24000, datum: '2025-08-15', taxateur: 'P. Jansen', type: 'vulmachine', category: 'verpakking' },
    { id: 'h22', brand: 'Krones', model: 'Contiform S8', year: 2015, taxatieWaarde: 72000, veilingOpbrengst: 61000, datum: '2025-05-20', taxateur: 'R. van Dam', type: 'vulmachine', category: 'verpakking' },
    { id: 'h23', brand: 'Tetra Pak', model: 'A3 Flex', year: 2017, taxatieWaarde: 58000, veilingOpbrengst: 52000, datum: '2025-09-28', taxateur: 'M. Bakker', type: 'vulmachine', category: 'verpakking' },

    // Voedingsmiddelen
    { id: 'h24', brand: 'GEA', model: 'Niro Spray Dryer', year: 2015, taxatieWaarde: 95000, veilingOpbrengst: 82000, datum: '2025-04-18', taxateur: 'J. de Vries', type: 'menglijn', category: 'voedingsmiddelen' },
    { id: 'h25', brand: 'Marel', model: 'I-Cut 122', year: 2019, taxatieWaarde: 78000, veilingOpbrengst: null, datum: '2025-12-10', taxateur: 'P. Jansen', type: 'transportband', category: 'voedingsmiddelen' },
    { id: 'h26', brand: 'Alfa Laval', model: 'HMRPX 518', year: 2017, taxatieWaarde: 62000, veilingOpbrengst: 55000, datum: '2025-07-22', taxateur: 'R. van Dam', type: 'menglijn', category: 'voedingsmiddelen' },
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

  return results.slice(0, 6)
}
