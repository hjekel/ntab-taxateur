import { formatCurrency } from '../utils/priceCalculator'
import { categories, conditionLabels } from '../data/categories'

const valueTypeLabels = {
  liquidatiewaarde: 'Liquidatiewaarde',
  marktwaarde: 'Marktwaarde',
  onderhandseVerkoopwaarde: 'Onderhandse verkoopwaarde',
  vervangingswaarde: 'Vervangingswaarde',
}

export default function ReportPreview({ asset, priceData, adjustment }) {
  const categoryLabel = categories.find(c => c.id === asset.category)?.label || asset.category
  const subcategoryLabel = categories
    .find(c => c.id === asset.category)
    ?.subcategories.find(s => s.id === asset.subcategory)?.label || asset.subcategory
  const conditionLabel = conditionLabels.find(c => c.value === asset.condition)?.label || asset.condition

  const today = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  function handleExport() {
    alert('PDF export is beschikbaar in de volledige versie.\n\nDit rapport zou worden geexporteerd als:\n\nNTAB_Taxatierapport_' + asset.brand + '_' + asset.model + '.pdf')
  }

  return (
    <div className="space-y-6">
      {/* Report */}
      <div className="bg-white rounded-xl shadow-lg border border-ntab-border overflow-hidden">
        {/* Header */}
        <div className="bg-ntab-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-75 mb-1">NTAB - Nederlands Taxatie & Adviesbureau</div>
              <h1 className="text-2xl font-bold">Taxatierapport</h1>
              <div className="text-sm opacity-75 mt-1">Opgericht 1904 · ISO 27001 gecertificeerd</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold opacity-20">NTAB</div>
              <div className="text-sm opacity-75">Rapport #{Math.floor(Math.random() * 9000 + 1000)}</div>
              <div className="text-sm opacity-75">{today}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset info */}
          <section>
            <h2 className="text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              1. Object Identificatie
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div><span className="text-ntab-text-light">Categorie:</span> <span className="font-medium">{categoryLabel}</span></div>
              <div><span className="text-ntab-text-light">Subcategorie:</span> <span className="font-medium">{subcategoryLabel}</span></div>
              <div><span className="text-ntab-text-light">Merk:</span> <span className="font-medium">{asset.brand}</span></div>
              <div><span className="text-ntab-text-light">Model:</span> <span className="font-medium">{asset.model}</span></div>
              <div><span className="text-ntab-text-light">Bouwjaar:</span> <span className="font-medium">{asset.year}</span></div>
              <div><span className="text-ntab-text-light">Draaiuren:</span> <span className="font-medium">{asset.hours ? asset.hours.toLocaleString('nl-NL') : 'Onbekend'}</span></div>
              <div><span className="text-ntab-text-light">Conditie:</span> <span className="font-medium">{conditionLabel} ({asset.condition}/5)</span></div>
            </div>
            {asset.notes && (
              <div className="mt-2 text-sm"><span className="text-ntab-text-light">Opmerkingen:</span> {asset.notes}</div>
            )}
          </section>

          {/* Waardetabel */}
          <section>
            <h2 className="text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              2. Waardebepaling
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ntab-light">
                  <th className="text-left py-2 px-3 font-medium text-ntab-text">Waardebegrip</th>
                  <th className="text-right py-2 px-3 font-medium text-ntab-text">AI-suggestie</th>
                  <th className="text-right py-2 px-3 font-medium text-ntab-text">Taxateur</th>
                  <th className="text-right py-2 px-3 font-medium text-ntab-text">Verschil</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(valueTypeLabels).map(([key, label]) => {
                  const suggested = priceData.prices[key].mid
                  const adjusted = adjustment.adjustedPrices[key]
                  const diff = adjusted - suggested
                  const diffPct = suggested > 0 ? Math.round((diff / suggested) * 100) : 0
                  return (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium">{label}</td>
                      <td className="py-2 px-3 text-right text-ntab-text-light">{formatCurrency(suggested)}</td>
                      <td className="py-2 px-3 text-right font-bold text-ntab-primary">{formatCurrency(adjusted)}</td>
                      <td className={`py-2 px-3 text-right text-xs ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {diff !== 0 ? `${diff > 0 ? '+' : ''}${diffPct}%` : '–'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {/* Onderbouwing */}
          <section>
            <h2 className="text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              3. Onderbouwing
            </h2>
            <div className="text-sm space-y-2">
              <div><span className="text-ntab-text-light">Reden aanpassing:</span> <span className="font-medium">{adjustment.reason}</span></div>
              <div><span className="text-ntab-text-light">Betrouwbaarheid:</span> <span className="font-medium">{adjustment.confidence}%</span></div>
              {adjustment.notes && (
                <div className="bg-ntab-light rounded-lg p-3 mt-2">
                  <span className="text-ntab-text-light block mb-1">Taxateur notities:</span>
                  <span className="font-medium">{adjustment.notes}</span>
                </div>
              )}
            </div>
          </section>

          {/* Bronnen */}
          <section>
            <h2 className="text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              4. Bronvermelding
            </h2>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-ntab-text-light">Marktlistings geraadpleegd:</span>
                <span className="font-medium">{priceData.prices.dataPoints.marketListings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ntab-text-light">Historische taxaties:</span>
                <span className="font-medium">{priceData.prices.dataPoints.historicalTaxaties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ntab-text-light">Veilingresultaten:</span>
                <span className="font-medium">{priceData.prices.dataPoints.veilingResultaten}</span>
              </div>
              <div className="mt-2 text-xs text-ntab-text-light">
                Bronnen: Mascus.nl, Troostwijk Auctions, BVA Auctions, Machineseeker.nl, NTAB Waardedatabase
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t-2 border-ntab-border pt-4">
            <p className="text-xs text-ntab-text-light leading-relaxed">
              <strong>Disclaimer:</strong> Dit taxatierapport is opgesteld conform de richtlijnen van RICS en TMV.
              De genoemde waardes zijn gebaseerd op marktonderzoek, historische data en professioneel oordeel van
              de taxateur. NTAB aanvaardt geen aansprakelijkheid voor beslissingen die uitsluitend op dit rapport
              zijn gebaseerd. Dit is een demonstratieversie.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-ntab-primary text-white px-6 py-3 flex justify-between text-xs opacity-75">
          <span>NTAB - Nederlands Taxatie & Adviesbureau · Sinds 1904</span>
          <span>Vertrouwelijk</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 bg-ntab-primary hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Exporteer als PDF
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-ntab-light hover:bg-gray-200 text-ntab-text font-semibold py-3 px-6 rounded-xl border border-ntab-border transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Nieuwe Taxatie
        </button>
      </div>
    </div>
  )
}
