export const categories = [
  {
    id: 'metaalbewerking',
    label: 'Metaalbewerking',
    subcategories: [
      { id: 'cnc-draaibank', label: 'CNC Draaibank' },
      { id: 'cnc-freesmachine', label: 'CNC Freesmachine' },
      { id: 'laser-snijmachine', label: 'Laser Snijmachine' },
      { id: 'kantpers', label: 'Kantpers / Afkantpers' },
      { id: 'plaatschaar', label: 'Plaatschaar' },
      { id: 'slijpmachine', label: 'Slijpmachine' },
    ],
  },
  {
    id: 'houtbewerking',
    label: 'Houtbewerking',
    subcategories: [
      { id: 'cnc-router', label: 'CNC Router' },
      { id: 'vlakbank', label: 'Vlakbank / Vandiktebank' },
      { id: 'formaatzaag', label: 'Formaatzaag' },
      { id: 'kantenlijmer', label: 'Kantenlijmer' },
    ],
  },
  {
    id: 'verpakking',
    label: 'Verpakkingsmachines',
    subcategories: [
      { id: 'vulmachine', label: 'Vulmachine' },
      { id: 'sluitmachine', label: 'Sluitmachine' },
      { id: 'etiketteermachine', label: 'Etiketteermachine' },
      { id: 'palletiseermachine', label: 'Palletiseermachine' },
    ],
  },
  {
    id: 'heftrucks',
    label: 'Heftrucks & Intern Transport',
    subcategories: [
      { id: 'heftruck-elektrisch', label: 'Heftruck Elektrisch' },
      { id: 'heftruck-diesel', label: 'Heftruck Diesel' },
      { id: 'reachtruck', label: 'Reachtruck' },
      { id: 'orderpicker', label: 'Orderpicker' },
      { id: 'pompwagen', label: 'Elektrische Pompwagen' },
    ],
  },
  {
    id: 'voedingsmiddelen',
    label: 'Voedingsmiddelenindustrie',
    subcategories: [
      { id: 'menglijn', label: 'Menglijn / Mixer' },
      { id: 'oven-industrieel', label: 'Industriele Oven' },
      { id: 'koelinstallatie', label: 'Koelinstallatie' },
      { id: 'transportband', label: 'Transportband' },
    ],
  },
]

export const brands = {
  metaalbewerking: ['DMG Mori', 'Mazak', 'Haas', 'Trumpf', 'Amada', 'Bystronic', 'Doosan', 'Okuma', 'Mori Seiki', 'Hurco'],
  houtbewerking: ['Homag', 'Biesse', 'SCM', 'Felder', 'Altendorf', 'Martin', 'Weinig', 'Holzma'],
  verpakking: ['Krones', 'Sidel', 'Bosch Packaging', 'Multivac', 'IMA', 'Tetra Pak', 'KHS'],
  heftrucks: ['Toyota', 'Linde', 'Jungheinrich', 'Still', 'Hyster', 'Yale', 'Crown', 'Caterpillar', 'Mitsubishi'],
  voedingsmiddelen: ['GEA', 'Buhler', 'Marel', 'JBT', 'Alfa Laval', 'SPX Flow', 'Hein'],
}

// Example models per brand+subcategory for quick selection
export const exampleModels = {
  // CNC Draaibanken
  'DMG Mori|cnc-draaibank': ['CLX 350', 'CLX 450', 'CLX 550', 'NLX 2000', 'NLX 2500'],
  'Mazak|cnc-draaibank': ['Quick Turn 200', 'Quick Turn 250', 'QT Nexus 250', 'QT Nexus 350'],
  'Haas|cnc-draaibank': ['ST-20', 'ST-30', 'ST-35', 'DS-30Y'],
  'Okuma|cnc-draaibank': ['LB3000 EX II', 'LB4000 EX II', 'GENOS L250'],
  'Doosan|cnc-draaibank': ['Puma 2600SY', 'Puma 2100SY', 'Lynx 2100'],
  // CNC Freesmachines
  'DMG Mori|cnc-freesmachine': ['DMU 50', 'DMU 60', 'DMU 80', 'DMC 635V'],
  'Haas|cnc-freesmachine': ['VF-2SS', 'VF-3SS', 'VF-4SS', 'Mini Mill'],
  'Mazak|cnc-freesmachine': ['VCN 530C', 'VCN 700C', 'Variaxis i-300'],
  'Hurco|cnc-freesmachine': ['VMX 42i', 'VMX 30i', 'VM 10i'],
  'Okuma|cnc-freesmachine': ['GENOS M560-V', 'GENOS M460-V', 'MB-46V'],
  'Doosan|cnc-freesmachine': ['DNM 500 II', 'DNM 650 II', 'Mynx 5400'],
  // Laser
  'Trumpf|laser-snijmachine': ['TruLaser 3030', 'TruLaser 5030', 'TruLaser 1030'],
  'Bystronic|laser-snijmachine': ['ByStar Fiber 3015', 'ByStar Fiber 4020', 'BySprint Fiber'],
  'Amada|laser-snijmachine': ['LCG 3015 AJ', 'ENSIS 3015 AJ', 'FOL 3015 AJ'],
  // Kantpersen
  'Trumpf|kantpers': ['TruBend 5130', 'TruBend 5085', 'TruBend 7036'],
  'Amada|kantpers': ['HFE 100-3', 'HG 1003', 'HRB 1003'],
  // Heftrucks Elektrisch
  'Toyota|heftruck-elektrisch': ['8FBMT25', '8FBMT30', '8FBMT20', '8FBMK25'],
  'Linde|heftruck-elektrisch': ['E25', 'E30', 'E20', 'E16'],
  'Jungheinrich|heftruck-elektrisch': ['EFG 320', 'EFG 220', 'EFG 425', 'EFG 216'],
  'Still|heftruck-elektrisch': ['RX 20-16', 'RX 20-18', 'RX 20-20', 'RX 60-25'],
  'Crown|heftruck-elektrisch': ['SC 5240', 'SC 5260', 'FC 5200'],
  'Hyster|heftruck-elektrisch': ['J2.5XN', 'J3.0XN', 'J1.8XN'],
  // Heftrucks Diesel
  'Toyota|heftruck-diesel': ['8FD25', '8FD30', '8FD20', '8FD35'],
  'Linde|heftruck-diesel': ['H25D', 'H30D', 'H20D', 'H35D'],
  'Caterpillar|heftruck-diesel': ['DP25N', 'DP30N', 'DP35N'],
  'Mitsubishi|heftruck-diesel': ['FD25N', 'FD30N', 'FD20N'],
  // Reachtrucks
  'Jungheinrich|reachtruck': ['ETV 214', 'ETV 216', 'ETV 320'],
  'Still|reachtruck': ['FM-X 14', 'FM-X 17', 'FM-X 20'],
  'Toyota|reachtruck': ['BT Reflex RRE160', 'BT Reflex RRE200'],
  // Houtbewerking
  'Homag|cnc-router': ['Venture 316', 'Venture 115', 'BOF 311'],
  'Biesse|cnc-router': ['Rover A 1332', 'Rover B 4.40', 'Rover K FT'],
  'SCM|cnc-router': ['Morbidelli M200', 'Morbidelli M400', 'Accord 25 FX'],
  'Altendorf|formaatzaag': ['F45', 'WA 80', 'C45'],
  'Homag|kantenlijmer': ['KAL 210', 'KAL 310', 'Edgeteq S-240'],
  // Verpakking
  'Multivac|vulmachine': ['R 245', 'R 535', 'R 175', 'T 800'],
  'Krones|vulmachine': ['Contiform S8', 'Contiform S16', 'Modulfill'],
  'IMA|vulmachine': ['C70', 'C21', 'Ilapak Delta'],
  'Tetra Pak|vulmachine': ['A3 Flex', 'A3 Speed', 'A1'],
  'Bosch Packaging|sluitmachine': ['CUC 3001', 'CUT 1205', 'CUT 1301'],
  'Krones|etiketteermachine': ['Autocol 540', 'Autocol 560', 'Topmatic'],
  'Sidel|etiketteermachine': ['EvoDECO', 'SL 90', 'Rollquattro'],
  // Voedingsmiddelen
  'GEA|menglijn': ['Niro Spray Dryer', 'Collette', 'Ariete 6100'],
  'Alfa Laval|menglijn': ['HMRPX 518', 'HMRPX 714', 'Contherm'],
  'Buhler|menglijn': ['MDDL 500/1000', 'MDDL 250/1000', 'Mozley'],
  'JBT|oven-industrieel': ['Stein TwinDrum 400', 'Stein Linear Oven', 'Stein JOF'],
  'Marel|transportband': ['I-Cut 122', 'I-Cut 36', 'SensorX'],
}

export const conditionLabels = [
  { value: 1, label: 'Slecht', description: 'Zwaar versleten, niet operationeel zonder groot onderhoud' },
  { value: 2, label: 'Matig', description: 'Versleten, beperkt operationeel, onderhoud nodig' },
  { value: 3, label: 'Redelijk', description: 'Operationeel, normale slijtage, regulier onderhoud' },
  { value: 4, label: 'Goed', description: 'Goed onderhouden, volledig operationeel' },
  { value: 5, label: 'Uitstekend', description: 'Als nieuw of recent gereviseerd' },
]
