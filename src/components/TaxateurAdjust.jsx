import { useState } from 'react'
import { formatCurrency } from '../utils/priceCalculator'

const adjustReasons = [
  'Geen aanpassing nodig',
  'Specifieke staat/slijtage',
  'Speciale uitvoering/opties',
  'Marktomstandigheden regio',
  'Beperkte vraag in segment',
  'Recent groot onderhoud',
  'Ontbrekende onderdelen',
  'Bekende koper aanwezig',
  'Anders',
]

const valueTypes = [
  { key: 'liquidatiewaarde', label: 'Liquidatiewaarde' },
  { key: 'marktwaarde', label: 'Marktwaarde' },
  { key: 'onderhandseVerkoopwaarde', label: 'Onderhands' },
  { key: 'vervangingswaarde', label: 'Vervangingswaarde' },
]

export default function TaxateurAdjust({ prices, onComplete }) {
  const [adjustments, setAdjustments] = useState(
    Object.fromEntries(valueTypes.map(vt => [vt.key, prices[vt.key].mid]))
  )
  const [reason, setReason] = useState('Geen aanpassing nodig')
  const [notes, setNotes] = useState('')
  const [confidence, setConfidence] = useState(prices.confidence)

  function updateValue(key, value) {
    const num = parseInt(value) || 0
    setAdjustments(prev => ({ ...prev, [key]: num }))
  }

  function handleComplete() {
    onComplete({
      adjustedPrices: adjustments,
      reason,
      notes,
      confidence,
    })
  }

  return (
    <div className="space-y-6">
      {/* Value adjustments */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-6">
        <h2 className="text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Taxateur Aanpassing
        </h2>
        <p className="text-sm text-ntab-text-light mb-4">
          Pas de gesuggereerde waardes aan op basis van uw expertise en locatiebezoek.
        </p>

        <div className="space-y-4">
          {valueTypes.map(vt => {
            const suggested = prices[vt.key].mid
            const current = adjustments[vt.key]
            const diff = current - suggested
            const diffPct = suggested > 0 ? Math.round((diff / suggested) * 100) : 0

            return (
              <div key={vt.key} className="p-4 bg-ntab-light rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-ntab-text">{vt.label}</label>
                  <span className="text-xs text-ntab-text-light">
                    Suggestie: {formatCurrency(suggested)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ntab-text-light">€</span>
                  <input
                    type="number"
                    value={current}
                    onChange={e => updateValue(vt.key, e.target.value)}
                    className="flex-1 rounded-lg border border-ntab-border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ntab-secondary"
                  />
                  {diff !== 0 && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${diff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {diff > 0 ? '+' : ''}{diffPct}%
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reason & Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-6">
        <h2 className="text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          Onderbouwing
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ntab-text mb-1">Reden aanpassing</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full rounded-lg border border-ntab-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary"
          >
            {adjustReasons.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-ntab-text mb-1">Taxateur notities</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Motivatie voor aanpassing, bevindingen locatiebezoek, bijzonderheden..."
            className="w-full rounded-lg border border-ntab-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary resize-none"
          />
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium text-ntab-text mb-1">
            Betrouwbaarheid taxatie: <span className="font-bold">{confidence}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={confidence}
            onChange={e => setConfidence(parseInt(e.target.value))}
            className="w-full accent-ntab-accent"
          />
          <div className="flex justify-between text-xs text-ntab-text-light">
            <span>Laag</span>
            <span>Hoog</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        className="w-full bg-ntab-accent hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Genereer Rapport
      </button>
    </div>
  )
}
