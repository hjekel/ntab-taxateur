export function calculatePrices(marketResults, historicalData, asset) {
  // Determine base market value from market results
  const prices = marketResults.map(r => r.price).filter(Boolean)
  const historicalPrices = historicalData
    .map(r => r.taxatieWaarde)
    .filter(Boolean)
  const auctionPrices = historicalData
    .map(r => r.veilingOpbrengst)
    .filter(Boolean)

  if (prices.length === 0 && historicalPrices.length === 0) {
    return null
  }

  // Calculate average market price
  const allPrices = [...prices, ...historicalPrices]
  const avgMarketPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length

  // Condition multiplier
  const conditionMultipliers = { 1: 0.5, 2: 0.7, 3: 0.85, 4: 1.0, 5: 1.15 }
  const conditionFactor = conditionMultipliers[asset.condition] || 1.0

  // Age depreciation (simple linear for demo)
  const currentYear = new Date().getFullYear()
  const age = asset.year ? currentYear - asset.year : 3
  const ageFactor = Math.max(0.3, 1 - age * 0.06)

  // Hours factor
  let hoursFactor = 1.0
  if (asset.hours) {
    if (asset.hours > 10000) hoursFactor = 0.75
    else if (asset.hours > 6000) hoursFactor = 0.85
    else if (asset.hours > 3000) hoursFactor = 0.95
  }

  // Base adjusted market value
  const adjustedMarket = avgMarketPrice * conditionFactor * ageFactor * hoursFactor

  // Calculate different value types
  const liquidatiewaarde = Math.round(adjustedMarket * 0.52)
  const marktwaarde = Math.round(adjustedMarket)
  const onderhandseVerkoopwaarde = Math.round(adjustedMarket * 1.05)
  const vervangingswaarde = Math.round(adjustedMarket * 1.35)

  // Confidence score based on data availability
  let confidence = 50
  if (prices.length >= 3) confidence += 15
  if (prices.length >= 5) confidence += 10
  if (historicalPrices.length >= 2) confidence += 10
  if (auctionPrices.length >= 1) confidence += 10
  if (asset.brand) confidence += 5
  confidence = Math.min(95, confidence)

  // Calculate ranges (+-10%)
  const range = (value) => ({
    low: Math.round(value * 0.9),
    mid: value,
    high: Math.round(value * 1.1),
  })

  return {
    liquidatiewaarde: range(liquidatiewaarde),
    marktwaarde: range(marktwaarde),
    onderhandseVerkoopwaarde: range(onderhandseVerkoopwaarde),
    vervangingswaarde: range(vervangingswaarde),
    confidence,
    dataPoints: {
      marketListings: prices.length,
      historicalTaxaties: historicalPrices.length,
      veilingResultaten: auctionPrices.length,
    },
    factors: {
      conditionFactor,
      ageFactor: Math.round(ageFactor * 100) / 100,
      hoursFactor,
      avgMarketPrice: Math.round(avgMarketPrice),
    },
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
