export function getMarketResults(asset) {
  const allResults = [
    // CNC Draaibanken (8)
    { id: 1, source: 'Mascus', brand: 'DMG Mori', model: 'CLX 350', year: 2019, price: 67500, currency: 'EUR', location: 'Eindhoven, NL', condition: 'Goed', hours: 4200, listDate: '2026-02-15', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 2, source: 'Troostwijk', brand: 'DMG Mori', model: 'CLX 450', year: 2018, price: 72000, currency: 'EUR', location: 'Rotterdam, NL', condition: 'Redelijk', hours: 6800, listDate: '2026-01-20', type: 'cnc-draaibank', category: 'metaalbewerking', isAuction: true },
    { id: 3, source: 'Machineseeker', brand: 'Mazak', model: 'Quick Turn 200', year: 2020, price: 58000, currency: 'EUR', location: 'Dusseldorf, DE', condition: 'Goed', hours: 3100, listDate: '2026-03-01', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 4, source: 'Mascus', brand: 'Haas', model: 'ST-20', year: 2017, price: 38500, currency: 'EUR', location: 'Antwerpen, BE', condition: 'Matig', hours: 9200, listDate: '2026-02-28', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 19, source: 'BVA Auctions', brand: 'Okuma', model: 'LB3000 EX II', year: 2019, price: 71000, currency: 'EUR', location: 'Helmond, NL', condition: 'Goed', hours: 3800, listDate: '2026-03-05', type: 'cnc-draaibank', category: 'metaalbewerking', isAuction: true },
    { id: 20, source: 'Mascus', brand: 'Doosan', model: 'Puma 2600SY', year: 2020, price: 62000, currency: 'EUR', location: 'Enschede, NL', condition: 'Goed', hours: 2900, listDate: '2026-03-10', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 21, source: 'Machineseeker', brand: 'Mazak', model: 'QT Nexus 250', year: 2016, price: 34000, currency: 'EUR', location: 'Munchen, DE', condition: 'Redelijk', hours: 11500, listDate: '2026-01-18', type: 'cnc-draaibank', category: 'metaalbewerking' },
    { id: 22, source: 'Troostwijk', brand: 'Haas', model: 'ST-30', year: 2021, price: 55000, currency: 'EUR', location: 'Breda, NL', condition: 'Goed', hours: 2100, listDate: '2026-02-25', type: 'cnc-draaibank', category: 'metaalbewerking', isAuction: true },

    // CNC Freesmachines (6)
    { id: 5, source: 'Mascus', brand: 'DMG Mori', model: 'DMU 50', year: 2020, price: 95000, currency: 'EUR', location: 'Utrecht, NL', condition: 'Goed', hours: 2800, listDate: '2026-03-10', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 6, source: 'Troostwijk', brand: 'Haas', model: 'VF-2SS', year: 2019, price: 52000, currency: 'EUR', location: 'Tilburg, NL', condition: 'Goed', hours: 4500, listDate: '2026-02-05', type: 'cnc-freesmachine', category: 'metaalbewerking', isAuction: true },
    { id: 7, source: 'BVA Auctions', brand: 'Mazak', model: 'VCN 530C', year: 2016, price: 41000, currency: 'EUR', location: 'Zwolle, NL', condition: 'Redelijk', hours: 8100, listDate: '2026-01-15', type: 'cnc-freesmachine', category: 'metaalbewerking', isAuction: true },
    { id: 23, source: 'Mascus', brand: 'Hurco', model: 'VMX 42i', year: 2018, price: 48000, currency: 'EUR', location: 'Apeldoorn, NL', condition: 'Goed', hours: 5200, listDate: '2026-02-20', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 24, source: 'Machineseeker', brand: 'Okuma', model: 'GENOS M560-V', year: 2021, price: 88000, currency: 'EUR', location: 'Stuttgart, DE', condition: 'Uitstekend', hours: 1800, listDate: '2026-03-15', type: 'cnc-freesmachine', category: 'metaalbewerking' },
    { id: 25, source: 'Troostwijk', brand: 'Doosan', model: 'DNM 500 II', year: 2017, price: 37000, currency: 'EUR', location: 'Leiden, NL', condition: 'Redelijk', hours: 7400, listDate: '2026-01-28', type: 'cnc-freesmachine', category: 'metaalbewerking', isAuction: true },

    // Laser Snijmachines (3)
    { id: 26, source: 'Mascus', brand: 'Trumpf', model: 'TruLaser 3030', year: 2019, price: 145000, currency: 'EUR', location: 'Eindhoven, NL', condition: 'Goed', hours: 8200, listDate: '2026-03-01', type: 'laser-snijmachine', category: 'metaalbewerking' },
    { id: 27, source: 'Machineseeker', brand: 'Bystronic', model: 'ByStar Fiber 3015', year: 2020, price: 165000, currency: 'EUR', location: 'Zurich, CH', condition: 'Goed', hours: 5600, listDate: '2026-02-10', type: 'laser-snijmachine', category: 'metaalbewerking' },
    { id: 28, source: 'Troostwijk', brand: 'Amada', model: 'LCG 3015 AJ', year: 2018, price: 118000, currency: 'EUR', location: 'Den Bosch, NL', condition: 'Redelijk', hours: 12400, listDate: '2026-01-22', type: 'laser-snijmachine', category: 'metaalbewerking', isAuction: true },

    // Kantpersen (2)
    { id: 29, source: 'Mascus', brand: 'Trumpf', model: 'TruBend 5130', year: 2019, price: 85000, currency: 'EUR', location: 'Tilburg, NL', condition: 'Goed', hours: 4100, listDate: '2026-03-12', type: 'kantpers', category: 'metaalbewerking' },
    { id: 30, source: 'BVA Auctions', brand: 'Amada', model: 'HFE 100-3', year: 2017, price: 52000, currency: 'EUR', location: 'Almere, NL', condition: 'Redelijk', hours: 7800, listDate: '2026-02-08', type: 'kantpers', category: 'metaalbewerking', isAuction: true },

    // Heftrucks Elektrisch (6)
    { id: 8, source: 'Mascus', brand: 'Toyota', model: '8FBMT25', year: 2021, price: 18500, currency: 'EUR', location: 'Amsterdam, NL', condition: 'Goed', hours: 3200, listDate: '2026-03-05', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 9, source: 'Troostwijk', brand: 'Linde', model: 'E25', year: 2019, price: 14200, currency: 'EUR', location: 'Den Haag, NL', condition: 'Redelijk', hours: 5600, listDate: '2026-02-20', type: 'heftruck-elektrisch', category: 'heftrucks', isAuction: true },
    { id: 10, source: 'Mascus', brand: 'Jungheinrich', model: 'EFG 320', year: 2020, price: 16800, currency: 'EUR', location: 'Breda, NL', condition: 'Goed', hours: 4100, listDate: '2026-03-12', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 11, source: 'BVA Auctions', brand: 'Still', model: 'RX 20-16', year: 2018, price: 11500, currency: 'EUR', location: 'Groningen, NL', condition: 'Matig', hours: 7800, listDate: '2026-01-25', type: 'heftruck-elektrisch', category: 'heftrucks', isAuction: true },
    { id: 31, source: 'Mascus', brand: 'Crown', model: 'SC 5240', year: 2020, price: 15200, currency: 'EUR', location: 'Arnhem, NL', condition: 'Goed', hours: 3600, listDate: '2026-03-08', type: 'heftruck-elektrisch', category: 'heftrucks' },
    { id: 32, source: 'Machineseeker', brand: 'Hyster', model: 'J2.5XN', year: 2019, price: 13800, currency: 'EUR', location: 'Antwerpen, BE', condition: 'Redelijk', hours: 5200, listDate: '2026-02-14', type: 'heftruck-elektrisch', category: 'heftrucks' },

    // Heftrucks Diesel (4)
    { id: 12, source: 'Mascus', brand: 'Toyota', model: '8FD25', year: 2019, price: 21000, currency: 'EUR', location: 'Venlo, NL', condition: 'Goed', hours: 4800, listDate: '2026-02-18', type: 'heftruck-diesel', category: 'heftrucks' },
    { id: 33, source: 'Troostwijk', brand: 'Linde', model: 'H25D', year: 2018, price: 18500, currency: 'EUR', location: 'Rotterdam, NL', condition: 'Redelijk', hours: 6200, listDate: '2026-01-30', type: 'heftruck-diesel', category: 'heftrucks', isAuction: true },
    { id: 34, source: 'Mascus', brand: 'Caterpillar', model: 'DP25N', year: 2020, price: 23500, currency: 'EUR', location: 'Eindhoven, NL', condition: 'Goed', hours: 3400, listDate: '2026-03-15', type: 'heftruck-diesel', category: 'heftrucks' },
    { id: 35, source: 'BVA Auctions', brand: 'Mitsubishi', model: 'FD25N', year: 2017, price: 14500, currency: 'EUR', location: 'Utrecht, NL', condition: 'Matig', hours: 8900, listDate: '2026-02-05', type: 'heftruck-diesel', category: 'heftrucks', isAuction: true },

    // Reachtrucks (2)
    { id: 36, source: 'Mascus', brand: 'Jungheinrich', model: 'ETV 214', year: 2020, price: 22000, currency: 'EUR', location: 'Tilburg, NL', condition: 'Goed', hours: 4800, listDate: '2026-03-02', type: 'reachtruck', category: 'heftrucks' },
    { id: 37, source: 'Troostwijk', brand: 'Still', model: 'FM-X 14', year: 2019, price: 19500, currency: 'EUR', location: 'Zwolle, NL', condition: 'Redelijk', hours: 5900, listDate: '2026-02-22', type: 'reachtruck', category: 'heftrucks', isAuction: true },

    // Verpakking (5)
    { id: 13, source: 'Mascus', brand: 'Multivac', model: 'R 245', year: 2018, price: 35000, currency: 'EUR', location: 'Deventer, NL', condition: 'Goed', hours: 5200, listDate: '2026-03-08', type: 'vulmachine', category: 'verpakking' },
    { id: 14, source: 'Machineseeker', brand: 'Bosch Packaging', model: 'CUC 3001', year: 2017, price: 28000, currency: 'EUR', location: 'Hamburg, DE', condition: 'Redelijk', hours: 7100, listDate: '2026-02-12', type: 'sluitmachine', category: 'verpakking' },
    { id: 38, source: 'Troostwijk', brand: 'IMA', model: 'C70', year: 2019, price: 42000, currency: 'EUR', location: 'Amersfoort, NL', condition: 'Goed', hours: 4300, listDate: '2026-03-01', type: 'vulmachine', category: 'verpakking', isAuction: true },
    { id: 39, source: 'Mascus', brand: 'Krones', model: 'Contiform S8', year: 2016, price: 95000, currency: 'EUR', location: 'Dortmund, DE', condition: 'Redelijk', hours: 14000, listDate: '2026-01-20', type: 'vulmachine', category: 'verpakking' },
    { id: 40, source: 'BVA Auctions', brand: 'Tetra Pak', model: 'A3 Flex', year: 2018, price: 68000, currency: 'EUR', location: 'Gorinchem, NL', condition: 'Goed', hours: 6800, listDate: '2026-02-28', type: 'vulmachine', category: 'verpakking', isAuction: true },

    // Etiketteermachines (2)
    { id: 41, source: 'Mascus', brand: 'Krones', model: 'Autocol 540', year: 2019, price: 32000, currency: 'EUR', location: 'Venlo, NL', condition: 'Goed', hours: 3900, listDate: '2026-03-10', type: 'etiketteermachine', category: 'verpakking' },
    { id: 42, source: 'Machineseeker', brand: 'Sidel', model: 'EvoDECO', year: 2020, price: 45000, currency: 'EUR', location: 'Parijs, FR', condition: 'Uitstekend', hours: 2100, listDate: '2026-02-15', type: 'etiketteermachine', category: 'verpakking' },

    // Houtbewerking (5)
    { id: 15, source: 'Mascus', brand: 'Homag', model: 'Venture 316', year: 2019, price: 45000, currency: 'EUR', location: 'Nijmegen, NL', condition: 'Goed', hours: 3800, listDate: '2026-03-15', type: 'cnc-router', category: 'houtbewerking' },
    { id: 16, source: 'Troostwijk', brand: 'Biesse', model: 'Rover A 1332', year: 2017, price: 38000, currency: 'EUR', location: 'Eindhoven, NL', condition: 'Redelijk', hours: 6200, listDate: '2026-01-30', type: 'cnc-router', category: 'houtbewerking', isAuction: true },
    { id: 43, source: 'Machineseeker', brand: 'SCM', model: 'Morbidelli M200', year: 2020, price: 52000, currency: 'EUR', location: 'Milaan, IT', condition: 'Goed', hours: 2800, listDate: '2026-03-05', type: 'cnc-router', category: 'houtbewerking' },
    { id: 44, source: 'Mascus', brand: 'Altendorf', model: 'F45', year: 2018, price: 12500, currency: 'EUR', location: 'Arnhem, NL', condition: 'Goed', hours: 3200, listDate: '2026-02-20', type: 'formaatzaag', category: 'houtbewerking' },
    { id: 45, source: 'Troostwijk', brand: 'Homag', model: 'KAL 210', year: 2019, price: 28000, currency: 'EUR', location: 'Oss, NL', condition: 'Goed', hours: 4100, listDate: '2026-03-12', type: 'kantenlijmer', category: 'houtbewerking', isAuction: true },

    // Voedingsmiddelen (5)
    { id: 17, source: 'Mascus', brand: 'GEA', model: 'Niro Spray Dryer', year: 2016, price: 125000, currency: 'EUR', location: 'Waalwijk, NL', condition: 'Redelijk', hours: 12000, listDate: '2026-02-25', type: 'menglijn', category: 'voedingsmiddelen' },
    { id: 18, source: 'Machineseeker', brand: 'Marel', model: 'I-Cut 122', year: 2020, price: 85000, currency: 'EUR', location: 'Boxtel, NL', condition: 'Goed', hours: 2900, listDate: '2026-03-18', type: 'transportband', category: 'voedingsmiddelen' },
    { id: 46, source: 'Mascus', brand: 'Alfa Laval', model: 'HMRPX 518', year: 2018, price: 78000, currency: 'EUR', location: 'Woerden, NL', condition: 'Goed', hours: 6500, listDate: '2026-03-02', type: 'menglijn', category: 'voedingsmiddelen' },
    { id: 47, source: 'Troostwijk', brand: 'Buhler', model: 'MDDL 500/1000', year: 2017, price: 92000, currency: 'EUR', location: 'Veghel, NL', condition: 'Redelijk', hours: 9800, listDate: '2026-01-15', type: 'menglijn', category: 'voedingsmiddelen', isAuction: true },
    { id: 48, source: 'Mascus', brand: 'JBT', model: 'Stein TwinDrum 400', year: 2019, price: 110000, currency: 'EUR', location: 'Helmond, NL', condition: 'Goed', hours: 4200, listDate: '2026-02-28', type: 'oven-industrieel', category: 'voedingsmiddelen' },
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
