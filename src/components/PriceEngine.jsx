import { useState, useEffect } from 'react'
import { getMarketResults } from '../data/mockMarketResults'
import { getHistoricalData } from '../data/mockHistorical'
import { calculatePrices, formatCurrency } from '../utils/priceCalculator'
import MarketSearch from './MarketSearch'

const searchSteps = [
  { label: 'Zoeken op Mascus.nl...', icon: '🔍', duration: 800 },
  { label: 'Zoeken op Troostwijk Auctions...', icon: '🏷️', duration: 700 },
  { label: 'Zoeken op BVA Auctions...', icon: '📦', duration: 600 },
  { label: 'Raadplegen historische database...', icon: '📊', duration: 900 },
  { label: 'Analyseren en berekenen...', icon: '🧮', duration: 500 },
]

export default function PriceEngine({ asset, onComplete }) {
  const [searchStep, setSearchStep] = useState(0)
  const [isSearching, setIsSearching] = useState(true)
  const [marketResults, setMarketResults] = useState([])
  const [historicalData, setHistoricalData] = useState([])
  const [prices, setPrices] = useState(null)

  useEffect(() => {
    let stepIndex = 0
    const interval = setInterval(() => {
      stepIndex++
      if (stepIndex < searchSteps.length) {
        setSearchStep(stepIndex)
      } else {
        clearInterval(interval)
        // Load data
        const market = getMarketResults(asset)
        const historical = getHistoricalData(asset)
        const calculated = calculatePrices(market, historical, asset)
        setMarketResults(market)
        setHistoricalData(historical)
        setPrices(calculated)
        setIsSearching(false)
      }
    }, searchSteps[stepIndex]?.duration || 700)
    return () => clearInterval(interval)
  }, [asset])

  if (isSearching) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ntab-light rounded-full mb-4">
            <span className="text-3xl animate-bounce">{searchSteps[searchStep].icon}</span>
          </div>
          <h2 className="text-lg font-semibold text-ntab-primary mb-2">Marktanalyse</h2>
          <p className="text-ntab-text mb-6">{searchSteps[searchStep].label}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-ntab-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${((searchStep + 1) / searchSteps.length) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {searchSteps.map((step, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i <= searchStep ? 'bg-ntab-accent' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const valueTypes = [
    { key: 'liquidatiewaarde', label: 'Liquidatiewaarde', description: 'Opbrengst bij gedwongen verkoop', color: 'bg-red-50 border-red-200 text-red-800' },
    { key: 'marktwaarde', label: 'Marktwaarde', description: 'Waarde bij normale markttransactie', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { key: 'onderhandseVerkoopwaarde', label: 'Onderhandse verkoopwaarde', description: 'Waarde bij vrijwillige verkoop', color: 'bg-green-50 border-green-200 text-green-800' },
    { key: 'vervangingswaarde', label: 'Vervangingswaarde', description: 'Kosten voor economisch equivalent', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  ]

  return (
    <div className="space-y-6">
      {/* Prijssuggestie */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ntab-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Waardesuggestie
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ntab-text-light">Betrouwbaarheid</span>
            <div className="flex items-center gap-1 bg-ntab-light rounded-full px-3 py-1">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${prices.confidence >= 75 ? 'bg-ntab-success' : prices.confidence >= 50 ? 'bg-ntab-warning' : 'bg-red-500'}`}
                  style={{ width: `${prices.confidence}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-ntab-text">{prices.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {valueTypes.map(vt => {
            const val = prices[vt.key]
            return (
              <div key={vt.key} className={`rounded-lg border p-4 ${vt.color}`}>
                <div className="text-xs font-medium opacity-75 mb-1">{vt.label}</div>
                <div className="text-2xl font-bold">{formatCurrency(val.mid)}</div>
                <div className="text-xs opacity-60 mt-1">
                  Range: {formatCurrency(val.low)} – {formatCurrency(val.high)}
                </div>
                <div className="text-xs opacity-50 mt-0.5">{vt.description}</div>
              </div>
            )
          })}
        </div>

        {/* Data points info */}
        <div className="mt-4 flex gap-4 text-xs text-ntab-text-light">
          <span>📋 {prices.dataPoints.marketListings} marktlistings</span>
          <span>📊 {prices.dataPoints.historicalTaxaties} historische taxaties</span>
          <span>🏷️ {prices.dataPoints.veilingResultaten} veilingresultaten</span>
        </div>
      </div>

      {/* Markt resultaten */}
      <MarketSearch results={marketResults} historical={historicalData} />

      {/* Doorgaan */}
      <button
        onClick={() => onComplete({ marketResults, historicalData, prices })}
        className="w-full bg-ntab-accent hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Ga naar Taxateur Aanpassing
      </button>
    </div>
  )
}
