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

export const conditionLabels = [
  { value: 1, label: 'Slecht', description: 'Zwaar versleten, niet operationeel zonder groot onderhoud' },
  { value: 2, label: 'Matig', description: 'Versleten, beperkt operationeel, onderhoud nodig' },
  { value: 3, label: 'Redelijk', description: 'Operationeel, normale slijtage, regulier onderhoud' },
  { value: 4, label: 'Goed', description: 'Goed onderhouden, volledig operationeel' },
  { value: 5, label: 'Uitstekend', description: 'Als nieuw of recent gereviseerd' },
]
