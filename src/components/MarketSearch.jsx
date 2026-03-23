import { formatCurrency } from '../utils/priceCalculator'
import { useI18n } from '../i18n.jsx'

const sourceColors = {
  'Mascus': 'bg-blue-600',
  'Troostwijk': 'bg-orange-600',
  'BVA Auctions': 'bg-green-600',
  'Machineseeker': 'bg-purple-600',
}

export default function MarketSearch({ results, historical }) {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      {/* Market Listings */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-6">
        <h3 className="text-md font-semibold text-ntab-primary mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
          {t('marketResults')} ({results.length})
        </h3>

        {results.length === 0 ? (
          <p className="text-sm text-ntab-text-light italic">{t('noResults')}</p>
        ) : (
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-ntab-light rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`${sourceColors[r.source] || 'bg-gray-600'} text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 w-24 text-center`}>
                  {r.source}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-ntab-text truncate">
                    {r.brand} {r.model}
                  </div>
                  <div className="text-xs text-ntab-text-light">
                    {r.year} · {r.condition} · {r.hours ? `${r.hours.toLocaleString('nl-NL')} uur` : 'Geen uren'} · {r.location}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-ntab-primary">{formatCurrency(r.price)}</div>
                  {r.isAuction && <span className="text-[10px] bg-ntab-accent text-white px-1.5 py-0.5 rounded">{t('auction')}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Data */}
      {historical.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-6">
          <h3 className="text-md font-semibold text-ntab-primary mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t('ntabDatabase')} ({historical.length} {t('references')})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ntab-border">
                  <th className="text-left py-2 pr-3 text-ntab-text-light font-medium">Asset</th>
                  <th className="text-left py-2 pr-3 text-ntab-text-light font-medium">Jaar</th>
                  <th className="text-right py-2 pr-3 text-ntab-text-light font-medium">Taxatie</th>
                  <th className="text-right py-2 pr-3 text-ntab-text-light font-medium">Veiling</th>
                  <th className="text-left py-2 pr-3 text-ntab-text-light font-medium whitespace-nowrap">Datum</th>
                  <th className="text-left py-2 text-ntab-text-light font-medium whitespace-nowrap">Taxateur</th>
                </tr>
              </thead>
              <tbody>
                {historical.map(h => (
                  <tr key={h.id} className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium whitespace-nowrap">{h.brand} {h.model}</td>
                    <td className="py-2 pr-3">{h.year}</td>
                    <td className="py-2 pr-3 text-right font-medium text-ntab-primary whitespace-nowrap">{formatCurrency(h.taxatieWaarde)}</td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">{h.veilingOpbrengst ? formatCurrency(h.veilingOpbrengst) : '–'}</td>
                    <td className="py-2 pr-3 text-ntab-text-light whitespace-nowrap">{h.datum}</td>
                    <td className="py-2 text-ntab-text-light whitespace-nowrap">{h.taxateur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Ecosystem integration hints */}
      <div className="space-y-2">
        <div className="opacity-40 border-2 border-dashed border-gray-300 p-4 rounded-xl flex items-center gap-3 cursor-not-allowed">
          <span className="text-2xl">📦</span>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('stockDataAvailable')}</p>
            <p className="text-xs text-gray-400">{t('stockDataDesc')} · smartstock.nl</p>
          </div>
          <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full shrink-0">{t('phase2')}</span>
        </div>
        <div className="opacity-40 border-2 border-dashed border-gray-300 p-4 rounded-xl flex items-center gap-3 cursor-not-allowed">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('debtorInfo')}</p>
            <p className="text-xs text-gray-400">{t('debtorDesc')} · ntabalcore.nl</p>
          </div>
          <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full shrink-0">{t('phase2')}</span>
        </div>
      </div>
    </div>
  )
}
